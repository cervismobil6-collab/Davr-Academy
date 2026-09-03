import React, { useState, useEffect } from 'react';
import { GamificationProfile, DailyQuest, LeaderboardEntry } from '../types';

interface GamificationDashboardProps {
  onLogAction?: (msg: string) => void;
  onSetStatusMsg?: (msg: string) => void;
}

export const GamificationDashboard: React.FC<GamificationDashboardProps> = ({
  onLogAction,
  onSetStatusMsg,
}) => {
  const [profile, setProfile] = useState<GamificationProfile>({
    userId: 'user_admin',
    name: 'Diyorbek Ormonov',
    streak: 14,
    xp: 2850,
    coins: 680,
    rank: 1,
    level: 'Diamond Master 💎',
    badge: '🏆 Respublika Chempioni',
    completedQuests: ['q1', 'q3'],
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Diyorbek Ormonov', username: '@diyorbek_ielts', city: 'Toshkent', xp: 2850, streak: 14, coins: 680, badge: '💎 Diamond', level: 'C1 Advanced' },
    { rank: 2, name: 'Madina Karimova', username: '@madina_k', city: 'Samarqand', xp: 2640, streak: 12, coins: 520, badge: '🥇 Gold', level: 'B2 Upper' },
    { rank: 3, name: 'Azizbek Toshmatov', username: '@aziz_dev', city: 'Farg\'ona', xp: 2410, streak: 10, coins: 460, badge: '🥈 Silver', level: 'B2 Upper' },
    { rank: 4, name: 'Shahnoza Yusupova', username: '@shahnoza_ielts', city: 'Buxoro', xp: 2190, streak: 9, coins: 390, badge: '🥉 Bronze', level: 'B1 Intermediate' },
    { rank: 5, name: 'Javohir Saidov', username: '@javohir_s', city: 'Namangan', xp: 1980, streak: 8, coins: 340, badge: '🌟 Star', level: 'B1 Intermediate' },
    { rank: 6, name: 'Dilnoza Alimova', username: '@dilnoza_a', city: 'Andijon', xp: 1820, streak: 7, coins: 310, badge: '🌟 Star', level: 'A2 Elementary' },
    { rank: 7, name: 'Bobur Mirzayev', username: '@bobur_m', city: 'Qarshi', xp: 1650, streak: 6, coins: 280, badge: '🌟 Star', level: 'A2 Elementary' },
    { rank: 8, name: 'Malika Umarova', username: '@malika_u', city: 'Xorazm', xp: 1540, streak: 5, coins: 250, badge: '🌟 Star', level: 'A2 Elementary' },
  ]);

  const [quests, setQuests] = useState<DailyQuest[]>([
    { id: 'q1', title: '📖 1 ta yangi dars o\'rganish', icon: '📚', rewardXp: 50, rewardCoins: 20, progress: 1, target: 1, completed: true },
    { id: 'q2', title: '🎙 IELTS Speaking ovozli xabar yuborish', icon: '🗣', rewardXp: 100, rewardCoins: 40, progress: 0, target: 1, completed: false },
    { id: 'q3', title: '⚡️ 5 ta test savolini to\'g\'ri yechish', icon: '🎯', rewardXp: 80, rewardCoins: 30, progress: 5, target: 5, completed: true },
    { id: 'q4', title: '👥 1 ta do\'stni botga taklif qilish', icon: '🚀', rewardXp: 200, rewardCoins: 100, progress: 0, target: 1, completed: false },
  ]);

  const [shopSuccess, setShopSuccess] = useState<string>('');

  const handleClaimQuest = (questId: string) => {
    const q = quests.find(item => item.id === questId);
    if (!q) return;

    setQuests(prev => prev.map(item => item.id === questId ? { ...item, progress: item.target, completed: true } : item));
    setProfile(prev => ({
      ...prev,
      xp: prev.xp + q.rewardXp,
      coins: prev.coins + q.rewardCoins,
    }));

    if (onSetStatusMsg) onSetStatusMsg(`🎉 Mukofot olindi: +${q.rewardXp} XP va +${q.rewardCoins} Davr Coins!`);
    if (onLogAction) onLogAction(`🎮 O'yin: "${q.title}" vazifasi bajarildi (+${q.rewardXp} XP, +${q.rewardCoins} tanga).`);
  };

  const handleBuyShopItem = (itemTitle: string, coinCost: number, rewardDesc: string) => {
    if (profile.coins < coinCost) {
      if (onSetStatusMsg) onSetStatusMsg(`❌ Tangalar yetarli emas! Sizda ${profile.coins} tanga bor, kerak: ${coinCost} tanga.`);
      return;
    }

    setProfile(prev => ({ ...prev, coins: prev.coins - coinCost }));
    setShopSuccess(`✅ "${itemTitle}" muvaffaqiyatli xarid qilindi! (${rewardDesc})`);
    setTimeout(() => setShopSuccess(''), 5000);

    fetch('/api/gamification/shop-buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemTitle, coinCost, rewardDesc }),
    }).catch(() => {});

    if (onSetStatusMsg) onSetStatusMsg(`🎉 Xarid muvaffaqiyatli: ${itemTitle}!`);
    if (onLogAction) onLogAction(`🪙 Tangalar do'koni: ${itemTitle} xarid qilindi (-${coinCost} tanga).`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/50 border border-amber-500/30 p-6 rounded-2xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h2 className="text-xl font-black text-white">
              Duolingo Uslubidagi O'yinlashtirish (Gamification & Reyting)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Kunlik uzluksiz o'rganish (Daily Streak 🔥), Davr Coins 🪙, Kunlik topshiriqlar va Respublika Top 100 reytingi.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/90 border border-amber-500/40 px-4 py-2 rounded-xl text-center shadow-lg">
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Kunlik Streak</div>
            <div className="text-xl font-black text-amber-300 flex items-center justify-center gap-1">
              🔥 {profile.streak} kun
            </div>
          </div>
          <div className="bg-slate-900/90 border border-yellow-500/40 px-4 py-2 rounded-xl text-center shadow-lg">
            <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider">Davr Tangalari</div>
            <div className="text-xl font-black text-yellow-300 flex items-center justify-center gap-1">
              🪙 {profile.coins}
            </div>
          </div>
        </div>
      </div>

      {shopSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <span>🎉</span> {shopSuccess}
        </div>
      )}

      {/* Grid: Daily Quests & Coin Shop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Daily Quests */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎯</span> Bugungi Kunlik Vazifalar (Daily Quests)
            </h3>
            <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
              {quests.filter(q => q.completed).length}/{quests.length} Bajarildi
            </span>
          </div>

          <div className="space-y-3">
            {quests.map(quest => (
              <div
                key={quest.id}
                className={`p-4 rounded-xl border transition flex items-center justify-between gap-3 ${
                  quest.completed
                    ? 'bg-slate-950/60 border-emerald-900/60'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-1 bg-slate-900 rounded-lg">{quest.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{quest.title}</h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="text-indigo-400 font-semibold">+{quest.rewardXp} XP</span>
                      <span>•</span>
                      <span className="text-yellow-400 font-semibold">+{quest.rewardCoins} Coins</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-36 bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${quest.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  {quest.completed ? (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1">
                      ✅ Bajarildi
                    </span>
                  ) : (
                    <button
                      onClick={() => handleClaimQuest(quest.id)}
                      className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition shadow-md"
                    >
                      Bajarish ⚡️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Davr Coins Exchange Store */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🪙</span> Davr Tangalari Do'koni (Coin Shop)
            </h3>
            <span className="text-[11px] text-yellow-300 font-mono bg-yellow-950/60 border border-yellow-800/60 px-2.5 py-0.5 rounded-full">
              Balans: {profile.coins} 🪙
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>⭐️</span> 1 Kunlik Bepul VIP Obuna
                </div>
                <div className="text-[11px] text-slate-400">Barcha AI murabbiylar va darslarga 24 soat to'liq ruxsat.</div>
                <div className="text-[11px] text-yellow-400 font-bold font-mono">Narxi: 250 🪙</div>
              </div>
              <button
                onClick={() => handleBuyShopItem('1 Kunlik VIP Obuna', 250, '1 kun cheksiz VIP faollashtirildi')}
                className="bg-yellow-600/20 hover:bg-yellow-600 text-yellow-300 hover:text-white border border-yellow-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                Olish ⚡️
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>👑</span> 3 Kunlik VIP Super Dostup
                </div>
                <div className="text-[11px] text-slate-400">IELTS Mock Imtihonlar va ElevenLabs ovozli suhbat.</div>
                <div className="text-[11px] text-yellow-400 font-bold font-mono">Narxi: 500 🪙</div>
              </div>
              <button
                onClick={() => handleBuyShopItem('3 Kunlik VIP Dostup', 500, '3 kun to\'liq VIP obuna')}
                className="bg-yellow-600/20 hover:bg-yellow-600 text-yellow-300 hover:text-white border border-yellow-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                Olish ⚡️
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>🎙</span> IELTS Speaking Examiner Tahlili
                </div>
                <div className="text-[11px] text-slate-400">Audio yozuvni 4 ta mezon bo'yicha Band 9.0 formatida baholash.</div>
                <div className="text-[11px] text-yellow-400 font-bold font-mono">Narxi: 700 🪙</div>
              </div>
              <button
                onClick={() => handleBuyShopItem('IELTS Speaking Tahlili', 700, 'IELTS Examiner tekshiruvi')}
                className="bg-yellow-600/20 hover:bg-yellow-600 text-yellow-300 hover:text-white border border-yellow-500/40 text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                Olish ⚡️
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Republican Leaderboard (Top 10) */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🏆</span> Respublika Liderlar Jadvali (Top 100 O'quvchilar)
            </h3>
            <p className="text-xs text-slate-400">Har haftalik yangilanuvchi eng faol va yuqori balli o'quvchilar ro'yxati</p>
          </div>
          <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full font-bold">
            ● Jonli Sinxronizatsiya Faol
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3.5">O'rin</th>
                <th className="p-3.5">O'quvchi</th>
                <th className="p-3.5">Shahar / Viloyat</th>
                <th className="p-3.5">Daraja</th>
                <th className="p-3.5">Streak</th>
                <th className="p-3.5">XP Ball</th>
                <th className="p-3.5">Tangalar</th>
                <th className="p-3.5">Unvon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leaderboard.map(entry => (
                <tr
                  key={entry.rank}
                  className={`hover:bg-slate-800/40 transition ${
                    entry.rank === 1 ? 'bg-amber-950/20 font-bold' : ''
                  }`}
                >
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                        entry.rank === 1
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-slate-950'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-white flex items-center gap-2">
                    {entry.name}
                    <span className="text-[10px] text-slate-500 font-mono font-normal">({entry.username})</span>
                  </td>
                  <td className="p-3.5 text-slate-400">{entry.city}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800/60 px-2 py-0.5 rounded">
                      {entry.level}
                    </span>
                  </td>
                  <td className="p-3.5 text-amber-400 font-bold">🔥 {entry.streak} kun</td>
                  <td className="p-3.5 font-mono text-emerald-400 font-bold">{entry.xp.toLocaleString()} XP</td>
                  <td className="p-3.5 font-mono text-yellow-400 font-bold">🪙 {entry.coins}</td>
                  <td className="p-3.5 text-indigo-300">{entry.badge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
