import { getAllCurriculumLessons } from './allLessonsCurriculum';

export interface LessonItem {
  id: string;
  level: 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'IELTS' | 'CINEMA' | 'BUSINESS';
  titleUz: string;
  titleEn: string;
  titleRu: string;
  category: string;
  icon: string;
  durationMin: number;
  summaryUz: string;
  summaryEn: string;
  summaryRu: string;
  contentMarkdownUz: string;
  contentMarkdownEn: string;
  contentMarkdownRu: string;
  keyWords: { word: string; transUz: string; transRu: string; example: string }[];
  quiz: {
    questionUz: string;
    questionEn: string;
    questionRu: string;
    options: string[];
    correctIndex: number;
    explanationUz: string;
    explanationEn: string;
  };
}

export interface IeltsTopicItem {
  id: string;
  part: 'Part 1' | 'Part 2 (Cue Card)' | 'Part 3' | 'Writing Task 1' | 'Writing Task 2';
  title: string;
  topicUz: string;
  topicEn: string;
  band9Vocabulary: string[];
  band9SampleAnswer: string;
  examinerTips: string;
}

export interface VocabularyTopic {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  icon: string;
  words: {
    word: string;
    phonetic: string;
    partOfSpeech: string;
    transUz: string;
    transRu: string;
    definitionEn: string;
    example: string;
    level: string;
  }[];
}

// 1. Comprehensive Ready Lessons Database (215+ Multi-Level Lessons: 0-Darajadan C2-gacha)
export const LESSONS_DATABASE: LessonItem[] = getAllCurriculumLessons();

// 2. IELTS 9.0 Speaking & Writing Vault (Hot Topics with Band 9 Samples)
export const IELTS_VAULT: IeltsTopicItem[] = [
  {
    id: "ielts_speaking_ai_tech",
    part: "Part 1",
    title: "Artificial Intelligence in Daily Education",
    topicUz: "Sun'iy intellektdan ta'limda foydalanish haqida savollar",
    topicEn: "Do you think AI and modern chatbots are helpful for learning foreign languages?",
    band9Vocabulary: ["Revolutionize", "Cognitive load", "Personalized feedback", "Indispensable tool", "Tailored curriculum"],
    band9SampleAnswer: "Without a shadow of a doubt, AI tools like Google Gemini and GPT-4o have completely revolutionized the way we acquire new languages. Rather than relying solely on rigid textbook structures, learners now receive instantaneous, personalized feedback tailored to their individual weaknesses, which drastically accelerates fluency.",
    examinerTips: "Do not give simple 'Yes/No' answers. State your direct view with an idiomatic phrase ('Without a shadow of a doubt'), substantiate with 2 supporting clauses, and conclude smoothly."
  },
  {
    id: "ielts_cue_card_memorable_journey",
    part: "Part 2 (Cue Card)",
    title: "Describe a Memorable Journey That Changed Your Perspective",
    topicUz: "Dunyoqarashingizni o'zgartirgan unutilmas sayohat",
    topicEn: "Describe a memorable journey you took. You should say: where you went, whom you went with, what you did, and explain why it was so transformative.",
    band9Vocabulary: ["Picturesque landscape", "Eye-opening experience", "Profound impact", "Immersed myself", "Serene atmosphere", "Unforgettable milestone"],
    band9SampleAnswer: "I would like to elaborate on a journey that left an indelible mark on my memory. Two summers ago, I embarked on a solo expedition to the ancient Silk Road cities of Samarkand and Bukhara. Standing before the majestic Registan square, I was completely mesmerized by the intricate geometric tilework and profound history. It was an eye-opening milestone that redefined my appreciation for cultural heritage.",
    examinerTips: "Use a wide range of past narrative tenses (Past Continuous, Past Perfect, Used to). Speak fluently for 1 minute 50 seconds to 2 full minutes without long hesitation."
  },
  {
    id: "ielts_speaking_part3_globalization",
    part: "Part 3",
    title: "Globalization and Traditional Cultures",
    topicUz: "Globallashuv va milliy madaniyatlar kelajagi",
    topicEn: "How is global integration affecting indigenous languages and local traditions?",
    band9Vocabulary: ["Cultural homogenization", "Linguistic diversity", "Paradoxical effect", "Global lingua franca", "Preservation initiatives"],
    band9SampleAnswer: "Global integration presents a double-edged sword. On the one hand, the ubiquity of English as a global lingua franca facilitates seamless cross-border commerce and academic collaboration. On the other hand, there is a legitimate concern regarding cultural homogenization, where lesser-spoken dialects risk obsolescence unless proactive digital preservation initiatives are instituted.",
    examinerTips: "Discuss both sides using sophisticated transition phrases ('double-edged sword', 'on the one hand / on the other hand'). Part 3 requires abstract, analytical discourse rather than personal storytelling."
  }
];

