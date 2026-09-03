import React, { useState } from 'react';
import { safeFetchJson } from '../utils/safeFetch';

interface FunnelStep {
  id: string;
  day: number;
  triggerEvent: string;
  title: string;
  badge: string;
  conversionRate: string;
  messageUz: string;
  callToAction: string;
  callbackData: string;
}

const DEFAULT_FUNNELS: FunnelStep[] = [
  {
    id: 'step_day1',
    day: 1,
    triggerEvent: 'Foydalanuvchi /start bosgandan 2 soat o\'tgach',
    title: '🎯 Day 1: Darajani Aniqlash & Omadli Sandiq Sovg\'asi',
    badge: 'Onboarding & Activation',
    conversionRate: '68.4% faollashish',
    messageUz: `👋 Salom! Davr Academy botiga xush kelibsiz.\n\nIngliz tili darajangizni 2 daqiqada aniqlang va bugungi bepul "Omadli Sovg'alar Sandig'i"ni ochib 3 kunlik VIP statusga ega bo'ling! 🎁`,
    callToAction: '🎯 Testni Boshlash & Sandiqni Ochish',
    callbackData: 'menu_gift_chest',
  },
  {
    id: 'step_day2',
    day: 2,
    triggerEvent: 'Test ishlaganidan 24 soat o\'tgach (Streak Reminder)',
    title: '🔥 Day 2: 1-Kunlik Streak & AI Speaking Audio Mashqi',
    badge: 'Habit Formation',
    conversionRate: '54.2% qayta kirish',
    messageUz: `🔥 Ajoyib boshlanish! 1-kunlik o'rganish streakingiz boshlandi.\n\nBugun Britaniya aksentidagi murabbiy Emma bilan 5 daqiqalik ovozli suhbat qilib, +50 ta Oltin Davr Tangasini yig'ib oling! 🎙`,
    callToAction: '🎙 AI Speaking Murabbiyi Bilan Gaplashish',
    callbackData: 'menu_speaking',
  },
  {
    id: 'step_day3',
    day: 3,
    triggerEvent: 'Botga kirganining 3-kuni (VIP Flash Sale)',
    title: '👑 Day 3: 50% Chegirmali VIP Obuna Voronkasi',
    badge: 'Monetization & Conversion',
    conversionRate: '19.8% to\'lov konversiyasi',
    messageUz: `⚡️ MAXSUS TAKLIF! Faqat bugun Davr Academy barcha IELTS kurslari va cheksiz AI murabbiylari uchun 50% maxsus chegirma e'lon qildi.\n\n🔒 Click, Payme yoki Uzum orqali 1 daqiqada faollashtiring va o'rganishni boshlang!`,
    callToAction: '⭐️ 50% Chegirma Bilan VIP Olish',
    callbackData: 'menu_vip',
  },
  {
    id: 'step_day7',
    day: 7,
    triggerEvent: '3 kun davomida kirmagan o\'quvchilarga (Re-activation)',
    title: '🏅 Day 7: Xalqaro CEFR Sertifikat Chiptasi',
    badge: 'Retention & Win-Back',
    conversionRate: '31.5% qaytish',
    messageUz: `👋 Sizni sog'indik! Siz uchun bepul CEFR / IELTS Mock imtihon chiptasi ajratildi. Testni topshiring va rasmiy QR-kodli sertifikatingizni yuklab oling! 📜`,
    callToAction: '🏅 Bepul Sertifikat Imtihonini Topshirish',
    callbackData: 'menu_get_cert',
  }
];

export const AutoMarketingFunnels: React.FC = () => {
  const [funnels, setFunnels] = useState<FunnelStep[]>(DEFAULT_FUNNELS);
  const [testChatId, setTestChatId] = useState('');
  const [selectedFunnel, setSelectedFunnel] = useState<FunnelStep>(DEFAULT_FUNNELS[0]);
  const [sendingTest, setSendingTest] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState('');

  const handleTestFunnelTrigger = async () => {
    if (!testChatId.trim()) {
      setNotifyMsg('⚠️ Chat ID kiritilishi shart (Masalan: 123456789)');
      setTimeout(() => setNotifyMsg(''), 3500);
      return;
    }

    setSendingTest(true);
    try {
      await safeFetchJson('/api/bot/send-direct-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: testChatId.trim(),
          text: `${selectedFunnel.messageUz}\n\n👇 Sovg'ani qabul qilish uchun quyidagi tugmani bosing:`,
          replyMarkup: {
            inline_keyboard: [
              [{ text: selectedFunnel.callToAction, callback_data: selectedFunnel.callbackData }],
              [{ text: "🏠 Asosiy Menyu", callback_data: "back_to_main" }]
            ]
          }
        }),
      });
      setNotifyMsg(`✅ Voronka xabari yuborildi: [${selectedFunnel.badge}] -> Chat ID: ${testChatId}`);
      setTimeout(() => setNotifyMsg(''), 4500);
    } catch (e: any) {
      setNotifyMsg(`⚠️ Xatolik: ${e.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            🚀 24/7 Autopilot Conversion Funnel
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Marketing & Avtomatlashtirilgan Reklama Voronkalari
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Botga yangi kirgan foydalanuvchilarni qadamma-qadam aktivlashtiruvchi, o'rganishga undovchi va VIP obunani sotuvchi aqlli triggerlar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold">
            🟢 4 ta Voronka Avtomatik Faol
          </span>
        </div>
      </div>

      {notifyMsg && (
        <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-bold">
          {notifyMsg}
        </div>
      )}

      {/* Funnels Steps List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {funnels.map((step) => {
          const isSelected = selectedFunnel.id === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setSelectedFunnel(step)}
              className={`p-5 rounded-2xl border transition cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-black">
                  Day {step.day}
                </span>
                <span className="text-[11px] font-bold text-emerald-400">{step.conversionRate}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white leading-tight">{step.title}</h4>
                <div className="text-[11px] text-slate-400 mt-1">
                  ⏱ Trigger: <strong className="text-slate-300">{step.triggerEvent}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                {step.messageUz}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                  🎯 Tugma: {step.callToAction}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{step.callbackData}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Trigger Simulator */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>⚡️</span> Voronkani Telegramda Test Qilish (Jonli Sinov)
        </h3>
        <p className="text-xs text-slate-400">
          Tanlangan voronka xabarini o'z Telegram hisobingizga (Chat ID) yuborib ko'ring:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="Telegram Chat ID kiriting (Masalan: 123456789)..."
            value={testChatId}
            onChange={(e) => setTestChatId(e.target.value)}
            className="w-full sm:w-80 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          />

          <button
            onClick={handleTestFunnelTrigger}
            disabled={sendingTest}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{sendingTest ? 'Yuborilmoqda...' : `🚀 [Day ${selectedFunnel.day}] Voronkasini Yuborish`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
