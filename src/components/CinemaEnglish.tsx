import React, { useState } from 'react';
import { Film, Play, Volume2, CheckCircle2, RotateCcw, Award, Sparkles, BookOpen, MessageSquare } from 'lucide-react';

interface CinemaScene {
  id: string;
  movieTitle: string;
  year: string;
  level: string;
  clipDuration: string;
  videoThumbUrl: string;
  dialogueEn: string;
  dialogueUz: string;
  slangExplained: { phrase: string; meaning: string; example: string }[];
  dictationTask: { missingWords: string[]; fullSentence: string };
}

const CINEMA_SCENES: CinemaScene[] = [
  {
    id: 'peaky_blinders_1',
    movieTitle: 'Peaky Blinders (Thomas Shelby)',
    year: 'BBC Series',
    level: 'B2 - C1 Advanced',
    clipDuration: '0:45',
    videoThumbUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    dialogueEn: "I have no limitations. In this world, there is no rest for me until we take over every single legitimate enterprise in London.",
    dialogueUz: "Menda hech qanday cheklovlar yo'q. Bu dunyoda biz Londondagi barcha qonuniy korxonalarni egallamagunimizcha menga tinchlik yo'q.",
    slangExplained: [
      { phrase: "Take over", meaning: "Nazoratni qo'lga olmoq, o'zlashtirmoq", example: "The company was taken over by a tech giant." },
      { phrase: "Legitimate enterprise", meaning: "Qonuniy biznes / korxona", example: "They transitioned from illegal betting to a legitimate enterprise." }
    ],
    dictationTask: {
      missingWords: ['limitations', 'rest', 'legitimate'],
      fullSentence: "I have no limitations. There is no rest until we take over every legitimate enterprise."
    }
  },
  {
    id: 'suits_harvey_1',
    movieTitle: 'Suits (Harvey Specter)',
    year: 'Legal Drama',
    level: 'C1 Executive Business',
    clipDuration: '0:38',
    videoThumbUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    dialogueEn: "I don't play the odds, I play the man. When someone puts a gun to your head, you take the gun, or you pull out a bigger gun, or you call their bluff.",
    dialogueUz: "Men ehtimollar bilan o'ynamayman, men inson psixologiyasi bilan o'ynayman. Kimdir boshingizga to'pponcha tirasa, uni tortib olasiz yoki undan kattaroq qurol chiqarasiz yoki uning aldovini fosh qilasiz.",
    slangExplained: [
      { phrase: "Play the odds", meaning: "Omadga yoki matematik ehtimollikka tayanmoq", example: "Don't play the odds in business; make calculated moves." },
      { phrase: "Call someone's bluff", meaning: "Kimningdir po'pisasini yoki yolg'onini fosh qilmoq", example: "He threatened to resign, but the CEO called his bluff." }
    ],
    dictationTask: {
      missingWords: ['odds', 'bigger', 'bluff'],
      fullSentence: "I don't play the odds, I play the man. You pull out a bigger gun or call their bluff."
    }
  },
  {
    id: 'harry_potter_1',
    movieTitle: 'Harry Potter & Dumbledore',
    year: 'Fantasy Classic',
    level: 'B1 - B2 Intermediate',
    clipDuration: '0:50',
    videoThumbUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    dialogueEn: "It is our choices, Harry, that show what we truly are, far more than our abilities.",
    dialogueUz: "Bizning aslida kim ekanligimizni qobiliyatlarimizdan ko'ra ko'proq qilgan tanlovlarimiz ko'rsatadi, Garri.",
    slangExplained: [
      { phrase: "Far more than", meaning: "...ga qaraganda ancha ko'proq", example: "Effort matters far more than raw talent." },
      { phrase: "Truly are", meaning: "Haqiqiy asl qiyofa / tabiat", example: "Difficult times reveal who you truly are." }
    ],
    dictationTask: {
      missingWords: ['choices', 'truly', 'abilities'],
      fullSentence: "It is our choices that show what we truly are, far more than our abilities."
    }
  }
];

