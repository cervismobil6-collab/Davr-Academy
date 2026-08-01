import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import {
  BotConfig,
  TelegramBotInfo,
  LogEntry,
  BotStats,
  TelegramUpdate,
  TelegramMessage,
  CustomCommand,
} from './src/types.js';
import { PERSONA_PRESETS } from './src/data/personas.js';
import {
  ALL_LESSONS,
  getLessonsByLevel,
  getLessonByCommandOrId,
  formatLessonForTelegram,
} from './src/data/lessons.js';


dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory Bot State (persists while container runs)
let config: BotConfig = {
  token: '',
  isActive: false,
  personaId: 'davr_academy',
  customPrompt: PERSONA_PRESETS[0].systemPrompt,
  model: 'gemini-3.6-flash',
  temperature: 0.7,
  autoReply: true,
  welcomeMessage: PERSONA_PRESETS[0].welcomeMessage,
  enableVoiceExplanation: true,
  enableImageVision: true,
  enableMarkdown: true,
  customCommands: [
    {
      id: 'cmd_help',
      command: '/yordam',
      replyText:
        "🤖 Men bilan suhbatlashish uchun istalgan savolni yozing yoki rasm yuboring!\n\nBuyruqlar:\n/start - Botni qayta ishga tushirish\n/yordam - Yordam menyusini ko'rish",
      description: 'Yordam va qo\'llanma',
    },
    {
      id: 'cmd_about',
      command: '/haqida',
      replyText:
        "🚀 Ushbu bot Telegram AI Bot Pro platformasi orqali Gemini AI yordamida ishlaydi.",
      description: 'Bot haqida ma\'lumot',
    },
  ],
  maxHistoryMessages: 10,
};

let botInfo: TelegramBotInfo | null = null;
let isPollingRunning = false;
let pollingAbortController: AbortController | null = null;
let lastUpdateId = 0;

let logs: LogEntry[] = [];
const MAX_LOGS = 200;

let stats: BotStats = {
  totalMessagesReceived: 0,
  totalMessagesSent: 0,
  activeUsersCount: 0,
  lastActive: null,
  uptimeSeconds: 0,
  startTime: Date.now(),
};

// Store unique user chat IDs for active users count
const activeUserIds = new Set<string>();

// Store per-user conversation history for contextual AI memory
const userChatHistories = new Map<
  string,
  Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
>();

// Helper: Add Log
function addLog(
  type: LogEntry['type'],
  text: string,
  options?: {
    chatId?: number | string;
    chatName?: string;
    username?: string;
    metadata?: Record<string, any>;
  }
) {
  const log: LogEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toLocaleTimeString('uz-UZ', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    type,
    text,
    chatId: options?.chatId,
    chatName: options?.chatName,
    username: options?.username,
    metadata: options?.metadata,
  };
  logs.unshift(log);
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }
  return log;
}

// Telegram API Request Helper
async function callTelegramApi(
  token: string,
  method: string,
  payload?: Record<string, any>,
  signal?: AbortSignal
): Promise<any> {
  if (!token) {
    throw new Error('Telegram bot tokeni kiritilmagan');
  }
  const url = `https://api.telegram.org/bot${token}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: payload ? JSON.stringify(payload) : undefined,
    signal,
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(
      data.description || `Telegram API xatosi (${data.error_code || res.status})`
    );
  }
  return data.result;
}

// Verify Bot Token
async function verifyToken(token: string): Promise<TelegramBotInfo> {
  const result = await callTelegramApi(token, 'getMe');
  return {
    id: result.id,
    first_name: result.first_name,
    username: result.username,
    can_join_groups: result.can_join_groups,
    can_read_all_group_messages: result.can_read_all_group_messages,
    supports_inline_queries: result.supports_inline_queries,
  };
}

// Default Telegram Bottom Reply Keyboard (Faqat eng kerakli bo'limlar - Bepul Darslar, So'zlar, Premium, Profil, AI Ustoz va Admin Panel)
const TELEGRAM_REPLY_KEYBOARD = {
  keyboard: [
    [{ text: "🎓 Bepul Darslar" }, { text: "📚 So'zlar" }, { text: "👑 Premium Bo'limi" }],
    [{ text: "👤 Profil" }, { text: "🧠 AI Ustoz (24/7)" }, { text: "👨‍💼 Admin Panel" }]
  ],
  resize_keyboard: true,
  is_persistent: true,
};

// Send Message to Telegram Chat (with fallback for Markdown errors)
async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  options?: { parseMode?: 'Markdown' | 'HTML'; replyToMessageId?: number; replyMarkup?: any }
) {
  if (!config.token) throw new Error('Token mavjud emas');
  try {
    const res = await callTelegramApi(config.token, 'sendMessage', {
      chat_id: chatId,
      text,
      parse_mode: options?.parseMode || (config.enableMarkdown ? 'Markdown' : undefined),
      reply_to_message_id: options?.replyToMessageId,
      reply_markup: options?.replyMarkup || TELEGRAM_REPLY_KEYBOARD,
    });
    stats.totalMessagesSent += 1;
    stats.lastActive = new Date().toISOString();
    return res;
  } catch (error: any) {
    // If Markdown parse failed, fallback to plain text automatically
    if (
      config.enableMarkdown &&
      error.message &&
      (error.message.includes("can't parse") || error.message.includes('Markdown'))
    ) {
      const res = await callTelegramApi(config.token, 'sendMessage', {
        chat_id: chatId,
        text,
        reply_to_message_id: options?.replyToMessageId,
        reply_markup: options?.replyMarkup || TELEGRAM_REPLY_KEYBOARD,
      });
      stats.totalMessagesSent += 1;
      stats.lastActive = new Date().toISOString();
      return res;
    }
    throw error;
  }
}

// Generate AI Response using Gemini
async function generateAiReply(
  chatId: string | number,
  userText: string,
  userName?: string
): Promise<{ text: string; processingTimeMs: number; tokens?: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY sozlanmagan. Iltimos AI Studio sozlamalarida API kalitini kiriting."
    );
  }

  const startTime = Date.now();
  const ai = new GoogleGenAI({ apiKey });

  // Get user history
  const historyKey = String(chatId);
  if (!userChatHistories.has(historyKey)) {
    userChatHistories.set(historyKey, []);
  }
  const history = userChatHistories.get(historyKey)!;

  // Build full system instructions
  let fullSystemPrompt = config.customPrompt || PERSONA_PRESETS[0].systemPrompt;
  if (userName) {
    fullSystemPrompt += `\n\nFoydalanuvchining ismi: ${userName}. O'zbekona hurmat bilan murojaat qilishing mumkin.`;
  }

  // Faqat Davr Academy AI (yoki ingliz tili darsligi) personasi tanlangan bo'lsagina darslik ko'rsatmalari qo'shiladi
  if (config.personaId === 'davr_academy' || !config.personaId) {
    fullSystemPrompt += `\n\n📚 DAVR ACADEMY TAYYOR DARSLIKLARI VA AI USTOZ VAZIFASI:
- Botingda CEFR A1 dan C2 gacha tayyor darslar bor (Buyruqlar: /darslar, /a1_1, /a1_2, /a1_3, /a2_1, /a2_2, /b1_1, /b1_2, /b2_1, /b2_2, /c1_1, /c1_2).
- O'quvchi bu darslarni o'rganadi, tushunmagan joylarini, grammatik qoidalarni yoki so'zlarni so'rasa — sen sabr bilan, hayotiy o'zbekcha va inglizcha misollar bilan tushuntirib berasan!
- Agar o'quvchi "darslar", "/darslar", "qanday darslar bor" deb yozsa, ularga "/darslar" buyrug'ini bosishni yoki o'z darajasini aytishni taklif qil.
- Agar o'quvchi test javobini yozsa (masalan, 1-C, 2-B) yoki mashq bajarsa, uning javobini tekshir, to'g'ri bo'lsa maқта, xato bo'lsa nega xatoligini qoida bilan tushuntir.`;
  }

  // Generate content using genai SDK
  const contents = [
    ...history,
    { role: 'user' as const, parts: [{ text: userText }] },
  ];

  const response = await ai.models.generateContent({
    model: config.model || 'gemini-3.6-flash',
    contents,
    config: {
      systemInstruction: fullSystemPrompt,
      temperature: config.temperature,
    },
  });

  const replyText =
    response.text || "Kechirasiz, javob tayyorlashda xatolik bo'ldi. Qayta urinib ko'ring.";

  // Save to history (limit to last N turns)
  history.push({ role: 'user', parts: [{ text: userText }] });
  history.push({ role: 'model', parts: [{ text: replyText }] });
  if (history.length > (config.maxHistoryMessages || 10) * 2) {
    history.splice(0, 2);
  }

  const processingTimeMs = Date.now() - startTime;
  return {
    text: replyText,
    processingTimeMs,
  };
}

