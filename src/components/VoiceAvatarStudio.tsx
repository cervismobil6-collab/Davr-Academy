import React, { useState } from 'react';

interface VoiceProfile {
  id: string;
  name: string;
  accent: 'British' | 'American' | 'Australian' | 'Canadian' | 'Irish';
  gender: 'Female' | 'Male';
  role: string;
  avatar: string;
  description: string;
  sampleText: string;
}

const VOICES_CATALOG: VoiceProfile[] = [
  {
    id: 'voice_uk_emma',
    name: 'Emma (BBC London)',
    accent: 'British',
    gender: 'Female',
    role: 'IELTS Academic & RP Accent Coach',
    avatar: '👩‍🏫',
    description: 'Klassik Received Pronunciation (RP) va rasmiy akademik ingliz tili uchun eng mukammal audio ovoz.',
    sampleText: "Good day! In today's academic session, we shall examine sophisticated lexical structures and Received Pronunciation.",
  },
  {
    id: 'voice_us_roger',
    name: 'Roger (Silicon Valley)',
    accent: 'American',
    gender: 'Male',
    role: 'Business & Tech Interview Coach',
    avatar: '👨‍💼',
    description: 'Aniq va ishonchli General American aksenti. IT, biznes va elchixona intervyulari uchun maxsus sozlangan.',
    sampleText: "Hey there! Ready to crush your tech interview and speak with clear, natural American confidence? Let's dive in.",
  },
  {
    id: 'voice_au_liam',
    name: 'Liam (Sydney Explorer)',
    accent: 'Australian',
    gender: 'Male',
    role: 'Everyday Fluency & Idioms Coach',
    avatar: '🏄‍♂️',
    description: 'Erkin va tabiiy Avstraliya aksenti. Kundalik speaking va real hayotiy muloqot mashqlari uchun.',
    sampleText: "G'day mate! Learning English is all about consistent rhythm and real conversational fluency. No worries, you've got this!",
  },
  {
    id: 'voice_us_sarah',
    name: 'Sarah (California Friendly)',
    accent: 'American',
    gender: 'Female',
    role: 'Daily Conversation & Vocabulary Tutor',
    avatar: '👩‍💻',
    description: 'Yumshoq va tushunarli ohang. Yangi so‘zlar va erkin suhbatlashish uchun ideal murabbiy.',
    sampleText: "Hi friends! Don't be afraid of making mistakes. Every single phrase brings you closer to native-like fluency.",
  },
  {
    id: 'voice_uk_arthur',
    name: 'Arthur (Oxford Senior)',
    accent: 'British',
    gender: 'Male',
    role: 'IELTS Band 9.0 Writing & Speaking Examiner',
    avatar: '👨‍🏫',
    description: 'Chuqur va professional britancha intonatsiya. Xalqaro imtihon standartlari talqini.',
    sampleText: "Indeed, coherence and cohesion form the fundamental pillars of an exceptional IELTS performance.",
  },
];

const ACCENT_PRACTICE_PHRASES = [
  { text: "Could you please explain the correlation between economic growth and environmental sustainability?", level: "C1 Advanced", category: "IELTS Speaking Part 3" },
  { text: "I'd like to schedule a follow-up interview to discuss our strategic roadmap in detail.", level: "B2 Business", category: "Tech Interview" },
  { text: "What fascinated me most about studying abroad was the rich cultural diversity.", level: "B2 Upper", category: "Fluency Builder" },
  { text: "Never before had I encountered such an extraordinary opportunity to enhance my fluency.", level: "C2 Mastery", category: "Inversion Grammar" }
];

export const VoiceAvatarStudio: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceProfile>(VOICES_CATALOG[0]);
  const [customSpeed, setCustomSpeed] = useState<number>(1.0);
  const [customText, setCustomText] = useState<string>(VOICES_CATALOG[0].sampleText);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [accentFilter, setAccentFilter] = useState<string>('ALL');

  const filteredVoices = accentFilter === 'ALL'
    ? VOICES_CATALOG
    : VOICES_CATALOG.filter((v) => v.accent === accentFilter);

  const handlePlayVoice = (textToPlay: string, voiceAccent: string) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToPlay);
      utterance.rate = customSpeed;
      if (voiceAccent === 'British') utterance.lang = 'en-GB';
      else if (voiceAccent === 'Australian') utterance.lang = 'en-AU';
      else utterance.lang = 'en-US';

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            🎙 AI Multi-Accent Voice Synthesizer
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Shaxsiy AI O'qituvchi & Aksentlar Studiyasi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Britaniya (RP), Amerika (General American) va Avstraliya aksentlarida jonli audio talaffuz va interaktiv speaking trenirovkasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'British', 'American', 'Australian'].map((acc) => (
            <button
              key={acc}
              onClick={() => setAccentFilter(acc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                accentFilter === acc
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {acc === 'ALL' ? '🌍 Barcha Aksentlar' : acc}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Avatars Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredVoices.map((v) => {
          const isSelected = selectedVoice.id === v.id;
          return (
            <div
              key={v.id}
              onClick={() => {
                setSelectedVoice(v);
                setCustomText(v.sampleText);
              }}
              className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-gradient-to-b from-purple-950/90 to-slate-900 border-purple-500 shadow-xl shadow-purple-500/10 ring-2 ring-purple-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{v.avatar}</span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                  v.accent === 'British' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  v.accent === 'American' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {v.accent}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{v.name}</h4>
                <p className="text-[11px] text-purple-300 font-medium mt-0.5">{v.role}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{v.description}</p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedVoice(v);
                  handlePlayVoice(v.sampleText, v.accent);
                }}
                className={`w-full py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isSelected && isPlaying
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white'
                }`}
              >
                <span>{isSelected && isPlaying ? '⏹ To\'xtatish' : '▶️ Tinglash'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Speech Synthesizer & Pronunciation Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Synthesizer Console */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>🎛</span> {selectedVoice.name} bilan Jonli Nutq Mashqi
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Tezlik:</span>
              {[0.8, 1.0, 1.2].map((s) => (
                <button
                  key={s}
                  onClick={() => setCustomSpeed(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    customSpeed === s ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={4}
            placeholder="Inglizcha matn yozing va AI tanlangan aksentda talaffuz qilib beradi..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:border-purple-500 focus:outline-none transition resize-none"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Aksent: <strong className="text-white">{selectedVoice.accent}</strong></span>
              <span>•</span>
              <span>Murabbiy: <strong className="text-white">{selectedVoice.name}</strong></span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handlePlayVoice(customText, selectedVoice.accent)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 ${
                  isPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
                }`}
              >
                <span>{isPlaying ? '⏹ Ovozni To\'xtatish' : '▶️ Audio Talaffuzni Tinglash'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Top IELTS & Interview Phrases */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>🔥</span> Trenirovka Shablonlari
          </h3>
          <p className="text-xs text-slate-400">
            Talaffuzni rivojlantirish uchun tayyor Band 8.5+ iboralardan birini tanlang:
          </p>

          <div className="space-y-2.5">
            {ACCENT_PRACTICE_PHRASES.map((phrase, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCustomText(phrase.text);
                  handlePlayVoice(phrase.text, selectedVoice.accent);
                }}
                className="p-3 bg-slate-950/70 border border-slate-800/80 hover:border-purple-500/50 rounded-xl cursor-pointer transition group space-y-1"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-purple-400 font-bold">{phrase.category}</span>
                  <span className="text-slate-500">{phrase.level}</span>
                </div>
                <p className="text-xs text-slate-300 group-hover:text-white line-clamp-2 leading-relaxed">
                  "{phrase.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
