import React, { useState } from 'react';
import { safeFetchJson } from '../utils/safeFetch';

interface CrmStudent {
  id: string;
  chatId: string;
  name: string;
  username: string;
  level: string;
  targetIelts: number;
  streakDays: number;
  coins: number;
  isVip: boolean;
  joinedDate: string;
  lastActive: string;
  paymentTotal: number;
  status: 'active' | 'trial' | 'vip_paid' | 'churned';
}

const INITIAL_STUDENTS: CrmStudent[] = [
  {
    id: 'std_1',
    chatId: '124982103',
    name: 'Diyorbek Ormonov',
    username: '@diyor_dev',
    level: 'C1 Advanced',
    targetIelts: 8.5,
    streakDays: 42,
    coins: 1450,
    isVip: true,
    joinedDate: '2026-07-15',
    lastActive: 'Hozirgina',
    paymentTotal: 289000,
    status: 'vip_paid',
  },
  {
    id: 'std_2',
    chatId: '98421094',
    name: 'Shahzod Aliyev',
    username: '@shahzod_ielts',
    level: 'B2 Upper',
    targetIelts: 7.5,
    streakDays: 19,
    coins: 680,
    isVip: true,
    joinedDate: '2026-08-02',
    lastActive: '5 daqiqa oldin',
    paymentTotal: 149000,
    status: 'vip_paid',
  },
  {
    id: 'std_3',
    chatId: '43920194',
    name: 'Madina Karimova',
    username: '@madina_k',
    level: 'B1 Intermediate',
    targetIelts: 7.0,
    streakDays: 8,
    coins: 320,
    isVip: false,
    joinedDate: '2026-08-18',
    lastActive: '1 soat oldin',
    paymentTotal: 0,
    status: 'trial',
  },
  {
    id: 'std_4',
    chatId: '87612309',
    name: 'Javohir Rustamov',
    username: '@java_rustam',
    level: 'A2 Elementary',
    targetIelts: 6.5,
    streakDays: 3,
    coins: 150,
    isVip: false,
    joinedDate: '2026-08-25',
    lastActive: 'Kecha',
    paymentTotal: 0,
    status: 'trial',
  },
  {
    id: 'std_5',
    chatId: '54129841',
    name: 'Nilufar Rahimova',
    username: '@nilu_eng',
    level: 'C1 Advanced',
    targetIelts: 8.0,
    streakDays: 31,
    coins: 1200,
    isVip: true,
    joinedDate: '2026-07-28',
    lastActive: 'Bugun',
    paymentTotal: 289000,
    status: 'vip_paid',
  }
];

export const SuperAdminCrm: React.FC = () => {
  const [students, setStudents] = useState<CrmStudent[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<CrmStudent | null>(null);
  const [directMsg, setDirectMsg] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [statusNotification, setStatusNotification] = useState('');

  const totalRevenue = students.reduce((acc, curr) => acc + curr.paymentTotal, 0);
  const vipCount = students.filter((s) => s.isVip).length;
  const avgCoins = Math.round(students.reduce((acc, curr) => acc + curr.coins, 0) / (students.length || 1));

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.chatId.includes(searchTerm);
    const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSendDirectMessage = async () => {
    if (!selectedStudent || !directMsg.trim()) return;
    setSendingMsg(true);
    try {
      await safeFetchJson('/api/bot/send-direct-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: selectedStudent.chatId,
          text: directMsg,
        }),
      });
      setStatusNotification(`✅ Xabar muvaffaqiyatli yuborildi: ${selectedStudent.name}`);
      setDirectMsg('');
      setTimeout(() => setStatusNotification(''), 4000);
    } catch (e: any) {
      setStatusNotification(`⚠️ Xabar yuborishda xatolik: ${e.message}`);
    } finally {
      setSendingMsg(false);
    }
  };

  const handleToggleVip = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const nextVip = !s.isVip;
          return {
            ...s,
            isVip: nextVip,
            status: nextVip ? 'vip_paid' : 'trial',
            paymentTotal: nextVip ? s.paymentTotal + 149000 : s.paymentTotal,
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top CRM Stats KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Jami O'quvchilar</div>
            <div className="text-2xl font-black text-white mt-1">1,840 nafar</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">▲ +18.4% ushbu haftada</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-2xl">
            👥
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">VIP Obunachilar</div>
            <div className="text-2xl font-black text-amber-400 mt-1">{vipCount + 142} ta</div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">Click & Payme orqali</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-2xl">
            👑
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Jami Daromad (Revenue)</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {(totalRevenue + 12450000).toLocaleString()} UZS
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Avtomatik shlyuzlar orqali</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-2xl">
            💳
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">O'rtacha Tanga Balansi</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{avgCoins} 🪙</div>
            <div className="text-[11px] text-purple-300 mt-0.5">Gamification faolligi 87%</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-2xl">
            🏆
          </div>
        </div>
      </div>

      {statusNotification && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Main CRM Table & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>📊</span> Telegram O'quvchilar Boshqaruv Bazasi (CRM)
            </h3>
            <p className="text-xs text-slate-400">
              O'quvchilar profili, IELTS darajasi, to'lovlar va to'g'ridan-to'g'ri xabar yuborish.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Ism, @username yoki Chat ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none w-full sm:w-64"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="ALL">Barchasi</option>
              <option value="vip_paid">👑 VIP To'langan</option>
              <option value="trial">⏳ Sinov Muddati</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">O'quvchi</th>
                <th className="py-3 px-4">Chat ID</th>
                <th className="py-3 px-4">Daraja / Maqsad</th>
                <th className="py-3 px-4">Streak & Tangalar</th>
                <th className="py-3 px-4">Holat / VIP</th>
                <th className="py-3 px-4">To'lov</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-850/50 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{std.name}</div>
                    <div className="text-[11px] text-indigo-400 font-mono">{std.username}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{std.chatId}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-semibold text-[10px]">
                      {std.level}
                    </span>
                    <span className="ml-1.5 text-amber-400 font-bold">🎯 {std.targetIelts}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-orange-400 font-bold">🔥 {std.streakDays} kun</span>
                    <span className="ml-2 text-purple-400">🪙 {std.coins}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleVip(std.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                        std.isVip
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {std.isVip ? '👑 VIP FAOL' : '⏳ Bepul Sinov'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {std.paymentTotal.toLocaleString()} UZS
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudent(std);
                        setDirectMsg(`Assalomu alaykum, ${std.name}! Davr Academy IELTS dasturingiz bo'yicha maxsus tavsiyalar...`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition shadow-md"
                    >
                      ✉️ Xabar Yozish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Messaging Modal / Drawer */}
      {selectedStudent && (
        <div className="bg-slate-900 border border-indigo-500/50 p-6 rounded-2xl space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span>✉️</span> To'g'ridan-to'g'ri Telegram Xabari Yuborish →{' '}
              <strong className="text-indigo-400">{selectedStudent.name}</strong> ({selectedStudent.chatId})
            </h4>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded-lg"
            >
              ✕ Yopish
            </button>
          </div>

          <textarea
            value={directMsg}
            onChange={(e) => setDirectMsg(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
            placeholder="O'quvchining Telegramiga yuboriladigan shaxsiy xabarni yozing..."
          />

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setSelectedStudent(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Bekor qilish
            </button>
            <button
              onClick={handleSendDirectMessage}
              disabled={sendingMsg || !directMsg.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg transition disabled:opacity-50"
            >
              {sendingMsg ? 'Yuborilmoqda...' : '🚀 Xabarni Yuborish'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