// ==========================================
// INTERACTIVE TELEGRAM MENUS & KEYBOARDS
// ==========================================

// Daily limit tracker for free users (15 AI messages/day)
interface UserDailyUsage {
  count: number;
  date: string; // YYYY-MM-DD
  isPremium: boolean;
}
const userDailyUsage: Record<string, UserDailyUsage> = {};

// Adminlar va doimiy bepul Premium huquqi bor Telegram ID'lar
const ADMIN_TELEGRAM_IDS = ['5879000826'];

function isUserAdminOrPremium(chatId: string | number): boolean {
  const idStr = String(chatId).trim();
  if (ADMIN_TELEGRAM_IDS.includes(idStr)) {
    return true;
  }
  return userDailyUsage[idStr]?.isPremium === true;
}

function checkDailyAILimit(chatId: string | number): { allowed: boolean; remaining: number } {
  const todayStr = new Date().toISOString().slice(0, 10);
  const idStr = String(chatId);

  if (isUserAdminOrPremium(chatId)) {
    return { allowed: true, remaining: 9999 };
  }

  if (!userDailyUsage[idStr] || userDailyUsage[idStr].date !== todayStr) {
    userDailyUsage[idStr] = {
      count: 0,
      date: todayStr,
      isPremium: false,
    };
  }

  const usage = userDailyUsage[idStr];
  if (usage.isPremium) {
    return { allowed: true, remaining: 9999 };
  }

  if (usage.count >= 15) {
    return { allowed: false, remaining: 0 };
  }

  usage.count += 1;
  return { allowed: true, remaining: 15 - usage.count };
}

// Check if lesson is one of the 5 free beginner lessons
const FREE_OPEN_LESSONS = [
  'a1_1', 'a1_2', 'a1_3', 'a2_1', 'a2_2',
  '/a1_1', '/a1_2', '/a1_3', '/a2_1', '/a2_2'
];
function isLessonOpenForFreeUser(lessonIdOrCommand: string, chatId?: string | number): boolean {
  if (chatId && isUserAdminOrPremium(chatId)) {
    return true;
  }
  return FREE_OPEN_LESSONS.includes(lessonIdOrCommand.trim().toLowerCase());
}

async function sendPremiumLockedMessage(chatId: number | string, featureName?: string) {
  const text =
    `🔒 *BU IMKONIYAT FAQAT PREMIUM OBUNACHILAR UCHUN!*\n\n` +
    `${featureName ? `📌 *${featureName}* bo'limi Premium obuna talab qiladi.\n\n` : ''}` +
    `🆓 *Bepul versiyada:* Faqat 5 ta boshlang'ich dars (/a1_1 dan /a2_2 gacha) va kuniga 15 ta AI xabar mavjud.\n\n` +
    `👑 *Davr Academy AI Premium imkoniyatlari:*\n` +
    `✅ 0–C2 barcha 40+ darslarga to'liq kirish\n` +
    `✅ Cheksiz 24/7 AI Ustoz bilan suhbat\n` +
    `✅ Speaking AI — Ovozli suhbatlar va talaffuz mashqi\n` +
    `✅ Writing AI — IELTS insho va essay tekshiruvi\n` +
    `✅ Barcha testlar, IELTS Mock va rasmiy Sertifikat\n\n` +
    `💎 *Premium narxi:*\n` +
    `• 1 oy — *100,000 so'm*\n` +
    `• 3 oy — *250,000 so'm* _(eng ommabop)_\n` +
    `• Cheksiz (To'liq kurs) — *500,000 so'm* _(eng foydali)_\n\n` +
    `👇 *"Premium sotib olish"* tugmasini bosing va imkoniyatlarni oching!`;

  const inlineMarkup = {
    inline_keyboard: [
      [{ text: "👑 1 Oylik Premium — 100,000 so'm", callback_data: "pay_1_month" }],
      [{ text: "🔥 3 Oylik Premium — 250,000 so'm (Eng ommabop)", callback_data: "pay_3_months" }],
      [{ text: "💎 Cheksiz Premium — 500,000 so'm (Eng foydali)", callback_data: "pay_12_months" }],
      [{ text: "⬅️ 5 ta Bepul Darsni Ko'rish", callback_data: "academy_menu_full" }],
    ],
  };

  await sendTelegramMessage(chatId, text, { replyMarkup: inlineMarkup });
}

async function sendAcademyOverview(chatId: number | string, senderName: string, username?: string) {
  const text =
    `📖 *DAVR ACADEMY AI — DARSLAR RO'YXATI*\n\n` +
    `🆓 *BEPUL FOYDALANUVCHILAR UCHUN 5 TA OCHIQ DARS:*\n` +
    `1️⃣ 1-Dars: To Be fe'li va Kishilik olmoshlari (/a1_1) 🟢 *Ochiq*\n` +
    `2️⃣ 2-Dars: Present Simple — Oddiy Hozirgi Zamon (/a1_2) 🟢 *Ochiq*\n` +
    `3️⃣ 3-Dars: There is / There are — Mavjudlik (/a1_3) 🟢 *Ochiq*\n` +
    `4️⃣ 4-Dars: Past Simple — Oddiy O'tgan Zamon (/a2_1) 🟢 *Ochiq*\n` +
    `5️⃣ 5-Dars: Present Continuous — Hozirgi Davomiy (/a2_2) 🟢 *Ochiq*\n\n` +
    `🔒 *6-DARSDAN 40-DARSGACHA (B1, B2, C1, C2 va IELTS Master):*\n` +
    `⚠️ Bepul versiyada faqatgina 5 ta dars ochiq. Qolgan 35 ta ilg'or darslar, Speaking AI va Writing tahlilini ochish uchun Premium obunani faollashtiring!\n\n` +
    `👑 *PREMIUM OBUNA IMKONIYATLARI:*\n` +
    `✅ Barcha 40+ ta darslarga to'liq kirish\n` +
    `✅ Cheksiz 24/7 AI Ustoz bilan suhbat (Bepul limit: kuniga 15 ta xabar)\n` +
    `✅ AI Speaking & Writing insholarni tahlil qilish\n` +
    `✅ Yakuniy Sertifikat va IELTS Mock imtihonlari`;

  const inlineMarkup = {
    inline_keyboard: [
      [{ text: "🟢 1-Dars: To Be fe'li (/a1_1)", callback_data: "lesson_a1_1" }],
      [{ text: "🟢 2-Dars: Present Simple (/a1_2)", callback_data: "lesson_a1_2" }],
      [{ text: "🟢 3-Dars: There is/are (/a1_3)", callback_data: "lesson_a1_3" }],
      [{ text: "🟢 4-Dars: Past Simple (/a2_1)", callback_data: "lesson_a2_1" }],
      [{ text: "🟢 5-Dars: Present Continuous (/a2_2)", callback_data: "lesson_a2_2" }],
      [{ text: "🔒 6-Dars: Present Perfect (B1) — Premium", callback_data: "lesson_locked" }],
      [{ text: "👑 Premium Obuna va Taqqoslashni Ko'rish", callback_data: "buy_premium" }],
    ],
  };

  await sendTelegramMessage(chatId, text, { replyMarkup: inlineMarkup });
  addLog('ai_reply', text, {
    chatId,
    chatName: senderName,
    username,
    metadata: { isLessonMenu: true },
  });
}

