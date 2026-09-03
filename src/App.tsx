import React, { useState, useEffect } from 'react';
import {
  BotConfig,
  AppLog,
  AIAgentProfile,
  AIModelEngine,
  PaymentPackage,
  IntegrationServiceConfig,
  LeadStudent,
  BotStats,
  MarketingDirectoryItem,
  AdCampaignMetric,
} from './types';
import {
  LESSONS_DATABASE,
  IELTS_VAULT,
  VOCABULARY_TOPICS,
  LessonItem,
  IeltsTopicItem,
  VocabularyTopic,
} from './lessonsData';
import { GrowthEngines } from './components/GrowthEngines';
import { GamificationDashboard } from './components/GamificationDashboard';
import { BroadcastCenter } from './components/BroadcastCenter';
import { IeltsEssayGrader } from './components/IeltsEssayGrader';
import { AffiliateProgram } from './components/AffiliateProgram';
import { CinemaEnglish } from './components/CinemaEnglish';
import { MockInterviewSim } from './components/MockInterviewSim';
import { Uptime247Center } from './components/Uptime247Center';
import { SaaSPitchCenter } from './components/SaaSPitchCenter';
import { KidsAndCefrHub } from './components/KidsAndCefrHub';
import { TelegramMiniAppPortal } from './components/TelegramMiniAppPortal';
import { VoiceAvatarStudio } from './components/VoiceAvatarStudio';
import { SuperAdminCrm } from './components/SuperAdminCrm';
import { AutoMarketingFunnels } from './components/AutoMarketingFunnels';
import { CertificateGenerator } from './components/CertificateGenerator';
import { safeFetchJson } from './utils/safeFetch';

