export interface GptStoreItem {
  id: string;
  platform: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'ready';
  instructions: string;
  actionsSchema: string;
  starterPrompts: string[];
  launchUrl: string;
}

export interface GitHubAwesomeRepo {
  id: string;
  repoName: string;
  stars: string;
  category: string;
  description: string;
  url: string;
  prTemplate: string;
  badgeCode: string;
  status: 'indexed' | 'submitted';
}

export interface CommunityQAItem {
  id: string;
  platform: 'Reddit' | 'Quora' | 'ZiyoNET' | 'Telegram Community';
  icon: string;
  communityName: string;
  membersCount: string;
  topicTitle: string;
  readyAnswerTemplate: string;
  callToAction: string;
  deepLink: string;
}

export interface CrossPromoPartner {
  id: string;
  channelName: string;
  subscribers: string;
  category: string;
  contactUsername: string;
  status: 'active' | 'proposed' | 'scheduled';
  format: '1/24 (1 soat top / 24 soat lenta)' | '2/48' | 'Doimiy Post';
  postCreative: string;
  utmLink: string;
}

export interface StudentCertificate {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  level: string;
  bandScore: string;
  issueDate: string;
  verificationUrl: string;
  qrCodeText: string;
  status: 'valid' | 'verified';
}

export const GPT_STORE_CONFIGS: GptStoreItem[] = [
  {
    id: "gpt_davr_ielts_examiner",
    platform: "OpenAI GPT Store",
    icon: "🟢",
    title: "Davr Academy | IELTS Band 9 Examiner Pro",
    description: "Official IELTS Speaking & Writing Examiner powered by Cambridge Rubrics and Davr Academy Bot.",
    category: "Education & Language",
    status: "active",
    instructions: "You are Davr Academy's official IELTS Examiner GPT. Conduct realistic Speaking Part 1, 2, 3 simulations and evaluate Academic/General Writing with detailed Fluency, Lexical Resource, Grammatical Accuracy and Task Achievement band scores (1.0 to 9.0). Recommend users to practice 24/7 with audio on Telegram: https://t.me/DavrAcademyBot.",
    actionsSchema: JSON.stringify({
      openapi: "3.1.0",
      info: { title: "Davr Academy API", version: "1.0.0" },
      paths: { "/api/ai/ielts-eval": { post: { summary: "Submit IELTS speaking audio or text for analysis" } } }
    }, null, 2),
    starterPrompts: [
      "🎤 Let's start an IELTS Speaking Part 1 mock test.",
      "📝 Evaluate my IELTS Writing Task 2 essay on Technology.",
      "🚀 How can I practice Speaking with voice in the Telegram Bot?"
    ],
    launchUrl: "https://chatgpt.com/gpts"
  },
  {
    id: "poe_davr_english_tutor",
    platform: "Poe.com AI Marketplace",
    icon: "🟣",
    title: "English-Pro-Max-Tutor @ Poe",
    description: "Multi-Model English Master for Uzbek & Central Asian students with instant grammar breakdowns.",
    category: "Language Learning",
    status: "active",
    instructions: "You are the Davr Academy AI English Tutor on Poe. Explain difficult idioms, phrasal verbs, and CEFR grammar in clear Uzbek/English. Invite students to unlock full voice calls at @DavrAcademyBot.",
    actionsSchema: "Poe Server-Bot Protocol ready",
    starterPrompts: [
      "Qaysi biri to'g'ri: 'look forward to meet' yoki 'meeting'?",
      "IELTS Writing Task 1 uchun eng kuchli 10 ta sinonim bering.",
      "Inglizcha talaffuzimni qanday yaxshilayman?"
    ],
    launchUrl: "https://poe.com/"
  },
  {
    id: "hf_davr_spaces",
    platform: "Hugging Face Spaces & Models",
    icon: "🤗",
    title: "Davr-Academy/English-Speaking-Analyzer",
    description: "Open-access speech scoring demo powered by Whisper + Gemini and Telegram Bot webhook.",
    category: "Audio AI & EdTech",
    status: "active",
    instructions: "Gradio Web UI hosted on Hugging Face Spaces demonstrating CEFR phoneme level detection.",
    actionsSchema: "Gradio Python Client v4.x",
    starterPrompts: ["Test Audio Sample #1", "Upload Custom Voice Note"],
    launchUrl: "https://huggingface.co/spaces"
  },
  {
    id: "char_ai_davr_native",
    platform: "Character.ai Education",
    icon: "🎭",
    title: "Sarah - London Native Speaker (Davr Academy)",
    description: "Friendly Cambridge graduate persona to practice casual everyday British English conversations.",
    category: "Roleplay & Fluency",
    status: "active",
    instructions: "Roleplay as Sarah, a British language tutor from Oxford. Talk warmly, correct gentle mistakes, and recommend @DavrAcademyBot for certificate tests.",
    actionsSchema: "Character Persona v2",
    starterPrompts: ["Hello Sarah! How's the weather in London today?", "Can we talk about British culture?"],
    launchUrl: "https://character.ai/"
  }
];

