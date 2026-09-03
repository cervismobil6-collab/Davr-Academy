import React, { useState } from 'react';
import { SAAS_TIERS, COMMERCIAL_OFFER_TEXT } from '../data/saasPitchData';
import { SaaSPackageTier } from '../types';
import { safeFetchJson } from '../utils/safeFetch';

interface SaaSPitchProps {
  onLogAction?: (msg: string) => void;
  onSetStatusMsg?: (msg: string) => void;
}

export const SaaSPitchCenter: React.FC<SaaSPitchProps> = ({ onLogAction, onSetStatusMsg }) => {
  const [selectedTier, setSelectedTier] = useState<SaaSPackageTier>(SAAS_TIERS[1]);
  const [clientAcademyName, setClientAcademyName] = useState('Registon O\'quv Markazi');
  const [directorName, setDirectorName] = useState('Akmal Karimov');
  const [studentCount, setStudentCount] = useState<number>(450);
  const [chargePerStudent, setChargePerStudent] = useState<number>(35000);
  const [activeTab, setActiveTab] = useState<'tiers' | 'roi' | 'proposal' | 'whitelabel_demo'>('tiers');
  const [copiedProposal, setCopiedProposal] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Financial Calculations
  const grossMonthlyRevenue = studentCount * chargePerStudent;
  const platformCost = selectedTier.monthlyFeeUz;
  const netMonthlyProfit = grossMonthlyRevenue - platformCost;
  const yearlyProfit = netMonthlyProfit * 12;

  const handleCopyProposal = () => {
    const personalizedText = COMMERCIAL_OFFER_TEXT
      .replace("Hurmatli Ta'lim Markazi Rahbari!", `Hurmatli ${directorName} (${clientAcademyName} Rahbari)!`)
      .replace("500 nafar o'quvchi", `${studentCount} nafar o'quvchi`)
      .replace("25,000 so'm", `${chargePerStudent.toLocaleString()} so'm`);

    navigator.clipboard.writeText(personalizedText);
    setCopiedProposal(true);
    if (onLogAction) onLogAction(`💼 Tijoriy taklif nusxalandi: "${clientAcademyName}" uchun`);
    if (onSetStatusMsg) onSetStatusMsg(`✅ "${clientAcademyName}" uchun moslashtirilgan tijoriy taklif nusxalandi!`);
    setTimeout(() => setCopiedProposal(false), 3000);
  };

  const handleSendOfferByTelegram = async () => {
    try {
      const data = await safeFetchJson('/api/saas/send-offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academyName: clientAcademyName,
          directorName,
          tierId: selectedTier.id,
          studentCount,
        }),
      });
      if (data && data.success) {
        if (onSetStatusMsg) onSetStatusMsg('🚀 Tijoriy taklif Telegram kanal va adminlarga yuborildi!');
      }
    } catch (e: any) {
      if (onSetStatusMsg) onSetStatusMsg('⚠️ Taklif yuborildi!');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-8 border border-blue-800/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
            💼 B2B EdTech Platform & SaaS Solutions
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            O'quv Markazlar va Maktablarga Sotish Markazi
          </h2>
          <p className="text-sm text-blue-200/90 leading-relaxed">
            Tayyor IELTS AI Examiner, Cinema English, Telegram Bot va Web App tizimini istalgan ta'lim muassasasiga ularning o'z logotipi bilan (White-Label) o'rnatib bering va har oylik passiv obuna daromadiga ega bo'ling.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTab('tiers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'tiers'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🏷️ Tariflar & Paketlar
        </button>
        <button
          onClick={() => setActiveTab('roi')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'roi'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          💰 ROI & Foyda Kalkulyatori
        </button>
        <button
          onClick={() => setActiveTab('proposal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'proposal'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          📄 Tijoriy Taklif (Commercial Deck)
        </button>
        <button
          onClick={() => setActiveTab('whitelabel_demo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'whitelabel_demo'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🎨 White-Label Brend Sinovi
        </button>
      </div>

      {/* Tab 1: Pricing Tiers */}
      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {SAAS_TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                selectedTier.id === tier.id
                  ? 'bg-slate-900/90 border-blue-500 shadow-2xl ring-2 ring-blue-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {tier.id === 'pro_academy' && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
                  Tavsiya etiladi
                </div>
              )}

              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                  {tier.badge}
                </span>
                <h3 className="text-xl font-black text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400">{tier.targetAudience}</p>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-2xl font-black text-emerald-400">
                    {(tier.monthlyFeeUz).toLocaleString()} UZS
                    <span className="text-xs text-slate-400 font-normal"> / oy</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Bir martalik sozlash: {(tier.setupFeeUz).toLocaleString()} UZS
                  </div>
                </div>

                <ul className="space-y-2 pt-3">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(tier);
                    setOrderModalOpen(true);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-black transition ${
                    selectedTier.id === tier.id
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  🚀 Ushbu Tarifni Tanlash / Sotish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: ROI Calculator */}
      {activeTab === 'roi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🧮</span>
              <span>O'quv Markaz Parametrlari</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  O'quvchilar soni: <span className="text-blue-400">{studentCount} nafar</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Har bir o'quvchidan AI uchun oylik to'lov: <span className="text-emerald-400">{chargePerStudent.toLocaleString()} UZS</span>
                </label>
                <input
                  type="range"
                  min="15000"
                  max="100000"
                  step="5000"
                  value={chargePerStudent}
                  onChange={(e) => setChargePerStudent(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Tanlangan SaaS Paketi:
                </label>
                <select
                  value={selectedTier.id}
                  onChange={(e) => {
                    const t = SAAS_TIERS.find((item) => item.id === e.target.value);
                    if (t) setSelectedTier(t);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  {SAAS_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name} ({tier.monthlyFeeUz.toLocaleString()} UZS/oy)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-black text-white">📈 Prognoz Qilingan Daromad va Foyda</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Jami Oylik Tushum</span>
                <div className="text-2xl font-black text-blue-400 mt-1">
                  {grossMonthlyRevenue.toLocaleString()} UZS
                </div>
                <span className="text-[10px] text-slate-500">O'quvchilar obunasidan</span>
              </div>

              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Platforma Xarajati</span>
                <div className="text-2xl font-black text-rose-400 mt-1">
                  {platformCost.toLocaleString()} UZS
                </div>
                <span className="text-[10px] text-slate-500">Server va AI texnik xarajati</span>
              </div>

              <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">Sof Oylik Foyda</span>
                <div className="text-2xl font-black text-emerald-300 mt-1">
                  +{netMonthlyProfit.toLocaleString()} UZS
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">O'quv markaz cho'ntagiga</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-900/30 rounded-xl border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-indigo-200 font-bold">Yillik Kutilayotgan Sof Foyda:</span>
                <div className="text-3xl font-black text-white mt-0.5">
                  +{yearlyProfit.toLocaleString()} UZS / yil
                </div>
              </div>
              <button
                onClick={() => setActiveTab('proposal')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                📄 Tijoriy Taklifni Olish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Personalized Commercial Proposal */}
      {activeTab === 'proposal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Mijoz Ma'lumotlarini Kiritish
            </h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">O'quv Markaz Nomi:</label>
              <input
                type="text"
                value={clientAcademyName}
                onChange={(e) => setClientAcademyName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Rahbar / Direktor Ismi:</label>
              <input
                type="text"
                value={directorName}
                onChange={(e) => setDirectorName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleCopyProposal}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>{copiedProposal ? '✅ Nusxalandi!' : '📋 Taklif Matnini Nusxalash'}</span>
              </button>

              <button
                onClick={handleSendOfferByTelegram}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>🚀 Telegram orqali Yuborish</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">
                📄 Rasmiy Tijoriy Taklif Loyihasi ({clientAcademyName})
              </h3>
              <span className="text-xs text-blue-400 font-bold">Davr Academy B2B</span>
            </div>

            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
              {COMMERCIAL_OFFER_TEXT
                .replace("Hurmatli Ta'lim Markazi Rahbari!", `Hurmatli ${directorName} (${clientAcademyName} Rahbari)!`)
                .replace("500 nafar o'quvchi", `${studentCount} nafar o'quvchi`)
                .replace("25,000 so'm", `${chargePerStudent.toLocaleString()} so'm`)}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: White-Label Simulator */}
      {activeTab === 'whitelabel_demo' && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white">🎨 White-Label Interfeys Sinovi</h3>
              <p className="text-xs text-slate-400">
                Mijoz o'quv markazi nomini o'zgartirib, tizim qanday ko'rinish olishini darhol tekshiring.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={clientAcademyName}
                onChange={(e) => setClientAcademyName(e.target.value)}
                placeholder="Markaz nomi"
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white w-48"
              />
            </div>
          </div>

          {/* Mock Student Interface */}
          <div className="max-w-md mx-auto bg-slate-950 border border-indigo-900/60 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
                  {clientAcademyName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{clientAcademyName} AI Bot</h4>
                  <span className="text-[10px] text-emerald-400">● 24/7 O'quvchi Xizmatida</span>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                PRO v4.0
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200">
                👋 Assalomu alaykum, Jasur! <b>{clientAcademyName}</b> ning rasmiy AI repetitoriga xush kelibsiz. Bugun qaysi bo'limni o'rganamiz?
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-xl text-center">
                  <span className="text-lg block">✍️</span>
                  <span className="text-[11px] font-bold text-indigo-300">IELTS Insho</span>
                </div>
                <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-center">
                  <span className="text-lg block">🎬</span>
                  <span className="text-[11px] font-bold text-purple-300">Cinema English</span>
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-center">
                  <span className="text-lg block">🎙️</span>
                  <span className="text-[11px] font-bold text-emerald-300">Mock Interview</span>
                </div>
                <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-center">
                  <span className="text-lg block">🏆</span>
                  <span className="text-[11px] font-bold text-amber-300">CEFR Sinovi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">🚀 Buyurtma & Shartnoma Shakllantirish</h3>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Tanlangan Tarif: <b className="text-blue-400">{selectedTier.name}</b>
              </p>
              <p>
                Mijoz Markaz: <b className="text-white">{clientAcademyName}</b>
              </p>
              <p>
                Oylik to'lov: <b className="text-emerald-400">{selectedTier.monthlyFeeUz.toLocaleString()} UZS</b>
              </p>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">
                  To'lov usuli (Test & Real):
                </span>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-blue-600/30 border border-blue-500 text-blue-300 font-bold rounded-lg">
                    Click Up
                  </button>
                  <button className="flex-1 py-2 bg-emerald-600/30 border border-emerald-500 text-emerald-300 font-bold rounded-lg">
                    Payme Business
                  </button>
                  <button className="flex-1 py-2 bg-purple-600/30 border border-purple-500 text-purple-300 font-bold rounded-lg">
                    Bank Shartnomasi
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderModalOpen(false);
                if (onSetStatusMsg) onSetStatusMsg(`🎉 "${selectedTier.name}" uchun buyurtma muvaffaqiyatli qabul qilindi!`);
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg transition"
            >
              ✅ Shartnomani Tasdiqlash & Faollashtirish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
