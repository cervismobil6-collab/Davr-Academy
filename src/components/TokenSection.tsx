import React, { useState } from 'react';
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Play,
  RefreshCw,
  Eye,
  EyeOff,
  Bot,
  Lock,
  Copy,
  Check,
  Sparkles,
  ArrowDown,
  GraduationCap,
} from 'lucide-react';
import { TelegramBotInfo } from '../types';

interface TokenSectionProps {
  botInfo: TelegramBotInfo | null;
  hasToken: boolean;
  tokenMasked: string;
  isPolling: boolean;
  onConnectToken: (token: string, autoStart: boolean) => Promise<boolean>;
  onOpenGuide: () => void;
  isLoading: boolean;
}

export const TokenSection: React.FC<TokenSectionProps> = ({
  botInfo,
  hasToken,
  tokenMasked,
  isPolling,
  onConnectToken,
  onOpenGuide,
  isLoading,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [autoStart, setAutoStart] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const DAVR_ACADEMY_DESC = `🎓 Davr Academy AI

Ingliz tilini 0 dan C2 darajagacha sun'iy intellekt yordamida o'rganing.

Dunyoning zamonaviy AI texnologiyasi asosida yaratilgan ushbu bot sizning shaxsiy ingliz tili ustozingiz bo'ladi.

🤖 Bot nimalarni qila oladi?

✅ 0 dan C2 gacha bosqichma-bosqich dars beradi.
✅ Sizning darajangizni aniqlab, shaxsiy o'quv rejasini tuzadi.
✅ Grammatikani sodda va tushunarli misollar bilan o'rgatadi.
✅ So'z boyligingizni har kuni yangi so'zlar bilan oshiradi.
✅ Speaking, Listening, Reading va Writing ko'nikmalarini rivojlantiradi.
✅ IELTS va CEFR (A1–C2) bo'yicha tayyorlaydi.
✅ Testlar o'tkazadi, natijalarni tahlil qiladi va xatolaringizni tushuntiradi.
✅ Ingliz tiliga oid istalgan savolingizga 24/7 javob beradi.

🚀 Boshlash

Quyidagilardan birini yozing:

• Men 0 darajadaman
• A1 darsini boshlaymiz
• Grammar o'rganmoqchiman
• Speaking mashq qilamiz
• IELTS tayyorgarligi

🌟 Davr Academy AI bilan bugunoq ingliz tilini ishonch bilan o'rganishni boshlang va maqsadingiz sari dadil qadam tashlang!`;

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(DAVR_ACADEMY_DESC);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setErrorMsg("Iltimos, @BotFather bergan tokenni kiriting");
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);

    const success = await onConnectToken(tokenInput.trim(), autoStart);
    if (success) {
      setSuccessMsg("Bot muvaffaqiyatli ulandi va AI bilan bog'landi!");
      setTokenInput('');
    } else {
      setErrorMsg("Token noto'g'ri yoki Telegram serveriga ulanishda xatolik");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              1-qadam: Telegram Bot Tokeni
            </h2>
            <p className="text-xs text-gray-400">
              Botingizni boshqarish uchun <span className="text-blue-300">@BotFather</span> tokenini ulang
            </p>
          </div>
        </div>
        <button
          onClick={onOpenGuide}
          type="button"
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
          Token qanday olinadi?
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Connected Bot Display Banner */}
        {hasToken && botInfo ? (
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-gray-900">
                    {botInfo.first_name}
                  </h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Ushbu bot faol
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-600">
                  <span className="font-mono text-gray-800 font-semibold">
                    @{botInfo.username}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>ID: {botInfo.id}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-emerald-700 font-medium">
                    {isPolling ? '🤖 Polling rejimida ishlashmoqda' : '🛑 Hozircha to\'xtatilgan'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <a
                href={`https://t.me/${botInfo.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 shadow-xs transition-colors"
              >
                Telegram'da ochish
                <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-gray-500" />
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-2xl flex items-start space-x-3.5">
            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-1">
              <p className="font-bold text-sm">
                Botingizni avtomatlashtirishga tayyormisiz?
              </p>
              <p className="text-blue-800/80">
                Telegram'dagi <span className="font-semibold">@BotFather</span> orqali bot ochib, API Tokenni quyidagi maydonga yozing. Biz botni avtomatik Gemini AI bilan ulab beramiz!
              </p>
            </div>
          </div>
        )}

        {/* Davr Academy description copy box for BotFather */}
        <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl border border-indigo-500/30 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  BotFather uchun bot matni ("What can this bot do?")
                </h3>
                <p className="text-xs text-indigo-200/80">
                  @BotFather'ga start bosgach, botingiz haqida ma'lumotga ushbu matnni nusxalab qo'ying:
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyDesc}
              className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-indigo-950 hover:bg-indigo-50 shadow-sm'
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Nusxalandi!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                  Matnni nusxalash
                </>
              )}
            </button>
          </div>

          <div className="p-3.5 bg-black/30 border border-white/10 rounded-xl max-h-48 overflow-y-auto font-mono text-xs text-indigo-100 whitespace-pre-wrap leading-relaxed">
            {DAVR_ACADEMY_DESC}
          </div>
        </div>

        {/* Form to enter or update token */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              {hasToken ? 'Boshqa bot tokeniga almashtirish (yoki yangilash)' : 'Telegram API Token'}
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder={hasToken ? tokenMasked : '1234567890:AAH_abc123... (BotFather bergan token)'}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                title={showToken ? 'Yashirish' : "Ko'rsatish"}
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* AutoStart toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-gray-700">
              <input
                type="checkbox"
                checked={autoStart}
                onChange={(e) => setAutoStart(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>Ulanishi bilan darhol Telegram xabarlariga javob berishni boshlash</span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !tokenInput.trim()}
              className={`inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                !tokenInput.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2 fill-current" />
              )}
              <span>{hasToken ? 'Tokenni yangilash' : 'Ulash va Ishga Tushirish'}</span>
            </button>
          </div>
        </form>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
