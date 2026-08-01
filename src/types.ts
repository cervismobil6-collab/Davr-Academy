/**
 * Shared types for Telegram AI Bot Pro
 */

export interface BotConfig {
  token: string;
  isActive: boolean;
  personaId: string;
  customPrompt: string;
  model: 'gemini-3.6-flash' | 'gemini-3.1-pro-preview';
  temperature: number;
  autoReply: boolean;
  welcomeMessage: string;
  enableVoiceExplanation: boolean;
  enableImageVision: boolean;
  enableMarkdown: boolean;
  customCommands: CustomCommand[];
  maxHistoryMessages: number;
}

export interface CustomCommand {
  id: string;
  command: string; // e.g. "/yordam"
  replyText: string; // Static or dynamic response
  description: string;
}

export interface TelegramBotInfo {
  id: number;
  first_name: string;
  username: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type:
    | 'incoming_telegram'
    | 'outgoing_telegram'
    | 'ai_reply'
    | 'system_info'
    | 'system_error'
    | 'test_message';
  chatId?: number | string;
  chatName?: string;
  username?: string;
  text: string;
  metadata?: {
    model?: string;
    processingTimeMs?: number;
    tokens?: number;
    error?: string;
    photoUrl?: string;
    [key: string]: any;
  };
}

export interface BotStats {
  totalMessagesReceived: number;
  totalMessagesSent: number;
  activeUsersCount: number;
  lastActive: string | null;
  uptimeSeconds: number;
  startTime: number;
}

export interface PersonaPreset {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  systemPrompt: string;
  welcomeMessage: string;
  temperature: number;
  badge: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  chat: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
    type: string;
  };
  date: number;
  text?: string;
  caption?: string;
  photo?: Array<{
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    file_size?: number;
  }>;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
}

export type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1-C2';

export interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonItem {
  id: string;
  level: LessonLevel;
  lessonNumber: number;
  command: string; // e.g. "/a1_1"
  title: string;
  subtitle: string;
  content: string;
  grammarRules: string[];
  vocabulary: Array<{ uz: string; en: string; example: string }>;
  practiceQuestions: PracticeQuestion[];
}
