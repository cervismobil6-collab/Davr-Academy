/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { TokenSection } from './components/TokenSection';
import { PersonaSelector } from './components/PersonaSelector';
import { BotSettingsPanel } from './components/BotSettingsPanel';
import { ChatSimulator } from './components/ChatSimulator';
import { LogsViewer } from './components/LogsViewer';
import { BotFatherModal } from './components/BotFatherModal';
import { LessonsManager } from './components/LessonsManager';
import {
  BotConfig,
  TelegramBotInfo,
  LogEntry,
  BotStats,
  PersonaPreset,
} from './types';
import { PERSONA_PRESETS } from './data/personas';
import { Sparkles, HelpCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'lessons' | 'simulator' | 'logs'>('config');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // App State from server
  const [config, setConfig] = useState<BotConfig>({
    token: '',
    isActive: false,
    personaId: 'uz_general',
    customPrompt: PERSONA_PRESETS[0].systemPrompt,
    model: 'gemini-3.6-flash',
    temperature: 0.7,
    autoReply: true,
    welcomeMessage: PERSONA_PRESETS[0].welcomeMessage,
    enableVoiceExplanation: true,
    enableImageVision: true,
    enableMarkdown: true,
    customCommands: [],
    maxHistoryMessages: 10,
  });

  const [botInfo, setBotInfo] = useState<TelegramBotInfo | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<BotStats>({
    totalMessagesReceived: 0,
    totalMessagesSent: 0,
    activeUsersCount: 0,
    lastActive: null,
    uptimeSeconds: 0,
    startTime: Date.now(),
  });

  const [tokenMasked, setTokenMasked] = useState('');
  const [hasToken, setHasToken] = useState(false);

  // Fetch status from backend
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/bot/status');
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        setBotInfo(data.botInfo);
        setIsPolling(data.isPolling);
        setStats(data.stats);
        setTokenMasked(data.config.tokenMasked || '');
        setHasToken(data.config.hasToken || false);
      }
    } catch (err) {
      console.warn('Bot holatini yuklashda uzilish:', err);
    }
  }, []);

  // Fetch logs from backend
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/bot/logs?limit=150');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.warn('Loglarni yuklashda uzilish:', err);
    }
  }, []);

  // Initial load + periodic polling for stats/logs
  useEffect(() => {
    fetchStatus();
    fetchLogs();

    const timer = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 4000);

    return () => clearInterval(timer);
  }, [fetchStatus, fetchLogs]);

  // Connect Token API
  const handleConnectToken = async (token: string, autoStart: boolean): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bot/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, autoStart }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchStatus();
        await fetchLogs();
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (err) {
      console.error('Token ulashda xato:', err);
      setIsLoading(false);
      return false;
    }
  };

  // Toggle Polling (Start / Stop)
  const handleTogglePolling = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bot/toggle-polling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle' }),
      });
      const data = await res.json();
      if (data.success) {
        setIsPolling(data.isPolling);
        setBotInfo(data.botInfo);
      }
    } catch (err) {
      console.error('Polling toggle xatosi:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Save Bot Settings API
  const handleSaveConfig = async (updated: Partial<BotConfig>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/bot/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (err) {
      console.error('Sozlamalarni saqlashda xato:', err);
      setIsLoading(false);
      return false;
    }
  };

  // Select Persona Preset
  const handleSelectPersona = async (preset: PersonaPreset) => {
    await handleSaveConfig({
      personaId: preset.id,
      customPrompt: preset.systemPrompt,
      welcomeMessage: preset.welcomeMessage,
      temperature: preset.temperature,
    });
  };

  // Update Custom Prompt
  const handleUpdatePrompt = async (newPrompt: string) => {
    await handleSaveConfig({
      customPrompt: newPrompt,
    });
  };

  // Test AI in Simulator
  const handleTestAi = async (
    message: string,
    userName?: string
  ): Promise<{ replyText: string; processingTimeMs: number } | null> => {
    try {
      const res = await fetch('/api/bot/test-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userName }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchLogs();
        return {
          replyText: data.replyText,
          processingTimeMs: data.processingTimeMs,
        };
      }
      return null;
    } catch (err) {
      console.error('Simulator AI xatosi:', err);
      return null;
    }
  };

  // Send Manual Telegram Message
  const handleSendManualTelegram = async (chatId: string, text: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/bot/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, text }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchLogs();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Qo\'lda yuborishda xato:', err);
      return false;
    }
  };

  // Clear Logs
  const handleClearLogs = async () => {
    try {
      await fetch('/api/bot/logs/clear', { method: 'POST' });
      setLogs([]);
    } catch (err) {
      console.error('Log tozalashda xato:', err);
    }
  };

  // Reset Bot Memory
  const handleResetMemory = async () => {
    try {
      await fetch('/api/bot/reset-memory', { method: 'POST' });
    } catch (err) {
      console.error('Xotirani yangilashda xato:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        botInfo={botInfo}
        isPolling={isPolling}
        hasToken={hasToken}
        onTogglePolling={handleTogglePolling}
        onOpenGuide={() => setIsGuideOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Helper Banner if Bot is not connected yet */}
        {!hasToken && activeTab === 'config' && (
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  Botingizni 1 daqiqada yaratamiz va ishga tushiramiz!
                </h3>
                <p className="text-xs text-blue-100">
                  @BotFather’dan yangi bot ochib, API Tokenni kiriting — Gemini AI suhbatlarga avtomatik javob berishni boshlaydi.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-white text-blue-900 font-bold rounded-xl text-xs hover:bg-blue-50 transition-colors shadow-xs shrink-0"
            >
              <HelpCircle className="w-4 h-4 mr-1.5 text-blue-600" />
              Token olish qo'llanmasi
            </button>
          </div>
        )}

        {/* Tab 1: Sozlamalar (Token, Persona, AI Options) */}
        {activeTab === 'config' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <TokenSection
              botInfo={botInfo}
              hasToken={hasToken}
              tokenMasked={tokenMasked}
              isPolling={isPolling}
              onConnectToken={handleConnectToken}
              onOpenGuide={() => setIsGuideOpen(true)}
              isLoading={isLoading}
            />

            <PersonaSelector
              config={config}
              presets={PERSONA_PRESETS}
              onSelectPersona={handleSelectPersona}
              onUpdatePrompt={handleUpdatePrompt}
              isLoading={isLoading}
            />

            <BotSettingsPanel
              config={config}
              onSaveConfig={handleSaveConfig}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Tab 2: Tayyor Darsliklar */}
        {activeTab === 'lessons' && (
          <div className="animate-in fade-in duration-200">
            <LessonsManager />
          </div>
        )}

        {/* Tab 3: Simulator & Manual Send */}
        {activeTab === 'simulator' && (
          <div className="animate-in fade-in duration-200">
            <ChatSimulator
              botInfo={botInfo}
              hasToken={hasToken}
              onTestAi={handleTestAi}
              onSendManualTelegram={handleSendManualTelegram}
              onResetMemory={handleResetMemory}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Tab 3: Logs & Stats */}
        {activeTab === 'logs' && (
          <div className="animate-in fade-in duration-200">
            <LogsViewer
              logs={logs}
              stats={stats}
              onClearLogs={handleClearLogs}
              onRefresh={() => {
                fetchStatus();
                fetchLogs();
              }}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">Telegram AI Bot Pro</span>
            <span>•</span>
            <span>Gemini AI bilan ishlovchi avtomatlashgan bot</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              BotFather yo'riqnomasi
            </button>
            <span>•</span>
            <span className="text-gray-400">Google AI Studio</span>
          </div>
        </div>
      </footer>

      {/* BotFather Help Modal */}
      <BotFatherModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