export default function App() {
  const [tab, setTab] = useState<
    | 'mini_app_portal'
    | 'voice_studio'
    | 'super_crm'
    | 'certificate_gen'
    | 'auto_funnels'
    | 'arena'
    | 'lessons'
    | 'kids_cefr'
    | 'essay_grader'
    | 'cinema'
    | 'mock_interview'
    | 'saas_pitch'
    | 'affiliate'
    | 'agents'
    | 'marketing'
    | 'growth'
    | 'gamification'
    | 'broadcasts'
    | 'integrations'
    | 'payments'
    | 'crm'
    | 'uptime_247'
    | 'bot_control'
    | 'logs'
  >('mini_app_portal');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.7-flash');
  const [loading, setLoading] = useState(false);
  const [aiResults, setAiResults] = useState<{ [key: string]: string }>({});
  const [compareMode, setCompareMode] = useState(true);
  const [playingVoice, setPlayingVoice] = useState(false);

  const [packages, setPackages] = useState<PaymentPackage[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationServiceConfig[]>([]);
  const [leads, setLeads] = useState<LeadStudent[]>([]);
  const [directories, setDirectories] = useState<MarketingDirectoryItem[]>([]);
  const [campaigns, setCampaigns] = useState<AdCampaignMetric[]>([]);

  // Educational Hub State
  const [lessons, setLessons] = useState<LessonItem[]>(LESSONS_DATABASE);
  const [ieltsVault, setIeltsVault] = useState<IeltsTopicItem[]>(IELTS_VAULT);
  const [vocabTopics, setVocabTopics] = useState<VocabularyTopic[]>(VOCABULARY_TOPICS);
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(LESSONS_DATABASE[0]);
  const [activeIelts, setActiveIelts] = useState<IeltsTopicItem | null>(null);
  const [activeVocab, setActiveVocab] = useState<VocabularyTopic | null>(null);
  const [quizSelection, setQuizSelection] = useState<{ [lessonId: string]: number }>({});
  const [eduSearch, setEduSearch] = useState('');

  // Bot config state
  const [config, setConfig] = useState<BotConfig>({
    token: '',
    isActive: false,
    personaId: 'davr_academy',
    customPrompt: '',
    webhookUrl: '',
    allowedUsers: [],
    voiceEnabled: true,
    autoReplyEnabled: true,
    responseDelayMs: 0,
    selectedVoiceId: 'CwhRBWXzGAHq8TQ4Fs17',
    voiceName: 'Roger',
    speechSpeed: 1.0,
    voiceAccent: 'American',
    voiceProvider: 'elevenlabs',
  });

  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  const [agents, setAgents] = useState<AIAgentProfile[]>([]);
  const [models, setModels] = useState<AIModelEngine[]>([]);
  const [logs, setLogs] = useState<AppLog[]>([]);
  const [stats, setStats] = useState<BotStats>({
    totalMessages: 1420,
    totalUsers: 384,
    totalAiGenerations: 2180,
    totalRevenueUz: 1280000,
    totalVoiceCalls: 430,
    totalAdClicks: 940,
  });
  const [statusMsg, setStatusMsg] = useState('');
  const [botDiagnostic, setBotDiagnostic] = useState<{ ok?: boolean; status?: string; bot?: any; message?: string; botMode?: string } | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [testChatId, setTestChatId] = useState('');
  const [testMsgText, setTestMsgText] = useState('Salom! AI test xabari ishlamoqda.');
  const [testSending, setTestSending] = useState(false);
  const [dirSearch, setDirSearch] = useState('');
  const [dirCategoryFilter, setDirCategoryFilter] = useState('all');
  const [dirLimit, setDirLimit] = useState(60);

  const fetchBotDiagnosis = async () => {
    setDiagnosing(true);
    try {
      const data = await safeFetchJson('/api/bot/diagnose');
      if (data) {
        setBotDiagnostic(data);
      } else {
        setBotDiagnostic({ ok: false, message: 'Server bilan aloqa vaqtincha mavjud emas' });
      }
    } catch (e: any) {
      setBotDiagnostic({ ok: false, message: 'Tarmoq xatosi: ' + e.message });
    } finally {
      setDiagnosing(false);
    }
  };

  const handleSendTestMessage = async () => {
    if (!testChatId.trim()) {
      setStatusMsg("⚠️ Chat ID kiritilishi shart! (Masalan: 123456789)");
      setTimeout(() => setStatusMsg(''), 4000);
      return;
    }
    setTestSending(true);
    try {
      const data = await safeFetchJson('/api/bot/test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: testChatId, message: testMsgText }),
      });
      if (data && data.success) {
        setStatusMsg(`✅ Xabar muvaffaqiyatli yuborildi!`);
      } else {
        setStatusMsg(`❌ Xatolik: ${data?.error || 'Xabar yuborilmadi'}`);
      }
    } catch (err: any) {
      setStatusMsg(`❌ Xatolik: ${err.message}`);
    } finally {
      setTestSending(false);
      setTimeout(() => setStatusMsg(''), 5000);
    }
  };

  // Fetch initial config
  useEffect(() => {
    safeFetchJson('/api/bot/config')
      .then((data) => {
        if (!data) return;
        if (data.config) setConfig(data.config);
        if (data.agents) setAgents(data.agents);
        if (data.models) setModels(data.models);
        if (data.packages) setPackages(data.packages);
        if (data.integrations) setIntegrations(data.integrations);
        if (data.leads) setLeads(data.leads);
        if (data.directories) setDirectories(data.directories);
        if (data.campaigns) setCampaigns(data.campaigns);
        if (data.stats) setStats(data.stats);
      })
      .catch((err) => console.error(err));

    const interval = setInterval(() => {
      safeFetchJson('/api/bot/logs')
        .then((data) => {
          if (data && data.logs) setLogs(data.logs);
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAskAi = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setAiResults({});

    try {
      const data = await safeFetchJson('/api/ai/ask-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          compareAll: compareMode,
          requestedModel: selectedModel,
        }),
      });
      if (data && data.results) {
        setAiResults(data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeakText = async (text: string, customVoiceId?: string, customSpeed?: number) => {
    if (!text) return;
    setPlayingVoice(true);

    const voiceIdToUse = customVoiceId || config.selectedVoiceId || 'CwhRBWXzGAHq8TQ4Fs17';
    const speedToUse = customSpeed || config.speechSpeed || 1.0;

    try {
      // 1. Try ElevenLabs API endpoint first
      const res = await fetch('/api/voice/elevenlabs-speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceId: voiceIdToUse,
          speed: speedToUse,
        }),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('audio')) {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.playbackRate = speedToUse;
          audio.onended = () => setPlayingVoice(false);
          audio.onerror = () => setPlayingVoice(false);
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.warn('Elevenlabs proxy error, falling back to browser TTS:', e);
    }

    // 2. Fallback to browser neural SpeechSynthesis
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = config.voiceAccent === 'British' ? 'en-GB' : config.voiceAccent === 'Australian' ? 'en-AU' : 'en-US';
      utterance.rate = speedToUse;
      utterance.onend = () => setPlayingVoice(false);
      utterance.onerror = () => setPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setPlayingVoice(false);
    }
  };

  const handlePreviewVoice = async (voiceId: string, voiceName: string, accent: string) => {
    setPreviewingVoiceId(voiceId);
    const samplePhrases = [
      `Hello! I'm ${voiceName}. Welcome to Davr Academy. Let's master your IELTS Speaking and English fluency together!`,
      `Great job! With consistent daily practice and natural pronunciation, you can achieve your target band score!`,
    ];
    const phrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    
    try {
      await handleSpeakText(phrase, voiceId, config.speechSpeed || 1.0);
    } finally {
      setPreviewingVoiceId(null);
    }
  };

  const handleSimulatePayment = async (pkg: PaymentPackage, method: string) => {
    const data = await safeFetchJson('/api/payments/create-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageId: pkg.id,
        method,
        studentName: 'Diyorbek O.',
        phone: '+998 90 123 45 67',
      }),
    });
    setStatusMsg(`✅ ${method.toUpperCase()}: ${data?.message || 'To\'lov yaratildi'}`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleTrackCampaignClick = async (campaign: AdCampaignMetric) => {
    await safeFetchJson('/api/marketing/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId: campaign.id, utmSource: campaign.utmSource }),
    });
    setStatusMsg(`🎯 Marketing konversiya qayd etildi (${campaign.channel})`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleSaveBotConfig = async () => {
    try {
      const data = await safeFetchJson('/api/bot/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setStatusMsg(data?.message || 'Saqlandi');
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err: any) {
      setStatusMsg('Xatolik: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
              🌐
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                English Pro Max
              </h1>
              <span className="text-xs text-indigo-400 font-medium">Davr Academy Multi-AI Hub</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 overflow-x-auto max-w-4xl">
            <button
              onClick={() => setTab('mini_app_portal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'mini_app_portal'
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-indigo-300 hover:text-white bg-indigo-950/40 border border-indigo-500/30'
              }`}
            >
              📱 Mini App 3D Portal
            </button>
            <button
              onClick={() => setTab('voice_studio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'voice_studio'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🎙 Ovoz & Aksent Studiyasi
            </button>
            <button
              onClick={() => setTab('super_crm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'super_crm'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              📊 Super CRM & Baza
            </button>
            <button
              onClick={() => setTab('certificate_gen')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'certificate_gen'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              🏅 CEFR/IELTS Sertifikat
            </button>
            <button
              onClick={() => setTab('auto_funnels')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'auto_funnels'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              🚀 Avto Reklama Voronkasi
            </button>
            <button
              onClick={() => setTab('lessons')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'lessons' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              📚 Darslar & IELTS
            </button>
            <button
              onClick={() => setTab('kids_cefr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'kids_cefr' ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-lg' : 'text-pink-400 hover:text-pink-300'
              }`}
            >
              🎈 Bolalar & CEFR Mock
            </button>
            <button
              onClick={() => setTab('saas_pitch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'saas_pitch' ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-lg' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              💼 Tijoriy Taklif / B2B SaaS
            </button>
            <button
              onClick={() => setTab('essay_grader')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'essay_grader' ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg' : 'text-teal-400 hover:text-teal-300'
              }`}
            >
              ✍️ IELTS Insho Examiner
            </button>
            <button
              onClick={() => setTab('cinema')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'cinema' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              🎬 Cinema English
            </button>
            <button
              onClick={() => setTab('mock_interview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'mock_interview' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg' : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              🎙 Viza & Job Interview
            </button>
            <button
              onClick={() => setTab('affiliate')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'affiliate' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              👥 25% Referal / Daromad
            </button>
            <button
              onClick={() => setTab('arena')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'arena' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌐 Multi-AI Arena
            </button>
            <button
              onClick={() => setTab('agents')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'agents' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🤖 4 ta AI Agent
            </button>
            <button
              onClick={() => setTab('growth')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'growth' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'text-purple-300 hover:text-white'
              }`}
            >
              🚀 6x O'sish Motorlari
            </button>
            <button
              onClick={() => setTab('gamification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'gamification' ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              🔥 Streak & Tangalar
            </button>
            <button
              onClick={() => setTab('broadcasts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'broadcasts' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'text-blue-300 hover:text-white'
              }`}
            >
              📢 Xabarnoma (Broadcast)
            </button>
            <button
              onClick={() => setTab('marketing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'marketing' ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🌍 500+ Katalog & Listing
            </button>
            <button
              onClick={() => setTab('integrations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'integrations' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🔌 Integratsiyalar
            </button>
            <button
              onClick={() => setTab('payments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'payments' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              💳 To'lovlar
            </button>
            <button
              onClick={() => setTab('crm')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'crm' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 O'quvchilar CRM
            </button>
            <button
              onClick={() => setTab('uptime_247')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                tab === 'uptime_247'
                  ? 'bg-gradient-to-r from-cyan-600 via-indigo-600 to-emerald-600 text-white shadow-lg shadow-cyan-500/20'
                  : 'text-cyan-300 hover:text-white border border-cyan-500/30 bg-cyan-950/40'
              }`}
            >
              ⚡️ 24/7 Bot Rejimi & Webhook
            </button>
            <button
              onClick={() => setTab('bot_control')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'bot_control' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ⚙️ Bot Sozlamalari
            </button>
            <button
              onClick={() => setTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                tab === 'logs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              📜 Jonli Loglar
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Educational Hub & Lessons Vault Tab */}
        {tab === 'lessons' && (
          <div className="space-y-6">
            {/* Header & Stats Banner */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-800/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🌍 Global Standart • CEFR & Cambridge
                  </span>
                  <span className="text-xs text-slate-400">Telegram Bot & Web sinxronizatsiyasi</span>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">
                  📚 Katta Darslar & IELTS 9.0 Akademik Bazasi
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  A1 dan C1 gacha bo'lgan to'liq grammatika, so'zlashuv, Cinema English tahlillari, Oxford 3000 oltin lug'ati va rasmiy IELTS Band 9.0 namunaviy materiallari.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
                  <span className="text-xl font-black text-emerald-400 block">{lessons.length}</span>
                  <span className="text-[10px] text-slate-400">Tayyor Darslar</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
                  <span className="text-xl font-black text-indigo-400 block">{ieltsVault.length}</span>
                  <span className="text-[10px] text-slate-400">IELTS Vault</span>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl text-center">
                  <span className="text-xl font-black text-amber-400 block">{vocabTopics.reduce((acc, t) => acc + t.words.length, 0)}+</span>
                  <span className="text-[10px] text-slate-400">Oltin So'zlar</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
              {/* Level Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
                {[
                  { id: 'ALL', label: `🌟 Barcha Darslar (${lessons.length})` },
                  { id: 'A0', label: '🔤 0-Daraja Starter' },
                  { id: 'A1', label: '🟢 A1 Beginner' },
                  { id: 'A2', label: '🔵 A2 Elementary' },
                  { id: 'B1', label: '🟡 B1 Intermediate' },
                  { id: 'B2', label: '🟠 B2 Upper-Int' },
                  { id: 'C1', label: '🟣 C1 Advanced' },
                  { id: 'C2', label: '👑 C2 Mastery' },
                  { id: 'CINEMA', label: '🎬 Cinema English' },
                  { id: 'IELTS', label: '🎯 IELTS 9.0' },
                  { id: 'VOCAB', label: '📖 Oxford Lug\'at' },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setLevelFilter(btn.id);
                      if (btn.id === 'IELTS') {
                        setActiveIelts(ieltsVault[0]);
                      } else if (btn.id === 'VOCAB') {
                        setActiveVocab(vocabTopics[0]);
                      } else {
                        setActiveIelts(null);
                        setActiveVocab(null);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                      levelFilter === btn.id
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="w-full lg:w-72 relative">
                <input
                  type="text"
                  value={eduSearch}
                  onChange={(e) => setEduSearch(e.target.value)}
                  placeholder="Mavzu yoki so'z qidirish..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                {eduSearch && (
                  <button
                    onClick={() => setEduSearch('')}
                    className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Main Interactive Workspace (Lessons / IELTS / Vocab) */}
            {levelFilter === 'IELTS' ? (
              /* IELTS Vault View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">IELTS 9.0 Mavzular To'plami</h3>
                  <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                    {ieltsVault
                      .filter((i) => !eduSearch || i.title.toLowerCase().includes(eduSearch.toLowerCase()) || i.topicEn.toLowerCase().includes(eduSearch.toLowerCase()))
                      .map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActiveIelts(item)}
                          className={`p-4 rounded-xl border cursor-pointer transition ${
                            activeIelts?.id === item.id
                              ? 'bg-indigo-950/60 border-indigo-500 shadow-md'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {item.part}
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold">Band 9.0 Master</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1 italic">"{item.topicEn}"</p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {activeIelts ? (
                    <div className="bg-slate-900 border border-indigo-900/50 rounded-2xl p-6 shadow-xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wide">
                              IELTS {activeIelts.part} • Cambridge Mezonlari
                            </span>
                          </div>
                          <h3 className="text-xl font-black text-white">{activeIelts.title}</h3>
                        </div>
                        <button
                          onClick={() => handleSpeakText(activeIelts.band9SampleAnswer)}
                          disabled={playingVoice}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <span>🔊 Band 9 Audio Tinglash</span>
                        </button>
                      </div>

                      {/* Topic Card */}
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Topshiriq / Savol:</span>
                        <p className="text-sm text-indigo-200 font-medium">{activeIelts.topicEn}</p>
                      </div>

                      {/* Band 9 Vocabulary */}
                      <div>
                        <h4 className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-2">
                          💎 Band 9.0 Oltin Lug'at & Idiomalar
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeIelts.band9Vocabulary.map((word, wIdx) => (
                            <span
                              key={wIdx}
                              className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs rounded-lg font-semibold cursor-pointer hover:bg-amber-500/20 transition"
                              onClick={() => handleSpeakText(word)}
                            >
                              🔊 {word}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Band 9 Sample Answer */}
                      <div>
                        <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-2">
                          🏆 Rasmiy Band 9.0 Namunaviy Javob (Sample Answer)
                        </h4>
                        <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-xs text-slate-200 leading-relaxed font-sans">
                          {activeIelts.band9SampleAnswer}
                        </div>
                      </div>

                      {/* Examiner Tips */}
                      <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                          <span>💡 Dr. Arthur Cambridge Maslahati:</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{activeIelts.examinerTips}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                      Mavzuni tanlang
                    </div>
                  )}
                </div>
              </div>
            ) : levelFilter === 'VOCAB' ? (
              /* Oxford Vocabulary Vault View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Mavzuli Lug'at Bo'limlari</h3>
                  <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                    {vocabTopics.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() => setActiveVocab(topic)}
                        className={`p-4 rounded-xl border cursor-pointer transition ${
                          activeVocab?.id === topic.id
                            ? 'bg-emerald-950/60 border-emerald-500 shadow-md'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{topic.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{topic.nameUz}</h4>
                            <span className="text-xs text-slate-400">{topic.nameEn} • {topic.words.length} ta so'z</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {activeVocab ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{activeVocab.icon}</span>
                          <div>
                            <h3 className="text-lg font-black text-white">{activeVocab.nameUz} ({activeVocab.nameEn})</h3>
                            <p className="text-xs text-slate-400">{activeVocab.nameRu}</p>
                          </div>
                        </div>
                      </div>

                      {/* Words Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
                        {activeVocab.words.map((item, wIdx) => (
                          <div key={wIdx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2 hover:border-emerald-500/50 transition">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-black text-white flex items-center gap-2">
                                {item.word}
                                <span className="text-[10px] text-indigo-400 font-mono font-normal">[{item.phonetic}]</span>
                              </span>
                              <button
                                onClick={() => handleSpeakText(item.word)}
                                className="text-slate-400 hover:text-emerald-400 text-xs p-1"
                                title="Talaffuzni tinglash"
                              >
                                🔊
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 bg-slate-800 text-[10px] rounded text-slate-400">{item.partOfSpeech}</span>
                              <span className="text-xs font-semibold text-emerald-400">{item.transUz}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 italic">
                              "{item.example}"
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {item.definitionEn}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              /* Standard CEFR & Cinema English Lessons View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Lessons List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Darslar Ro'yxati ({
                        lessons.filter((l) => (levelFilter === 'ALL' || l.level === levelFilter) && (!eduSearch || l.titleUz.toLowerCase().includes(eduSearch.toLowerCase()) || l.titleEn.toLowerCase().includes(eduSearch.toLowerCase()))).length
                      })
                    </h3>
                  </div>

                  <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
                    {lessons
                      .filter((l) => (levelFilter === 'ALL' || l.level === levelFilter) && (!eduSearch || l.titleUz.toLowerCase().includes(eduSearch.toLowerCase()) || l.titleEn.toLowerCase().includes(eduSearch.toLowerCase())))
                      .map((l) => (
                        <div
                          key={l.id}
                          onClick={() => setActiveLesson(l)}
                          className={`p-4 rounded-xl border cursor-pointer transition ${
                            activeLesson?.id === l.id
                              ? 'bg-emerald-950/60 border-emerald-500 shadow-md'
                              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                                l.level === 'A1' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                                l.level === 'A2' ? 'bg-blue-950 text-blue-400 border-blue-800' :
                                l.level === 'B1' ? 'bg-indigo-950 text-indigo-400 border-indigo-800' :
                                l.level === 'B2' ? 'bg-amber-950 text-amber-400 border-amber-800' :
                                l.level === 'C1' ? 'bg-rose-950 text-rose-400 border-rose-800' :
                                'bg-purple-950 text-purple-400 border-purple-800'
                              }`}
                            >
                              {l.level} • {l.category}
                            </span>
                            <span className="text-[10px] text-slate-400">{l.durationMin} min</span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{l.titleUz}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{l.titleEn}</p>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Right: Active Lesson Interactive Workspace */}
                <div className="lg:col-span-2">
                  {activeLesson ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                      {/* Lesson Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                              {activeLesson.level} DARAJASI • {activeLesson.category}
                            </span>
                            <span className="text-xs text-slate-500">• {activeLesson.durationMin} daqiqalik dars</span>
                          </div>
                          <h3 className="text-xl font-black text-white">{activeLesson.titleUz}</h3>
                          <span className="text-xs text-slate-400">{activeLesson.titleEn}</span>
                        </div>

                        <button
                          onClick={() => handleSpeakText((activeLesson.contentMarkdownUz || activeLesson.summaryUz).slice(0, 150))}
                          disabled={playingVoice}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                        >
                          <span>🔊 Ovozli Tinglash</span>
                        </button>
                      </div>

                      {/* Explanation */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                          📖 Nazariy Tushuntirish & Qoidalar
                        </h4>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                          {activeLesson.contentMarkdownUz || activeLesson.summaryUz}
                        </div>
                      </div>

                      {/* Key Vocabulary Table */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                          💎 Darsdagi Oltin So'zlar va Namunalar
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activeLesson.keyWords.map((v, vIdx) => (
                            <div key={vIdx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white text-xs">{v.word}</span>
                                <button
                                  onClick={() => handleSpeakText(v.word)}
                                  className="text-slate-400 hover:text-emerald-400 text-xs"
                                >
                                  🔊
                                </button>
                              </div>
                              <p className="text-xs text-emerald-400 font-medium">{v.transUz}</p>
                              <p className="text-[11px] text-slate-400 italic">"{v.example}"</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Quiz Solver */}
                      <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                            🎮 Dars Bo'yicha Interaktiv Test
                          </span>
                          <span className="text-xs text-slate-400">Tezkor baholash</span>
                        </div>

                        <p className="text-sm font-bold text-white">
                          ❓ {activeLesson.quiz.questionUz}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeLesson.quiz.options.map((opt, oIdx) => {
                            const isSelected = quizSelection[activeLesson.id] === oIdx;
                            const isCorrect = oIdx === activeLesson.quiz.correctIndex;
                            const hasAnswered = quizSelection[activeLesson.id] !== undefined;

                            let btnStyle = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750';
                            if (hasAnswered) {
                              if (isCorrect) {
                                btnStyle = 'bg-emerald-900/60 border-emerald-500 text-emerald-200 font-bold';
                              } else if (isSelected && !isCorrect) {
                                btnStyle = 'bg-rose-900/60 border-rose-500 text-rose-200 font-bold';
                              } else {
                                btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => setQuizSelection({ ...quizSelection, [activeLesson.id]: oIdx })}
                                className={`p-3 rounded-xl border text-xs text-left transition flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{String.fromCharCode(65 + oIdx)}) {opt}</span>
                                {hasAnswered && isCorrect && <span>✅</span>}
                                {hasAnswered && isSelected && !isCorrect && <span>❌</span>}
                              </button>
                            );
                          })}
                        </div>

                        {quizSelection[activeLesson.id] !== undefined && (
                          <div className="pt-2 border-t border-slate-800">
                            <p className="text-xs text-slate-300">
                              💡 <span className="font-bold">Tushuntirish:</span> {activeLesson.quiz.explanationUz}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kids English World & CEFR Official Mock Exams */}
        {tab === 'kids_cefr' && (
          <KidsAndCefrHub
            onLogAction={(msg) => {
              fetch('/api/bot/test-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, type: 'educational' }),
              }).catch(() => {});
            }}
            onSetStatusMsg={(msg) => {
              setStatusMsg(msg);
              setTimeout(() => setStatusMsg(''), 4000);
            }}
          />
        )}

        {/* B2B SaaS Commercial Pitch Deck & School Licensing Center */}
        {tab === 'saas_pitch' && (
          <SaaSPitchCenter
            onLogAction={(msg) => {
              fetch('/api/bot/test-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, type: 'marketing' }),
              }).catch(() => {});
            }}
            onSetStatusMsg={(msg) => {
              setStatusMsg(msg);
              setTimeout(() => setStatusMsg(''), 4000);
            }}
          />
        )}

        {/* 1. Multi-AI Arena Tab */}
        {tab === 'arena' && (
          <div className="space-y-8">
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    ⚡️ Universal Multi-AI Arena
                  </h2>
                  <p className="text-sm text-slate-400">
                    Google Gemini 2.5, OpenAI GPT-4o va Claude 3.5 Sonnet modellarini birdaniga parallel ishlatish
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
                    <input
                      type="checkbox"
                      checked={compareMode}
                      onChange={(e) => setCompareMode(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <span className="text-slate-200 font-medium">Parallel Solishtirish Rejimi</span>
                  </label>

                  {!compareMode && (
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                    >
                      {models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.badge} {m.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Prompt Input */}
              <div className="space-y-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Istalgan savol, grammatik mavzu yoki IELTS inshongizni yozing..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPrompt('Check my IELTS Writing Task 2: "Some people believe that AI will replace teachers in the future. To what extent do you agree?"')
                      }
                      className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-400 px-3 py-1 rounded-lg transition"
                    >
                      💡 IELTS Essay Namuna
                    </button>
                    <button
                      onClick={() => setPrompt('Explain the difference between "present perfect" and "past simple" with cinema examples.')}
                      className="text-xs bg-slate-800/60 hover:bg-slate-800 text-slate-400 px-3 py-1 rounded-lg transition"
                    >
                      🎬 Grammatika Namuna
                    </button>
                  </div>

                  <button
                    onClick={handleAskAi}
                    disabled={loading || !prompt.trim()}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition disabled:opacity-50"
                  >
                    {loading ? 'AI Modellar hisoblamoqda...' : '🚀 Barcha AI\'larga Yuborish'}
                  </button>
                </div>
                {statusMsg && (
                  <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl text-xs">
                    {statusMsg}
                  </div>
                )}
              </div>
            </div>

            {/* Multi AI Results Grid */}
            {Object.keys(aiResults).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.keys(aiResults).map((key) => (
                  <div
                    key={key}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl"
                  >
                    <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white capitalize">{key.replace(/-/g, ' ')}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                          {key.includes('gemini') ? '🟢 Google' : key.includes('gpt') ? '🟣 OpenAI' : '🟠 Anthropic'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSpeakText(aiResults[key])}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition"
                        title="Talaffuzni eshitish"
                      >
                        <span>{playingVoice ? '🔊 O\'qilmoqda...' : '🎙 Eshitish'}</span>
                      </button>
                    </div>
                    <div className="p-5 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {aiResults[key]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Marketing & Listing Hub Tab */}
        {tab === 'marketing' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  🚀 Global Marketing, Listing & Analitika Markazi
                </h2>
                <p className="text-sm text-slate-400">
                  ProductHunt, Futurepedia, TheresAnAIForThat, Telegram Ads va Meta Pixel kampaniyalari monitoringi
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
                  <span className="text-xs text-slate-400 block">Jami Trafik & Kliklar:</span>
                  <span className="text-lg font-bold text-pink-400">{stats.totalAdClicks.toLocaleString()} tashrif</span>
                </div>
              </div>
            </div>

            {/* Global Directories & Listing Portals */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    🌍 Dunyo AI Kataloglari va Listing Platformalari ({directories.length}+ xalqaro portal)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Product Hunt, There's An AI, Toolify, HuggingFace, Capterra, BotList, AppSumo, GPT Store, EdTech Federations
                  </p>
                </div>
                <button
                  onClick={async () => {
                    setStatusMsg("🚀 Barcha 500+ kataloglarga tasdiqlash yuborilmoqda...");
                    const data = await safeFetchJson('/api/marketing/submit-all-directories', { method: 'POST' });
                    if (data && data.directories) setDirectories(data.directories);
                    setStatusMsg(`✅ Dunyodagi barcha ${data?.directories?.length || 500}+ ta global AI va Telegram kataloglariga ping va rasmiy listing muvaffaqiyatli yuborildi!`);
                    setTimeout(() => setStatusMsg(''), 5000);
                  }}
                  className="bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  ⚡️ Barcha 500+ Kataloglarga Yuborish & Ping Berish
                </button>
              </div>

              {/* Search & Category Filter Controls */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={dirSearch}
                      onChange={(e) => setDirSearch(e.target.value)}
                      placeholder="🔍 500+ kataloglar ichidan qidirish (masalan: Product Hunt, Telegram, IELTS, EdTech)..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                    {dirSearch && (
                      <button
                        onClick={() => setDirSearch('')}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <select
                    value={dirCategoryFilter}
                    onChange={(e) => setDirCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="all">Barcha Kategoriyalar (500+)</option>
                    <option value="Telegram">Telegram Bot Kataloglari</option>
                    <option value="AI">AI Aggregatorlar & Indekslar</option>
                    <option value="EdTech">EdTech & Til O'rganish</option>
                    <option value="IELTS">IELTS & Imtihon Portallari</option>
                    <option value="Launch">Global Launchpads & SaaS</option>
                    <option value="Search">Qidiruv Tizimlari & Web Indeks</option>
                    <option value="Open">Ochiq Manbalar & GitHub</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>
                    Ko'rsatilmoqda: <strong className="text-indigo-400">
                      {directories.filter((dir) => {
                        const matchesSearch =
                          dir.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
                          dir.category.toLowerCase().includes(dirSearch.toLowerCase()) ||
                          dir.description.toLowerCase().includes(dirSearch.toLowerCase());
                        const matchesCat =
                          dirCategoryFilter === 'all' ||
                          dir.category.toLowerCase().includes(dirCategoryFilter.toLowerCase());
                        return matchesSearch && matchesCat;
                      }).length}
                    </strong> ta katalog ({directories.length} tadan)
                  </span>
                  <span className="text-emerald-400 font-medium">● 500+ Avtomatik Indeksatsiya Faol</span>
                </div>
              </div>

              {/* Directories Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[650px] overflow-y-auto p-1 pr-2">
                {directories
                  .filter((dir) => {
                    const matchesSearch =
                      dir.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
                      dir.category.toLowerCase().includes(dirSearch.toLowerCase()) ||
                      dir.description.toLowerCase().includes(dirSearch.toLowerCase());
                    const matchesCat =
                      dirCategoryFilter === 'all' ||
                      dir.category.toLowerCase().includes(dirCategoryFilter.toLowerCase());
                    return matchesSearch && matchesCat;
                  })
                  .slice(0, dirLimit)
                  .map((dir) => (
                    <div key={dir.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition shadow-lg">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl p-1.5 bg-slate-800/80 rounded-xl">{dir.icon}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            dir.status === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}>
                            {dir.status === 'published' ? '✅ Joylashtirilgan' : '🚀 Listing Tayyor'}
                          </span>
                        </div>
                        <h4 className="font-bold text-white text-sm mb-0.5">{dir.name}</h4>
                        <div className="text-[10px] text-indigo-400 font-semibold mb-1">{dir.category}</div>
                        <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2">{dir.description}</p>
                      </div>
                      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-400">Qamrov: <strong className="text-indigo-400">{dir.reach}</strong></span>
                        <a
                          href={dir.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white px-2.5 py-1 rounded-lg transition font-semibold"
                        >
                          Ochish ↗
                        </a>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Load More Pagination */}
              {directories.filter((dir) => {
                const matchesSearch =
                  dir.name.toLowerCase().includes(dirSearch.toLowerCase()) ||
                  dir.category.toLowerCase().includes(dirSearch.toLowerCase()) ||
                  dir.description.toLowerCase().includes(dirSearch.toLowerCase());
                const matchesCat =
                  dirCategoryFilter === 'all' ||
                  dir.category.toLowerCase().includes(dirCategoryFilter.toLowerCase());
                return matchesSearch && matchesCat;
              }).length > dirLimit && (
                <div className="text-center pt-3">
                  <button
                    onClick={() => setDirLimit((prev) => prev + 60)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-6 py-2.5 rounded-xl transition"
                  >
                    Yana 60 ta katalog yuklash (+{directories.length - dirLimit} qoldi) 🔽
                  </button>
                </div>
              )}
            </div>

            {/* Telegram Ads & Attribution Campaign Metrics */}
            <div>
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                📊 Telegram Ads & Reklama Kanallari Analitikasi (UTM Tracker)
              </h3>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="p-4">Kanal / Reklama Manbasi</th>
                      <th className="p-4">UTM Parametr</th>
                      <th className="p-4">Ko'rishlar</th>
                      <th className="p-4">Kliklar</th>
                      <th className="p-4">O'quvchi / To'lovlar</th>
                      <th className="p-4">CPA (Harajat)</th>
                      <th className="p-4">Harakat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          {c.channel}
                        </td>
                        <td className="p-4 font-mono text-indigo-400">{c.utmSource}</td>
                        <td className="p-4">{c.impressions.toLocaleString()}</td>
                        <td className="p-4 text-white font-bold">{c.clicks.toLocaleString()}</td>
                        <td className="p-4 text-emerald-400 font-bold">{c.conversions} ta</td>
                        <td className="p-4 text-slate-400">{c.cpa.toLocaleString()} UZS</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleTrackCampaignClick(c)}
                            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg transition"
                          >
                            ⚡️ Sinov Kliki
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6x Organic Growth Engines & Viral Loops Tab */}
        {tab === 'growth' && (
          <GrowthEngines
            onLogAction={(msg) => {
              // Direct dispatch to server logs
              fetch('/api/bot/test-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, type: 'marketing' }),
              }).catch(() => {});
            }}
            onSetStatusMsg={(msg) => {
              setStatusMsg(msg);
              setTimeout(() => setStatusMsg(''), 4000);
            }}
          />
        )}

        {/* 3. Integrations Directory Tab */}
        {tab === 'integrations' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">🔌 Ulanishlar & Tashqi Xizmatlar Ekotizimi</h2>
              <p className="text-sm text-slate-400">Barcha to'lov shlyuzlari, ovozli neyron tarmoqlar, CRM va qidiruv tizimlari holati</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {integrations.map((svc) => (
                <div key={svc.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition shadow-lg">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl p-2 bg-slate-800/80 rounded-xl">{svc.icon}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        svc.status === 'connected' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {svc.status === 'connected' ? '✅ Ulangan' : '⚡️ Faollashtirilgan'}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base mb-1">{svc.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{svc.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-indigo-400 font-medium">
                    <span>Kategoriya: {svc.category.toUpperCase()}</span>
                    <span className="text-emerald-400">24/7 Monitoring</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Payments & Monetization Tab */}
        {tab === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">💳 To'lov Tizimlari & VIP Tariflar</h2>
                <p className="text-sm text-slate-400">Click, Payme va Telegram Stars orqali avtomatik to'lov qabul qilish</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-right">
                <span className="text-xs text-slate-400 block">Jami Tushum:</span>
                <span className="text-lg font-bold text-emerald-400">{stats.totalRevenueUz.toLocaleString()} UZS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="p-6 bg-slate-900 border border-indigo-950/60 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
                  {pkg.badge && (
                    <div className="absolute top-3 right-3 text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                      {pkg.badge}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg text-white mb-2">{pkg.title}</h3>
                    <div className="mb-4">
                      <span className="text-2xl font-black text-white">{pkg.priceUzs.toLocaleString()}</span>
                      <span className="text-xs text-slate-400"> UZS / {pkg.durationDays} kun</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((f, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                          <span className="text-emerald-400">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => handleSimulatePayment(pkg, 'click')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <span>💳 Click orqali to'lash</span>
                    </button>
                    <button
                      onClick={() => handleSimulatePayment(pkg, 'payme')}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <span>💳 Payme orqali to'lash</span>
                    </button>
                    <button
                      onClick={() => handleSimulatePayment(pkg, 'stars')}
                      className="w-full bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                    >
                      <span>⭐️ {pkg.stars} Telegram Stars</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. CRM Leads Tab */}
        {tab === 'crm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">📊 O'quvchilar Bazasini Boshqarish (CRM)</h2>
                <p className="text-sm text-slate-400">Google Sheets va Telegram orqali ro'yxatdan o'tgan o'quvchilar</p>
              </div>
              <span className="text-xs bg-indigo-950 border border-indigo-800 text-indigo-300 px-3 py-1.5 rounded-xl font-medium">
                Google Sheets Sync: Faol ✅
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="p-4">Ism-Familiya</th>
                    <th className="p-4">Telegram / Tel</th>
                    <th className="p-4">Daraja</th>
                    <th className="p-4">Natija / Kurs</th>
                    <th className="p-4">Manba (UTM)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Vaqt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        <div className="text-2xl mb-2">👥</div>
                        <p className="font-medium text-slate-400">Hozircha yangi o'quvchilar ro'yxati bo'sh</p>
                        <p className="text-[11px] text-slate-500 mt-1">Foydalanuvchilar Telegram botga kirib xabar yozishi bilan bu yerda real vaqtda paydo bo'ladi.</p>
                      </td>
                    </tr>
                  ) : (
                    leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-semibold text-white">{l.name}</td>
                        <td className="p-4 font-mono text-indigo-400">{l.telegramId}</td>
                        <td className="p-4">{l.level}</td>
                        <td className="p-4 text-emerald-400 font-medium">{l.score}</td>
                        <td className="p-4 text-xs text-slate-400">{l.source || 'Telegram Bot'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            l.status === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            l.status === 'contacted' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{l.date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Agents Tab */}
        {tab === 'agents' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">🤖 4 ta Ixtisoslashgan Avtonom AI Agentlar</h2>
              <p className="text-sm text-slate-400">Telegram va Veb orqali har bir agent bilan mustaqil muloqot qiling</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl p-2 bg-slate-800 rounded-xl">{agent.icon}</span>
                      <div>
                        <h3 className="font-bold text-white text-base">{agent.name}</h3>
                        <span className="text-xs text-indigo-400 font-medium">{agent.role}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">{agent.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {agent.capabilities.map((c, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTab('arena');
                      setPrompt(`Menga ${agent.name} sifatida yordam bering.`);
                    }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    Muloqotni Boshlash 💬
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Bot Settings Tab */}
        {tab === 'bot_control' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Live Diagnosis Banner */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⚙️ Telegram Bot Boshqaruv & Diagnostika</span>
                  </h2>
                  <p className="text-xs text-slate-400">Botning ulanish holatini tekshirish, token yangilash va sinov xabari yuborish</p>
                </div>
                <button
                  onClick={fetchBotDiagnosis}
                  disabled={diagnosing}
                  className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-900/60 px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <span>{diagnosing ? 'Tekshirilmoqda...' : '🔍 Bot Holatini Tekshirish'}</span>
                </button>
              </div>

              {botDiagnostic && (
                <div className={`p-4 rounded-xl text-xs border ${
                  botDiagnostic.ok
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                    : 'bg-amber-950/40 border-amber-800 text-amber-300'
                }`}>
                  <div className="font-bold text-sm mb-1">{botDiagnostic.message}</div>
                  {botDiagnostic.bot && (
                    <div className="font-mono text-[11px] text-slate-300 mt-2 space-y-0.5">
                      <div>• Bot Foydalanuvchi nomi: <strong>@{botDiagnostic.bot.username}</strong></div>
                      <div>• Bot ID: <strong>{botDiagnostic.bot.id}</strong></div>
                      <div>• Qabul qilish rejimi: <strong>{botDiagnostic.botMode === 'webhook' ? '⚡️ Webhook 24/7 (Faol)' : '🔄 Long-Polling + Watchdog (Faol)'}</strong></div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 24/7 Professional Webhook & Uptime Quick Card */}
            <div className="bg-gradient-to-r from-cyan-950/50 via-slate-900 to-indigo-950/50 border border-cyan-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xl font-black">
                  ⚡️
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Botni 24/7 Professional Rejimda Ishlatish</h4>
                  <p className="text-[11px] text-slate-300">Zero-downtime, Crash Shield, Webhook va UptimeRobot integratsiyasi</p>
                </div>
              </div>
              <button
                onClick={() => setTab('uptime_247')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-lg shadow-cyan-600/20 whitespace-nowrap"
              >
                24/7 Panelini Ochish 🚀
              </button>
            </div>

            {/* Main Configuration Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-5">
              <h3 className="text-base font-bold text-white">🔑 Asosiy Token va AI Ko'rsatmalari</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Telegram Bot Token (@BotFather bergan API token):
                  </label>
                  <input
                    type="text"
                    value={config.token}
                    onChange={(e) => setConfig({ ...config, token: e.target.value })}
                    placeholder="Masalan: 7892345612:AAH9f_x... (BotFather'dan nusxalang)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    * Tokenni kiritib Saqlash tugmasini bosishingiz bilan bot avtomatik getUpdates rejimiga ulanadi.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">AI Murabbiy Maxsus Prompt Ko'rsatmasi:</label>
                  <textarea
                    value={config.customPrompt}
                    onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
                    rows={3}
                    placeholder="O'quvchilarga o'zbek, ingliz va rus tillarida xushmuomala yordam berish, grammatik xatolarni to'g'rilash..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={config.voiceEnabled}
                      onChange={(e) => setConfig({ ...config, voiceEnabled: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <span>Ovozli xabarlarni (Voice Notes) qabul qilish & tahlil</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={config.autoReplyEnabled}
                      onChange={(e) => setConfig({ ...config, autoReplyEnabled: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-0"
                    />
                    <span>Avto-javob tizimi (Multi-AI) faol</span>
                  </label>
                </div>

                <button
                  onClick={handleSaveBotConfig}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/20"
                >
                  💾 Sozlamalarni Saqlash & Botni Qayta Ishga Tushirish
                </button>
              </div>
            </div>

            {/* Voice Preferences & Speech Synthesis Settings */}
            <div className="bg-slate-900 border border-indigo-900/40 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-bold">
                    🎙
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>AI Ovoz & Talaffuz Sozlamalari (Voice Preferences)</span>
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-medium">
                        ElevenLabs & Neural TTS
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      O'quvchilar bilan audio muloqot, IELTS Speaking simulyatsiyasi va darslar uchun AI ovozi hamda tezligini sozlash
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Tanlangan ovoz:</span>
                  <span className="bg-slate-800 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-lg font-bold">
                    {config.voiceName || 'Roger (US Male)'}
                  </span>
                </div>
              </div>

              {/* 1. Voice Persona Selection Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200">
                    1. AI Ovoz Modellarini Tanlang:
                  </label>
                  <span className="text-[11px] text-slate-500">IELTS va so'zlashuv mashqlari uchun optimallashtirilgan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'CwhRBWXzGAHq8TQ4Fs17',
                      name: 'Roger',
                      gender: 'male',
                      accent: 'American',
                      flag: '🇺🇸',
                      tag: 'IELTS Examiner',
                      description: 'Rezonansli, tabiiy va vazmin erkak ovozi. Speaking simulyatsiyalari uchun tavsiya etiladi.',
                    },
                    {
                      id: '21m00Tcm4TlvDq8ikWAM',
                      name: 'Rachel',
                      gender: 'female',
                      accent: 'American',
                      flag: '🇺🇸',
                      tag: 'Friendly Tutor',
                      description: 'Sokin, do\'stona va juda tushunarli ayol ovozi. Boshlang\'ich va o\'rta darajalar uchun a\'lo.',
                    },
                    {
                      id: 'pNInz6obpgDQGcFmaJgB',
                      name: 'Adam',
                      gender: 'male',
                      accent: 'American',
                      flag: '🇺🇸',
                      tag: 'Deep Voice',
                      description: 'Chuqur, diktor darajasidagi ishonchli talaffuz. Podkastlar va audio darslar uchun.',
                    },
                    {
                      id: 'EXAVITQu4vr4xnSDxMaL',
                      name: 'Bella',
                      gender: 'female',
                      accent: 'American',
                      flag: '🇺🇸',
                      tag: 'Expressive',
                      description: 'Yumshoq, ifodali va emotsional urg\'uli ovoz. Bolalar va dialoglar uchun qiziqarli.',
                    },
                    {
                      id: 'JBFqnCBsd6RMkjVDRZzb',
                      name: 'George',
                      gender: 'male',
                      accent: 'British',
                      flag: '🇬🇧',
                      tag: 'BBC British',
                      description: 'Klassik Britaniya BBC talaffuzi. Rasmiy va akademik listening mashqlari uchun ideal.',
                    },
                    {
                      id: 'XB0fDUnXU5powFXDhCwa',
                      name: 'Charlotte',
                      gender: 'female',
                      accent: 'British',
                      flag: '🇬🇧',
                      tag: 'Cambridge RP',
                      description: 'Nafis Britaniya RP urg\'usi. IELTS Listening Section 3-4 va akademik matnlar uchun.',
                    },
                    {
                      id: 'TxGEqnHWrfWFTfGW9XjX',
                      name: 'Josh',
                      gender: 'male',
                      accent: 'American',
                      flag: '🇺🇸',
                      tag: 'Youth & Energy',
                      description: 'Yosh, dinamik va jo\'shqin amerikalik repetitor ovozi.',
                    },
                  ].map((v) => {
                    const isSelected = config.selectedVoiceId === v.id;
                    const isPlaying = previewingVoiceId === v.id;

                    return (
                      <div
                        key={v.id}
                        onClick={() => {
                          setConfig({
                            ...config,
                            selectedVoiceId: v.id,
                            voiceName: `${v.name} (${v.accent} ${v.gender === 'male' ? 'Male' : 'Female'})`,
                            voiceAccent: v.accent,
                          });
                        }}
                        className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{v.flag}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-xs">{v.name}</span>
                                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded">
                                  {v.gender === 'male' ? 'Erkak' : 'Ayol'}
                                </span>
                              </div>
                              <span className="text-[10px] text-indigo-400 font-medium">{v.tag}</span>
                            </div>
                          </div>

                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-indigo-500 bg-indigo-600' : 'border-slate-700'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                          {v.description}
                        </p>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(v.id, v.name, v.accent);
                          }}
                          disabled={playingVoice}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-semibold py-1.5 px-2 rounded-lg border border-slate-700/80 flex items-center justify-center gap-1.5 transition"
                        >
                          <span>{isPlaying ? '🔊 Tinglanmoqda...' : '▶️ Ovozni Tinglab Ko\'rish'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Speech Speed & Pitch Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200">
                      2. Nutq Tezligi (Speech Speed):
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {(config.speechSpeed || 1.0).toFixed(2)}x
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { speed: 0.75, label: '0.75x', desc: 'Boshlang\'ich' },
                      { speed: 0.9, label: '0.9x', desc: 'Sekin' },
                      { speed: 1.0, label: '1.0x', desc: 'Normal' },
                      { speed: 1.25, label: '1.25x', desc: 'Tezkor' },
                      { speed: 1.5, label: '1.5x', desc: 'IELTS Native' },
                    ].map((item) => {
                      const isActive = (config.speechSpeed || 1.0) === item.speed;
                      return (
                        <button
                          key={item.speed}
                          type="button"
                          onClick={() => setConfig({ ...config, speechSpeed: item.speed })}
                          className={`py-2 px-1 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                            isActive
                              ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-xs font-bold">{item.label}</span>
                          <span className="text-[9px] opacity-75 leading-tight">{item.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  <input
                    type="range"
                    min="0.6"
                    max="1.6"
                    step="0.05"
                    value={config.speechSpeed || 1.0}
                    onChange={(e) => setConfig({ ...config, speechSpeed: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Sekinroq (0.6x)</span>
                    <span>Standart (1.0x)</span>
                    <span>Tezroq (1.6x)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-200 block">
                    3. AI Ovoz Provayderi & Urg'u:
                  </label>

                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'elevenlabs', name: 'ElevenLabs Ultra-HD', badge: 'Ultra-Realistik' },
                        { id: 'google_neural', name: 'Google Neural Audio', badge: 'Tezkor & AI' },
                      ].map((prov) => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() => setConfig({ ...config, voiceProvider: prov.id })}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            (config.voiceProvider || 'elevenlabs') === prov.id
                              ? 'bg-indigo-950/40 border-indigo-500 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{prov.name}</div>
                          <div className="text-[10px] text-indigo-400">{prov.badge}</div>
                        </button>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                      <span className="text-[11px] text-slate-300 font-medium block">
                        Jonli Ovoz Sinovi (Custom Phrase Test):
                      </span>
                      <div className="flex gap-2">
                        <input
                          id="voiceTestInput"
                          type="text"
                          defaultValue="Welcome to Davr Academy! Today we are practicing IELTS Speaking Part 2."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('voiceTestInput') as HTMLInputElement;
                            if (input && input.value) {
                              handleSpeakText(input.value);
                            }
                          }}
                          disabled={playingVoice}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0 transition flex items-center gap-1"
                        >
                          <span>{playingVoice ? 'O\'qilmoqda...' : 'O\'qish 🔊'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveBotConfig}
                  className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
                >
                  <span>💾 Ovoz Sozlamalarini Saqlash & Botga Qo'llash</span>
                </button>
              </div>
            </div>

            {/* Test Message Dispatcher */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>💬 Sinov Xabari Yuborish (Test Message)</span>
              </h3>
              <p className="text-xs text-slate-400">
                O'zingizning Telegram Chat ID raqamingizni kiriting va bot sizga xabar yubora olishini sinab ko'ring (Oldin botingizga Telegramdan kirib <strong>/start</strong> bosing).
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Telegram Chat ID:</label>
                  <input
                    type="text"
                    value={testChatId}
                    onChange={(e) => setTestChatId(e.target.value)}
                    placeholder="Masalan: 123456789"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sinov Xabari Matni:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testMsgText}
                      onChange={(e) => setTestMsgText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      onClick={handleSendTestMessage}
                      disabled={testSending}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shrink-0 flex items-center gap-1.5"
                    >
                      <span>{testSending ? 'Yuborilmoqda...' : 'Yuborish 🚀'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 24/7 High-Availability & Webhook Tab */}
        {tab === 'uptime_247' && (
          <Uptime247Center
            onAddLog={(content) => {
              setStatusMsg(content);
              setTimeout(() => setStatusMsg(''), 4000);
            }}
          />
        )}

        {/* 8. Live Logs Tab */}
        {tab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">📜 Real-Time Tizim va Marketing Loglari</h2>
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Jonli kuzatuv faol
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                Hozircha tizim loglari mavjud emas.
              </div>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-mono flex items-start gap-3">
                    <span className="text-slate-500 shrink-0">{log.timestamp.split('T')[1]?.slice(0, 8)}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] shrink-0 ${
                      log.type === 'error' ? 'bg-red-950 text-red-400 border border-red-800' :
                      log.type === 'ai_call' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      log.type === 'marketing' ? 'bg-pink-950 text-pink-400 border border-pink-800' :
                      log.type === 'payment' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-blue-950 text-blue-400 border border-blue-800'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-slate-300 break-words flex-1">{log.content}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* IELTS Essay Grader Tab */}
        {tab === 'essay_grader' && (
          <IeltsEssayGrader />
        )}

        {/* Cinema English Tab */}
        {tab === 'cinema' && (
          <CinemaEnglish />
        )}

        {/* Mock Interview Sim Tab */}
        {tab === 'mock_interview' && (
          <MockInterviewSim />
        )}

        {/* Affiliate & Referral Tab */}
        {tab === 'affiliate' && (
          <AffiliateProgram />
        )}

        {/* Gamification & Streaks Tab */}
        {tab === 'gamification' && (
          <GamificationDashboard />
        )}

        {/* Broadcasts & Outreach Tab */}
        {tab === 'broadcasts' && (
          <BroadcastCenter />
        )}

        {/* Telegram Mini App 3D Portal */}
        {tab === 'mini_app_portal' && (
          <TelegramMiniAppPortal />
        )}

        {/* AI Voice & Multi-Accent Studio */}
        {tab === 'voice_studio' && (
          <VoiceAvatarStudio />
        )}

        {/* Super Admin CRM & Students Analytics */}
        {tab === 'super_crm' && (
          <SuperAdminCrm />
        )}

        {/* Official CEFR & IELTS Certificate Generator */}
        {tab === 'certificate_gen' && (
          <CertificateGenerator onLogAction={(msg) => setStatusMsg(msg)} />
        )}

        {/* Automated Marketing Conversion Funnels */}
        {tab === 'auto_funnels' && (
          <AutoMarketingFunnels />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>⚡️ Davr Academy &copy; {new Date().getFullYear()}</span>
            <span>•</span>
            <span>Powered by Google Gemini, OpenAI & Claude</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://t.me/jasurdos" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition">
              Bosh Admin: @jasurdos
            </a>
            <span>•</span>
            <span>Status: <span className="text-emerald-400 font-semibold">Online & Active</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