async function sendPremiumInfo(chatId: number | string, senderName: string, username?: string) {
  const text =
    `👑 *Davr Academy AI Premium*\n\n` +
    `📚 *Bepul va Premium taqqoslash*\n\n` +
    `Imkoniyat | 🆓 Bepul | 👑 Premium\n` +
    `AI bilan suhbat | ⚠️ Cheklangan (kuniga 15 ta) | ✅ Cheksiz\n` +
    `0–C2 darslari | ⚠️ Faqat 5 ta boshlang'ich dars | ✅ To'liq kirish\n` +
    `Grammatika darslari | ✅ | ✅\n` +
    `Speaking AI | ❌ | ✅\n` +
    `Writing AI tekshiruvi | ❌ | ✅\n` +
    `IELTS tayyorgarligi | ❌ | ✅\n` +
    `Premium testlar | ❌ | ✅\n` +
    `Shaxsiy o'quv rejasi | ❌ | ✅\n` +
    `24/7 AI ustoz | ⚠️ Cheklangan (kuniga 15 ta) | ✅ Cheksiz\n` +
    `Reklamasiz foydalanish | ❌ | ✅\n` +
    `Yangi funksiyalarga erta kirish | ❌ | ✅\n\n` +
    `---\n\n` +
    `🌟 *Nega Premium?*\n\n` +
    `🎯 Ingliz tilini tezroq o'rganasiz.\n\n` +
    `🤖 AI sizning xatolaringizni tahlil qilib, aynan sizga mos darslarni tavsiya qiladi.\n\n` +
    `📈 Har kuni natijangiz kuzatiladi va rivojlanishingiz bo'yicha tavsiyalar beriladi.\n\n` +
    `🏆 Premium foydalanuvchilar maxsus imkoniyatlar va yangilanishlardan birinchi bo'lib foydalanadi.\n\n` +
    `---\n\n` +
    `💎 *Premium narxi*\n\n` +
    `1 oy — *100,000 so'm*\n` +
    `3 oy — *250,000 so'm* _(eng ommabop)_\n` +
    `Cheksiz (To'liq kurs) — *500,000 so'm* _(eng foydali)_\n\n` +
    `👇 *"Premium sotib olish"* tugmasini bosing va imkoniyatlarni oching!`;

  const inlineMarkup = {
    inline_keyboard: [
      [{ text: "👑 1 Oylik Premium — 100,000 so'm", callback_data: "pay_1_month" }],
      [{ text: "🔥 3 Oylik Premium — 250,000 so'm (Eng ommabop)", callback_data: "pay_3_months" }],
      [{ text: "💎 Cheksiz Premium — 500,000 so'm (Eng foydali)", callback_data: "pay_12_months" }],
      [{ text: "💳 To'lov qilish yo'riqnomasi (Click / Payme)", callback_data: "pay_info" }],
      [{ text: "👨‍💼 Admin (@jasurdos) bilan bog'lanish", url: "https://t.me/jasurdos" }],
      [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu_full" }],
    ],
  };

  await sendTelegramMessage(chatId, text, { replyMarkup: inlineMarkup });
  addLog('ai_reply', text, {
    chatId,
    chatName: senderName,
    username,
    metadata: { isPremiumMenu: true },
  });
}

async function handleTelegramMenuCommand(
  chatId: number | string,
  userText: string,
  senderName: string,
  username?: string
): Promise<boolean> {
  const clean = userText.trim().toLowerCase();

  // 1) English Academy / Darslar
  if (['🎓 english academy', '/darslar', 'darslar', '📚 darslar', 'dars', "darslar ro'yxati"].includes(clean)) {
    await sendAcademyOverview(chatId, senderName, username);
    return true;
  }

  // 2) Imtihon
  if (['🎓 imtihon', '/imtihon', 'imtihon', 'yakuniy imtihon', 'level exam'].includes(clean)) {
    const text =
      `🎓 *YAKUNIY IMTIHON VA DARAJA ANIQLASH (LEVEL EXAM)*\n\n` +
      `AI Ustoz sizning ingliz tili darajangizni 5 ta yo'nalishda tekshirib beradi:\n` +
      `1️⃣ *Listening* — Audio tushunish\n` +
      `2️⃣ *Speaking* — Og'zaki nutq va talaffuz\n` +
      `3️⃣ *Grammar* — Grammatik qoidalar\n` +
      `4️⃣ *Vocabulary* — So'z boyligi\n` +
      `5️⃣ *Writing* — Insho yozish mahorati\n\n` +
      `*Qaysi daraja bo'yicha imtihon topshirmoqchisiz?*`;
    const markup = {
      inline_keyboard: [
        [{ text: "🌱 A1 - Beginner Imtihon", callback_data: "exam_a1" }],
        [{ text: "🌿 A2 - Elementary Imtihon", callback_data: "exam_a2" }],
        [{ text: "🌳 B1 - Intermediate Exam", callback_data: "exam_b1" }],
        [{ text: "🚀 B2 / C1 - IELTS Mock Exam", callback_data: "exam_b2" }],
        [{ text: "💎 Premium Imtihon Paketini Olish", callback_data: "buy_premium" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 3) AI Ustoz
  if (['🧠 ai ustoz', '/ai_ustoz', 'ai ustoz', 'ustoz'].includes(clean)) {
    const text =
      `🧠 *AI USTOZ — 24/7 Shaxsiy Ingliz Tili O'qituvchingiz!*\n\n` +
      `Menga istalgan savolingizni yozing yoki ovozli xabar / rasm yuboring!\n` +
      `✅ Grammatika qoidalarini tushuntiraman\n` +
      `✅ Xatolaringizni to'g'rilab beraman\n` +
      `✅ Speaking suhbatdosh bo'laman\n` +
      `✅ IELTS Insho va vazifalarni tekshiraman\n\n` +
      `👇 *Hozirning o'zida menga inglizcha yoki o'zbekcha savol yozing!*`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 AI Ustoz PRO — Cheksiz Savol & Tahlil", callback_data: "buy_premium" }],
        [{ text: "📖 Darslar Ro'yxati", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 4) So'zlar (Vocabulary)
  if (["📚 so'zlar", '/sozlar', 'sozlar', "so'zlar", 'vocabulary', "so'z boyligi"].includes(clean)) {
    const text =
      `📚 *KUNDALIK OXFORD 3000 & IELTS SO'ZLAR*\n\n` +
      `📌 *1. Accomplish* [v] — Muvaffaqiyatli yakunlamoq, erishmoq\n` +
      `   _Example:_ She accomplished all her goals this year.\n\n` +
      `📌 *2. Essential* [adj] — Muhim, zaruriy\n` +
      `   _Example:_ Vocabulary is essential for IELTS success.\n\n` +
      `📌 *3. Provide* [v] — Ta'minlamoq, berib bormoq\n` +
      `   _Example:_ Davr Academy provides 40+ structured lessons.\n\n` +
      `💡 _Barcha 5,000 ta so'zlar, fleshkartalar va audio talaffuzlarni Premium obunada o'rganing!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 5,000 ta Premium So'zlar va Flashcard", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 5) Test
  if (['📝 test', '/test', 'test', 'testlar'].includes(clean)) {
    const text =
      `📝 *INGLIZ TILI TEST MASHQI (GRAMMAR QUIZ)*\n\n` +
      `❓ *Savol:* Which sentence is grammatically correct?\n\n` +
      `A) She don't like playing tennis.\n` +
      `B) She doesn't likes playing tennis.\n` +
      `C) She doesn't like playing tennis. ✅\n\n` +
      `💡 *Tushuntirish:* He/She/It kishilik olmoshlarida inkor shaklida "doesn't + verb (s-siz)" ishlatiladi!\n\n` +
      `🚀 _Barcha darajalar bo'yicha 1,000 ta test mashqlarini Premium obunada ishlashga tayyormisiz?_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 1,000+ ta Premium Testlarni Ochish", callback_data: "buy_premium" }],
        [{ text: "📖 Darslar Ro'yxati", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 6) Grammar
  if (['📖 grammar', '/grammar', 'grammar', 'grammatika'].includes(clean)) {
    const text =
      `📖 *ASOSIY GRAMMATIKA QOIDALARI (CEFR A1-C1)*\n\n` +
      `Quyidagi mavzularni o'rganish uchun buyruq ustiga bosing:\n\n` +
      `📌 /a1_1 — To Be fe'li va Kishilik olmoshlari\n` +
      `📌 /a1_2 — Present Simple (Oddiy Hozirgi Zamon)\n` +
      `📌 /a2_1 — Past Simple (Oddiy O'tgan Zamon)\n` +
      `📌 /b1_1 — Present Perfect & Past Perfect\n` +
      `📌 /b1_2 — Conditionals (0, 1, 2, 3-shart gaplar)\n` +
      `📌 /b2_1 — Passive Voice & Reported Speech\n\n` +
      `💡 _Istalgan grammatik qoida haqida AI Ustozdan so'rashingiz mumkin!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Premium Grammatika Kursi (Barcha 40 dars)", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 7) Speaking
  if (['🗣️ speaking', '/speaking', 'speaking', "og'zaki nutq"].includes(clean)) {
    await sendPremiumLockedMessage(chatId, "Speaking AI va talaffuz tahlili");
    return true;
  }

  // 8) Listening
  if (['🎧 listening', '/listening', 'listening', 'audio mashq'].includes(clean)) {
    const text =
      `🎧 *LISTENING & AUDIO TALAFFUZ MASHQLARI*\n\n` +
      `Eshitish qobiliyatini o'stirish bo'yicha tavsiyalar:\n` +
      `✅ Audio matnlarni 2 marta eshiting: avval umumiy ma'no, keyin detali uchun.\n` +
      `✅ BBC Learning English va TED Talks podkastlaridan foydalaning.\n\n` +
      `💡 _Premium obunachilar uchun 100+ ta audio darslar va subtitrli mashqlar mavjud!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 100+ ta Premium Listening Darslari", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 9) Writing
  if (['✍️ writing', '/writing', 'writing', 'insho yozish'].includes(clean)) {
    await sendPremiumLockedMessage(chatId, "Writing AI — IELTS Insho va essay tekshiruvi");
    return true;
  }

  // 10) Reading
  if (['📖 reading', '/reading', 'reading', "matn o'qish"].includes(clean)) {
    const text =
      `📖 *READING — MATN O'QISH VA TUSHUNISH*\n\n` +
      `O'qish ko'nikmasi so'z boyligini va grammatikani tez o'zlashtirishga yordam beradi.\n\n` +
      `📚 _Bugungi mini-matn:_\n` +
      `*"Success is not accidental. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing."*\n\n` +
      `❓ _Siz bu fikrga qo'shilasizmi? AI Ustozga inglizcha javob yozing!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Barcha Reading Matnlarini Ochish", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 11) IELTS
  if (['🎯 ielts', '/ielts', 'ielts', 'ielts mock'].includes(clean)) {
    await sendPremiumLockedMessage(chatId, "IELTS Master PRO kursi va Mock Imtihonlar");
    return true;
  }

  // 12) Daily English
  if (['💬 daily english', '/daily', 'daily english', 'kun iborasi'].includes(clean)) {
    const text =
      `💬 *DAILY ENGLISH — BUGUNGI KUN IBORASI*\n\n` +
      `🔥 *Idiom:* "Hit the nail on the head"\n` +
      `UZ: *Ayni muddao / juda to'g'ri topmoq*\n\n` +
      `🗣 _Example:_ "You hit the nail on the head when you said practice is more important than theory."\n\n` +
      `💡 _Har kuni yangi ibora va kinolardagi so'zlarni Premium obunada qabul qiling!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Kundalik English PRO", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 13) O'yinlar (Games)
  if (["🎮 o'yinlar", '/oyinlar', "o'yinlar", 'oyinlar', 'games'].includes(clean)) {
    const text =
      `🎮 *INGLIZ TILI O'YINLARI VA VIKTORINALAR*\n\n` +
      `1️⃣ *Word Chain (So'z zanjiri):* Men aytgan so'zning oxirgi harfiga so'z topasiz!\n` +
      `2️⃣ *Guess the Word:* Ma'nosiga qarab so'zni topish.\n` +
      `3️⃣ *Synonym Match:* Sinonimlarini topish o'yini.\n\n` +
      `👇 _O'yinni boshlash uchun menga "O'yin o'ynaymiz" deb yozing!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Premium English Games", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 14) Sevimlilar
  if (['❤️ sevimlilar', '/sevimlilar', 'sevimlilar', 'saqlanganlar'].includes(clean)) {
    const text =
      `❤️ *SEVIMLILAR VA SAQLANGAN DARSLAR*\n\n` +
      `Siz saqlab qo'ygan darsliklar va lug'atlar shu yerda jamlanadi.\n` +
      `📌 Hozircha sevimli darslar ro'yxatingiz bo'sh. Darsliklarni ochib, ularni saqlab borishingiz mumkin!`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Barcha 40+ Darslarni Saqlash (PRO)", callback_data: "buy_premium" }],
        [{ text: "📖 Darslar Ro'yxati", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 15) Profil
  if (['👤 profil', '/profil', 'profil', 'mening profilim'].includes(clean)) {
    const isAdminOrPro = isUserAdminOrPremium(chatId);
    const dailyUsage = userDailyUsage[String(chatId)]?.count || 0;
    const remaining = isAdminOrPro ? "CHEKSIZ" : `${Math.max(0, 15 - dailyUsage)} / 15 ta qoldi`;
    const subStatus = isAdminOrPro ? "👑 PREMIUM (Cheksiz)" : "Free (Bepul)";
    const openLessons = isAdminOrPro ? "Barcha 40+ ta darslar OCHIQ (A1–C2)" : "5 / 40 ta (Bepul versiya)";

    const text =
      `👤 *FOYDALANUVCHI PROFILI*\n\n` +
      `🏷 Ism: *${senderName}*\n` +
      `📊 Daraja: A1–C2 (Ingliz tili)\n` +
      `🔥 Streak: 7 kun ketma-ket faol\n` +
      `⭐ To'plangan ball: 1,450 XP\n` +
      `🎓 Ochiq darslar: *${openLessons}*\n` +
      `💬 Bugungi AI xabar limiti: *${remaining}*\n` +
      `💎 Obuna holati: *${subStatus}*\n\n` +
      (isAdminOrPro
        ? `🎉 *Sizda Barcha Premium Darslar va AI Ustoz (24/7) to'liq ochilgan!* Darslarni o'rganishda davom eting.`
        : `🚀 *Premium Obunaga o'ting:* Barcha 40+ darslar, cheksiz AI Ustoz, Speaking & Writing AI va IELTS Mock imtihonlarini oching!`);
    const markup = {
      inline_keyboard: [
        isAdminOrPro
          ? [{ text: "📖 Barcha Darslarga O'tish", callback_data: "academy_menu" }]
          : [{ text: "👑 Premium Obunani Faollashtirish (1 oy — 100,000 so'm)", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 16) Reyting
  if (['🏆 reyting', '/reyting', 'reyting', 'leaderboard'].includes(clean)) {
    const text =
      `🏆 *TOP-10 ENG FAOL O'QUVCHILAR REYTINGI*\n\n` +
      `1. 👑 *Sardorbek G'aniyev* — 4,850 XP\n` +
      `2. 🥇 *Shakhzoda K.* — 4,320 XP\n` +
      `3. 🥈 *Azizbek R.* — 3,910 XP\n` +
      `4. 🥉 *Malika T.* — 3,650 XP\n` +
      `5. ⭐ *Jasur M.* — 3,400 XP\n` +
      `...\n` +
      `📌 *Sizning o'rningiz:* 18-o'rin (1,450 XP)\n\n` +
      `🔥 _Har kuni dars o'rganing va reytingda 1-o'ringa chiqing!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Premium Darslar Bilan Tezroq O'rganish", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 17) Streak
  if (['🔥 streak', '/streak', 'streak', 'kunlik faollik'].includes(clean)) {
    const text =
      `🔥 *KUNLIK STREAK VA FAOLLIK*\n\n` +
      `🎉 *7 KUN KETMA-KET!*\n` +
      `Siz 7 kundan beri har kuni ingliz tili bilan shug'ullanyapsiz! Bu ajoyib natija!\n\n` +
      `🎁 *30 kunlik Streak mukofoti:* Premium obunaga 50% maxsus chegirma kuponi!`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Chegirma Bilan Premiumni Faollashtirish", callback_data: "buy_premium" }],
        [{ text: "📖 Darslar Ro'yxati", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 18) Sozlamalar
  if (['⚙️ sozlamalar', '/sozlamalar', 'sozlamalar', 'settings'].includes(clean)) {
    const text =
      `⚙️ *BOT SOZLAMALARI*\n\n` +
      `🌐 *Til:* O'zbek tili & Ingliz tili\n` +
      `🤖 *AI Model:* Gemini Pro (Tezkor tahlil)\n` +
      `🔔 *Eslatmalar:* Yoqilgan (Har kuni 20:00 da)\n\n` +
      `💡 _Sozlamalarni o'zgartirish yoki savollar uchun admin bilan bog'laning._`;
    const markup = {
      inline_keyboard: [
        [{ text: "👨‍💼 Admin bilan bog'lanish", url: "https://t.me/jasurdos" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 19) Admin Panel
  if (['👨‍💼 admin panel', '/admin', 'admin panel', 'admin', 'aloqa', 'support'].includes(clean)) {
    const text =
      `👨‍💼 *DAVR ACADEMY AI — RASMIY ADMIN VA QO'LLAB-QUVVATLASH*\n\n` +
      `💬 Savollaringiz, Premium darslarni sotib olish yoki texnik yordam uchun adminimizga murojaat qiling:\n` +
      `👉 *Telegram Admin:* @jasurdos\n` +
      `📞 *Telefon / Support:* +998 (94) 518-11-61\n` +
      `👤 *Karta egasi / Rahbar:* G'aniyev Sardorbek\n\n` +
      `⏳ _Ish vaqti: 24/7. Sizga tez orada javob beramiz!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Premium Darslarni Sotib Olish (PRO)", callback_data: "buy_premium" }],
        [{ text: "👨‍💼 Telegram orqali yozish (@jasurdos)", url: "https://t.me/jasurdos" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return true;
  }

  // 20) Premium
  if (['💎 premium', '/premium', 'premium', 'premium obuna', 'premium darslar', 'premium darsni sotib olish', 'sotib olish', 'buy premium'].includes(clean)) {
    await sendPremiumInfo(chatId, senderName, username);
    return true;
  }

  return false;
}

// Handle Callback Queries (when users click inline buttons)
async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message?.chat?.id;
  const data = callbackQuery.data;
  const senderName = callbackQuery.from?.first_name || 'Foydalanuvchi';
  const username = callbackQuery.from?.username ? `@${callbackQuery.from?.username}` : undefined;

  // Always answer callback query to remove loading state
  if (config.token) {
    callTelegramApi(config.token, 'answerCallbackQuery', {
      callback_query_id: callbackQuery.id,
    }).catch(() => {});
  }

  if (!chatId || !data) return;

  if (data === 'buy_premium' || data === 'pay_info') {
    await sendPremiumInfo(chatId, senderName, username);
    return;
  }

  if (['pay_1_month', 'pay_3_months', 'pay_12_months', 'pay_click', 'pay_payme'].includes(data)) {
    const packageName =
      data === 'pay_3_months' ? "3 Oylik Premium — 250,000 so'm (Eng ommabop)" :
      data === 'pay_12_months' ? "Cheksiz Premium (To'liq kurs) — 500,000 so'm (Eng foydali)" :
      "1 Oylik Premium — 100,000 so'm";

    const text =
      `💳 *PREMIUM OBUNA UCHUN TO'LOV MA'LUMOTLARI*\n\n` +
      `📦 *Tanlangan paket:* ${packageName}\n\n` +
      `💳 *Karta egasi:* G'aniyev Sardorbek\n` +
      `📌 *Click / Payme / Uzcard:* \`5614 6818 8730 1095\`\n\n` +
      `✅ *Qanday faollashtiriladi?*\n` +
      `1️⃣ Yuqoridagi karta raqamiga to'lovni amalga oshiring.\n` +
      `2️⃣ To'lov chekini (skrinshotni) adminimiz @jasurdos ga yuboring.\n` +
      `3️⃣ Obunangiz 1 daqiqa ichida faollashtiriladi!\n\n` +
      `📞 *Admin Tel:* +998 (94) 518-11-61`;

    const markup = {
      inline_keyboard: [
        [{ text: "👨‍💼 Chekni adminga yuborish (@jasurdos)", url: "https://t.me/jasurdos" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu_full" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return;
  }

  if (data === 'academy_menu' || data === 'academy_menu_full') {
    await sendAcademyOverview(chatId, senderName, username);
    return;
  }

  if (data === 'exam_b1' || data === 'exam_b2') {
    await sendPremiumLockedMessage(chatId, `${data.replace('exam_', '').toUpperCase()} Daraja Imtihoni`);
    return;
  }

  if (data === 'exam_a1' || data === 'exam_a2') {
    const text =
      `🎓 *INGLIZ TILI DARAJA IMTIHONI (${data.replace('exam_', '').toUpperCase()})*\n\n` +
      `Imtihon savollarini boshlaymiz!\n\n` +
      `❓ *1-savol:* "Where ___ you from?"\n` +
      `A) is   B) am   C) are   D) be\n\n` +
      `👇 _To'g'ri javobni (A, B, C yoki D) yozib yuboring!_`;
    const markup = {
      inline_keyboard: [
        [{ text: "👑 B1–C2 va IELTS Imtihonlarini Ochish (PRO)", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu_full" }],
      ],
    };
    await sendTelegramMessage(chatId, text, { replyMarkup: markup });
    return;
  }

  if (data === 'lesson_locked') {
    await sendPremiumLockedMessage(chatId, "B1 / B2 / C1 – Ilg'or Darslar");
    return;
  }

  if (data === 'lesson_a2_1' || data.startsWith('lesson_')) {
    const lessonCommand = data === 'lesson_a2_1' ? '/a2_1' : `/${data.replace('lesson_', '')}`;
    if (!isLessonOpenForFreeUser(lessonCommand, chatId) && !isUserAdminOrPremium(chatId)) {
      await sendPremiumLockedMessage(chatId, `Darslik: ${lessonCommand}`);
      return;
    }
    const lesson = getLessonByCommandOrId(lessonCommand);
    if (lesson) {
      const lessonText = formatLessonForTelegram(lesson);
      const markup = {
        inline_keyboard: [
          [{ text: "👑 Premium Obuna va Taqqoslashni Ko'rish", callback_data: "buy_premium" }],
          [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu_full" }],
        ],
      };
      await sendTelegramMessage(chatId, lessonText, { replyMarkup: markup });
    }
    return;
  }
}

// Process Incoming Telegram Message
async function handleIncomingMessage(message: TelegramMessage) {
  const chatId = message.chat.id;
  const userText = message.text || message.caption || '';
  const senderName =
    [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ') ||
    message.chat.first_name ||
    'Foydalanuvchi';
  const username = message.from?.username ? `@${message.from?.username}` : undefined;

  stats.totalMessagesReceived += 1;
  stats.lastActive = new Date().toISOString();
  activeUserIds.add(String(chatId));
  stats.activeUsersCount = activeUserIds.size;

  // Log incoming message
  addLog('incoming_telegram', userText || '[Rasm yoki media xabar]', {
    chatId,
    chatName: senderName,
    username,
  });

  // 1. Check commands (/start, /help, custom commands)
  if (userText.startsWith('/')) {
    const cmdName = userText.split(' ')[0].toLowerCase();

    if (cmdName === '/start') {
      const welcome = config.welcomeMessage || PERSONA_PRESETS[0].welcomeMessage;
      // Send welcome message WITH the persistent reply keyboard
      await sendTelegramMessage(chatId, welcome, { replyMarkup: TELEGRAM_REPLY_KEYBOARD });
      addLog('ai_reply', welcome, {
        chatId,
        chatName: senderName,
        username,
        metadata: { isCommand: true },
      });
      // Immediately follow up with the visual Academy & Premium overview card
      await sendAcademyOverview(chatId, senderName, username);
      return;
    }

    // Check custom commands
    const customCmd = config.customCommands.find(
      (c) => c.command.toLowerCase() === cmdName
    );
    if (customCmd) {
      await sendTelegramMessage(chatId, customCmd.replyText);
      addLog('ai_reply', customCmd.replyText, {
        chatId,
        chatName: senderName,
        username,
        metadata: { isCommand: true, command: customCmd.command },
      });
      return;
    }
  }

  // 2. Check if message matches any of the 19 Reply Keyboard menu buttons
  if (await handleTelegramMenuCommand(chatId, userText, senderName, username)) {
    return;
  }

  // Check specific level commands (/a1, /a2, /b1, /b2, /c1)
  const cleanText = userText.trim().toLowerCase();
  const levelMap: Record<string, string> = {
    '/a1': 'A1',
    '/dars_a1': 'A1',
    'a1 darslar': 'A1',
    'a1 darsini boshlaymiz': 'A1',
    'men 0 darajadaman': 'A1',
    '/a2': 'A2',
    '/dars_a2': 'A2',
    'a2 darslar': 'A2',
    '/b1': 'B1',
    '/dars_b1': 'B1',
    'b1 darslar': 'B1',
    '/b2': 'B2',
    '/dars_b2': 'B2',
    'b2 darslar': 'B2',
    'ielts tayyorgarligi': 'B2',
    '/c1': 'C1-C2',
    '/dars_c1': 'C1-C2',
    'c1 darslar': 'C1-C2',
    '/c2': 'C1-C2',
  };
  if (levelMap[cleanText]) {
    const lvl = levelMap[cleanText] as any;
    const list = getLessonsByLevel(lvl);
    const levelReply =
      `🎓 *DAVR ACADEMY AI — ${lvl} DARAJASI DARSLARI*\n\nQuyidagi darslardan birining buyrug'i ustiga bosing:\n\n` +
      list
        .map(
          (l) =>
            `📖 *${l.title}*\n   👉 Buyruq: ${l.command}\n   📝 _${l.subtitle}_`
        )
        .join('\n\n') +
      `\n\n⬅️ Barcha darajalar: /darslar`;
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Premium Darslarni Sotib Olish (PRO)", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, levelReply, { replyMarkup: markup });
    addLog('ai_reply', levelReply, {
      chatId,
      chatName: senderName,
      username,
      metadata: { isLevelMenu: true, level: lvl },
    });
    return;
  }

  // Check if specific lesson command (/a1_1, /a1_2, etc)
  const matchedLesson = getLessonByCommandOrId(cleanText);
  if (matchedLesson) {
    if (!isLessonOpenForFreeUser(cleanText, chatId) && !isUserAdminOrPremium(chatId)) {
      await sendPremiumLockedMessage(chatId, matchedLesson.title);
      return;
    }
    const lessonText = formatLessonForTelegram(matchedLesson);
    const markup = {
      inline_keyboard: [
        [{ text: "💎 Premium Darslarni Sotib Olish (PRO)", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu" }],
      ],
    };
    await sendTelegramMessage(chatId, lessonText, { replyMarkup: markup });
    addLog('ai_reply', `[Darslik yuborildi] ${matchedLesson.title}`, {
      chatId,
      chatName: senderName,
      username,
      metadata: { isLesson: true, lessonId: matchedLesson.id },
    });
    return;
  }

  // 3. If autoReply is OFF, don't generate AI answer
  if (!config.autoReply) {
    addLog(
      'system_info',
      `Avtomatik javob o'chirilgan — xabar qabul qilindi, lekin javob yuborilmadi (@${username || senderName})`,
      { chatId, chatName: senderName }
    );
    return;
  }

  // 4. Check Daily Free User Limit (15 AI messages/day)
  const limitCheck = checkDailyAILimit(chatId);
  if (!limitCheck.allowed) {
    const limitText =
      `⏳ *Bugungi bepul limit tugadi.*\n\n` +
      `Premium obuna orqali cheksiz AI darslari, Speaking AI, Writing AI va barcha C2 darslarini oching.`;
    const markup = {
      inline_keyboard: [
        [{ text: "👑 Premium Obuna — 100,000 so'm / oy", callback_data: "buy_premium" }],
        [{ text: "⬅️ Akademiya Bosh Menyu", callback_data: "academy_menu_full" }],
      ],
    };
    await sendTelegramMessage(chatId, limitText, {
      replyToMessageId: message.message_id,
      replyMarkup: markup,
    });
    return;
  }

  // 5. Generate AI Answer
  try {
    // Send typing status to Telegram
    try {
      await callTelegramApi(config.token, 'sendChatAction', {
        chat_id: chatId,
        action: 'typing',
      });
    } catch (e) {
      // Ignore chat action errors
    }

    const aiRes = await generateAiReply(chatId, userText || "Rasmga izoh bering", senderName);

    // Send to Telegram
    await sendTelegramMessage(chatId, aiRes.text, {
      replyToMessageId: message.message_id,
    });

    // Log reply
    addLog('ai_reply', aiRes.text, {
      chatId,
      chatName: senderName,
      username,
      metadata: {
        model: config.model,
        processingTimeMs: aiRes.processingTimeMs,
      },
    });
  } catch (error: any) {
    const errMsg = error.message || 'AI xatosi';
    addLog('system_error', `AI javobida xatolik: ${errMsg}`, {
      chatId,
      chatName: senderName,
    });

    // Notify user gently in Telegram
    try {
      await sendTelegramMessage(
        chatId,
        "⚠️ Kechirasiz, hozirgi vaqtda javob tayyorlashda texnik xatolik yuz berdi. Iltimos birozdan keyin qayta urining."
      );
    } catch (e) {
      // ignore
    }
  }
}

// Background Telegram Polling Loop
async function runPollingLoop() {
  if (isPollingRunning) return;
  isPollingRunning = true;
  config.isActive = true;
  pollingAbortController = new AbortController();

  addLog('system_info', `🤖 Telegram bot polling (uzluksiz qabul) ishga tushdi: @${botInfo?.username || 'bot'}`);

  while (isPollingRunning && config.isActive) {
    try {
      const updates = await callTelegramApi(
        config.token,
        'getUpdates',
        {
          offset: lastUpdateId + 1,
          timeout: 10,
          allowed_updates: ['message', 'edited_message', 'callback_query'],
        },
        pollingAbortController.signal
      );

      if (Array.isArray(updates)) {
        for (const update of updates) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
          const msg = update.message || update.edited_message;
          if (msg) {
            handleIncomingMessage(msg).catch((err) => {
              console.error('Xabar qayta ishlash xatosi:', err);
            });
          }
          if (update.callback_query) {
            handleCallbackQuery(update.callback_query).catch((err) => {
              console.error('Callback query xatosi:', err);
            });
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        break;
      }
      // Log connection warning but retry
      console.warn('Polling xatosi, 3 soniyadan keyin qayta urinadi:', error.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  isPollingRunning = false;
  config.isActive = false;
  addLog('system_info', `🛑 Telegram bot polling to'xtatildi.`);
}

function stopPollingLoop() {
  isPollingRunning = false;
  config.isActive = false;
  if (pollingAbortController) {
    pollingAbortController.abort();
    pollingAbortController = null;
  }
}

// =======================
// REST API ENDPOINTS
// =======================

// 1. Get Bot Status & Config
app.get('/api/bot/status', (req, res) => {
  stats.uptimeSeconds = Math.floor((Date.now() - stats.startTime) / 1000);
  res.json({
    config: {
      ...config,
      // Mask token for frontend display security
      tokenMasked: config.token
        ? `${config.token.substring(0, 8)}...${config.token.slice(-4)}`
        : '',
      hasToken: Boolean(config.token),
    },
    botInfo,
    stats,
    isPolling: isPollingRunning,
  });
});

// 2. Set / Verify Bot Token
app.post('/api/bot/token', async (req, res) => {
  const { token, autoStart } = req.body;
  if (!token || typeof token !== 'string' || !token.trim()) {
    return res.status(400).json({ error: 'Telegram bot tokenini kiriting' });
  }

  try {
    const cleanToken = token.trim();
    const info = await verifyToken(cleanToken);

    // Stop existing polling if token changed
    if (config.token !== cleanToken) {
      stopPollingLoop();
    }

    config.token = cleanToken;
    botInfo = info;

    addLog('system_info', `✅ Bot token tasdiqlandi: @${info.username} (${info.first_name})`);

    // Start polling if requested
    if (autoStart) {
      runPollingLoop();
    }

    res.json({
      success: true,
      botInfo,
      config: {
        ...config,
        tokenMasked: `${config.token.substring(0, 8)}...${config.token.slice(-4)}`,
        hasToken: true,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error: error.message || 'Noto\'g\'ri token yoki Telegram serveriga ulanib bo\'lmadi',
    });
  }
});

// 3. Toggle Polling (Start/Stop Bot)
app.post('/api/bot/toggle-polling', async (req, res) => {
  const { action } = req.body; // 'start' | 'stop' | 'toggle'

  if (!config.token || !botInfo) {
    return res.status(400).json({ error: 'Avval Telegram bot tokenini ulang' });
  }

  const targetState =
    action === 'start'
      ? true
      : action === 'stop'
      ? false
      : !isPollingRunning;

  if (targetState) {
    if (!isPollingRunning) {
      runPollingLoop();
    }
  } else {
    stopPollingLoop();
  }

  res.json({
    success: true,
    isPolling: isPollingRunning,
    botInfo,
  });
});

// 4. Update Bot AI Config (Persona, System Prompt, AutoReply, Welcome, etc.)
app.post('/api/bot/config', (req, res) => {
  const updates = req.body;
  config = {
    ...config,
    ...updates,
    // ensure token doesn't get overwritten with masked version
    token: updates.token !== undefined ? updates.token : config.token,
  };

  addLog('system_info', `⚙️ Bot sozlamalari yangilandi: ${config.model}, Avto-javob: ${config.autoReply ? 'Yoqilgan' : 'O\'chirilgan'}`);

  res.json({
    success: true,
    config: {
      ...config,
      tokenMasked: config.token
        ? `${config.token.substring(0, 8)}...${config.token.slice(-4)}`
        : '',
      hasToken: Boolean(config.token),
    },
  });
});

// 5. Get Logs
app.get('/api/bot/logs', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 100, 200);
  res.json({
    logs: logs.slice(0, limit),
  });
});

// 6. Clear Logs
app.post('/api/bot/logs/clear', (req, res) => {
  logs = [];
  addLog('system_info', '🗑️ Boshqaruv panelidan jami tarix tozalandi');
  res.json({ success: true });
});

// 7. Test AI Simulator (Web preview chat without sending to Telegram)
app.post('/api/bot/test-ai', async (req, res) => {
  const { message, userName } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Xabar matnini kiriting' });
  }

  const testChatId = 'simulator_user_1';
  const name = userName || 'Sinovchi';

  // Log incoming simulator message
  addLog('test_message', message, {
    chatId: 'Simulator',
    chatName: name,
    metadata: { isSimulator: true },
  });

  const cleanSimText = message.trim().toLowerCase();

  // 1) Lesson menu check for simulator
  if (
    ['/darslar', 'darslar', '📚 darslar', 'dars', "darslar ro'yxati"].includes(
      cleanSimText
    )
  ) {
    const menuText = `🎓 *DAVR ACADEMY AI — TAYYOR DARSLIKLAR RO'YXATI*\n\nIngliz tilini 0 dan C2 gacha tizimli o'rganish uchun quyidagi darajalardan birini tanlang yoki buyruq ustiga bosing:\n\n🌱 *A1 (Beginner — Boshlang'ich):*\n  /a1_1 — To Be fe'li va Kishilik olmoshlari\n  /a1_2 — Present Simple (Oddiy Hozirgi Zamon)\n  /a1_3 — There is / There are (Mavjudlik)\n\n🌿 *A2 (Elementary — Elementar):*\n  /a2_1 — Past Simple (Oddiy O'tgan Zamon)\n  /a2_2 — Present Continuous (Hozirgi Davomiy)\n\n🌳 *B1 (Intermediate — O'rta daraja):*\n  /b1_1 — Present Perfect (Hozirgi Tugallangan Zamon)\n  /b1_2 — Conditionals (0, 1, 2-shart gaplar)\n\n🚀 *B2 (Upper-Intermediate — Yuqori o'rta):*\n  /b2_1 — Passive Voice (Majhul Nisbat)\n  /b2_2 — IELTS Writing Task 2 strukturasi\n\n🏆 *C1–C2 (Advanced Mastery — Oliy daraja):*\n  /c1_1 — Inversion in Formal English\n  /c1_2 — Advanced Collocations & Academic Vocab\n\n💡 _Istalgan dars ustiga bosing yoki savol bering — AI Ustozingiz tushuntirib beradi!_`;
    addLog('ai_reply', menuText, {
      chatId: 'Simulator',
      chatName: name,
      metadata: { isSimulator: true, isLessonMenu: true },
    });
    return res.json({
      success: true,
      replyText: menuText,
      processingTimeMs: 15,
    });
  }

  // 2) Level command check for simulator
  const levelSimMap: Record<string, string> = {
    '/a1': 'A1',
    '/dars_a1': 'A1',
    'a1 darslar': 'A1',
    'a1 darsini boshlaymiz': 'A1',
    'men 0 darajadaman': 'A1',
    '/a2': 'A2',
    '/dars_a2': 'A2',
    'a2 darslar': 'A2',
    '/b1': 'B1',
    '/dars_b1': 'B1',
    'b1 darslar': 'B1',
    '/b2': 'B2',
    '/dars_b2': 'B2',
    'b2 darslar': 'B2',
    'ielts tayyorgarligi': 'B2',
    '/c1': 'C1-C2',
    '/dars_c1': 'C1-C2',
    'c1 darslar': 'C1-C2',
    '/c2': 'C1-C2',
  };
  if (levelSimMap[cleanSimText]) {
    const lvl = levelSimMap[cleanSimText] as any;
    const list = getLessonsByLevel(lvl);
    const levelReply =
      `🎓 *DAVR ACADEMY AI — ${lvl} DARAJASI DARSLARI*\n\nQuyidagi darslardan birining buyrug'i ustiga bosing:\n\n` +
      list
        .map(
          (l) =>
            `📖 *${l.title}*\n   👉 Buyruq: ${l.command}\n   📝 _${l.subtitle}_`
        )
        .join('\n\n') +
      `\n\n⬅️ Barcha darajalar: /darslar`;
    addLog('ai_reply', levelReply, {
      chatId: 'Simulator',
      chatName: name,
      metadata: { isSimulator: true, isLevelMenu: true, level: lvl },
    });
    return res.json({
      success: true,
      replyText: levelReply,
      processingTimeMs: 15,
    });
  }

  // 3) Specific lesson check for simulator
  const simLesson = getLessonByCommandOrId(cleanSimText);
  if (simLesson) {
    const lessonText = formatLessonForTelegram(simLesson);
    addLog('ai_reply', `[Darslik yuborildi] ${simLesson.title}`, {
      chatId: 'Simulator',
      chatName: name,
      metadata: { isSimulator: true, isLesson: true, lessonId: simLesson.id },
    });
    return res.json({
      success: true,
      replyText: lessonText,
      processingTimeMs: 15,
    });
  }

  try {
    const aiRes = await generateAiReply(testChatId, message, name);

    addLog('ai_reply', aiRes.text, {
      chatId: 'Simulator',
      chatName: name,
      metadata: {
        isSimulator: true,
        model: config.model,
        processingTimeMs: aiRes.processingTimeMs,
      },
    });

    res.json({
      success: true,
      replyText: aiRes.text,
      processingTimeMs: aiRes.processingTimeMs,
    });
  } catch (error: any) {
    const errMsg = error.message || 'AI xatosi';
    addLog('system_error', `Simulator xatosi: ${errMsg}`);
    res.status(500).json({ error: errMsg });
  }
});

// 8. Send Manual Message from Dashboard to a Chat ID
app.post('/api/bot/send-message', async (req, res) => {
  const { chatId, text } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ error: 'Chat ID va xabar matnini kiriting' });
  }
  if (!config.token) {
    return res.status(400).json({ error: 'Token ulanmagan' });
  }

  try {
    const result = await sendTelegramMessage(chatId, text);
    addLog('outgoing_telegram', text, {
      chatId,
      chatName: `Chat #${chatId}`,
      metadata: { isManualSend: true },
    });
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Xabar yuborishda xatolik' });
  }
});

// 9. Get Preconfigured Persona Presets
app.get('/api/bot/personas', (req, res) => {
  res.json({
    presets: PERSONA_PRESETS,
  });
});

// 10. Reset Bot memory / history for a chat
app.post('/api/bot/reset-memory', (req, res) => {
  userChatHistories.clear();
  addLog('system_info', '🧠 AI xotirasi (suhbatlar tarixi) yangilandi');
  res.json({ success: true });
});

// 11. Get all curriculum lessons
app.get('/api/lessons', (req, res) => {
  const { level } = req.query;
  if (level) {
    res.json({ lessons: getLessonsByLevel(level as any) });
  } else {
    res.json({ lessons: ALL_LESSONS });
  }
});

// 12. Send a specific lesson to a Telegram user from Dashboard
app.post('/api/lessons/send', async (req, res) => {
  const { chatId, lessonId } = req.body;
  if (!chatId || !lessonId) {
    return res.status(400).json({ error: 'chatId va lessonId talab qilinadi' });
  }
  const lesson = ALL_LESSONS.find(
    (l) => l.id === lessonId || l.command === lessonId
  );
  if (!lesson) {
    return res.status(404).json({ error: 'Dars topilmadi' });
  }
  try {
    const formattedText = formatLessonForTelegram(lesson);
    const result = await sendTelegramMessage(chatId, formattedText);
    addLog('outgoing_telegram', `[Darslik yuborildi] ${lesson.title}`, {
      chatId,
      chatName: `Chat #${chatId}`,
      metadata: { isLessonSend: true, lessonId: lesson.id },
    });
    res.json({ success: true, result });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Dars yuborishda xatolik' });
  }
});

// 13. Verify and notify admin @jasurdos for Premium Lessons Payment
app.post('/api/lessons/verify-payment', async (req, res) => {
  const {
    userHandle,
    courseTitle,
    cardNumber,
    receiverName,
    screenshotName,
    screenshotUrl,
    note,
    adminUsername = '@jasurdos',
  } = req.body;

  if (!userHandle || !courseTitle) {
    return res
      .status(400)
      .json({ error: "Foydalanuvchi ismi va kurs nomi kiritilishi shart" });
  }

  const notificationText =
    `💎 *PREMIUM DARSLIK - TO'LOV TASDIQLASH XABARI*\n\n` +
    `👤 *O'quvchi:* ${userHandle}\n` +
    `📚 *Tanlangan Kurs:* ${courseTitle}\n` +
    `💳 *Karta egasi:* ${receiverName || "G'aniyev Sardorbek"}\n` +
    `🔢 *Karta raqami:* ${cardNumber || '5614 6818 8730 1095'}\n` +
    `📎 *Skrinshot:* ${screenshotName || screenshotUrl || "Yuborildi (Fayl/URL)"}\n` +
    (note ? `💬 *Izoh:* ${note}\n` : '') +
    `\n👑 *Admin nazorati:* ${adminUsername}\n` +
    `📞 *Admin Tel:* +998 94 518 11 61 (To'lov tekshirilgach o'quvchiga Premium kirish ruxsati beriladi)`;

  // Add a prominent log to the system
  addLog('system_info', `[💎 Premium To'lov] @jasurdos adminga xabar yuborildi (${userHandle} - ${courseTitle} | Tel: +998945181161)`, {
    chatId: 'Admin #Jasurdos',
    chatName: "G'aniyev Sardorbek",
    username: adminUsername,
    metadata: {
      isPremiumVerification: true,
      userHandle,
      courseTitle,
      receiverName: receiverName || "G'aniyev Sardorbek",
      cardNumber: cardNumber || '5614 6818 8730 1095',
      adminPhone: '+998945181161',
      screenshotName,
      screenshotUrl,
    },
  });

  // Try to send to admin chat if available (for instance if Jasurdos chatId is 5879000826 from recent logs)
  try {
    if (config.isActive && config.token) {
      // We send to Jasurdos chatId 5879000826 if known, or silently log
      const adminChatId = '5879000826';
      await sendTelegramMessage(adminChatId, notificationText).catch(() => {});
    }
  } catch (e) {
    // Ignore error if admin telegram is not reachable
  }

  res.json({
    success: true,
    message: `To'lov ma'lumotlari admin (${adminUsername} - ${receiverName || "G'aniyev Sardorbek"}) ga muvaffaqiyatli yuborildi!`,
  });
});

// Add initial system boot log
addLog('system_info', '🚀 Telegram AI Bot Pro serveri ishga tushdi');

async function startServer() {
  // Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Telegram AI Bot Pro serveri ${PORT} portda ishga tushdi`);
  });
}

startServer();
