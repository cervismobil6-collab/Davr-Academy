import { LessonItem, LessonLevel } from '../types';

export const ALL_LESSONS: LessonItem[] = [
  // ==================== A1 LEVEL ====================
  {
    id: 'a1_1',
    level: 'A1',
    lessonNumber: 1,
    command: '/a1_1',
    title: "To Be fe'li (Am / Is / Are) va Kishilik olmoshlari",
    subtitle: "Ingliz tilining eng birinchi poydevori — kim yoki nima ekanligini aytish",
    content: `🎓 DAVR ACADEMY AI — 1-DARS: TO BE FE'LI

Ingliz tilida gap tuzishda asosiy fe'l bo'lmaganda "To Be" (bo'lmoq, -dir) fe'li ishlatiladi.
Hozirgi zamonda u 3 xil shaklga ega: AM, IS, ARE.

📌 KISHILIK OLMOSHLARI VA TO BE:
• I am → Men ...man (I am a student — Men talabaman)
• You are → Sen / Siz ...siz (You are a doctor — Siz shifokorsiz)
• He is → U (o'g'il bolaga) (He is from Tashkent — U Toshkentdan)
• She is → U (qiz bolaga) (She is a teacher — U o'qituvchi)
• It is → U (narsa / hayvon) (It is an apple — Bu olma)
• We are → Biz ...miz (We are ready — Biz tayyormiz)
• They are → Ular ...dir (They are happy — Ular xursand)

💡 BO'LISHSIZ SHAKL (NOT):
• I am not tired. (Men charchamadim)
• She is not at home. (U uyda emas)

❓ SO'ROQ SHAKL:
To Be fe'li ega oldiga chiqadi!
• Are you happy? → Xursandmisiz? (Yes, I am / No, I am not)
• Is he your brother? → U sizning akangizmi?`,
    grammarRules: [
      "I bilan faqat 'am' ishlatiladi (I am)",
      "Birlikdagi otlar va He/She/It bilan 'is' ishlatiladi",
      "Ko'plikdagi otlar va You/We/They bilan 'are' ishlatiladi",
      "Inkor gaplarda 'not' to be fe'lidan keyin qo'yiladi (is not = isn't, are not = aren't)"
    ],
    vocabulary: [
      { uz: "Talaba / O'quvchi", en: "Student", example: "I am an English student at Davr Academy." },
      { uz: "O'qituvchi", en: "Teacher", example: "Mr. John is a great teacher." },
      { uz: "Tayyor", en: "Ready", example: "Are you ready for the lesson?" },
      { uz: "Charchagan", en: "Tired", example: "We are not tired today." }
    ],
    practiceQuestions: [
      {
        id: 'a1_1_q1',
        question: "Qaysi gap grammatik jihatdan TO'G'RI?",
        options: [
          "She are a doctor at the hospital.",
          "They is my best friends.",
          "He is from Tashkent.",
          "I is very happy today."
        ],
        correctIndex: 2,
        explanation: "He (birlik) bilan 'is' ishlatiladi: 'He is from Tashkent'. She bilan 'is', They bilan 'are', I bilan 'am' bo'lishi kerak edi."
      },
      {
        id: 'a1_1_q2',
        question: "'Siz tayyormisiz?' gapining inglizcha to'g'ri tarjimasi qaysi?",
        options: [
          "You are ready?",
          "Are you ready?",
          "Is you ready?",
          "Am you ready?"
        ],
        correctIndex: 1,
        explanation: "So'roq gaplarda 'Are' fe'li egadan (you) oldinga chiqadi: 'Are you ready?'"
      }
    ]
  },
  {
    id: 'a1_2',
    level: 'A1',
    lessonNumber: 2,
    command: '/a1_2',
    title: "Present Simple (Oddiy Hozirgi Zamon)",
    subtitle: "Doimiy odatlar, kundalik ishlar va umumiy haqiqatlar",
    content: `🎓 DAVR ACADEMY AI — 2-DARS: PRESENT SIMPLE

Present Simple — har kuni takrorlanadigan ish-harakatlar, odatlar va o'zgarmas haqiqatlarni ifodalash uchun ishlatiladi.

📌 DASTEKLASH FORMULASI:
• I / You / We / They + V1 (fe'lning o'zi)
  👉 I work every day. (Men har kuni ishlayman)
• He / She / It + V1 + (-s / -es)
  👉 She lives in London. (U Londonda yashaydi)

💡 BO'LISHSIZ SHAKL (DON'T / DOESN'T):
• I don't speak Spanish. (Men ispancha gapirmayman)
• He doesn't like coffee. (U qahvani yoqtirmaydi — 'like' dan -s tushib qoladi!)

❓ SO'ROQ SHAKL (DO / DOES):
• Do you study English? (Ingliz tilini o'rganasizmi?)
• Does she read books? (U kitob o'qiydimi?)`,
    grammarRules: [
      "He/She/It (uchinchi shaxs birlik) bilan fe'lga -s yoki -es qo'shiladi (work -> works, go -> goes)",
      "Inkor va so'roqda Does/Doesn't kelganda fe'lning oxiridagi -s tushib qoladi (Does she work?)",
      "Signal so'zlar: always (doim), usually (odatda), often (tez-tez), every day (har kuni), never (hech qachon)"
    ],
    vocabulary: [
      { uz: "Har kuni", en: "Every day", example: "I practice English every day with AI." },
      { uz: "Odatda", en: "Usually", example: "She usually wakes up at 7 AM." },
      { uz: "Yoqtirmoq", en: "Like", example: "We like learning grammar." },
      { uz: "Gapirmoq / So'zlamoq", en: "Speak", example: "He speaks three languages fluently." }
    ],
    practiceQuestions: [
      {
        id: 'a1_2_q1',
        question: "Bo'sh joyga to'g'ri so'zni qo'ying: 'My brother _____ English every morning.'",
        options: [
          "study",
          "studies",
          "studying",
          "are study"
        ],
        correctIndex: 1,
        explanation: "'My brother' = He (3-shaxs birlik), shuning uchun fe'l oxiriga -es qo'shiladi: studies."
      }
    ]
  },
  {
    id: 'a1_3',
    level: 'A1',
    lessonNumber: 3,
    command: '/a1_3',
    title: "There is / There are — Mavjudlikni ifodalash",
    subtitle: "Biror joyda nima bor yoki yo'qligini to'g'ri aytish",
    content: `🎓 DAVR ACADEMY AI — 3-DARS: THERE IS / THERE ARE

O'zbek tilida "...da ... bor" deb aytadigan gaplarimiz ingliz tilida "There is" yoki "There are" bilan boshlanadi.

📌 QOIDA:
• There is → Birlikdagi va sanalmaydigan otlar uchun
  👉 There is a book on the table. (Stol ustida kitob bor)
  👉 There is some water in the glass. (Stakanda biroz suv bor)
• There are → Ko'plikdagi otlar uchun
  👉 There are three apples in the bag. (Sumkada 3 ta olma bor)
  👉 There are many students in the classroom. (Sinfda ko'p o'quvchilar bor)

💡 INKOR VA SO'ROQ:
• There isn't any milk left. (Hech qancha sut qolmadi)
• Are there any questions? (Savollar bormi?)`,
    grammarRules: [
      "There is + a / an / one (birlik)",
      "There are + two / three / many / some (ko'plik)",
      "Sanalmaydigan otlar (suv, pul, vaqt, ma'lumot) bilan doim 'There is' ishlatiladi"
    ],
    vocabulary: [
      { uz: "Stol ustida", en: "On the table", example: "There is a laptop on the table." },
      { uz: "Sinfxona", en: "Classroom", example: "There are 20 chairs in the classroom." },
      { uz: "Biroz / Bir nechta", en: "Some", example: "There is some sugar in my tea." }
    ],
    practiceQuestions: [
      {
        id: 'a1_3_q1',
        question: "Qaysi variat to'g'ri: '_____ a big airport in Tashkent.'",
        options: ["There are", "There is", "It are", "Are there"],
        correctIndex: 1,
        explanation: "'a big airport' birlikda, shuning uchun 'There is' ishlatiladi."
      }
    ]
  },

  // ==================== A2 LEVEL ====================
  {
    id: 'a2_1',
    level: 'A2',
    lessonNumber: 1,
    command: '/a2_1',
    title: "Past Simple (Oddiy O'tgan Zamon)",
    subtitle: "O'tmishda bo'lib o'tgan va tugallangan ish-harakatlar",
    content: `🎓 DAVR ACADEMY AI — 4-DARS: PAST SIMPLE

Past Simple — o'tmishda ma'lum bir vaqtda yuz bergan va hozirgi zamonga aloqasi qolmagan voqealarni ifodalaydi.

📌 TO'G'RI VA NOTO'G'RI FE'LLAR (REGULAR & IRREGULAR):
1. To'g'ri fe'llarga '-ed' qo'shiladi:
   • work → worked (ishladi)
   • play → played (o'ynadi)
2. Noto'g'ri fe'llar 2-shaklga (V2) o'zgaradi:
   • go → went (bordi)
   • see → saw (ko'rdi)
   • have → had (bor edi / qildi)

💡 INKOR VA SO'ROQ (DID / DIDN'T):
Did / didn't kelganda fe'l 1-shaklga (V1) qaytadi!
• I didn't go to work yesterday. (Men kecha ishga bormadim)
• Did you watch the match last night? (O'tgan tunda o'yinni ko'rdingizmi?)`,
    grammarRules: [
      "Inkor va so'roqda 'did/didn't' dan keyin fe'lning 1-shakli (V1) ishlatiladi (didn't went emas, didn't go!)",
      "Signal so'zlar: yesterday (kecha), last week (o'tgan hafta), 2 years ago (2 yil oldin), in 2020"
    ],
    vocabulary: [
      { uz: "Kecha", en: "Yesterday", example: "I finished my homework yesterday." },
      { uz: "O'tgan hafta", en: "Last week", example: "We visited Samarkand last week." },
      { uz: "Bordi (Go -> Went)", en: "Went", example: "She went to the library 2 hours ago." }
    ],
    practiceQuestions: [
      {
        id: 'a2_1_q1',
        question: "Qaysi gap grammatik jihatdan TO'G'RI?",
        options: [
          "I didn't saw my friend yesterday.",
          "Did you went to the cinema?",
          "We visited our grandparents last Sunday.",
          "She working hard last night."
        ],
        correctIndex: 2,
        explanation: "'didn't' va 'did' kelganda fe'l 1-shaklga qaytadi ('didn't see', 'did you go'). To'g'ri variant: 'We visited...' (-ed qo'shilgan)."
      }
    ]
  },
  {
    id: 'a2_2',
    level: 'A2',
    lessonNumber: 2,
    command: '/a2_2',
    title: "Present Continuous (Hozirgi Davomiy Zamon)",
    subtitle: "Ayni damda yoki hozirgi kunlarda davom etayotgan jarayonlar",
    content: `🎓 DAVR ACADEMY AI — 5-DARS: PRESENT CONTINUOUS

Ayni gapirayotgan paytimizda yoki hozirgi kunlarda davom etayotgan harakatlar uchun Present Continuous ishlatiladi.

📌 FORMULA:
Ega + am / is / are + V-ing
• I am studying English now. (Men hozir ingliz tilini o'rganyapman)
• Look! It is raining outside. (Qara! Ko'chada yomg'ir yog'yapti)
• They are working on a new project this month. (Ular shu oy yangi loyiha ustida ishlamoqda)

💡 PRESENT SIMPLE BILAN FARQI:
• I drink coffee every morning. (Odatiy — Present Simple)
• I am drinking coffee right now. (Ayni damda — Present Continuous)`,
    grammarRules: [
      "am/is/are + fe'l oxiriga -ing qo'shiladi",
      "Holat fe'llari (know, want, understand, love, like) odatda -ing shaklida ISHLATILMAYDI (I am knowing emas, I know bo'ladi)",
      "Signal so'zlar: now (hozir), right now (ayni damda), at the moment (shu lahzada), Look! (Qara!), Listen! (Eshit!)"
    ],
    vocabulary: [
      { uz: "Hozir / Ayni damda", en: "Right now", example: "What are you doing right now?" },
      { uz: "Tushunmoq", en: "Understand", example: "I understand this grammar rule very well." },
      { uz: "Loyiha", en: "Project", example: "She is creating an AI project this week." }
    ],
    practiceQuestions: [
      {
        id: 'a2_2_q1',
        question: "Listen! Somebody _____ the piano.",
        options: ["play", "plays", "is playing", "are playing"],
        correctIndex: 2,
        explanation: "'Listen!' (Eshit!) so'zi harakat ayni damda bo'layotganini bildiradi. Somebody (birlik) -> 'is playing'."
      }
    ]
  },

  // ==================== B1 LEVEL ====================
  {
    id: 'b1_1',
    level: 'B1',
    lessonNumber: 1,
    command: '/b1_1',
    title: "Present Perfect (Hozirgi Tugallangan Zamon)",
    subtitle: "O'tmishda yuz berib, natijasi hozirgi zamonga ta'sir qiluvchi harakatlar",
    content: `🎓 DAVR ACADEMY AI — 6-DARS: PRESENT PERFECT

Present Perfect — o'tmishda qachon bo'lgani aniq bo'lmagan, ammo natijasi yoki tajribasi hozirgi kunga bog'liq bo'lgan voqealarni bildiradi.

📌 FORMULA:
Ega + have / has + V3 (yoki -ed)
• I have visited London twice. (Men Londonda 2 marta bo'lganman — hayotiy tajriba)
• She has already finished her homework. (U vazifasini allaqachon tugatdi — natijasi tayyor)
• We have lived here since 2018. (2018-yildan beri shu yerda yashaymiz — hali ham davom etyapti)

💡 PAST SIMPLE VS PRESENT PERFECT:
• I lost my key yesterday. (Kecha yo'qotdim — o'tmishda qolgan)
• I have lost my key! (Kalitimni yo'qotib qo'ydim — hozir uyi-ga kirolmayapman!)`,
    grammarRules: [
      "He/She/It bilan 'has', qolganlar bilan 'have' ishlatiladi",
      "Since (dan beri — aniq nuqta: since 2020, since yesterday)",
      "For (davomida — vaqt oralig'i: for 3 years, for 2 hours)",
      "Just (xuddi hozir), Already (allaqachon), Yet (hali — inkor va so'roqda)"
    ],
    vocabulary: [
      { uz: "Allaqachon", en: "Already", example: "I have already completed five lessons." },
      { uz: "Tajriba", en: "Experience", example: "Have you ever had an experience with AI tutors?" },
      { uz: "Dan beri", en: "Since", example: "We have known each other since childhood." }
    ],
    practiceQuestions: [
      {
        id: 'b1_1_q1',
        question: "Bo'sh joyga 'since' yoki 'for' dan qaysi biri mos? 'I have lived in Tashkent _____ 5 years.'",
        options: ["since", "for", "from", "ago"],
        correctIndex: 1,
        explanation: "5 years — bu vaqt davomiyligi (duration), shuning uchun 'for' ishlatiladi. Agar yil ko'rsatilsa (2019), 'since' bo'lardi."
      }
    ]
  },
  {
    id: 'b1_2',
    level: 'B1',
    lessonNumber: 2,
    command: '/b1_2',
    title: "Conditional Sentences (0, 1, 2-shart gaplar)",
    subtitle: "Agar ... bo'lganda edi — shart va natija gaplari",
    content: `🎓 DAVR ACADEMY AI — 7-DARS: CONDITIONALS (SHART GAPLAR)

Ingliz tilida "Agar ... bo'lsa" ma'nosidagi gaplar Conditionals deb ataladi.

📌 1-SHART GAP (REAL FUTURE CONDITION — 1st Conditional):
Kelajakda bo'lishi ehtimoli yuqori bo'lgan shart.
Formula: If + Present Simple, WILL + V1
• If you study hard, you will pass the IELTS exam.
  (Agar qattiq o'qisangiz, IELTS imtihonidan o'tasiz)
• If it rains tomorrow, we will stay at home.
  (Agar ertaga yomg'ir yog'sa, uyda qolamiz)

📌 2-SHART GAP (UNREAL PRESENT — 2nd Conditional):
Hozirgi vaqtda amalga oshishi qiyin yoki xayoliy holat.
Formula: If + Past Simple, WOULD + V1
• If I had a million dollars, I would travel the world.
  (Agar 1 million dollarim bo'lganda edi, dunyoni kezgan bo'lardim)
• If I were you, I would practice speaking every day.
  (O'rningizda bo'lganimda, har kuni speaking mashq qilardim)`,
    grammarRules: [
      "1st Conditional: If qismida kelajak bo'lsa ham will emas, Present Simple ishlatiladi! (If it will rain emas -> If it rains)",
      "2nd Conditional: Barcha shaxslar (I, he, she, it) uchun 'was' o'rniga 'were' ishlatish adabiy va to'g'ri (If I were you)"
    ],
    vocabulary: [
      { uz: "O'rningda bo'lganimda", en: "If I were you", example: "If I were you, I would take the CEFR exam." },
      { uz: "Amalga oshmoq / o'tmoq", en: "Pass", example: "You will pass the test easily with Davr Academy." },
      { uz: "Imkoniyat", en: "Opportunity", example: "This bot gives you a great opportunity to learn." }
    ],
    practiceQuestions: [
      {
        id: 'b1_2_q1',
        question: "Qaysi variat to'g'ri? 'If she _____ time tomorrow, she will call you.'",
        options: ["will have", "has", "had", "have"],
        correctIndex: 1,
        explanation: "1st Conditional: If qismida Present Simple ishlatiladi -> 'If she has time tomorrow...'."
      }
    ]
  },

  // ==================== B2 LEVEL ====================
  {
    id: 'b2_1',
    level: 'B2',
    lessonNumber: 1,
    command: '/b2_1',
    title: "Passive Voice (Majhul Nisbat)",
    subtitle: "Harakatning o'zi muhim bo'lgan rasmiy va akademik uslub",
    content: `🎓 DAVR ACADEMY AI — 8-DARS: PASSIVE VOICE

Passive Voice (Majhul Nisbat) — harakatni kim bajarganidan ko'ra, harakatning o'zi yoki uning natijasi muhimroq bo'lganda ishlatiladi. IELTS va akademik yozishda juda muhim!

📌 FORMULA:
Ega (Ob-yekt) + BE + V3 (yoki -ed)
• Active: People speak English all over the world.
  👉 Passive: English is spoken all over the world.
  (Ingliz tilida butun dunyoda gapiriladi)
• Active: Alexander Fleming discovered penicillin in 1928.
  👉 Passive: Penicillin was discovered in 1928.
  (Penitsillin 1928-yili kashf qilingan)
• Active: They are building a new university in Tashkent.
  👉 Passive: A new university is being built in Tashkent.`,
    grammarRules: [
      "Zamon o'zgarmaydi, faqat 'To Be' fe'li o'sha zamonga moslanadi (is, was, has been, will be)",
      "Asosiy fe'l DOIM 3-shaklida (V3 / -ed) turadi (is spoken, was made, will be done)",
      "Agar bajargan shaxsni aytish muhim bo'lsa, 'by' predlogi qo'shiladi (by Shakespeare, by AI)"
    ],
    vocabulary: [
      { uz: "Kashf qilindi", en: "Was discovered", example: "Many useful technologies were discovered recently." },
      { uz: "Gullab-yashnamoq / Rivojlanmoq", en: "Thrive", example: "Students thrive when taught by personalized AI." },
      { uz: "Qurilmoqda", en: "Is being built", example: "A modern campus is being built in our city." }
    ],
    practiceQuestions: [
      {
        id: 'b2_1_q1',
        question: "'The Mona Lisa _____ by Leonardo da Vinci in the 16th century.'",
        options: ["is painted", "was painted", "painted", "was painting"],
        correctIndex: 1,
        explanation: "O'tmishdagi aniq voqea (16th century) uchun Past Simple Passive: 'was painted' (chizilgan)."
      }
    ]
  },
  {
    id: 'b2_2',
    level: 'B2',
    lessonNumber: 2,
    command: '/b2_2',
    title: "IELTS Writing Task 2 — Argumentative Essay strukturasi",
    subtitle: "IELTS Insho yozishda 7.0+ ball olish sirlari va strukturasi",
    content: `🎓 DAVR ACADEMY AI — 9-DARS: IELTS WRITING TASK 2

IELTS Writing Task 2 imtihonning eng ko'p ball beradigan qismidir (66%). 7.0 va undan yuqori ball olish uchun aniq 4 qismli strukturaga amal qilish shart!

📌 OLTIN STRUKTURA (4 PARAGRAFLI ESSAY):
1️⃣ INTRODUCTION (Kirish - 2-3 gap):
   • Paraphrase the prompt (Savolni o'z so'zlaringiz bilan qayta yozing)
   • Thesis statement (O'z fikringiz va essay nimada ekanligini aniq aytish)
2️⃣ BODY PARAGRAPH 1 (Asosiy qism 1 - 4-5 gap):
   • Topic sentence (1-asosiy argument)
   • Explanation (Nega bunday deb o'ylaysiz - tushuntirish)
   • Example (Hayotiy yoki ilmiy misol)
3️⃣ BODY PARAGRAPH 2 (Asosiy qism 2 - 4-5 gap):
   • Topic sentence (2-asosiy argument yoki qarshi fikr)
   • Explanation & Example
4️⃣ CONCLUSION (Xulosa - 1-2 gap):
   • Restate thesis (Fikringizni yana bir bor umumlashtirib yakunlash — yangi g'oya qo'shmang!)

💡 BOG'LOVCHI SO'ZLAR (LINKING WORDS FOR 7.0+):
• Furthermore / Moreover — Bundan tashqari
• Consequently / As a result — Natijada
• On the one hand / On the other hand — Bir tomondan / Ikkinchi tomondan
• To illustrate / For instance — Misol uchun`,
    grammarRules: [
      "Inshoda hech qachon qisqartmalar ishlatmang (don't emas do not, can't emas cannot)",
      "Shaxsiy hissiyotlar o'rniga akademik uslubni tanlang ('I feel that...' o'rniga 'It is widely argued that...')",
      "Kamida 250 ta so'z yozish shart, eng optimal hajm — 270–310 so'z"
    ],
    vocabulary: [
      { uz: "Bundan tashqari", en: "Furthermore", example: "Furthermore, AI tutors provide immediate feedback." },
      { uz: "Natijada", en: "Consequently", example: "Consequently, learners improve their speaking confidence." },
      { uz: "Keng tarqalgan fikrga ko'ra", en: "It is widely argued that", example: "It is widely argued that technology enhances learning." }
    ],
    practiceQuestions: [
      {
        id: 'b2_2_q1',
        question: "IELTS Writing Task 2 Xulosa (Conclusion) qismida qaysi birini QILISh MUMKIN EMAS?",
        options: [
          "Fikringizni qayta ta'kidlash",
          "Asosiy argumentlarni qisqa umumlashtirish",
          "Mavzuga oid butunlay yangi g'oya va misol qo'shish",
          "Inshoni akademik tilda yakunlash"
        ],
        correctIndex: 2,
        explanation: "Conclusion qismida HECH QACHON yangi g'oya (new idea) qo'shmaslik kerak, faqat yuqorida aytilganlarni xulosa qilish kerak."
      }
    ]
  },

  // ==================== C1-C2 LEVEL ====================
  {
    id: 'c1_1',
    level: 'C1-C2',
    lessonNumber: 1,
    command: '/c1_1',
    title: "Inversion in Formal English (Inversiya qoidalari)",
    subtitle: "Oliy darajadagi ta'sirchan va akademik gap qurilishi",
    content: `🎓 DAVR ACADEMY AI — 10-DARS: ADVANCED INVERSION (C1–C2)

Inversion (Inversiya) — gapda ta'sirni kuchaytirish (emphasis) yoki rasmiy (formal/academic) uslub berish uchun yordamchi fe'lning egadan oldinga chiqarilishi. IELTS va Kembrij imtihonlarida 8.0+ darajaning ko'rsatkichi!

📌 ASOSIY INVERSIYA QURILISHLARI:
1. Never / Rarely / Seldom (Hech qachon / Juda kamdan-kam):
   • Normal: I have never seen such an incredible AI tutor.
   • Inversion: Never have I seen such an incredible AI tutor.
     (Hech qachon bunday ajoyib AI ustozni ko'rmaganman!)

2. Not only ... but also (Nafaqat ... balki):
   • Normal: She teaches grammar and she also motivates students.
   • Inversion: Not only does she teach grammar, but she also motivates students.

3. Hardly ... when / No sooner ... than (Endigina ... ediki):
   • Inversion: No sooner had I opened the app than the bot explained the answer.
     (Ilovani ochishim bilan bot javobni tushuntirib berdi!)

4. Little did I know ... (Xayolimga ham kelmagandi ...):
   • Inversion: Little did we know that AI would revolutionize English education.`,
    grammarRules: [
      "Inversiya gaplarda yordamchi fe'l (do, does, did, have, had, was, were) egadan oldin keladi, xuddi so'roq gapga o'xshab, ammo nuqta (.) bilan tugaydi!",
      "Not only bilan boshlanganda faqat birinchi qism inversiya qilinadi, 'but also' qismi oddiy tartibda qoladi."
    ],
    vocabulary: [
      { uz: "Nafaqat ... balki", en: "Not only ... but also", example: "Not only is English useful, but it is also essential for careers." },
      { uz: "Kamdan-kam / kamdan kam holatlarda", en: "Seldom / Rarely", example: "Seldom do we see such rapid progress without daily practice." },
      { uz: "Tubdan o'zgartirmoq", en: "Revolutionize", example: "Artificial Intelligence will revolutionize global education." }
    ],
    practiceQuestions: [
      {
        id: 'c1_1_q1',
        question: "Qaysi inversiya gap TO'G'RI tuzilgan?",
        options: [
          "Never I have seen such a beautiful city.",
          "Not only she speaks English, but also French.",
          "Rarely do we encounter such brilliant solutions.",
          "Little we knew about the future of AI."
        ],
        correctIndex: 2,
        explanation: "'Rarely do we encounter...' — yordamchi fe'l (do) egadan (we) oldinga chiqqan. Qolganlarida yordamchi fe'l tushib qolgan."
      }
    ]
  },
  {
    id: 'c1_2',
    level: 'C1-C2',
    lessonNumber: 2,
    command: '/c1_2',
    title: "Advanced Collocations & Academic Vocabulary",
    subtitle: "C1–C2 darajada tabiiy va boy nutq egasi bo'lish",
    content: `🎓 DAVR ACADEMY AI — 11-DARS: C1-C2 COLLOCATIONS

C1 va C2 darajasidagi eng katta farq — bu oddiy so'zlar o'rniga "Collocations" (o'zaro tabiiy birga keluvchi iboralar) va akademik so'z boyligini ishlatishdir.

📌 ODDIY SO'Z vs C1-C2 AKADEMIK COLLOCATION:
• Very important → Of paramount importance (O'ta muhim ahamiyatga ega)
  👉 "Vocabulary is of paramount importance in mastering a language."
• Great result → Remarkable achievement (Ajoyib yutuq)
  👉 "Reaching C2 proficiency is a remarkable achievement."
• Big difference → Substantial discrepancy / Marked distinction (Katta farq)
  👉 "There is a marked distinction between passive reading and active speaking."
• Solve a problem → Alleviate a challenge / Mitigate an issue (Muammoni hal/yumshatmoq)
  👉 "AI tutors mitigate the issue of expensive language courses."

💡 SPEAKING VA WRITING UCHUN C1 IBORALAR:
• "It is worth noting that..." — Shuni ta'kidlash joizki...
• "Contrary to popular belief..." — Keng tarqalgan fikrning aksiga o'laroq...
• "To yield fruitful results" — Samarali natija bermoq`,
    grammarRules: [
      "Collocation'larda so'zlarni sinonimlarga o'zgartirib bo'lmaydi (masalan, 'heavy rain' deyiladi, 'strong rain' emas)",
      "Academic English'da 'a lot of' o'rniga 'a substantial number of' yoki 'a great deal of' ishlatish ballni ko'tadi"
    ],
    vocabulary: [
      { uz: "O'ta muhim ahamiyatga ega", en: "Of paramount importance", example: "Consistency is of paramount importance when learning English." },
      { uz: "Samarali natija bermoq", en: "Yield fruitful results", example: "Daily practice with Davr Academy will yield fruitful results." },
      { uz: "Muammoni yengillashtirmoq", en: "Mitigate an issue", example: "AI helps mitigate the issue of speaking anxiety." }
    ],
    practiceQuestions: [
      {
        id: 'c1_2_q1',
        question: "'Very important' so'zining C1-C2 darajadagi eng chiroyli alternatividan qaysi?",
        options: [
          "Super important",
          "Big importance",
          "Of paramount importance",
          "High necessary"
        ],
        correctIndex: 2,
        explanation: "'Of paramount importance' — akademik va IELTS/CEFR'da eng yuqori baholanadigan collocation."
      }
    ]
  }
];

