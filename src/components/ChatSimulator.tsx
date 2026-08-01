import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  RefreshCw,
  Sparkles,
  Bot,
  User,
  Clock,
  Terminal,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { TelegramBotInfo } from '../types';

interface ChatSimulatorProps {
  botInfo: TelegramBotInfo | null;
  hasToken: boolean;
  onTestAi: (
    message: string,
    userName?: string
  ) => Promise<{ replyText: string; processingTimeMs: number } | null>;
  onSendManualTelegram: (chatId: string, text: string) => Promise<boolean>;
  onResetMemory: () => Promise<void>;
  isLoading: boolean;
}

interface SimulatedMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  processingTimeMs?: number;
}

export const ChatSimulator: React.FC<ChatSimulatorProps> = ({
  botInfo,
  hasToken,
  onTestAi,
  onSendManualTelegram,
  onResetMemory,
  isLoading,
}) => {
  const [messages, setMessages] = useState<SimulatedMessage[]>([
    {
      id: 'welcome_1',
      sender: 'bot',
      text: "Assalomu alaykum! 🤖 Men sizning AI yordamchingizman. Botning qanday javob berishini mana shu yerdan sinab ko'rishingiz mumkin. Menga savol bering!",
      time: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSendingSim, setIsSendingSim] = useState(false);

  // Manual telegram send state
  const [targetChatId, setTargetChatId] = useState('');
  const [manualText, setManualText] = useState('');
  const [isSendingManual, setIsSendingManual] = useState(false);
  const [manualSuccess, setManualSuccess] = useState<string | null>(null);
  const [manualError, setManualError] = useState<string | null>(null);

  const handleSendSimulator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSendingSim) return;

    const text = inputText.trim();
    setInputText('');

    const userMsg: SimulatedMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSendingSim(true);

    const res = await onTestAi(text, 'Sinovchi');

    setIsSendingSim(false);

    if (res) {
      const botMsg: SimulatedMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: res.replyText,
        time: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        processingTimeMs: res.processingTimeMs,
      };
      setMessages((prev) => [...prev, botMsg]);
    } else {
      const errorMsg: SimulatedMessage = {
        id: `err_${Date.now()}`,
        sender: 'bot',
        text: "⚠️ Kechirasiz, javob olishda xatolik yuz berdi. Iltimos qayta urining.",
        time: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleClearSimulator = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: "Suhbatlar tarixi tozalandi. Yangidan savol berishingiz mumkin!",
        time: new Date().toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  const handleManualSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetChatId.trim() || !manualText.trim()) return;

    setIsSendingManual(true);
    setManualSuccess(null);
    setManualError(null);

    const ok = await onSendManualTelegram(targetChatId.trim(), manualText.trim());
    setIsSendingManual(false);

    if (ok) {
      setManualSuccess(`Xabar Telegram Chat #${targetChatId} ga muvaffaqiyatli yuborildi!`);
      setManualText('');
    } else {
      setManualError(`Xabar yuborishda xato. Chat ID to'g'riligini va bot chatda ekanligini tekshiring.`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Live Web Simulator Chat (2 columns on Desktop) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        {/* Chat Simulator Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold">AI Bot Simulatori (Jonli Sinov)</h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-400/20 text-emerald-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Gemini Ulangani
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Telegramga yubormasdan turib, botning aqlini va javoblarini shu yerda sinab ko'ring
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onResetMemory}
              type="button"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              title="AI Xotirasini tozalash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleClearSimulator}
              type="button"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs transition-colors"
              title="Suhbatni tozalash"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-100/70 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex items-end space-x-2.5 ${
                  isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mb-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-xs ${
                    isBot
                      ? 'bg-white text-gray-900 border border-gray-200/80 rounded-bl-xs'
                      : 'bg-blue-600 text-white rounded-br-xs'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>

                  <div
                    className={`flex items-center justify-end space-x-2 mt-1.5 text-[10px] ${
                      isBot ? 'text-gray-400' : 'text-blue-200'
                    }`}
                  >
                    {isBot && msg.processingTimeMs && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-0.5" />
                        {(msg.processingTimeMs / 1000).toFixed(1)}s
                      </span>
                    )}
                    <span>{msg.time}</span>
                  </div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 shadow-xs mb-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSendingSim && (
            <div className="flex items-center space-x-2.5 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-xs border border-gray-200/80 flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendSimulator}
          className="p-4 bg-white border-t border-gray-200 flex items-center space-x-3 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="AI botga savolingizni yozing..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all"
          />
          <button
            type="submit"
            disabled={isSendingSim || !inputText.trim()}
            className={`inline-flex items-center justify-center px-5 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm shrink-0 ${
              isSendingSim || !inputText.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isSendingSim ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
      </div>

      {/* RIGHT: Direct Telegram Message Sender Panel (1 column) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Qo'lda Xabar Yuborish</h2>
              <p className="text-xs text-gray-400">
                Paneldan Telegram foydalanuvchisiga yozish
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
            <div className="font-semibold flex items-center">
              <HelpCircle className="w-4 h-4 mr-1.5 text-blue-600" />
              Qanday ishlaydi?
            </div>
            <p className="text-blue-800/80 leading-relaxed">
              Agar mijozingiz yoki o'zingizning Telegram <span className="font-mono font-bold">Chat ID</span> raqamingizni bilsangiz, to'g'ridan-to'g'ri shu yerdan unga xabar yuborishingiz mumkin.
            </p>
          </div>

          <form onSubmit={handleManualSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Telegram Chat ID (yoki guruh ID si)
              </label>
              <input
                type="text"
                value={targetChatId}
                onChange={(e) => setTargetChatId(e.target.value)}
                placeholder="Masalan: 123456789 yoki -10012345..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Eslatma: Foydalanuvchi botga avval kamida 1 marta /start yozgan bo'lishi kerak.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                Yuboriladigan Xabar Matni
              </label>
              <textarea
                rows={5}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Assalomu alaykum, sizning buyurtmangiz tayyor..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={isSendingManual || !targetChatId.trim() || !manualText.trim() || !hasToken}
              className={`w-full py-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center ${
                !targetChatId.trim() || !manualText.trim() || !hasToken || isSendingManual
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
              }`}
            >
              {isSendingManual ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              <span>Telegramga Yuborish</span>
            </button>
          </form>

          {manualSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{manualSuccess}</span>
            </div>
          )}

          {manualError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{manualError}</span>
            </div>
          )}

          {botInfo && (
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Joriy bot: @{botInfo.username}</span>
              <a
                href={`https://t.me/${botInfo.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center font-medium"
              >
                Telegram <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
