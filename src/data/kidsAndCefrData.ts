import { KidsStoryTopic, CefrMockExam } from '../types';

export const KIDS_STORIES: KidsStoryTopic[] = [
  {
    id: 'kids_1',
    title: 'The Brave Little Lion',
    titleUz: 'Jasur Kichkina Sher',
    category: 'animals',
    emoji: '🦁',
    englishStory: 'Once upon a time, a little lion named Leo lived in the green savannah. Leo loved to make new friends! One sunny day, he saw a tiny rabbit stuck in the bushes. Leo used his paws gently and helped the rabbit. "Thank you, brave Leo!" said the rabbit happily.',
    uzbekStory: 'Qadim zamonda, yashil savannada Leo ismli kichkina sher yashar edi. Leo yangi do\'stlar orttirishni juda yaxshi ko\'rardi! Bir quyoshli kunda u butalarga qisilib qolgan jajji quyonchani ko\'rib qoldi. Leo panjalarini ehtiyotkorlik bilan ishlatib quyonchaga yordam berdi. "Rahmat senga, jasur Leo!" dedi quyoncha quvonch bilan.',
    vocabulary: [
      { word: 'Lion', translation: 'Sher', icon: '🦁' },
      { word: 'Savannah', translation: 'Savanna / Dasht', icon: '🌾' },
      { word: 'Rabbit', translation: 'Quyon', icon: '🐰' },
      { word: 'Brave', translation: 'Jasur', icon: '🛡️' },
      { word: 'Help', translation: 'Yordam bermoq', icon: '🤝' },
    ],
    quizQuestion: {
      question: 'Who did Leo the lion help in the story?',
      options: ['A tiny rabbit 🐰', 'A big elephant 🐘', 'A funny monkey 🐒'],
      correctIndex: 0,
      explanation: 'Leo the lion gently helped the tiny rabbit that was stuck in the bushes!',
    },
  },
  {
    id: 'kids_2',
    title: 'Rainbow Colors Party',
    titleUz: 'Kamalak Ranglari Bazmi',
    category: 'colors',
    emoji: '🌈',
    englishStory: 'The sun and rain smiled together in the sky. Red apple danced with Yellow banana. Green frog jumped on the Blue lake. Orange orange and Purple grape sang sweet songs. Together, they made a beautiful colorful rainbow!',
    uzbekStory: 'Quyosh va yomg\'ir osmonda birga jilmayishdi. Qizil olma Sariq banan bilan raqsga tushdi. Yashil baqa Moviy ko\'lda sakradi. To\'q sariq apelsin va Binafsharang uzum shirin qo\'shiqlar kuyladi. Birgalikda ular ajoyib rang-barang kamalak hosil qildilar!',
    vocabulary: [
      { word: 'Red', translation: 'Qizil', icon: '🍎' },
      { word: 'Yellow', translation: 'Sariq', icon: '🍌' },
      { word: 'Green', translation: 'Yashil', icon: '🐸' },
      { word: 'Blue', translation: 'Moviy / Ko\'k', icon: '🌊' },
      { word: 'Rainbow', translation: 'Kamalak', icon: '🌈' },
    ],
    quizQuestion: {
      question: 'Which color was the dancing apple?',
      options: ['Green 🍏', 'Red 🍎', 'Purple 🍇'],
      correctIndex: 1,
      explanation: 'The Red apple danced with the Yellow banana!',
    },
  },
  {
    id: 'kids_3',
    title: 'Counting Magic Stars',
    titleUz: 'Sehrli Yulduzlarni Sanash',
    category: 'numbers',
    emoji: '⭐',
    englishStory: 'Look up at the night sky! One, two, three, four, five shiny stars are twinkling. A friendly spaceship flies by: "One star for joy, two stars for sweet dreams, five stars for wonderful learners!" Can you count with me?',
    uzbekStory: 'Tungi osmonga qarang! Bir, ikki, uch, to\'rt, besh yaltiroq yulduz charaqlab turibdi. Do\'stona kosmik kema uchib o\'tdi: "Bir yulduz quvonch uchun, ikki yulduz shirin tushlar uchun, besh yulduz esa ajoyib o\'quvchilar uchun!" Men bilan sanay olasizmi?',
    vocabulary: [
      { word: 'One', translation: 'Bir (1)', icon: '1️⃣' },
      { word: 'Two', translation: 'Ikki (2)', icon: '2️⃣' },
      { word: 'Three', translation: 'Uch (3)', icon: '3️⃣' },
      { word: 'Five', translation: 'Besh (5)', icon: '5️⃣' },
      { word: 'Stars', translation: 'Yulduzlar', icon: '✨' },
    ],
    quizQuestion: {
      question: 'How many shiny stars were twinkling in the sky?',
      options: ['Five stars ⭐', 'Ten stars 🌟', 'Zero stars 🌑'],
      correctIndex: 0,
      explanation: 'There were five (5) shiny stars twinkling in the sky!',
    },
  },
  {
    id: 'kids_4',
    title: 'My Happy Loving Family',
    titleUz: 'Mening Baxtli Mehrli Oilam',
    category: 'family',
    emoji: '👨‍👩‍👧‍👦',
    englishStory: 'In our cozy home, father cooks delicious soup. Mother reads a fascinating fairy tale. My little sister plays with her teddy bear, and our cute puppy wags its tail. We love spending warm family time together every evening!',
    uzbekStory: 'Bizning shinam uyimizda dadam mazali sho\'rva pishiradilar. Onam qiziqarli ertak o\'qib beradilar. Kichkina singlim ayiqchasi bilan o\'ynaydi, yoqimtoy kuchukchamiz esa dumini likillatadi. Biz har oqshom birga issiq oilaviy vaqt o\'tkazishni yaxshi ko\'ramiz!',
    vocabulary: [
      { word: 'Father / Dad', translation: 'Ota / Dada', icon: '👨' },
      { word: 'Mother / Mom', translation: 'Ona / Oyi', icon: '👩' },
      { word: 'Sister', translation: 'Opa / Singil', icon: '👧' },
      { word: 'Family', translation: 'Oila', icon: '🏡' },
      { word: 'Puppy', translation: 'Kuchukcha', icon: '🐶' },
    ],
    quizQuestion: {
      question: 'What is mother doing in the cozy home?',
      options: ['Reading a fairy tale 📖', 'Sleeping 😴', 'Driving a car 🚗'],
      correctIndex: 0,
      explanation: 'Mother is reading a fascinating fairy tale to the family!',
    },
  },
];

