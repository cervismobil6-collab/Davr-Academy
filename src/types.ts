export interface BotVoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  accent: 'American' | 'British' | 'Australian';
  description: string;
  previewUrl?: string;
}

export interface BotConfig {
  token: string;
  isActive: boolean;
  personaId: string;
  customPrompt: string;
  webhookUrl: string;
  allowedUsers: string[];
  voiceEnabled: boolean;
  autoReplyEnabled: boolean;
  responseDelayMs: number;
  selectedVoiceId?: string;
  voiceName?: string;
  speechSpeed?: number;
  voiceAccent?: string;
  voiceProvider?: string;
}

export interface AppLog {
  id: string;
  timestamp: string;
  type: 'incoming_msg' | 'outgoing_msg' | 'system_info' | 'error' | 'ai_call' | 'voice_proc' | 'marketing' | 'payment' | 'gamification';
  content: string;
  meta?: any;
}

export interface AIAgentProfile {
  id: string;
  name: string;
  role: string;
  icon: string;
  description: string;
  systemPrompt: string;
  capabilities: string[];
}

export interface AIModelEngine {
  id: string;
  name: string;
  provider: 'google' | 'openai' | 'anthropic' | 'openrouter' | 'auto';
  badge: string;
  description: string;
  bestFor: string;
}

export interface BotStats {
  totalMessages: number;
  totalUsers: number;
  totalAiGenerations: number;
  totalRevenueUz: number;
  totalVoiceCalls: number;
  totalAdClicks: number;
}

export interface PaymentPackage {
  id: string;
  title: string;
  priceUzs: number;
  stars: number;
  durationDays: number;
  features: string[];
  badge?: string;
}

export interface IntegrationServiceConfig {
  id: string;
  name: string;
  category: 'payment' | 'voice' | 'crm' | 'analytics' | 'catalog' | 'marketing';
  icon: string;
  status: 'connected' | 'ready' | 'pending';
  description: string;
}

export interface LeadStudent {
  id: string;
  name: string;
  telegramId: string | number;
  level: string;
  score: string;
  status: 'new' | 'contacted' | 'paid';
  date: string;
  source?: string;
}

export interface MarketingDirectoryItem {
  id: string;
  name: string;
  category: string;
  icon: string;
  url: string;
  status: 'published' | 'ready_to_submit' | 'submitted';
  reach: string;
  description: string;
}

export interface AdCampaignMetric {
  id: string;
  channel: string;
  utmSource: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spendUzs: number;
  cpa: number;
}

export interface GamificationProfile {
  userId: string;
  name: string;
  streak: number;
  xp: number;
  coins: number;
  rank: number;
  level: string;
  badge: string;
  completedQuests: string[];
}

export interface DailyQuest {
  id: string;
  title: string;
  icon: string;
  rewardXp: number;
  rewardCoins: number;
  progress: number;
  target: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  city: string;
  xp: number;
  streak: number;
  coins: number;
  badge: string;
  level: string;
}

export interface BroadcastCampaign {
  id: string;
  title: string;
  targetAudience: 'all' | 'ielts' | 'beginners' | 'vip' | 'inactive';
  messageText: string;
  sentCount: number;
  status: 'sent' | 'scheduled' | 'draft';
  sentDate: string;
  scheduledTime?: string;
  hasButton?: boolean;
  buttonText?: string;
  buttonUrl?: string;
}

export interface Uptime247Status {
  isAlive: boolean;
  uptimeSeconds: number;
  uptimeFormatted: string;
  botMode: 'webhook' | 'polling' | 'hybrid';
  webhookInfo?: {
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: number;
    last_error_date?: number;
    last_error_message?: string;
    max_connections?: number;
    ip_address?: string;
  };
  pollingActive: boolean;
  watchdogActive: boolean;
  lastHeartbeat: string;
  latencyMs: number;
  memoryUsageMb: number;
  autoHealsCount: number;
  totalUpdatesProcessed: number;
  errorsCaught: number;
}

export interface ViralScriptItem {
  id: string;
  topic: string;
  hook: string;
  script: string;
  callToAction: string;
  platform: 'tiktok' | 'reels' | 'shorts' | 'telegram';
  estimatedReach: string;
}

export interface GroupStudySettings {
  enabled: boolean;
  autoQuizIntervalHours: number;
  welcomeNewMembers: boolean;
  allowDuels: boolean;
  leaderboardInGroup: boolean;
}

export interface SaaSPackageTier {
  id: string;
  name: string;
  badge: string;
  targetAudience: string;
  setupFeeUz: number;
  monthlyFeeUz: number;
  maxStudents: number;
  features: string[];
  whiteLabelDomain: boolean;
  customBotName: boolean;
  dedicatedAdminPanel: boolean;
  crmIntegration: boolean;
}

export interface KidsStoryTopic {
  id: string;
  title: string;
  titleUz: string;
  category: 'animals' | 'colors' | 'numbers' | 'family' | 'fairy_tales';
  emoji: string;
  englishStory: string;
  uzbekStory: string;
  vocabulary: { word: string; translation: string; icon: string }[];
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CefrMockExam {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  title: string;
  timeMinutes: number;
  totalQuestions: number;
  sections: {
    listening: { audioPrompt: string; question: string; options: string[]; answer: number }[];
    reading: { passage: string; question: string; options: string[]; answer: number }[];
    grammar: { question: string; options: string[]; answer: number }[];
    speaking: { prompt: string; sampleBandScore: string; modelAnswer: string }[];
  };
}