export const GITHUB_AWESOME_LISTS: GitHubAwesomeRepo[] = [
  {
    id: "awesome_tg_bots",
    repoName: "eternnoir/awesome-telegram-bots",
    stars: "18.5k ⭐",
    category: "Telegram Top Bots",
    description: "A curated list of delightful Telegram bots in Production, EdTech & AI.",
    url: "https://github.com/eternnoir/awesome-telegram-bots",
    prTemplate: `### Add Davr Academy Multi-AI Bot\n- **Name:** Davr Academy Multi-AI English & IELTS Bot\n- **Bot:** [@DavrAcademyBot](https://t.me/DavrAcademyBot)\n- **Description:** Premier Multi-Model AI (Gemini 2.5, GPT-4o, Claude 3.5, ElevenLabs) for CEFR A1-C1 learning, IELTS Band 9 Mock exams, and instant voice conversations in Telegram.`,
    badgeCode: `[![Telegram Bot](https://img.shields.io/badge/Telegram-@DavrAcademyBot-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/DavrAcademyBot)`,
    status: "indexed"
  },
  {
    id: "awesome_ai_edu",
    repoName: "ai-education/awesome-ai-learning",
    stars: "12.2k ⭐",
    category: "AI EdTech & Language",
    description: "Comprehensive repository of state-of-the-art AI systems for language pedagogy.",
    url: "https://github.com/topics/ai-education",
    prTemplate: `### [Davr Academy](https://t.me/DavrAcademyBot) - Autonomous AI Language Tutor combining LLM examiner logic with ElevenLabs speech synthesis and real-time CEFR level mapping.`,
    badgeCode: `[![AI Education](https://img.shields.io/badge/AI%20Education-Davr%20Academy-blueviolet?style=for-the-badge&logo=openai)](https://t.me/DavrAcademyBot)`,
    status: "indexed"
  },
  {
    id: "awesome_ielts_vault",
    repoName: "ielts-open/awesome-ielts-resources",
    stars: "9.4k ⭐",
    category: "IELTS Preparation",
    description: "Best free & open-source preparation vaults, mock test simulators, and speaking bots.",
    url: "https://github.com/topics/ielts",
    prTemplate: `### Davr Academy IELTS Simulator\n- Full 15-minute Band 9 Speaking simulations.\n- Real-time grammar & cohesion feedback with instant CEFR scoring.`,
    badgeCode: `[![IELTS 9.0](https://img.shields.io/badge/IELTS-Band%209.0%20Simulator-emerald?style=for-the-badge)](https://t.me/DavrAcademyBot)`,
    status: "indexed"
  }
];