// 3. Oxford 3000 & High-Band Vocabulary Topics
export const VOCABULARY_TOPICS: VocabularyTopic[] = [
  {
    id: "topic_business_success",
    nameUz: "💼 Biznes, Karyera va Muvaffaqiyat",
    nameEn: "💼 Business, Career & High Performance",
    nameRu: "💼 Бизнес, карьера и продуктивность",
    icon: "💼",
    words: [
      { word: "Entrepreneur", phonetic: "/ˌɒntrəprəˈnɜːr/", partOfSpeech: "Noun", transUz: "Tadbirkor", transRu: "Предприниматель", definitionEn: "A person who sets up a business taking on financial risks in hope of profit.", example: "Innovative entrepreneurs drive the modern digital economy.", level: "B2" },
      { word: "Negotiate", phonetic: "/nɪˈɡəʊʃieɪt/", partOfSpeech: "Verb", transUz: "Muzokara olib bormoq", transRu: "Вести переговоры", definitionEn: "Try to reach an agreement or compromise by discussion.", example: "We successfully negotiated a mutually beneficial contract.", level: "B2" },
      { word: "Lucrative", phonetic: "/ˈluːkrətɪv/", partOfSpeech: "Adjective", transUz: "Katta daromad keltiruvchi", transRu: "Прибыльный / Выгодный", definitionEn: "Producing a great deal of profit.", example: "Artificial intelligence has become an exceptionally lucrative sector.", level: "C1" },
      { word: "Scalability", phonetic: "/ˌskeɪləˈbɪləti/", partOfSpeech: "Noun", transUz: "Kengayish qobiliyati", transRu: "Масштабируемость", definitionEn: "The capacity to be changed in size or scale easily.", example: "Our platform possesses infinite cloud scalability.", level: "C1" }
    ]
  },
  {
    id: "topic_technology_ai",
    nameUz: "🤖 Sun'iy Intellekt va Kelajak Texnologiyalari",
    nameEn: "🤖 Artificial Intelligence & Modern Tech",
    nameRu: "🤖 Искусственный интеллект и технологии",
    icon: "🤖",
    words: [
      { word: "Algorithm", phonetic: "/ˈælɡərɪðəm/", partOfSpeech: "Noun", transUz: "Algoritm / Hisoblash tartibi", transRu: "Алгоритм", definitionEn: "A process or set of rules to be followed in calculations.", example: "The search algorithm indexes millions of pages instantly.", level: "B1" },
      { word: "Automation", phonetic: "/ˌɔːtəˈmeɪʃn/", partOfSpeech: "Noun", transUz: "Avtomatlashtirish", transRu: "Автоматизация", definitionEn: "The use of largely automatic equipment in a system of operation.", example: "Automation optimizes repetitive educational tasks.", level: "B2" },
      { word: "Breakthrough", phonetic: "/ˈbreɪkθruː/", partOfSpeech: "Noun", transUz: "Katta ilmiy yutuq / Yangilik", transRu: "Прорыв", definitionEn: "A sudden, dramatic, and important discovery or development.", example: "Multi-model reasoning is a major scientific breakthrough.", level: "C1" }
    ]
  },
  {
    id: "topic_travel_culture",
    nameUz: "✈️ Sayohat, Dunyo va Madaniyat",
    nameEn: "✈️ Travel, Tourism & World Cultures",
    nameRu: "✈️ Путешествия и мировые культуры",
    icon: "✈️",
    words: [
      { word: "Destination", phonetic: "/ˌdestɪˈneɪʃn/", partOfSpeech: "Noun", transUz: "Manzil / Sayohat joyi", transRu: "Пункт назначения", definitionEn: "The place to which someone or something is going or being sent.", example: "Samarkand is a world-renowned tourist destination.", level: "A2" },
      { word: "Breathtaking", phonetic: "/ˈbreθteɪkɪŋ/", partOfSpeech: "Adjective", transUz: "Hayratga soladigan / Go'zal", transRu: "Захватывающий дух", definitionEn: "Astonishing or awe-inspiring in quality, so as to take one's breath away.", example: "The mountain peaks offered a breathtaking panoramic view.", level: "B2" },
      { word: "Hospitality", phonetic: "/ˌhɒspɪˈtæləti/", partOfSpeech: "Noun", transUz: "Mehmondo'stlik", transRu: "Гостеприимство", definitionEn: "The friendly and generous reception and entertainment of guests.", example: "Uzbek hospitality is celebrated across the globe.", level: "B1" }
    ]
  }
];
