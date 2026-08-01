import React from 'react';
import { X, ExternalLink, Copy, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface BotFatherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BotFatherModal: React.FC<BotFatherModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const copyBotFather = () => {
    navigator.clipboard.writeText('@BotFather');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-6 h-6 text-blue-200" />
            <h3 className="text-lg font-bold">Telegram Bot Token Oling</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <p className="text-sm text-gray-600">
            Telegram bot tokenini olish juda oson va bepul. Buning uchun Telegram’ning rasmiy <span className="font-semibold text-gray-900">@BotFather</span> botidan foydalanamiz.
          </p>

          {/* Step 1 */}
          <div className="flex items-start space-x-3.5 p-3.5 bg-blue-50/70 rounded-xl border border-blue-100">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div className="text-sm text-gray-800 space-y-1">
              <div className="font-semibold text-gray-900 flex items-center justify-between">
                <span>@BotFather’ni oching</span>
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Telegram'da ochish <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
              <p className="text-xs text-gray-600">
                Telegram qidiruvidan <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-medium">@BotFather</code> deb qidiring va "Start" (Boshlash) tugmasini bosing.
              </p>
              <button
                onClick={copyBotFather}
                className="mt-1 inline-flex items-center text-xs text-blue-600 font-medium hover:underline"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" /> @BotFather nusxalandi
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> @BotFather nomini nusxalash
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3.5 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-7 h-7 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div className="text-sm text-gray-800 space-y-1">
              <div className="font-semibold text-gray-900">
                Yangi bot yarating
              </div>
              <p className="text-xs text-gray-600">
                BotFather’ga <code className="bg-white px-1.5 py-0.5 rounded border border-gray-300 font-mono font-medium text-blue-700">/newbot</code> buyrug'ini yuboring.
              </p>
              <p className="text-xs text-gray-600">
                • Avval botingiz uchun <span className="font-medium">nom</span> yozing (masalan: <span className="italic">Aqlli Yordamchi</span>)<br />
                • Keyin bot uchun <span className="font-medium">username</span> yozing, u albatta <span className="font-mono font-semibold">bot</span> so'zi bilan tugashi kerak (masalan: <span className="font-mono text-gray-800">my_uzbek_ai_bot</span>).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3.5 p-3.5 bg-green-50/70 rounded-xl border border-green-200">
            <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div className="text-sm text-gray-800 space-y-1">
              <div className="font-semibold text-gray-900">
                API Tokenni nusxalab oling
              </div>
              <p className="text-xs text-gray-600">
                @BotFather sizga uzun API Token yuboradi:<br />
                <code className="block mt-1 bg-white p-2 rounded border border-green-300 font-mono text-[11px] text-gray-700 break-all select-all">
                  7182934012:AAH-xY_8kzN3eQ_vP9sM4kL2jW...
                </code>
              </p>
              <p className="text-xs text-gray-600">
                O'sha token matnining ustiga bosib nusxa oling va ushbu sahifadagi maydonga qo'ying.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Xavfsizlik eslatmasi:</strong> Tokeningiz faqat sizning bodingizni boshqarish uchun ishlatiladi va hech qayerga e'lon qilinmaydi.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            Tushundim, rahmat!
          </button>
        </div>
      </div>
    </div>
  );
};
