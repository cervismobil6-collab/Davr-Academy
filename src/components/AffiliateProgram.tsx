import React, { useState } from 'react';
import { Users, DollarSign, Gift, Share2, Copy, CheckCircle, TrendingUp, Wallet, ArrowUpRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface ReferralUser {
  name: string;
  telegramHandle: string;
  joinedDate: string;
  status: 'active' | 'purchased_vip' | 'completed_test';
  earnedUzs: number;
}

export const AffiliateProgram: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500000');
  const [cardHolder, setCardHolder] = useState('8600 4912 3810 9412');
  const [withdrawStatus, setWithdrawStatus] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const myReferralLink = 'https://t.me/engilishpromax_bot?start=ref_jasur_vip';
  const minWithdrawUzs = 500000;
  const currentBalance = 85000;
  const totalEarned = 185000;
  const totalInvited = 24;
  const vipConversions = 6;

  const remainingToWithdraw = Math.max(0, minWithdrawUzs - currentBalance);
  const progressPercent = Math.min(100, Math.round((currentBalance / minWithdrawUzs) * 100));

  const referralUsers: ReferralUser[] = [
    { name: 'Diyorbek Ormonov', telegramHandle: '@diyor_ielts', joinedDate: 'Bugun, 18:20', status: 'purchased_vip', earnedUzs: 37250 },
    { name: 'Madina Karimova', telegramHandle: '@madina_k', joinedDate: 'Kecha, 21:10', status: 'purchased_vip', earnedUzs: 24750 },
    { name: 'Azizbek Toshmatov', telegramHandle: '@aziz_dev', joinedDate: '26-avgust', status: 'completed_test', earnedUzs: 5000 },
    { name: 'Shaxnoza Umarova', telegramHandle: '@shaxnoza_u', joinedDate: '25-avgust', status: 'purchased_vip', earnedUzs: 62250 },
    { name: 'Bobur Mirzayev', telegramHandle: '@bobur_m', joinedDate: '24-avgust', status: 'completed_test', earnedUzs: 5000 },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(myReferralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(withdrawAmount, 10) || 0;
    if (currentBalance < minWithdrawUzs || amt < minWithdrawUzs) {
      setWithdrawError(`Minimal pul yechib olish summasi 500,000 SO'M! Sizning balansingiz: ${currentBalance.toLocaleString()} UZS. Yana ${remainingToWithdraw.toLocaleString()} UZS to'plashingiz kerak.`);
      setWithdrawStatus(null);
      return;
    }
    setWithdrawError(null);
    setWithdrawStatus("✅ So'rov qabul qilindi! Mablag' 1-5 daqiqa ichida Uzcard/Humo kartangizga o'tkaziladi.");
    setTimeout(() => setWithdrawStatus(null), 7000);
  };

  return (
    <div id="affiliate-program-root" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/40">
              <Gift className="w-3.5 h-3.5" /> 5,000 SO'M & 25% VIP Referal Dasturi
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              👥 Davr Academy Rasmiy Pul Ishlash Tizimi
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              Do'stlaringizni botga taklif qiling. Har bir birinchi marta start bosgan yangi o'quvchi uchun <strong className="text-amber-400 font-bold">5,000 SO'M</strong> oling! Balansingiz 500,000 so'mga yetganda mablag' Uzcard yoki Humo kartangizga 1 daqiqada tushadi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl shadow-lg transition flex items-center gap-2 text-xs uppercase tracking-wider"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Nusxa Olindi!" : "Referal Havolamni Olish"}
            </button>
          </div>
        </div>
      </div>

      {/* Progress to 500,000 UZS Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Minimal Pul Yechish Progressi (500,000 UZS)</span>
          </div>
          <span className="text-xs font-bold text-amber-400">
            {currentBalance.toLocaleString()} UZS / 500,000 UZS ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-3.5 border border-slate-800 p-0.5">
          <div
            className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Boshlang'ich: 0 UZS</span>
          <span>Yechib olish uchun yana: <strong className="text-amber-400 font-bold">{remainingToWithdraw.toLocaleString()} UZS</strong> kerak</span>
          <span>Kafolatlangan: 500,000 UZS</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Mavjud Qoldiq</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            {currentBalance.toLocaleString()} <span className="text-xs font-semibold text-slate-400">UZS</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Minimal yechish: 500,000 UZS
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Jami Ishlangan Daromad</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            {totalEarned.toLocaleString()} <span className="text-xs font-semibold text-slate-400">UZS</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">24 ta taklif qilingan do'stlardan</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Taklif Qilinganlar</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">
            {totalInvited} <span className="text-xs font-semibold text-slate-400">o'quvchi</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">+6 nafari bugun qo'shildi</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>VIP Obuna Xaridlari</span>
            <Gift className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 mt-2">
            {vipConversions} <span className="text-xs font-semibold text-slate-400">ta VIP</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Konversiya ko'rsatkichi: 25.0%</div>
        </div>
      </div>

      {/* Main Content: Referral Link & Payout form & User table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Referral Link Card & Card Payout */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" /> Shaxsiy Referal Havolangiz
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ushbu havolani Telegram guruhlarga yoki do'stlaringizga yuboring. Ular birinchi marta start bosganda hisobingizga avtomatik pul qo'shiladi:
            </p>
            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <input
                type="text"
                readOnly
                value={myReferralLink}
                className="bg-transparent text-xs text-amber-300 font-mono flex-1 focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-500/20 rounded-xl text-xs text-slate-300 space-y-1.5">
              <div className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Hisoblash Qoidalari & Kafolat
              </div>
              <div>• <strong>Faqat 1-marta start bosgan yangi foydalanuvchilar</strong> uchun hisoblanadi (anti-cheat).</div>
              <div>• Dastlabki 1-10 ta yangi do'st uchun: <strong className="text-white">har biri uchun +5,000 UZS</strong></div>
              <div>• 10 tadan keyin: <strong className="text-white">2 ta yangi do'stga 1 tasi hisoblanadi</strong> (+2,500 UZS / do'st)</div>
              <div>• Minimal yechib olish miqdori: <strong className="text-amber-400">500,000 UZS</strong></div>
            </div>
          </div>

          {/* Withdraw Request Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" /> Pulni Kartaga Yechib Olish
            </h3>
            {withdrawError && (
              <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs rounded-xl font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{withdrawError}</span>
              </div>
            )}
            {withdrawStatus && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs rounded-xl font-medium">
                {withdrawStatus}
              </div>
            )}
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Uzcard / Humo Karta Raqami:</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Yechiladigan summa (Minimal: 500,000 UZS):</label>
                <input
                  type="number"
                  min="500000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" /> Kartaga O'tkazishni So'rash (500,000 UZS)
              </button>
            </form>
          </div>
        </div>

        {/* Right: Invited Students Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>👥 So'nggi Taklif Qilingan O'quvchilar</span>
              <span className="text-xs text-slate-400 font-normal">Jami: 24 nafar</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">O'quvchi</th>
                    <th className="pb-3 font-semibold">Sana</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Daromadingiz</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {referralUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition">
                      <td className="py-3">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.telegramHandle}</div>
                      </td>
                      <td className="py-3 text-slate-400">{u.joinedDate}</td>
                      <td className="py-3">
                        {u.status === 'purchased_vip' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            👑 VIP Xarid
                          </span>
                        )}
                        {u.status === 'completed_test' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                            🎯 1-Marta Qo'shildi
                          </span>
                        )}
                        {u.status === 'active' && (
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                            ⏳ Boshladi
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right font-black text-amber-400">
                        {u.earnedUzs > 0 ? `+${u.earnedUzs.toLocaleString()} UZS` : '0 UZS'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
