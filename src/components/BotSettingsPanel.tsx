import React, { useState } from 'react';
import {
  Settings,
  Cpu,
  Thermometer,
  MessageSquare,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
  Zap,
  Terminal,
} from 'lucide-react';
import { BotConfig, CustomCommand } from '../types';

interface BotSettingsPanelProps {
  config: BotConfig;
  onSaveConfig: (updated: Partial<BotConfig>) => Promise<boolean>;
  isLoading: boolean;
}

export const BotSettingsPanel: React.FC<BotSettingsPanelProps> = ({
  config,
  onSaveConfig,
  isLoading,
}) => {
  const [model, setModel] = useState<BotConfig['model']>(config.model || 'gemini-3.6-flash');
  const [temperature, setTemperature] = useState<number>(config.temperature ?? 0.7);
  const [autoReply, setAutoReply] = useState<boolean>(config.autoReply ?? true);
  const [enableMarkdown, setEnableMarkdown] = useState<boolean>(config.enableMarkdown ?? true);
  const [welcomeMessage, setWelcomeMessage] = useState<string>(config.welcomeMessage || '');
  const [customCommands, setCustomCommands] = useState<CustomCommand[]>(config.customCommands || []);

  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    setModel(config.model || 'gemini-3.6-flash');
    setTemperature(config.temperature ?? 0.7);
    setAutoReply(config.autoReply ?? true);
    setEnableMarkdown(config.enableMarkdown ?? true);
    setWelcomeMessage(config.welcomeMessage || '');
    setCustomCommands(config.customCommands || []);
  }, [config]);

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    const ok = await onSaveConfig({
      model,
      temperature,
      autoReply,
      enableMarkdown,
      welcomeMessage,
      customCommands,
    });

    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const addCustomCommand = () => {
    const newCmd: CustomCommand = {
      id: `cmd_${Date.now()}`,
      command: '/yangi',
      replyText: "Assalomu alaykum! Bu yangi buyruqqa javob matni.",
      description: 'Yangi buyruq tasviri',
    };
    setCustomCommands([...customCommands, newCmd]);
  };

  const updateCommand = (index: number, field: keyof CustomCommand, value: string) => {
    const copy = [...customCommands];
    copy[index] = { ...copy[index], [field]: value };
    setCustomCommands(copy);
  };

  const removeCommand = (index: number) => {
    setCustomCommands(customCommands.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSaveAll}
      className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-700/60 border border-slate-600 flex items-center justify-center text-slate-300">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              3-qadam: AI Model va Maxsus Buyruqlar Sozlamasi
            </h2>
            <p className="text-xs text-slate-300">
              Gemini modeli, ijodiy harorat va Telegram buyruqlar (/start, /yordam) javoblarini sozlang
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
        >
          <Save className="w-3.5 h-3.5 mr-1.5" />
          Saqlash
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Row 1: Model Selection & Temperature */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Model selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              Gemini AI Modeli
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModel('gemini-3.6-flash')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  model === 'gemini-3.6-flash'
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 flex items-center">
                    <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" /> 3.6 Flash
                  </span>
                  {model === 'gemini-3.6-flash' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Juda tez va kundalik suhbatlar uchun ideal
                </p>
              </button>

              <button
                type="button"
                onClick={() => setModel('gemini-3.1-pro-preview')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  model === 'gemini-3.1-pro-preview'
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" /> 3.1 Pro
                  </span>
                  {model === 'gemini-3.1-pro-preview' && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Murakkab tahlil, kod va chuqur fikrlash
                </p>
              </button>
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center">
                <Thermometer className="w-3.5 h-3.5 mr-1 text-rose-500" />
                Ijodiy Harorat (Temperature)
              </label>
              <span className="px-2 py-0.5 rounded bg-gray-100 text-xs font-mono font-bold text-gray-800">
                {temperature}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
              <span>0.0 (Aniq va rasmiy)</span>
              <span>0.7 (Muvozanatli)</span>
              <span>1.0 (Ijodiy)</span>
            </div>
          </div>
        </div>

        {/* Row 2: Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200/80">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-900">
                AI Avtomat javob (Auto-Reply)
              </span>
              <p className="text-[11px] text-gray-500">
                Yangi xabar kelsa, Gemini avtomatik javob qaytaradi
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoReply}
              onChange={(e) => setAutoReply(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-gray-900">
                Markdown formatlash (Bold, Code)
              </span>
              <p className="text-[11px] text-gray-500">
                Telegramda qalin, kursiv va kod bloklarini chiroyli ko'rsatish
              </p>
            </div>
            <input
              type="checkbox"
              checked={enableMarkdown}
              onChange={(e) => setEnableMarkdown(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Welcome message /start */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
            /start — Xush kelibsiz xabari (Welcome Message)
          </label>
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all font-mono"
            placeholder="Assalomu alaykum! Botga xush kelibsiz..."
          />
        </div>

        {/* Custom Commands Manager */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Maxsus Buyruqlar (Custom Telegram Commands)
              </label>
            </div>
            <button
              type="button"
              onClick={addCustomCommand}
              className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Buyruq qo'shish
            </button>
          </div>

          <div className="space-y-3">
            {customCommands.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-gray-50 border border-dashed border-gray-300 text-xs text-gray-500">
                Hozircha maxsus buyruqlar yo'q. /yordam yoki /narxlar kabi buyruqlarni qo'shishingiz mumkin.
              </div>
            ) : (
              customCommands.map((cmd, idx) => (
                <div
                  key={cmd.id}
                  className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Buyruq (matn)
                      </span>
                      <input
                        type="text"
                        value={cmd.command}
                        onChange={(e) => updateCommand(idx, 'command', e.target.value)}
                        placeholder="/yordam"
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono font-semibold text-gray-900"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-gray-600">
                          Tavsif (Description)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCommand(idx)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> O'chirish
                        </button>
                      </div>
                      <input
                        type="text"
                        value={cmd.description}
                        onChange={(e) => updateCommand(idx, 'description', e.target.value)}
                        placeholder="Botdan foydalanish bo'yicha yordam"
                        className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-gray-900"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Buyruq bosilganda chiqadigan javob matni:
                    </span>
                    <textarea
                      rows={2}
                      value={cmd.replyText}
                      onChange={(e) => updateCommand(idx, 'replyText', e.target.value)}
                      placeholder="Javob matnini yozing..."
                      className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-mono text-gray-900"
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer save notifications */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> Sozlamalar muvaffaqiyatli saqlandi
            </span>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            <Save className="w-4 h-4 mr-2" />
            Barcha o'zgarishlarni saqlash
          </button>
        </div>
      </div>
    </form>
  );
};
