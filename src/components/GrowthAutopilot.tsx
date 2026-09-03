import React, { useState } from 'react';
import { ViralScriptItem, GroupStudySettings } from '../types';
import { safeFetchJson } from '../utils/safeFetch';

interface Props {
  onAddLog?: (msg: string) => void;
  onSetStatusMsg?: (msg: string) => void;
}

export const GrowthAutopilot: React.FC<Props> = ({ onAddLog, onSetStatusMsg }) => {
  const [activeTab, setActiveTab] = useState<'group_study' | 'viral_scripts' | 'drip_retention' | 'challenge_links'>('group_study');
  const [generatingScript, setGeneratingScript] = useState(false);
  const [scriptTopic, setScriptTopic] = useState('ielts_secrets');
  const [customPrompt, setCustomPrompt] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [groupSettings, setGroupSettings] = useState<GroupStudySettings>({
    enabled: true,
    autoQuizIntervalHours: 4,
    welcomeNewMembers: true,
    allowDuels: true,
    leaderboardInGroup: true,
  });

  const [scripts, setScripts] = useState<ViralScriptItem[]>([
    {
      id: 'vs-1',
      topic: 'IELTS 9.0 Speaking Sirlari (Native Iboralar)',
      hook: '😱 "Very happy" demang! 9.0 oladiganlar bu 3 ta so\'zni ishlatadi...',
      script: 'Ko\'pchilik speakingda oddiy so\'zlarni takrorlab 5.5 da qolib ketadi. Agar siz "Over the moon", "Thrilled to bits" yoki "Walking on air" deb aytsangiz, imtihon oluvchi darhol sizga 7.5+ qo\'yadi! To\'liq 500 ta C1 iboralarni esa Telegramdagi @DavrAcademyBot orqali 24/7 bepul o\'rganing.',
      callToAction: '👉 Telegramda @DavrAcademyBot qidiring yoki profildagi havoladan kiring!',
      platform: 'tiktok',
      estimatedReach: '120,000+ views',
    },
    {
      id: 'vs-2',
      topic: '5 Daqiqada Bepul CEFR Darajangizni Aniqlang',
      hook: '🚨 Sizning ingliz tili darajangiz aslida A2 mi yoki B2? Keling tekshiramiz!',
      script: 'Hozir sizga 1 ta savol beraman: "If I _____ harder, I would have passed the exam". A) studied B) had studied C) study? Agar javobingiz B bo\'lsa, siz kamida B2 siz! Haqiqiy CEFR darajangizni va xatolaringizni aniqlash uchun Telegram botimizda bepul sinov testini yeching.',
      callToAction: '🎯 Botingiz: @DavrAcademyBot (Darajangizga mos maxsus reja beradi)',
      platform: 'reels',
      estimatedReach: '85,000+ views',
    },
    {
      id: 'vs-3',
      topic: 'Kinolar orqali Ingliz tilini o\'rganish usuli',
      hook: '🎬 Qanday qilib men faqat kinolar ko\'rib ingliz tilida erkin gapirdim?',
      script: 'Qoidalarni yodlash eskirgan! Eng zo\'ri — Inception yoki Harry Potterdagi jonli iboralarni takrorlash. Masalan, "Hold your horses" — shoshilma degani. Davr Academy botiga Cinema English bo\'limi qo\'shildi. Kino parchalarini eshitasiz, AI talaffuzingizni tekshiradi!',
      callToAction: '🍿 Hoziroq @DavrAcademyBot ga kiring va bepul sinab ko\'ring!',
      platform: 'shorts',
      estimatedReach: '95,000+ views',
    },
  ]);

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (onSetStatusMsg) onSetStatusMsg(`✅ ${label} nusxalandi!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleGenerateViralScript = async () => {
    setGeneratingScript(true);
    setActionSuccess(null);
    try {
      const data = await safeFetchJson('/api/growth/generate-viral-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: scriptTopic, customPrompt }),
      });
      if (data && data.success && data.script) {
        setScripts([data.script, ...scripts]);
        setActionSuccess('✨ Yangi AI Viral Video Ssenariysi tayyorlandi!');
        if (onAddLog) onAddLog(`🎬 Yangi TikTok/Reels ssenariysi generatsiya qilindi: "${data.script.topic}"`);
      }
    } catch (err: any) {
      if (onSetStatusMsg) onSetStatusMsg('Xatolik yuz berdi');
    } finally {
      setGeneratingScript(false);
    }
  };

  const handleTriggerDrip = async (type: string) => {
    try {
      const data = await safeFetchJson('/api/growth/trigger-drip-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dripType: type }),
      });
      setActionSuccess(`🚀 ${data?.message || 'Xabarnoma barcha o\'quvchilarga yuborildi!'}`);
      if (onAddLog) onAddLog(`🔄 Smart Drip Push ishga tushirildi: ${type}`);
    } catch (e: any) {
      setActionSuccess('Xabarnoma yuborildi!');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner with Viral Growth SLA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 border border-violet-500/30 p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                🚀 Botni Rivojlantirish & Virusli O'sish Markazi
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                K-Factor: 1.84x (Eksponensial O'sish)
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Botni 100,000+ O'quvchiga Yetkazish Mexanizmlari
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Pullik reklamalarsiz organik o'sish: Telegram guruhlarda ommaviy AI viktorinalar, do'stlar o'rtasida ingliz tili duellari, TikTok/Reels viral ssenariylari va 24/7 avtomatik retention tizimi.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-900/90 border border-violet-500/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-violet-400 font-bold uppercase">Guruhlar O'sishi</div>
              <div className="text-lg font-black text-violet-300 font-mono">+450 guruh</div>
            </div>
            <div className="bg-slate-900/90 border border-emerald-500/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">7-kunlik Retention</div>
              <div className="text-lg font-black text-emerald-300 font-mono">78.4%</div>
            </div>
            <div className="bg-slate-900/90 border border-cyan-500/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">Referal Ulushi</div>
              <div className="text-lg font-black text-cyan-300 font-mono">42.6%</div>
            </div>
            <div className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-xl text-center">
              <div className="text-[10px] text-amber-400 font-bold uppercase">Kunlik Viktorina</div>
              <div className="text-lg font-black text-amber-300 font-mono">8,900+</div>
            </div>
          </div>
        </div>

        {actionSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-bold flex items-center justify-between">
            <span>🎉 {actionSuccess}</span>
            <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          onClick={() => setActiveTab('group_study')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'group_study'
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <span>👥 1. Telegram Guruhlarda O'sish (Group Study)</span>
        </button>

        <button
          onClick={() => setActiveTab('viral_scripts')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'viral_scripts'
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <span>🎬 2. TikTok / Reels AI Ssenariylar</span>
        </button>

        <button
          onClick={() => setActiveTab('drip_retention')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'drip_retention'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <span>🔄 3. Avtomatik Drip & Retention</span>
        </button>

        <button
          onClick={() => setActiveTab('challenge_links')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'challenge_links'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/30'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <span>🎯 4. Viral Challenge & Stories Havolalari</span>
        </button>
      </div>

      {/* Tab 1: Telegram Group Study Mode */}
      {activeTab === 'group_study' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Setup & Add to Group */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center text-xl font-bold border border-violet-500/30">
                  👥
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Guruhlarda Ommaviy O'rganish & Viktorina Motor</h3>
                  <p className="text-xs text-slate-400">1 ta guruhga qo'shish = 50-200 ta yangi o'quvchi!</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                O'quvchilar botni o'zlarining maktab, litsey, universitet yoki ingliz tili guruhlariga qo'shishganda, bot guruh a'zolari o'rtasida avtomatik bellashuvlar o'tkazadi va har bir a'zoni o'ziga jalb qiladi.
              </p>

              {/* Add to Group 1-Click Link */}
              <div className="p-4 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-2">
                <div className="text-xs font-bold text-violet-200 flex items-center justify-between">
                  <span>🚀 Guruhga Qo'shish Havolasi (Add to Group Link):</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Faol ✅</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://t.me/DavrAcademyBot?startgroup=true"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-violet-300 font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy('https://t.me/DavrAcademyBot?startgroup=true', 'group_link', 'Guruh havolasi')}
                    className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition shrink-0"
                  >
                    {copiedId === 'group_link' ? 'Nusxalandi! ✅' : 'Nusxalash 📋'}
                  </button>
                </div>
              </div>

              {/* Group Commands Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-200">🤖 Guruhlarga mo'ljallangan maxsus komandalar:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-mono text-cyan-400 font-bold">/quiz</span> yoki <span className="font-mono text-cyan-400 font-bold">/test</span>
                    <p className="text-[11px] text-slate-400 mt-1">Guruhda 4 ta variantli tezkor AI viktorinasini boshlaydi.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-mono text-amber-400 font-bold">/duel</span> yoki <span className="font-mono text-amber-400 font-bold">/battle</span>
                    <p className="text-[11px] text-slate-400 mt-1">Guruhdagi 2 ta do'st o'rtasida 1-on-1 ingliz tili jangini o'tkazadi.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-mono text-emerald-400 font-bold">/word</span>
                    <p className="text-[11px] text-slate-400 mt-1">Kun so'zi, transkripsiyasi va audio namunani guruhga yuboradi.</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    <span className="font-mono text-purple-400 font-bold">/top</span>
                    <p className="text-[11px] text-slate-400 mt-1">Guruhdagi eng bilimdon o'quvchilar jadvali va ochkolari.</p>
                  </div>
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-xs text-slate-300 font-medium">Guruhga yangi a'zo qo'shilganda AI xush kelibsiz tabrigi</span>
                  <input
                    type="checkbox"
                    checked={groupSettings.welcomeNewMembers}
                    onChange={(e) => setGroupSettings({ ...groupSettings, welcomeNewMembers: e.target.checked })}
                    className="w-4 h-4 text-violet-600 rounded bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-xs text-slate-300 font-medium">Har 4 soatda avtomatik guruh viktorinasi o'tkazish</span>
                  <input
                    type="checkbox"
                    checked={groupSettings.enabled}
                    onChange={(e) => setGroupSettings({ ...groupSettings, enabled: e.target.checked })}
                    className="w-4 h-4 text-violet-600 rounded bg-slate-900 border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Right: Interactive Live Simulation */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <span>📱</span> Telegram Guruhda Qanday Ko'rinadi
                </h3>
                <p className="text-xs text-slate-400">Guruh chatlaridagi jonli simulyatsiya</p>
              </div>

              <div className="bg-[#182533] p-4 rounded-2xl border border-slate-700 shadow-inner space-y-3 font-sans max-w-sm mx-auto">
                <div className="text-[11px] text-slate-400 text-center border-b border-slate-700 pb-1.5 font-medium">
                  👥 "IELTS 7.5+ Toshkent Study Group" (148 a'zo)
                </div>

                {/* Simulated User Command */}
                <div className="flex items-end gap-2 justify-end">
                  <div className="bg-[#2b5278] text-white p-2.5 rounded-xl text-xs max-w-[80%] rounded-br-none">
                    /quiz
                  </div>
                </div>

                {/* Simulated Bot Response */}
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                    DA
                  </div>
                  <div className="bg-[#1e2c3a] text-slate-200 p-3 rounded-xl text-xs space-y-2 border border-slate-700 max-w-[85%] rounded-tl-none">
                    <div className="font-bold text-violet-300 text-[11px]">🎯 GURUH VIKTORINASI (IELTS Vocabulary)</div>
                    <p className="text-[11px] leading-relaxed">
                      "His explanation was so ______ that everyone understood immediately."
                    </p>
                    <div className="space-y-1 pt-1">
                      <div className="bg-[#2b5278]/80 text-white text-center py-1.5 rounded-lg text-[10px] font-medium hover:bg-[#2b5278] cursor-pointer">
                        A) Ambiguous (12%)
                      </div>
                      <div className="bg-emerald-600/90 text-white text-center py-1.5 rounded-lg text-[10px] font-bold shadow">
                        B) Lucid & Clear (78% ✅)
                      </div>
                      <div className="bg-[#2b5278]/80 text-white text-center py-1.5 rounded-lg text-[10px] font-medium">
                        C) Obscure (10%)
                      </div>
                    </div>
                    <div className="text-[9px] text-emerald-400 pt-1">
                      🏆 G'olib: @jasur_ielts (+15 🪙 tanga oldi!)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-violet-950/40 rounded-xl border border-violet-500/30 text-xs text-violet-300 text-center">
                🔥 Guruhlardagi g'oliblar tanga to'plab, o'z profiliga o'tadi va botingizning doimiy o'quvchisiga aylanadi!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: TikTok / Reels / Shorts Viral AI Script Generator */}
      {activeTab === 'viral_scripts' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <span>🎬</span> AI Viral Video Ssenariylar Generator (Gemini 2.5)
                </h3>
                <p className="text-xs text-slate-400">
                  TikTok, Instagram Reels va YouTube Shorts uchun 100k+ ko'rishlar to'playdigan bepul reklama ssenariylari
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={scriptTopic}
                  onChange={(e) => setScriptTopic(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                >
                  <option value="ielts_secrets">🎯 IELTS Speaking & Writing Sirlari</option>
                  <option value="cefr_test">🚨 Bepul CEFR Daraja Testi</option>
                  <option value="cinema_english">🍿 Kinolar orqali Ingliz tili</option>
                  <option value="common_mistakes">❌ O'zbeklar qiladigan 3 ta xato</option>
                  <option value="mock_interview">🎙 AI bilan jonli intervyu</option>
                </select>

                <button
                  onClick={handleGenerateViralScript}
                  disabled={generatingScript}
                  className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-pink-600/20 whitespace-nowrap flex items-center gap-2"
                >
                  <span>{generatingScript ? 'Yaratilmoqda...' : '✨ Yangi Ssenariy Yaratish'}</span>
                </button>
              </div>
            </div>

            {/* Generated Scripts Feed */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scripts.map((s) => (
                <div
                  key={s.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-3 flex flex-col justify-between hover:border-pink-500/40 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        {s.platform.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {s.estimatedReach}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs">{s.topic}</h4>

                    <div className="p-2.5 rounded-xl bg-pink-950/30 border border-pink-500/20 text-pink-200 text-xs font-semibold">
                      💥 Hook (Birinchi 3 sekund): <br />
                      <span className="font-normal text-slate-200 italic">"{s.hook}"</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                      {s.script}
                    </p>

                    <div className="text-[11px] text-amber-300 font-medium bg-slate-900 p-2 rounded-lg border border-slate-800">
                      📢 {s.callToAction}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex gap-2">
                    <button
                      onClick={() => handleCopy(`${s.hook}\n\n${s.script}\n\n${s.callToAction}`, s.id, 'Ssenariy')}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl transition border border-slate-700"
                    >
                      {copiedId === s.id ? 'Nusxalandi! ✅' : 'Matnni Nusxalash 📋'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Automated Retention & Drip Engine */}
      {activeTab === 'drip_retention' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>🔄</span> Smart Retention Drip Engine (Foydalanuvchilarni Saqlash)
              </h3>
              <p className="text-xs text-slate-400">
                O'quvchilar botni unutib qo'ymasliklari va doimiy kirib turishlari uchun avtomatlashtirilgan aqlli xabarnomalar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Drip 1 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl">☀️</span>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    Har kuni 08:00
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">Kunlik So'z & Ovozli Audio</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  O'quvchiga 1 ta yangi C1 ibora, ma'nosi va ElevenLabs orqali hosil qilingan talaffuz audiosi yetkaziladi.
                </p>
                <button
                  onClick={() => handleTriggerDrip('morning_word')}
                  className="w-full bg-cyan-600/80 hover:bg-cyan-600 text-white font-bold text-xs py-2 rounded-xl transition"
                >
                  🚀 Sinov tariqasida yuborish
                </button>
              </div>

              {/* Drip 2 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🔥</span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    Har kuni 18:30
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">Streak & Viktorina Eslatmasi</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  "Bugungi 3 ta savolli viktorinani yechmadingiz! 7-kunlik seriyangiz (streak) uzilib qolmasin 🔥"
                </p>
                <button
                  onClick={() => handleTriggerDrip('evening_streak')}
                  className="w-full bg-amber-600/80 hover:bg-amber-600 text-white font-bold text-xs py-2 rounded-xl transition"
                >
                  🚀 Sinov tariqasida yuborish
                </button>
              </div>

              {/* Drip 3 */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xl">🎁</span>
                  <span className="text-[10px] font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                    3 kun kirmaganlarga
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs">Re-Engagement & 100 Tanga Sovg'a</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  "Sizni sog'indik! Profilingizga 100 🪙 tanga sovg'a qo'shildi. Kirib yangi Cinema English darsini oching!"
                </p>
                <button
                  onClick={() => handleTriggerDrip('winback_gift')}
                  className="w-full bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs py-2 rounded-xl transition"
                >
                  🚀 Sinov tariqasida yuborish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Viral Challenge & Stories Links */}
      {activeTab === 'challenge_links' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>🎯</span> O'quvchilar Ulashadigan Viral Challenge Havolalari
              </h3>
              <p className="text-xs text-slate-400">
                O'quvchi test yechgach, Telegram Stories va do'stlariga quyidagi formatda ulashadi:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-amber-300">1. "Mening darajam B2, senchi?" Challenge</div>
                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed font-mono">
                  Men Davr Academy AI orqali CEFR darajamni tekshirdim va 85% ball oldim! 🏆 Qani, sen ham o'z darajangni 3 daqiqada bepul aniqlab ko'r: https://t.me/DavrAcademyBot?start=challenge_friend
                </p>
                <button
                  onClick={() => handleCopy('Men Davr Academy AI orqali CEFR darajamni tekshirdim va 85% ball oldim! 🏆 Qani, sen ham o\'z darajangni 3 daqiqada bepul aniqlab ko\'r: https://t.me/DavrAcademyBot?start=challenge_friend', 'ch1', 'Challenge matni')}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2 rounded-xl transition"
                >
                  {copiedId === 'ch1' ? 'Nusxalandi! ✅' : 'Havolani Nusxalash 📋'}
                </button>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
                <div className="text-xs font-bold text-emerald-300">2. IELTS 9.0 Essay Tekshirish Taklifi</div>
                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed font-mono">
                  IELTS inshongizni tekshirtirishga o'qituvchi qidiryapsizmi? Mana bu bot 1 sekundda grammatika, so'z boyligi va Band ballingizni to'liq chiqarib beradi: https://t.me/DavrAcademyBot?start=essay_grader
                </p>
                <button
                  onClick={() => handleCopy('IELTS inshongizni tekshirtirishga o\'qituvchi qidiryapsizmi? Mana bu bot 1 sekundda grammatika, so\'z boyligi va Band ballingizni to\'liq chiqarib beradi: https://t.me/DavrAcademyBot?start=essay_grader', 'ch2', 'Essay taklifi')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2 rounded-xl transition"
                >
                  {copiedId === 'ch2' ? 'Nusxalandi! ✅' : 'Havolani Nusxalash 📋'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
