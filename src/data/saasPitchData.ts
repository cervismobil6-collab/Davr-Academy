import { SaaSPackageTier } from '../types';

export const SAAS_TIERS: SaaSPackageTier[] = [
  {
    id: 'starter_center',
    name: 'Starter Academy (1 ta Filial)',
    badge: '🚀 Startap O\'quv Markazlar uchun',
    targetAudience: '100-300 o\'quvchiga ega xususiy kurslar',
    setupFeeUz: 1500000,
    monthlyFeeUz: 990000,
    maxStudents: 300,
    features: [
      'Telegram Bot (O\'z brendingiz va logongiz bilan)',
      'Grammar & Vocabulary 150+ interaktiv darslar',
      'IELTS Essay & Speaking AI tekshiruv (oyiga 1,000 tekshiruv)',
      'O\'quvchilar CRM va Davomat jurnali',
      'Click / Payme to\'lov integratsiyasi',
      'Kunlik avtomatik xabarnomalar (Broadcast)',
    ],
    whiteLabelDomain: false,
    customBotName: true,
    dedicatedAdminPanel: true,
    crmIntegration: true,
  },
  {
    id: 'pro_academy',
    name: 'Pro Academy (3-5 ta Filial)',
    badge: '👑 Eng Ommabop & Yuqori ROI',
    targetAudience: '500-1500 o\'quvchiga ega o\'rta va yirik markazlar',
    setupFeeUz: 3500000,
    monthlyFeeUz: 2490000,
    maxStudents: 1500,
    features: [
      'To\'liq White-Label (O\'z domeningiz va Telegram Web App)',
      'IELTS Band 9.0 Examiner + Mock Interview Simulyatori',
      'Cinema English & Netflix audio kliplar bazasi',
      'Cheksiz AI tahlil va Ovozli suhbat (Gemini + GPT-4o)',
      'Filiallar bo\'yicha alohida statistika va o\'qituvchilar kabineti',
      '24/7 Uptime Kafolati va Texnik qo\'llab-quvvatlash',
      'QR kodli rasmiy sertifikatlar generatori',
    ],
    whiteLabelDomain: true,
    customBotName: true,
    dedicatedAdminPanel: true,
    crmIntegration: true,
  },
  {
    id: 'enterprise_network',
    name: 'Enterprise Franchise (Maktab & Universitetlar)',
    badge: '🏢 Katta Tarmoqlar & Xalqaro Loyihalar',
    targetAudience: '2,000+ o\'quvchiga ega ta\'lim tarmoqlari',
    setupFeeUz: 7000000,
    monthlyFeeUz: 4990000,
    maxStudents: 10000,
    features: [
      'Maxsus serverda (Cloud Run / Dedicated) mustaqil o\'rnatish',
      'CEFR & IELTS rasmiy Mock imtihonlar markazi',
      'Kids English interaktiv multfilm darsliklari',
      'Shaxsiy AI neyromodel (O\'quv markaz darsliklariga moslangan)',
      '1C, Bitrix24, amoCRM va Modme bilan to\'liq API integratsiya',
      'VIP Menejer va 99.99% SLA kafolati',
      'Cheksiz SMS / Telegram ommaviy marketing xabarnomalari',
    ],
    whiteLabelDomain: true,
    customBotName: true,
    dedicatedAdminPanel: true,
    crmIntegration: true,
  },
];

export const COMMERCIAL_OFFER_TEXT = `
TIJORIY TAKLIF (COMMERCIAL PROPOSAL)
Mavzu: O'quv markazingizni 100% Avtomatlashtirilgan AI Ta'lim Platformasiga Aylantirish

Hurmatli Ta'lim Markazi Rahbari!

"Davr Academy AI Technologies" sizga o'quv markazingiz daromadini 2-3 barobarga oshirish va o'qituvchilar yuklamasini 70% ga qisqartirishga mo'ljallangan yagona AI EdTech ekotizimini taqdim etadi.

🔥 ASOSIY IMKONIYATLAR:
1. Shaxsiy Brendli Telegram Web App & AI Repetitor (24/7 o'quvchilar bilan ingliz tilida suhbatlashadi).
2. IELTS Essay & Speaking AI Examiner (Cambridge mezonlarida 5 soniyada baholash va tuzatish).
3. Cinema English & Real-World Dialogues (Kino va seriallar orqali zamonaviy slenglarni o'rgatish).
4. Avtomatik CEFR / IELTS Mock Testlar va QR kodli Sertifikat berish.
5. O'quvchilar davomati, to'lovlar (Click/Payme) va CRM nazorati.

💰 IQTISODIY SAMARADORLIK (ROI):
• 500 nafar o'quvchi uchun har oy atigi 25,000 so'm qo'shimcha AI obuna joriy qilinganda:
  -> Sof oylik daromad: +12,500,000 UZS/oy
  -> Platforma xarajati: 2,490,000 UZS/oy
  -> SOF FOYDA: +10,010,000 UZS/oy (400% ROI!)

📞 Aloqa va Shartnoma uchun:
Telegram: @DavrAcademyAdmin
Telefon: +998 (90) 123-45-67
Veb-sayt: https://davracademy.uz
`;