/**
 * Get all lessons filtered by level
 */
export function getLessonsByLevel(level: LessonLevel): LessonItem[] {
  return ALL_LESSONS.filter((l) => l.level === level);
}

/**
 * Find a specific lesson by its command (/a1_1, /a1_2 etc) or id
 */
export function getLessonByCommandOrId(query: string): LessonItem | undefined {
  const normalized = query.trim().toLowerCase();
  return ALL_LESSONS.find(
    (l) =>
      l.command.toLowerCase() === normalized ||
      l.id.toLowerCase() === normalized ||
      `/${l.id.toLowerCase()}` === normalized
  );
}

/**
 * Format lesson item beautifully into Telegram text format
 */
export function formatLessonForTelegram(lesson: LessonItem): string {
  const grammarSection =
    lesson.grammarRules.length > 0
      ? `\n\n📌 *ENG MUHIM QOIDALAR:*\n` +
        lesson.grammarRules.map((rule, idx) => `${idx + 1}. ${rule}`).join('\n')
      : '';

  const vocabSection =
    lesson.vocabulary.length > 0
      ? `\n\n📖 *YANGI SO'ZLAR VA IBORALAR:*\n` +
        lesson.vocabulary
          .map((v) => `• *${v.en}* — ${v.uz}\n  💬 _"${v.example}"_`)
          .join('\n')
      : '';

  const practiceSection =
    lesson.practiceQuestions.length > 0
      ? `\n\n🧠 *MASHQ VA TEST:*\n` +
        lesson.practiceQuestions
          .map(
            (q, idx) =>
              `*Savol ${idx + 1}:* ${q.question}\n` +
              q.options.map((opt, i) => `   ${['A', 'B', 'C', 'D'][i]}) ${opt}`).join('\n')
          )
          .join('\n\n')
          + `\n\n💡 *Testni yechish uchun:* Javobingizni (masalan: \`1-C\`) yoki o'zingiz misol tuzib menga yozing, men darhol tahlil qilib beraman!`
      : '';

  return (
    lesson.content +
    grammarSection +
    vocabSection +
    practiceSection +
    `\n\n———————————————\n💬 _Ushbu dars bo'yicha tushunmagan joyingiz bo'lsa, istalgan savolni bering yoki "Menga shu mavzuda 3 ta test ber" deb yozing — AI Ustozingiz javob beradi!_\n\n📚 Barcha darslar ro'yxati uchun: /darslar`
  );
}
