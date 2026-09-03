import React, { useState } from 'react';

export const TelegramMiniAppPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'speaking' | 'gift' | 'wheel' | 'calculator'>('home');
  const [targetIelts, setTargetIelts] = useState<number>(7.5);
  const [currentLevel, setCurrentLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1'>('B1');
  const [dailyStudyMinutes, setDailyStudyMinutes] = useState<number>(30);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [chestOpened, setChestOpened] = useState(false);
  const [chestPrize, setChestPrize] = useState<{ title: string; desc: string; icon: string } | null>(null);
  const [liveRecording, setLiveRecording] = useState(false);
  const [speakingScore, setSpeakingScore] = useState<{ fluency: number; vocab: number; grammar: number; band: number } | null>(null);

  // Estimate weeks needed to target IELTS
  const levelToScore: Record<string, number> = { A1: 3.0, A2: 4.0, B1: 5.0, B2: 6.5, C1: 7.5 };
  const currentScore = levelToScore[currentLevel] || 5.0;
  const gap = Math.max(0, targetIelts - currentScore);
  const estimatedWeeks = Math.ceil((gap * 12) / (dailyStudyMinutes / 30));

  const handleOpenChest = () => {
    if (chestOpened) return;
    const prizes = [
      { title: "👑 3 Kunlik VIP Super Dostup", desc: "Barcha AI murabbiylar va IELTS kurslariga to'liq ruxsat!", icon: "👑" },
      { title: "💰 +250 Oltin Davr Tangasi", desc: "Tangalar do'konida darslarga almashtiring!", icon: "🪙" },
      { title: "🎙 IELTS Band 9 Speaking Examiner Tekshiruvi", desc: "Ovozli nutqingizni xalqaro mezon bo'yicha tahlil qiling!", icon: "🎙" },
      { title: "🔥 +500 XP Rekord O'sish", desc: "Respublika liderlar jadvalida yuqoriga ko'tarildingiz!", icon: "⚡️" }
    ];
    const won = prizes[Math.floor(Math.random() * prizes.length)];
    setChestPrize(won);
    setChestOpened(true);
  };

  const handleSpinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);
    setTimeout(() => {
      const items = [
        "👑 7 Kunlik Oltin VIP Obuna",
        "💰 1,000 Oltin Davr Tangasi (JACKPOT!)",
        "📚 IELTS 8.5 Secret Vocabulary Bible",
        "🎙 Band 9.0 Mock Speaking Chiptasi",
        "💎 1 Oylik VIP Super Dostup",
        "🔥 +500 XP & 100 Davr Tangasi"
      ];
      const selected = items[Math.floor(Math.random() * items.length)];
      setSpinResult(selected);
      setIsSpinning(false);
    }, 2000);
  };

  const handleSimulateSpeaking = () => {
    setLiveRecording(true);
    setSpeakingScore(null);
    setTimeout(() => {
      setLiveRecording(false);
      setSpeakingScore({
        fluency: 8.5,
        vocab: 8.0,
        grammar: 8.5,
        band: 8.5,
      });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Hero 3D Card Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Telegram Web App & Mini App 3D Portal v3.0
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ingliz Tili & IELTS ni <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">AI Bilan 3x Tezroq</span> O'rganing
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Telegram ichida to'liq interaktiv dastur: AI Speaking klubi, Band 9.0 insho tahlili, jonli aksentlar va har kuni bepul sovg'alar sandig'i!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
            <a
              href="https://t.me/engilishpromax_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-400 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 text-center transition flex items-center justify-center gap-2"
            >
              <span>📱</span> Telegram Botda Ochish
            </a>
            <div className="text-center text-xs text-slate-400">
              ⚡️ @engilishpromax_bot (24/7 Faol)
            </div>
          </div>
        </div>

        {/* Portal Mini-Nav */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'home', label: '🏠 Bosh Sahifa', icon: '✨' },
            { id: 'speaking', label: '🎙 Live AI Speaking', icon: '🎧' },
            { id: 'gift', label: "🎁 Sovg'alar Sandig'i", icon: '📦' },
            { id: 'wheel', label: '🎡 Omad Charxpalagi', icon: '🎰' },
            { id: 'calculator', label: '🎯 IELTS Vaqt Kalkulyatori', icon: '⏱' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
                activeTab === item.id
                  ? 'bg-white text-slate-950 shadow-lg shadow-white/10'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Home Showcase */}
      {activeTab === 'home' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl">
              🎙
            </div>
            <h3 className="text-lg font-bold text-white">Live AI Voice Tutor</h3>
            <p className="text-xs text-slate-400">
              Britaniya, Amerika va Avstraliya aksentlarida istalgan mavzuda real vaqtda ovozli suhbatlashing.
            </p>
            <div className="pt-2 text-xs font-semibold text-indigo-400 flex items-center gap-1">
              Band 9.0 Talaffuz Baholash →
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl">
              ✍️
            </div>
            <h3 className="text-lg font-bold text-white">IELTS Task 1 & 2 Examiner</h3>
            <p className="text-xs text-slate-400">
              Inshongizni yuboring va 5 soniyada Grammatika, Lug'at, Cohesion va Task Achievement bo'yicha to'liq taqriz oling.
            </p>
            <div className="pt-2 text-xs font-semibold text-purple-400 flex items-center gap-1">
              Rasmiy IELTS Mezonlari →
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-2xl">
              🎁
            </div>
            <h3 className="text-lg font-bold text-white">Gamification & Sovg'alar</h3>
            <p className="text-xs text-slate-400">
              Har kuni streak qiling, test ishlang, tangalar yig'ing va bepul VIP kurslar va xalqaro sertifikatlarga ega bo'ling.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-400 flex items-center gap-1">
              Top 100 Respublika Reytingi →
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Live AI Speaking Simulator */}
      {activeTab === 'speaking' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎙</span> Live AI Speaking Audio Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Mikrofon orqali gapiring va AI Examiner nutqingizni tekshirib ball qo'yib beradi.
              </p>
            </div>
            <button
              onClick={handleSimulateSpeaking}
              disabled={liveRecording}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                liveRecording
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
              }`}
            >
              {liveRecording ? '🔴 Ovoz Yozilmoqda...' : '🎙 Gapirishni Boshlash (Test)'}
            </button>
          </div>

          {liveRecording && (
            <div className="p-8 rounded-2xl bg-slate-950 border border-rose-500/40 flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex items-center gap-1.5 h-12">
                {[40, 70, 90, 60, 100, 45, 80, 60, 95, 50, 75].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1.5 bg-gradient-to-t from-rose-500 to-pink-400 rounded-full animate-bounce"
                  />
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-200">
                "Describe your hometown and what makes it special to you..."
              </p>
              <span className="text-xs text-rose-400">AI nutqingizni tinglamoqda...</span>
            </div>
          )}

          {speakingScore && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">🎉 IELTS Speaking Natijasi:</h4>
                  <p className="text-xs text-slate-400">Examiner AI tahlili yakunlandi</p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xl">
                  Band {speakingScore.band}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl text-center">
                  <div className="text-xs text-slate-400">Fluency & Coherence</div>
                  <div className="text-base font-bold text-indigo-400">{speakingScore.fluency}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-center">
                  <div className="text-xs text-slate-400">Lexical Resource</div>
                  <div className="text-base font-bold text-purple-400">{speakingScore.vocab}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-center">
                  <div className="text-xs text-slate-400">Grammar & Accuracy</div>
                  <div className="text-base font-bold text-emerald-400">{speakingScore.grammar}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Gift Chest */}
      {activeTab === 'gift' && (
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">🎁 Omadli Sovg'alar Sandig'i</h3>
            <p className="text-xs text-slate-400">
              Har 12 soatda bir marotaba sandiqni ochib qimmatbaho VIP bonuslarni qabul qiling!
            </p>
          </div>

          <div className="py-8">
            {!chestOpened ? (
              <div
                onClick={handleOpenChest}
                className="w-40 h-40 mx-auto rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex flex-col items-center justify-center text-6xl shadow-2xl shadow-amber-500/30 cursor-pointer hover:scale-105 transition transform active:scale-95 border-4 border-amber-300"
              >
                <span>📦</span>
                <span className="text-xs font-black text-white mt-2 uppercase tracking-wider">Ochish uchun bosing</span>
              </div>
            ) : (
              <div className="max-w-md mx-auto p-6 rounded-3xl bg-gradient-to-br from-emerald-950 to-slate-950 border border-emerald-500/40 space-y-3 animate-fade-in">
                <div className="text-5xl">{chestPrize?.icon}</div>
                <h4 className="text-lg font-black text-emerald-300">{chestPrize?.title}</h4>
                <p className="text-xs text-slate-300">{chestPrize?.desc}</p>
                <div className="pt-2 text-xs font-bold text-emerald-400">
                  ✅ Yutuq profilingizga qo'shildi!
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Fortune Wheel */}
      {activeTab === 'wheel' && (
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl text-center space-y-6">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-bold text-white">🎡 Omad Charxpalagi (Lucky Spin)</h3>
            <p className="text-xs text-slate-400">
              Omadingizni sinab ko'ring va 1,000 tagacha tanga va 7 kunlik VIP yutib oling!
            </p>
          </div>

          <div className="py-6 flex flex-col items-center justify-center gap-6">
            <div className={`w-48 h-48 rounded-full border-8 border-indigo-500/60 bg-gradient-to-tr from-purple-900 via-indigo-900 to-pink-900 flex items-center justify-center text-4xl shadow-2xl shadow-purple-500/20 ${isSpinning ? 'animate-spin' : ''}`}>
              🎰
            </div>

            <button
              onClick={handleSpinWheel}
              disabled={isSpinning}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-white font-black text-sm shadow-xl shadow-amber-500/30 transition transform active:scale-95 disabled:opacity-50"
            >
              {isSpinning ? '🎡 Charxpalak Aylanmoqda...' : '🎰 Aylantirish (Spin)'}
            </button>

            {spinResult && (
              <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-200 text-xs font-bold max-w-sm">
                🎉 Sizning yutug'ingiz: <span className="text-amber-300 font-extrabold">{spinResult}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: IELTS Time Calculator */}
      {activeTab === 'calculator' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🎯</span> IELTS Maqsadli Ball Vaqt Kalkulyatori
            </h3>
            <p className="text-xs text-slate-400">
              Hozirgi darajangiz va kunlik mashg'ulot vaqtingiz asosida kerakli IELTS balliga qancha vaqtda erishishingizni hisoblang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Joriy Darajangiz:</label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                <option value="A1">A1 — Beginner (3.0)</option>
                <option value="A2">A2 — Elementary (4.0)</option>
                <option value="B1">B1 — Intermediate (5.0)</option>
                <option value="B2">B2 — Upper-Intermediate (6.5)</option>
                <option value="C1">C1 — Advanced (7.5)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Maqsadli IELTS Ball:</label>
              <select
                value={targetIelts}
                onChange={(e) => setTargetIelts(parseFloat(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                <option value="6.0">IELTS 6.0</option>
                <option value="6.5">IELTS 6.5</option>
                <option value="7.0">IELTS 7.0</option>
                <option value="7.5">IELTS 7.5</option>
                <option value="8.0">IELTS 8.0</option>
                <option value="8.5">IELTS 8.5</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Kunlik AI Mashq Vaqti:</label>
              <select
                value={dailyStudyMinutes}
                onChange={(e) => setDailyStudyMinutes(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              >
                <option value="15">15 daqiqa / kun (Yengil rejim)</option>
                <option value="30">30 daqiqa / kun (Standart rejim)</option>
                <option value="60">60 daqiqa / kun (Intensiv rejim)</option>
                <option value="120">120 daqiqa / kun (Super Pro rejim)</option>
              </select>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">AI Taxminiy Muddat:</div>
              <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                Taxminan <span className="text-amber-400">{estimatedWeeks} hafta</span> ({Math.ceil(estimatedWeeks / 4)} oy)
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Davr Academy AI darslari va kundalik speaking trenirovkasi bilan uzluksiz shug'ullanilganda.
              </p>
            </div>

            <a
              href="https://t.me/engilishpromax_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition whitespace-nowrap"
            >
              🚀 Botda Dasturni Boshlash
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