export const CEFR_MOCK_EXAMS: CefrMockExam[] = [
  {
    id: 'cefr_b1',
    level: 'B1',
    title: 'CEFR B1 (Intermediate) Rasmiy Namunaviy Test',
    timeMinutes: 25,
    totalQuestions: 10,
    sections: {
      listening: [
        {
          audioPrompt: 'Speaker: "Hello everyone, the international library will be open on Saturdays from 9 AM to 5 PM, but closed on Sundays for maintenance."',
          question: 'When is the library closed?',
          options: ['On Saturday mornings', 'On Sundays for maintenance', 'On Weekday evenings'],
          answer: 1,
        },
        {
          audioPrompt: 'Speaker: "If you want to join the robotics club, please submit your form by Friday afternoon to room 204."',
          question: 'Where should students submit the robotics club form?',
          options: ['Room 204', 'The library', 'Online website'],
          answer: 0,
        },
      ],
      reading: [
        {
          passage: 'Online education has transformed how adults learn languages. With mobile apps and AI tutors, students can practice speaking anytime without feeling shy or embarrassed. Studies show that 15 minutes of daily active conversational practice is more effective than a single 3-hour weekly lecture.',
          question: 'According to the passage, what is more effective for language learning?',
          options: [
            'A 3-hour weekly lecture on grammar',
            '15 minutes of daily active practice with apps/AI',
            'Only studying grammar books alone',
          ],
          answer: 1,
        },
        {
          passage: 'Eco-tourism encourages travelers to visit natural areas while conserving the environment and improving the well-being of local people. Unlike traditional mass tourism, eco-travelers minimize waste and support small independent businesses.',
          question: 'What is the main purpose of eco-tourism?',
          options: [
            'To build large luxury hotels in forests',
            'To conserve the environment and support local communities',
            'To travel only by airplanes',
          ],
          answer: 1,
        },
      ],
      grammar: [
        {
          question: 'If I _____ enough money, I would travel around Europe this summer.',
          options: ['have', 'had', 'will have', 'having'],
          answer: 1,
        },
        {
          question: 'She has been working in this international technology firm _____ 2021.',
          options: ['for', 'since', 'during', 'from'],
          answer: 1,
        },
        {
          question: 'The meeting was postponed _____ the CEO was unexpectedly delayed at the airport.',
          options: ['because of', 'despite', 'because', 'although'],
          answer: 2,
        },
        {
          question: 'You _____ wear a uniform at school; it is a mandatory rule for all students.',
          options: ['might', 'must', 'could', 'would'],
          answer: 1,
        },
      ],
      speaking: [
        {
          prompt: 'Describe your favorite hobby and explain why it is important for your personal well-being.',
          sampleBandScore: 'B1+ High Pass',
          modelAnswer: 'My favorite hobby is reading English novels and coding. It helps me relax after a long study day, enhances my vocabulary, and gives me creative problem-solving skills.',
        },
        {
          prompt: 'Do you prefer studying alone or in a group? Give reasons.',
          sampleBandScore: 'B1 Pass',
          modelAnswer: 'I prefer studying in a group because we can discuss complex problems, share useful resources, and motivate each other when tasks get difficult.',
        },
      ],
    },
  },
  {
    id: 'cefr_b2',
    level: 'B2',
    title: 'CEFR B2 (Vantage / Upper-Intermediate) Professional Mock',
    timeMinutes: 30,
    totalQuestions: 10,
    sections: {
      listening: [
        {
          audioPrompt: 'Academic Lecture: "Renewable energy infrastructure is expanding exponentially. While photovoltaic cells have dropped in cost by 80% over the last decade, battery storage capacity remains the crucial bottleneck for global adoption."',
          question: 'What is cited as the main bottleneck for renewable energy adoption?',
          options: ['The high cost of solar panels', 'Battery storage capacity', 'Lack of public interest'],
          answer: 1,
        },
      ],
      reading: [
        {
          passage: 'Cognitive scientists argue that bilingualism bestows significant neuroprotective benefits. Individuals fluent in two or more languages exhibit superior executive control, enhanced cognitive flexibility, and a delayed onset of age-related cognitive decline compared to monolinguals.',
          question: 'What cognitive advantage is highlighted for bilingual individuals?',
          options: [
            'Better physical stamina',
            'Superior executive control and cognitive flexibility',
            'Inability to multitask',
          ],
          answer: 1,
        },
      ],
      grammar: [
        {
          question: 'Hardly _____ the presentation started when the fire alarm interrupted the auditorium.',
          options: ['had', 'did', 'was', 'has'],
          answer: 0,
        },
        {
          question: 'The proposal is believed _____ by the board of directors yesterday afternoon.',
          options: ['to approve', 'to have been approved', 'approving', 'having approved'],
          answer: 1,
        },
      ],
      speaking: [
        {
          prompt: 'Evaluate the ethical implications of artificial intelligence in modern education and workplace recruitment.',
          sampleBandScore: 'B2+ (CEFR Vantage High)',
          modelAnswer: 'While AI provides unprecedented personalization and efficiency, it poses valid ethical questions regarding algorithmic bias, academic integrity, and data privacy. Institutions must establish transparent guidelines to harness benefits responsibly.',
        },
      ],
    },
  },
  {
    id: 'cefr_c1',
    level: 'C1',
    title: 'CEFR C1 (Effective Operational Proficiency) Advanced Mock',
    timeMinutes: 35,
    totalQuestions: 10,
    sections: {
      listening: [
        {
          audioPrompt: 'Keynote Speaker: "The juxtaposition of rapid technological disruption and traditional pedagogical paradigms necessitates a fundamental reevaluation of curricular design across higher education."',
          question: 'What does the speaker imply about modern curriculum design?',
          options: [
            'It should remain unchanged for stability',
            'It requires a fundamental reevaluation due to technological disruption',
            'Technology has no impact on pedagogy',
          ],
          answer: 1,
        },
      ],
      reading: [
        {
          passage: 'The ubiquity of algorithmic curation in digital media environments has inadvertently fostered epistemic bubbles. Users are continuously fed ideologically congruent content, which insidiously polarizes public discourse and diminishes nuanced debate.',
          question: 'How does algorithmic curation impact public discourse according to the text?',
          options: [
            'It promotes diverse perspectives seamlessly',
            'It polarizes discourse and limits nuanced debate',
            'It eliminates all digital media consumption',
          ],
          answer: 1,
        },
      ],
      grammar: [
        {
          question: 'Were it not for your meticulous guidance, the project _____ doomed to failure.',
          options: ['would have been', 'will be', 'had been', 'is'],
          answer: 0,
        },
        {
          question: 'So intricate _____ the machinery that only specialized engineers were authorized to inspect it.',
          options: ['was', 'had', 'did', 'being'],
          answer: 0,
        },
      ],
      speaking: [
        {
          prompt: 'To what extent does socioeconomic background dictate linguistic attainment in globalized economies?',
          sampleBandScore: 'C1 Master (Score: 92/100)',
          modelAnswer: 'Undeniably, socioeconomic background correlates with early access to immersive linguistic environments and premium academic resources. However, the democratisation of AI learning platforms is rapidly leveling the playing field for ambitious self-directed autodidacts.',
        },
      ],
    },
  },
];
