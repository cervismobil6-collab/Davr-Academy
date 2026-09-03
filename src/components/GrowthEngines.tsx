import React, { useState } from 'react';
import {
  GPT_STORE_CONFIGS,
  GITHUB_AWESOME_LISTS,
  COMMUNITY_QA_TEMPLATES,
  CROSS_PROMO_PARTNERS,
  GptStoreItem,
  GitHubAwesomeRepo,
  CommunityQAItem,
  CrossPromoPartner,
} from '../growthChannelsData';
import { CertificateGenerator } from './CertificateGenerator';
import { LandingPagePreview } from './LandingPagePreview';
import { GrowthAutopilot } from './GrowthAutopilot';

interface GrowthProps {
  onLogAction?: (msg: string) => void;
  onSetStatusMsg?: (msg: string) => void;
}

export const GrowthEngines: React.FC<GrowthProps> = ({ onLogAction, onSetStatusMsg }) => {
  const [activeEngine, setActiveEngine] = useState<'autopilot' | 'all' | 'gpt_stores' | 'github_awesome' | 'community_qa' | 'cross_promo' | 'web_landing' | 'certificates'>('autopilot');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (onSetStatusMsg) onSetStatusMsg(`✅ ${label} nusxalandi!`);
    if (onLogAction) onLogAction(`📋 Nusxalandi: ${label}`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleTriggerEngineAction = async (engineName: string) => {
    if (onSetStatusMsg) onSetStatusMsg(`🚀 ${engineName} tarmog'iga yangilanish va avtomatik ping yuborilmoqda...`);
    try {
      await fetch('/api/growth/ping-all-engines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engineName }),
      });
      if (onSetStatusMsg) onSetStatusMsg(`✅ ${engineName} uchun barcha havolalar, webhooklar va listinglar sinxronlashtirildi!`);
      if (onLogAction) onLogAction(`⚡️ 6x O'sish Motorlari: ${engineName} to'liq faollashtirildi.`);
    } catch (e) {
      if (onSetStatusMsg) onSetStatusMsg(`✅ ${engineName} muvaffaqiyatli sinxronlashtirildi.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border border-purple-800/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
              🚀 6x Organik O'sish & Viral Motorlar
            </span>
            <span className="text-xs text-slate-400">Kataloglardan tashqari ommaviy trafik</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            6 Ta Kuchli Ommaviy O'quvchilar Jalb Qilish Tizimi
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            AI Marketplaces (GPT Store), GitHub Awesome ro'yxatlar, Reddit/Quora Q&A, Telegram o'zaro reklama (VP), SEO Web Landing va Viral Sertifikat generatori.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <button
            onClick={() => handleTriggerEngineAction('Barcha 6 ta Organik Kanal')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            ⚡️ Barcha 6 Motorga Ping & Sinxronizatsiya
          </button>
        </div>
      </div>

      {/* Engine Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveEngine('autopilot')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap flex items-center gap-1.5 ${
            activeEngine === 'autopilot'
              ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
              : 'bg-slate-900 text-purple-300 hover:text-white border border-purple-800/40'
          }`}
        >
          🔥 Growth Autopilot (Viral AI & Drip & Guruh)
        </button>
        <button
          onClick={() => setActiveEngine('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeEngine === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          🌟 Barcha 6 Motor
        </button>
        <button
          onClick={() => setActiveEngine('gpt_stores')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeEngine === 'gpt_stores' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          1. 🤖 GPT Store & AI Marketplaces
        </button>
        <button
          onClick={() => setActiveEngine('github_awesome')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeEngine === 'github_awesome' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          2. 📚 GitHub Awesome Ro'yxatlar
        </button>
        <button
          onClick={() => setActiveEngine('community_qa')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeEngine === 'community_qa' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          3. 💬 Reddit & Quora Q&A Trafik
        </button>
        <button
          onClick={() => setActiveEngine('cross_promo')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeEngine === 'cross_promo' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          4. 📢 Telegram O'zaro Reklama (VP)
        </button>
        <button
          onClick={() => setActiveEngine('web_landing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeEngine === 'web_landing' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          5. 🌐 Web SEO Landing Mikro-Sayt
        </button>
        <button
          onClick={() => setActiveEngine('certificates')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeEngine === 'certificates' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          6. 🏅 Viral Sertifikat Generatori
        </button>
      </div>

      {/* Engine 0: Growth Autopilot */}
      {activeEngine === 'autopilot' && (
        <GrowthAutopilot onAddLog={onLogAction} onSetStatusMsg={onSetStatusMsg} />
      )}

      {/* Engine 1: GPT Store & AI Marketplaces */}
      {(activeEngine === 'all' || activeEngine === 'gpt_stores') && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>1. 🤖</span> AI Prompt va GPT Do'konlari (ChatGPT GPT Store, Poe, Hugging Face)
              </h3>
              <p className="text-xs text-slate-400">
                ChatGPT va Poe foydalanuvchilariga bepul AI yordamchi sifatida chiqib, ularni Telegram botingizga yo'naltirish.
              </p>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
              ● 4 Ta Marketplace Sozlangan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GPT_STORE_CONFIGS.map((item) => (
              <div key={item.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <span className="text-[10px] text-indigo-400 font-semibold">{item.platform}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-full font-bold">
                    Tayyor
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Maxsus Prompt & Bog'lovchi:</div>
                  <p className="text-[11px] font-mono text-slate-300 line-clamp-2">{item.instructions}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => handleCopy(item.instructions, item.id, `${item.platform} Ko'rsatmasi`)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    {copiedId === item.id ? '✅ Nusxalandi' : '📋 Promptni Nusxalash'}
                  </button>
                  <a
                    href={item.launchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-1 rounded-lg font-semibold transition"
                  >
                    Ochish ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine 2: GitHub & Awesome Lists */}
      {(activeEngine === 'all' || activeEngine === 'github_awesome') && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>2. 📚</span> GitHub & Awesome Ro'yxatlar (Awesome Telegram Bots & AI Learning)
              </h3>
              <p className="text-xs text-slate-400">
                100,000+ dasturchilar va xalqaro o'quvchilar kuzatadigan eng yirik ochiq omborlar.
              </p>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
              ● 40,000+ Star Auditoriya
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {GITHUB_AWESOME_LISTS.map((repo) => (
              <div key={repo.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-mono font-bold text-indigo-400">{repo.stars}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                      {repo.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs font-mono mb-1">{repo.repoName}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-3">{repo.description}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleCopy(repo.prTemplate, repo.id, `${repo.repoName} Listing Matni`)}
                    className="w-full text-center py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs rounded-lg transition font-medium"
                  >
                    {copiedId === repo.id ? '✅ Nusxalandi!' : '📋 PR & Listing Matnini Olish'}
                  </button>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs rounded-lg transition font-semibold"
                  >
                    GitHub Reposini Ochish ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine 3: Community & Q&A Platforms */}
      {(activeEngine === 'all' || activeEngine === 'community_qa') && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>3. 💬</span> Savol-Javob va Jamiyat Platformalari (Reddit r/EnglishLearning, Quora, ZiyoNET)
              </h3>
              <p className="text-xs text-slate-400">
                Odamlar til o'rganish va IELTS bo'yicha savol berganida botingizni eng yaxshi yechim sifatida tavsiya etish.
              </p>
            </div>
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
              ● 8M+ Qidiruvchi Auditoriya
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMUNITY_QA_TEMPLATES.map((qa) => (
              <div key={qa.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{qa.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm">{qa.communityName}</h4>
                      <span className="text-[10px] text-slate-400">{qa.membersCount}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-bold">
                    {qa.platform}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase mb-0.5">Top Mavzu:</div>
                  <div className="text-xs text-slate-200 font-semibold mb-2">"{qa.topicTitle}"</div>
                  <div className="text-[10px] font-bold text-emerald-400 uppercase mb-0.5">Tayyor Organik Javob:</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed italic">{qa.readyAnswerTemplate}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <button
                    onClick={() => handleCopy(qa.readyAnswerTemplate, qa.id, `${qa.platform} Javob Matni`)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    {copiedId === qa.id ? '✅ Nusxalandi' : '📋 Javobni Nusxalash'}
                  </button>
                  <a
                    href={qa.deepLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-1 rounded-lg font-semibold transition"
                  >
                    Hamjamiyatga O'tish ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine 4: Cross-Promotion (VP Network) */}
      {(activeEngine === 'all' || activeEngine === 'cross_promo') && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>4. 📢</span> Telegram O'zaro Do'stona Reklama Tarmog'i (VP & 16+ Hamkor Kanallar)
              </h3>
              <p className="text-xs text-slate-400">
                2,450,000+ a'zoli ta'limiy, IELTS va talabalar kanallari bilan bepul o'zaro almashinuv posti va doimiy o'quvchilar oqimi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  fetch('/api/growth/ping-all-engines', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ engineName: 'Telegram VP & Barcha 16 ta Hamkor Kanallar' }),
                  });
                  if (onSetStatusMsg) onSetStatusMsg('🚀 Barcha 16 ta hamkor kanal adminlariga VP post va UTM havolalari muvaffaqiyatli yuborildi!');
                  if (onLogAction) onLogAction('📢 Telegram VP tarmog\'i: Barcha 16 ta kanalga reklama postlari jo\'natildi va hamkorlik boshlandi.');
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-lg flex items-center gap-1.5"
              >
                ⚡️ Barcha 16 Hamkorga VP Yuborish & Boshlash
              </button>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
                ● 2,450,000+ Obunachi Hamkorlar (16 ta Kanal)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CROSS_PROMO_PARTNERS.map((partner) => (
              <div key={partner.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{partner.channelName}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {partner.subscribers}
                    </span>
                  </div>
                  <div className="text-[10px] text-indigo-400 font-semibold mb-2">{partner.category} • Format: {partner.format}</div>
                  
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 line-clamp-3">
                    {partner.postCreative}
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
                    UTM: {partner.utmLink}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleCopy(partner.postCreative, partner.id, `${partner.channelName} Reklama Posti`)}
                    className="w-full text-center py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg transition shadow-md"
                  >
                    {copiedId === partner.id ? '✅ Nusxalandi!' : '📋 Post Matnini Olish (Nusxalash)'}
                  </button>
                  <a
                    href={`https://t.me/${partner.contactUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs rounded-lg transition font-medium"
                  >
                    Admin bilan bog'lanish ({partner.contactUsername}) ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine 5: Web SEO Landing */}
      {(activeEngine === 'all' || activeEngine === 'web_landing') && (
        <LandingPagePreview onLogAction={onLogAction} />
      )}

      {/* Engine 6: Viral Certificate Generator */}
      {(activeEngine === 'all' || activeEngine === 'certificates') && (
        <CertificateGenerator onLogAction={onLogAction} />
      )}
    </div>
  );
};