export const CinemaEnglish: React.FC = () => {
  const [activeScene, setActiveScene] = useState<CinemaScene>(CINEMA_SCENES[0]);
  const [userDictationInput, setUserDictationInput] = useState('');
  const [dictationChecked, setDictationChecked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleCheckDictation = () => {
    setDictationChecked(true);
  };

  const handleSimulateAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  return (
    <div id="cinema-english-root" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider border border-purple-500/40">
              <Film className="w-3.5 h-3.5" /> Real Native Speech & Dictation Training
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              🎬 Cinema English & YouTube Shorts Tahlili
            </h2>
            <p className="text-sm text-slate-300">
              Hollywood filmlari va seriallardan jonli audio parchalarni tinglang, slenglarni o'rganing va diktant (Dictation) orqali Listening ko'nikmangizni 9.0 darajaga ko'taring!
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 p-1.5 rounded-xl">
            {CINEMA_SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => {
                  setActiveScene(scene);
                  setUserDictationInput('');
                  setDictationChecked(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition ${activeScene.id === scene.id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {scene.movieTitle.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video & Audio Player & Dialogue */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center group">
              <img
                src={activeScene.videoThumbUrl}
                alt={activeScene.movieTitle}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              
              <button
                onClick={handleSimulateAudio}
                className="absolute w-16 h-16 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white flex items-center justify-center shadow-2xl transition transform group-hover:scale-110"
              >
                {isPlayingAudio ? <Volume2 className="w-8 h-8 animate-pulse" /> : <Play className="w-8 h-8 ml-1" />}
              </button>

              <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-[11px] font-bold text-purple-300">
                {activeScene.level}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="font-bold">{activeScene.movieTitle}</span>
                <span className="font-mono text-purple-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                  {activeScene.clipDuration}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                  🗣 Kinodagi Asl Dialogni Ko'rish (Original Subtitles):
                </h4>
                <p className="text-base font-semibold text-white leading-relaxed">
                  "{activeScene.dialogueEn}"
                </p>
                <p className="text-sm text-slate-400 mt-1 italic">
                  🇺🇿 "{activeScene.dialogueUz}"
                </p>
              </div>

              {/* Slang & Idioms breakdown */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Sahnadagi Sleng va Idiomalar:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeScene.slangExplained.map((s, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-xs font-black text-amber-300">"{s.phrase}"</div>
                      <div className="text-[11px] text-slate-300">{s.meaning}</div>
                      <div className="text-[10px] text-slate-500 italic">Misol: {s.example}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dictation Exercise (Eshitib yozish mashqi) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" /> 🎧 Diktant & Listening Mashqi
              </h3>
              <span className="text-[11px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                +50 XP & +20 🪙
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Audioni tinglang va eshitgan gapingizni to'liq inglizcha yozing:
            </p>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Audioni tinglash:</span>
              <button
                onClick={handleSimulateAudio}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" /> Tinglash
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Siz eshitgan matn (Write what you hear):
              </label>
              <textarea
                rows={4}
                value={userDictationInput}
                onChange={(e) => setUserDictationInput(e.target.value)}
                placeholder="Eshitgan gapingizni bu yerga yozing..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckDictation}
                disabled={!userDictationInput.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Javobni Tekshirish
              </button>
              <button
                onClick={() => setUserDictationInput(activeScene.dictationTask.fullSentence)}
                className="px-3 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl"
              >
                Yechim
              </button>
            </div>

            {dictationChecked && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> A'lo darajada bajarildi! (+50 XP)
                </div>
                <div className="text-slate-300">
                  <strong>To'g'ri matn:</strong> <span className="font-mono text-emerald-400">{activeScene.dictationTask.fullSentence}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Kalit so'zlar: {activeScene.dictationTask.missingWords.join(', ')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
