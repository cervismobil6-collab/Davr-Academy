import React from 'react';
import {
  Bot,
  Play,
  Square,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { TelegramBotInfo } from '../types';

interface NavbarProps {
  botInfo: TelegramBotInfo | null;
  isPolling: boolean;
  hasToken: boolean;
  onTogglePolling: () => void;
  onOpenGuide: () => void;
  activeTab: 'config' | 'lessons' | 'simulator' | 'logs';
  setActiveTab: (tab: 'config' | 'lessons' | 'simulator' | 'logs') => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  botInfo,
  isPolling,
  hasToken,
  onTogglePolling,
  onOpenGuide,
  activeTab,
  setActiveTab,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Telegram AI Bot Pro
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-500" />
                  Gemini 3 AI
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Avtomatlashgan suhbat boti paneli</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation (Center on Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'config'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🚀 Token & Sozlamalar
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'lessons'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📚 Tayyor Darsliklar
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💬 Simulator & Sinov
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'logs'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Jonli Suhbatlar
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100/70 hover:bg-gray-100 rounded-xl transition-colors"
              title="Qanday qilib token olinadi?"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
              <span className="hidden sm:inline">Token olish</span>
            </button>

            {/* Connected Bot Status Chip */}
            {botInfo && (
              <a
                href={`https://t.me/${botInfo.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                @{botInfo.username}
                <ExternalLink className="w-3 h-3 ml-1.5 opacity-70" />
              </a>
            )}

            {/* Start / Stop Bot Polling Toggle */}
            <button
              onClick={onTogglePolling}
              disabled={!hasToken || isLoading}
              className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                !hasToken
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isPolling
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : isPolling ? (
                <Square className="w-3.5 h-3.5 mr-1.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
              )}
              <span>{isPolling ? "Botni to'xtatish" : 'Botni yoqish'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="flex md:hidden items-center justify-center space-x-1 py-2 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'config'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            🚀 Sozlamalar
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'lessons'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            📚 Darslar
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'simulator'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            💬 Simulator
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            📊 Tarix
          </button>
        </div>
      </div>
    </header>
  );
};
