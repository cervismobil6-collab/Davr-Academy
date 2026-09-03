import React, { useState } from 'react';
import { safeFetchJson } from '../utils/safeFetch';

interface LandingProps {
  onLogAction?: (msg: string) => void;
}

export const LandingPagePreview: React.FC<LandingProps> = ({ onLogAction }) => {
  const [quickQuestion, setQuickQuestion] = useState('How can I improve my IELTS Speaking from 6.0 to 7.5?');
  const [demoResponse, setDemoResponse] = useState<string | null>(null);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleTestLiveAi = async () => {
    if (!quickQuestion.trim()) return;
    setLoadingDemo(true);
    try {
      const data = await safeFetchJson('/api/ai/ask-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: quickQuestion,
          compareAll: false,
          requestedModel: 'gemini',
        }),
      });
      setDemoResponse(data?.results?.gemini || data?.message || 'Davr Academy AI: Fokusni Lexical Resource va tabiiy idiomalarga qarating. Telegram botimizda to\'liq audio suhbat o\'tkazishingiz mumkin!');
      if (onLogAction) onLogAction(`🌐 Web Landing AI Demo sinovi o'tkazildi: "${quickQuestion.substring(0, 30)}..."`);
    } catch (e) {
      setDemoResponse('Davr Academy Multi-AI: IELTS Speaking 7.5+ olish uchun kundalik 15 daqiqa jonli ovozli mashq va Cambridge testlaridan foydalaning. Telegram botimiz: @DavrAcademyBot');
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleCopyLandingUrl = () => {
    navigator.clipboard.writeText('https://ais-pre-7ru7gz6q462kwf3cvtpnfd-217372630663.asia-southeast1.run.app');
    setCopiedLink(true);
    if (onLogAction) onLogAction('🔗 Rasmiy Web Landing havolasi nusxalandi');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              ● 100% SEO Ready & Jonli Web Sayt
            </span>
            <span className="text-xs text-slate-400">Google & Yandex 1-o'rin optimizatsiyasi</span>
          </div>
          <h3 className="text-base font-bold text-white mt-1">
            🌐 Davr Academy Web Landing Page (Mikro-Sayt)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLandingUrl}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl transition font-semibold"
          >
            {copiedLink ? '✅ Havola Nusxalandi!' : '📋 Sayt Havolasini Olish'}
          </button>
          <a
            href="https://t.me/DavrAcademyBot"
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition flex items-center gap-1.5"
          >
            ✈️ Telegram Botni Ochish ↗
          </a>
        </div>
      </div>

      {/* Live Landing Preview Canvas */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Navigation Bar */}
        <div className="border-b border-slate-800/80 px-6 py-4 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏛️</span>
            <div>
              <span className="font-black text-white text-sm tracking-wider">DAVR ACADEMY</span>
              <span className="text-[10px] text-indigo-400 font-semibold block">MULTI-AI ENGLISH PLATFORM</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-300">
            <span className="hover:text-white cursor-pointer transition">Xususiyatlar</span>
            <span className="hover:text-white cursor-pointer transition">IELTS 9.0 Mock</span>
            <span className="hover:text-white cursor-pointer transition">Ovozli AI</span>
            <span className="hover:text-white cursor-pointer transition">CEFR Sertifikat</span>
          </div>
          <a
            href="https://t.me/DavrAcademyBot"
            target="_blank"
            rel="noreferrer"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition"
          >
            Botga Kirish
          </a>
        </div>

        {/* Hero Section */}
        <div className="px-6 py-12 sm:py-16 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-medium mb-4">
            <span>✨ Gemini 2.5 Flash • GPT-4o • Claude 3.5 • ElevenLabs Voice</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Ingliz tilini <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">Multi-AI</span> bilan 3 barobar tezroq o'rganing
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Repetitorsiz, uyda, xohlagan vaqtingizda jonli ovozli suhbat qiling, IELTS Speaking va Writing mashqlarini bajaring hamda rasmiy CEFR sertifikatiga ega bo'ling.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://t.me/DavrAcademyBot?start=landing_hero"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm px-8 py-3 rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
            >
              <span>🚀</span> Telegramda Bepul Boshlash
            </a>
            <button
              onClick={() => {
                const el = document.getElementById('interactive-demo-box');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold px-6 py-3 rounded-2xl transition"
            >
              ⚡️ Saytda AI Sinovini Ko'rish
            </button>
          </div>
        </div>

        {/* Live Interactive AI Trial Widget */}
        <div id="interactive-demo-box" className="max-w-2xl mx-auto px-6 pb-12">
          <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                <span>🤖</span> Jonli AI Sinov (Live Demo Sandbox)
              </span>
              <span className="text-[10px] text-slate-400">Telegram Bot Web API</span>
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="Savolingizni yoki IELTS mavzuingizni yozing..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleTestLiveAi}
                disabled={loadingDemo}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                {loadingDemo ? '...' : 'Sinash ⚡️'}
              </button>
            </div>

            {demoResponse && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed space-y-2">
                <div className="text-[11px] font-bold text-emerald-400">Davr Academy Multi-AI Javobi:</div>
                <p>{demoResponse}</p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Ovozli suhbat uchun Telegram botga o'ting ➜</span>
                  <a href="https://t.me/DavrAcademyBot" target="_blank" rel="noreferrer" className="text-indigo-400 font-bold hover:underline">
                    @DavrAcademyBot
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-t border-slate-800/80 bg-slate-900/30">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-2xl mb-2 block">🧠</span>
            <h4 className="font-bold text-white text-sm mb-1">4 x Multi-Model AI</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini 2.5, GPT-4o va Claude 3.5 bir vaqtda xatolaringizni tahlil qilib, eng aniq tushuntirishni beradi.
            </p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-2xl mb-2 block">🎙️</span>
            <h4 className="font-bold text-white text-sm mb-1">ElevenLabs Ovozli AI</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Xuddi Londonlik native speaker bilan telefonda gaplashgandek real vaqtda jonli audio muloqot qiling.
            </p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-2xl mb-2 block">🎯</span>
            <h4 className="font-bold text-white text-sm mb-1">IELTS 9.0 Mock Sinov</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Speaking Part 1-3 va Writing insholaringizni Cambridge rasmiy 4 mezoni bo'yicha baholab beradi.
            </p>
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <span className="text-2xl mb-2 block">🏅</span>
            <h4 className="font-bold text-white text-sm mb-1">Rasmiy CEFR Sertifikat</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Test yakunida tasdiqlangan QR kodli xalqaro darajadagi sertifikatni darhol yuklab oling.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 Davr Academy. Xalqaro Multi-AI Ta'lim Ekotizimi. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </div>
  );
};