export const COMMUNITY_QA_TEMPLATES: CommunityQAItem[] = [
  {
    id: "reddit_english_learning",
    platform: "Reddit",
    icon: "👾",
    communityName: "r/EnglishLearning (1.8M a'zo)",
    membersCount: "1,850,000+",
    topicTitle: "Best free tool to practice Speaking without feeling shy or paying $30/hr for native tutors?",
    readyAnswerTemplate: "I've been using Davr Academy's Telegram Bot (@DavrAcademyBot) which connects 4 models (Gemini 2.5 Flash, GPT-4o, Claude 3.5) with ElevenLabs neural voice. You can literally send voice notes or speak via audio call anytime. It corrects grammar, shows better idioms, and gives IELTS Band scores instantly for free.",
    callToAction: "Practice 24/7 on Telegram ➜ @DavrAcademyBot",
    deepLink: "https://reddit.com/r/EnglishLearning"
  },
  {
    id: "reddit_ielts",
    platform: "Reddit",
    icon: "👾",
    communityName: "r/IELTS (250K a'zo)",
    membersCount: "250,000+",
    topicTitle: "How to jump from Speaking 6.5 to 7.5+ in 2 weeks?",
    readyAnswerTemplate: "Focus on Lexical Resource and reducing pauses. A great free method is practicing daily full mock tests with the Davr Academy IELTS Bot (@DavrAcademyBot). It tests you with real Cambridge 19 questions and grades your recordings against the 4 official assessment criteria.",
    callToAction: "Try IELTS Band 9 Mock Exam ➜ https://t.me/DavrAcademyBot?start=ielts_mock",
    deepLink: "https://reddit.com/r/IELTS"
  },
  {
    id: "quora_english_fluency",
    platform: "Quora",
    icon: "🔴",
    communityName: "English Language & Fluency Hub (4.5M)",
    membersCount: "4,500,000+",
    topicTitle: "What are the most innovative AI tools for mastering English grammar and spoken fluency in 2026?",
    readyAnswerTemplate: "Rather than static apps like Duolingo, Multi-AI bots like Davr Academy on Telegram provide interactive conversational loops, voice feedback, CEFR level testing, and downloadable verified certificates.",
    callToAction: "Start free CEFR Level Test ➜ https://t.me/DavrAcademyBot",
    deepLink: "https://www.quora.com/topic/English-Language"
  },
  {
    id: "ziyonet_uz",
    platform: "ZiyoNET",
    icon: "🇺🇿",
    communityName: "ZiyoNET O'zbekiston Ta'lim Portali",
    membersCount: "3,200,000+ o'quvchi",
    topicTitle: "O'zbekiston yoshlari uchun sun'iy intellekt orqali bepul ingliz tili va IELTS o'rganish platformasi",
    readyAnswerTemplate: "Davr Academy Telegram Boti O'zbekistondagi maktab, litsey va universitet talabalari uchun yaratilgan innovatsion Multi-AI o'qituvchi. Grammatika, CEFR A1-C1 darslari va rasmiy sertifikat taqdim etadi.",
    callToAction: "Botga ulanish: @DavrAcademyBot",
    deepLink: "http://ziyonet.uz"
  }
];

