import React from 'react';
import {
  Activity,
  MessageSquare,
  Users,
  Clock,
  Trash2,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Bot,
  AlertTriangle,
  Info,
  Terminal,
  Search,
} from 'lucide-react';
import { LogEntry, BotStats } from '../types';

interface LogsViewerProps {
  logs: LogEntry[];
  stats: BotStats;
  onClearLogs: () => Promise<void>;
  onRefresh: () => void;
  isLoading: boolean;
}

export const LogsViewer: React.FC<LogsViewerProps> = ({
  logs,
  stats,
  onClearLogs,
  onRefresh,
  isLoading,
}) => {
  const [filterType, setFilterType] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const formatUptime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0 s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) return `${hrs}s ${mins}d`;
    if (mins > 0) return `${mins}d ${secs}s`;
    return `${secs}s`;
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'all' && log.type !== filterType) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = log.text.toLowerCase().includes(q);
      const matchUser = log.chatName?.toLowerCase().includes(q) || log.username?.toLowerCase().includes(q);
      return matchText || matchUser;
    }
    return true;
  });

  const getLogBadge = (type: LogEntry['type']) => {
    switch (type) {
      case 'incoming_telegram':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800">
            <ArrowDownLeft className="w-3 h-3 mr-1" /> Telegram xabar
          </span>
        );
      case 'ai_reply':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800">
            <Bot className="w-3 h-3 mr-1" /> AI Javob
          </span>
        );
      case 'outgoing_telegram':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <ArrowUpRight className="w-3 h-3 mr-1" /> Chiquvchi
          </span>
        );
      case 'system_error':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800">
            <AlertTriangle className="w-3 h-3 mr-1" /> Xatolik
          </span>
        );
      case 'test_message':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
            <Terminal className="w-3 h-3 mr-1" /> Simulator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700">
            <Info className="w-3 h-3 mr-1" /> Tizim
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Qabul Qilingan Xabarlar
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.totalMessagesReceived}
            </h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              AI Javoblari
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.totalMessagesSent}
            </h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Faol Foydalanuvchilar
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {stats.activeUsersCount}
            </h3>
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Botning Ishlash Vaqti
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {formatUptime(stats.uptimeSeconds)}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Logs Table / Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Jonli Xabarlar va Suhbat Tarixi</h2>
              <p className="text-xs text-gray-400">
                Telegramdan kelayotgan xabarlar va AI bergan javoblar oqimi
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
              Yangilash
            </button>
            <button
              onClick={onClearLogs}
              className="inline-flex items-center px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Tarixni tozalash
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'incoming_telegram', label: 'Kiruvchi Xabarlar' },
              { id: 'ai_reply', label: 'AI Javoblar' },
              { id: 'system_info', label: 'Tizim' },
              { id: 'system_error', label: 'Xatoliklar' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterType === f.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Foydalanuvchi yoki matn bo'yicha qidirish..."
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* Logs Feed */}
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-gray-500 text-xs">
              Hozircha bunday turdagi yozuvlar yo'q. Telegram botingizga yozganingizda shu yerda paydo bo'ladi.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-gray-50/70 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    {getLogBadge(log.type)}
                    {log.chatName && (
                      <span className="text-xs font-bold text-gray-900">
                        {log.chatName}
                      </span>
                    )}
                    {log.username && (
                      <span className="text-xs font-mono font-medium text-blue-600">
                        {log.username}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-800 font-medium whitespace-pre-wrap leading-relaxed break-words">
                    {log.text}
                  </p>

                  {/* Metadata labels if present */}
                  {log.metadata && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {log.metadata.model && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 font-mono text-gray-600">
                          Model: {log.metadata.model}
                        </span>
                      )}
                      {log.metadata.processingTimeMs && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 font-mono text-blue-700">
                          ⏱️ {(log.metadata.processingTimeMs / 1000).toFixed(1)}s
                        </span>
                      )}
                      {log.metadata.isCommand && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                          ⚡ Buyruq
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-gray-400 font-mono shrink-0 self-end sm:self-start">
                  {log.timestamp}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