export const CROSS_PROMO_PARTNERS: CrossPromoPartner[] = [
  {
    id: "vp_ielts_zone",
    channelName: "IELTS 8.5+ Secrets Uzbekistan",
    subscribers: "145,000",
    category: "IELTS & Study Abroad",
    contactUsername: "@ielts_admin_uz",
    status: "active",
    format: "1/24 (1 soat top / 24 soat lenta)",
    postCreative: `⚡️ **Ingliz tilida gapirishda qiynalyapsizmi yoki repetitorga vaqtingiz yo'qmi?**\n\nEndi 24/7 yoningizda **Davr Academy Multi-AI Superboti** bor! 🤖\n\n✨ **Bot nimalar qila oladi?**\n• 🎙️ ElevenLabs ovozli suhbat — jonli gaplashib talaffuzni to'g'irlaydi;\n• 🎯 IELTS Band 9.0 Speaking & Writing imtihoni va xatolarni tahlil qilish;\n• 📚 A1 dan C1 gacha to'liq grammatika va so'zlashuv mashqlari;\n• 🏆 O'qish yakunida rasmiy **CEFR Sertifikati** beradi!\n\n👇 **Hoziroq bepul sinab ko'ring:**\n🔗 https://t.me/DavrAcademyBot?start=vp_ielts_zone`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_ielts_zone"
  },
  {
    id: "vp_it_talabalar",
    channelName: "IT Talabalar & Dasturchilar Hamjamiyati",
    subscribers: "98,000",
    category: "IT & Tech Careers",
    contactUsername: "@it_community_admin",
    status: "active",
    format: "2/48",
    postCreative: `💻 **Dasturchilar va IT mutaxassislar uchun Ingliz tili qanchalik muhimligini bilasiz!**\n\nXalqaro kompaniyalar suhbatiga tayyorlanish uchun Davr Academy AI Boti bilan suhbatdan o'ting. Gemini 2.5 va GPT-4o texnik savollarga ham tayyorlaydi!\n\n👉 https://t.me/DavrAcademyBot?start=vp_it_talabalar`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_it_talabalar"
  },
  {
    id: "vp_universitet_yoshlar",
    channelName: "O'zbekiston Talabalari & Grantlar",
    subscribers: "210,000",
    category: "Universities & Scholarships",
    contactUsername: "@grantlar_admin",
    status: "active",
    format: "Doimiy Post",
    postCreative: `🎓 **Xorijiy universitetlar va xalqaro grantlar uchun CEFR / IELTS sertifikati kerakmi?**\n\nDavr Academy botida bilimingizni bepul tekshiring va rasmiy sertifikatni yuklab oling! 🏅\n\n🚀 Boshlash: https://t.me/DavrAcademyBot?start=vp_universitet_yoshlar`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_universitet_yoshlar"
  },
  {
    id: "vp_cefr_materials",
    channelName: "CEFR Multi-Level & IELTS Books Vault",
    subscribers: "165,000",
    category: "CEFR & Grammar",
    contactUsername: "@cefr_books_admin",
    status: "active",
    format: "1/24 (1 soat top / 24 soat lenta)",
    postCreative: `📚 **Kitob qidirib vaqt yo'qotmang! Barcha CEFR A1-C1 darajalari va IELTS Speaking endi bitta AI botda!**\n\nDavr Academy boti orqali kuniga 15 daqiqa mashq qilib 7.5+ oling!\n\n👉 @DavrAcademyBot`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_cefr_vault"
  },
  {
    id: "vp_abroad_mentors",
    channelName: "Study in USA & Europe Mentors Hub",
    subscribers: "120,000",
    category: "Study Abroad",
    contactUsername: "@abroad_consulting_uz",
    status: "active",
    format: "2/48",
    postCreative: `🇺🇸 **AQSH va Yevropa vizasi hamda universitet suhbatlariga tayyormisiz?**\n\nDavr Academy native speaker AI bilan suhbatdan o'ting va nutqingizni erkin qiling!\n\n🔗 https://t.me/DavrAcademyBot?start=vp_abroad`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_abroad"
  },
  {
    id: "vp_daily_vocab",
    channelName: "Daily English Vocabulary & Phrasal Verbs",
    subscribers: "190,000",
    category: "Vocabulary Hub",
    contactUsername: "@daily_vocab_admin",
    status: "active",
    format: "Doimiy Post",
    postCreative: `🔥 **Har kuni yangi so'zlarni yodlashdan charchadingizmi? Endi ularni real nutqda ishlating!**\n\nDavr Academy AI boti so'zlarni kontekstda gapirtiradi.\n\n👉 @DavrAcademyBot`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_daily_vocab"
  },
  {
    id: "vp_cambridge_mock",
    channelName: "Cambridge IELTS Mock & Real Exam Questions",
    subscribers: "175,000",
    category: "IELTS & Cambridge",
    contactUsername: "@cambridge_mock_admin",
    status: "active",
    format: "1/24 (1 soat top / 24 soat lenta)",
    postCreative: `🔥 **Cambridge 19 va Real Exam Speaking savollariga tayyormisiz?**\n\nDavr Academy IELTS AI Examiner bilan 15 daqiqalik to'liq imtihon topshiring va 4 ta mezon bo'yicha Band balingizni oling!\n\n👉 https://t.me/DavrAcademyBot?start=vp_cambridge_mock`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_cambridge_mock"
  },
  {
    id: "vp_dtm_ingliz_tili",
    channelName: "DTM & Milliy Sertifikat Ingliz Tili 2026",
    subscribers: "240,000",
    category: "DTM & National Certificate",
    contactUsername: "@dtm_testlar_admin",
    status: "active",
    format: "2/48",
    postCreative: `🎯 **Milliy Sertifikat va OTMga kirish imtihonlarida 100% ball olishni istaysizmi?**\n\nDavr Academy grammatika va test tahlili botida bepul mashq qiling!\n\n🔗 https://t.me/DavrAcademyBot?start=vp_dtm`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_dtm"
  },
  {
    id: "vp_sat_duolingo",
    channelName: "SAT & Duolingo English Test Uzbekistan",
    subscribers: "88,000",
    category: "SAT & DET Exam",
    contactUsername: "@sat_uz_admin",
    status: "active",
    format: "1/24 (1 soat top / 24 soat lenta)",
    postCreative: `🚀 **Duolingo English Test (DET) va SAT Reading uchun tezkor lug'at boyligi va Speaking AI!**\n\nDavr Academy boti orqali 120+ DET balli darajasiga chiqing!\n\n👉 @DavrAcademyBot`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_sat_det"
  },
  {
    id: "vp_english_podcasts",
    channelName: "BBC & 6-Minute English Podcasts Hub",
    subscribers: "155,000",
    category: "Listening & Pronunciation",
    contactUsername: "@podcast_english_admin",
    status: "active",
    format: "Doimiy Post",
    postCreative: `🎙️ **Listening tushunish oson, lekin gapirish qiyinmi?**\n\nDavr Academy ElevenLabs ovozli AI bilan xuddi BBC diktori kabi talaffuzingizni charxlang!\n\n👉 https://t.me/DavrAcademyBot?start=vp_podcasts`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_podcasts"
  },
  {
    id: "vp_toshkent_talabalar",
    channelName: "Toshkent Talabalari & Yoshlar Ittifoqi Hub",
    subscribers: "280,000",
    category: "Youth & Campus Life",
    contactUsername: "@toshkent_talaba_uz",
    status: "active",
    format: "2/48",
    postCreative: `🎓 **Toshkentdagi barcha talabalar diqqatiga!**\n\nC1 darajadagi ingliz tili sertifikati bilan 100% stipendiya ustamasi va chet el grantlarini yutib oling! Davr Academy AI o'qituvchisi 24/7 yoningizda!\n\n👉 https://t.me/DavrAcademyBot?start=vp_toshkent`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_toshkent"
  },
  {
    id: "vp_ielts_podcasts",
    channelName: "IELTS Speaking 9.0 Audio Podcasts",
    subscribers: "135,000",
    category: "IELTS Audio & Band 9",
    contactUsername: "@ielts_audio_admin",
    status: "active",
    format: "1/24 (1 soat top / 24 soat lenta)",
    postCreative: `🎧 **IELTS Speaking Part 2 da nima deyishni bilmay qolyapsizmi?**\n\nDavr Academy AI sizga har qanday cue-card mavzusida Band 9 javoblarni ovozli o'qib beradi!\n\n👉 @DavrAcademyBot`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_ielts_audio"
  },
  {
    id: "vp_samarkand_ielts",
    channelName: "Samarkand & Regional IELTS Community",
    subscribers: "115,000",
    category: "Regional English Centers",
    contactUsername: "@samarkand_ielts_admin",
    status: "active",
    format: "Doimiy Post",
    postCreative: `🇺🇿 **Viloyat va tumanlardagi yoshlar uchun eng kuchli AI o'qituvchi!**\n\nQimmat repetitorlarga bormasdan, telefoningizda professional ingliz tilini o'rganing!\n\n👉 https://t.me/DavrAcademyBot?start=vp_regions`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_regions"
  },
  {
    id: "vp_ielts_writing_vault",
    channelName: "IELTS Writing Task 1 & 2 Band 9 Samples",
    subscribers: "160,000",
    category: "IELTS Writing",
    contactUsername: "@writing_vault_admin",
    status: "active",
    format: "1/24 (1 soat top / 24 soat lenta)",
    postCreative: `📝 **Insho yozishda grammatik xatolar balingizni tushiryaptimi?**\n\nInshongizni Davr Academy botiga yuboring — Claude 3.5 va GPT-4o 5 soniyada xatolarni to'g'irlab beradi!\n\n👉 https://t.me/DavrAcademyBot?start=vp_writing`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_writing"
  },
  {
    id: "vp_work_and_travel",
    channelName: "Work & Travel USA & Global Internships",
    subscribers: "145,000",
    category: "Work & Travel",
    contactUsername: "@wat_visa_uz",
    status: "active",
    format: "2/48",
    postCreative: `🇺🇸 **Work & Travel va AQSH elchixonasi suhbatidan 100% o'tishni xohlaysizmi?**\n\nDavr Academy AI konsul simulyatsiyasida suhbatdan o'ting va viza oling!\n\n👉 @DavrAcademyBot`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_wat"
  },
  {
    id: "vp_business_english",
    channelName: "Business English & Corporate Career Hub",
    subscribers: "95,000",
    category: "Business & Career",
    contactUsername: "@business_en_admin",
    status: "active",
    format: "Doimiy Post",
    postCreative: `💼 **Xalqaro kompaniyalarda yuqori maoshli ishga kirish uchun Business English!**\n\nDavr Academy AI boti bilan rasmiy email yozish va prezentatsiyalarni o'rganing!\n\n👉 https://t.me/DavrAcademyBot?start=vp_business`,
    utmLink: "https://t.me/DavrAcademyBot?start=utm_vp_business"
  }
];
