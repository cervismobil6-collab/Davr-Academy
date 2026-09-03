import React, { useState } from 'react';
import { Mic, MicOff, Play, CheckCircle, AlertCircle, Award, Sparkles, Building2, GraduationCap, Briefcase, RefreshCw } from 'lucide-react';

interface MockTrack {
  id: 'us_visa' | 'tech_job' | 'scholarship';
  title: string;
  category: string;
  icon: string;
  description: string;
  questions: { qEn: string; qUz: string; idealAnswerTip: string }[];
}

const MOCK_TRACKS: MockTrack[] = [
  {
    id: 'us_visa',
    title: 'AQSH Elchixonasi F1 / J1 Viza Simulyatori',
    category: 'US Embassy Visa Interview',
    icon: '🇺🇸',
    description: "Toshkentdagi AQSH elchixonasi konsuli bilan jonli suhbat simulyatsiyasi.",
    questions: [
      {
        qEn: "Why did you choose this particular university in the United States instead of universities in Uzbekistan or Europe?",
        qUz: "Nega O'zbekiston yoki Yevropa universitetlari emas, aynan AQSHdagi ushbu universitetni tanladingiz?",
        idealAnswerTip: "Universitetning o'quv dasturi, professorlari va sizning kelajakdagi karyerangizga qanday yordam berishiga aniq urg'u bering."
      },
      {
        qEn: "Who is funding your education and how do they afford the tuition fees?",
        qUz: "O'qishingiz uchun kim homiylik qiladi va ularning daromad manbai qanday?",
        idealAnswerTip: "Ota-onangizning rasmiy biznesi yoki bank hisobidagi mablag'larni ishonchli va qisqa ifoda eting."
      },
      {
        qEn: "What are your specific plans after graduating and returning to Uzbekistan?",
        qUz: "O'qishni tugatgach O'zbekistonga qaytib nima ish qilmoqchisiz (Home Ties)?",
        idealAnswerTip: "O'zbekistondagi aniq soha, kompaniya yoki loyihani tilga olib, vatanga qaytish niyatini qat'iy ko'rsating."
      }
    ]
  },
  {
    id: 'tech_job',
    title: 'Xalqaro IT & Texnik Ishga Qabul Suhbatlari',
    category: 'Global Tech Job Interview',
    icon: '💻',
    description: "Google, Amazon yoki xalqaro startaplar uchun ingliz tilidagi HR va Texnik intervyu.",
    questions: [
      {
        qEn: "Tell me about a challenging technical problem you solved and the trade-offs you considered.",
        qUz: "O'zingiz hal qilgan murakkab texnik muammo va uning afzallik/kamchiliklari haqida so'zlab bering.",
        idealAnswerTip: "STAR metodidan (Situation, Task, Action, Result) foydalaning."
      },
      {
        qEn: "How do you handle disagreements with team members during a high-stakes sprint?",
        qUz: "Loyiha muddati qisqa bo'lgan vaqtda jamoa a'zolari bilan kelishmovchilikni qanday hal qilasiz?",
        idealAnswerTip: "Konstruktiv muloqot va biznes manfaati ustuvorligini ko'rsating."
      }
    ]
  },
  {
    id: 'scholarship',
    title: 'Xalqaro Grantlar & Chevening / Erasmus Intervyusi',
    category: 'Global Scholarships',
    icon: '🎓',
    description: "Chevening, Fulbright, DAAD va xalqaro magistratura grantlari suhbati.",
    questions: [
      {
        qEn: "Explain your long-term leadership vision and how this scholarship will catalyze your impact in Uzbekistan.",
        qUz: "Uzoq muddatli yetakchilik maqsadingiz va ushbu grant O'zbekistondagi ta'siringizni qanday oshirishi haqida gapiring.",
        idealAnswerTip: "Aniq raqamlar, ijtimoiy tashabbuslar va yetakchilik namunalarini keltiring."
      }
    ]
  }
];

export const MockInterviewSim: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<MockTrack>(MOCK_TRACKS[0]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    passed: boolean;
    feedback: string;
    strengths: string[];
    betterAnswer: string;
  } | null>(null);

  const activeQ = selectedTrack.questions[currentQIndex];

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setUserSpeechInput('');
      setTimeout(() => {
        setIsRecording(false);
        setUserSpeechInput(
          "I chose this university because of its specialized Data Science research lab led by Professor Smith. In Uzbekistan, the fintech sector is growing rapidly, and my goal is to gain cutting-edge expertise and return to Tashkent to implement scalable AI payment algorithms."
        );
      }, 3500);
    } else {
      setIsRecording(false);
    }
  };

  const handleEvaluate = () => {
    if (!userSpeechInput.trim()) return;
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setEvaluationResult({
        score: 8.5,
        passed: true,
        feedback: "Konsul / Interviewer uchun juda ishonchli va aniq dalillarga boy javob! Aniq maqsad va Vatan bilan bog'liqlik (Strong Ties) mukammal ifodalangan.",
        strengths: [
          "Professor va laboratoriya nomining tilga olinishi o'rganilganligini ko'rsatdi.",
          "O'zbekistondagi bozor ehtiyoji bilan bog'landi.",
          "Grammatik xatolarsiz ravon ifoda."
        ],
        betterAnswer: "I chose this institution due to its distinguished Data Science lab directed by Professor Smith. Given the unprecedented expansion of Uzbekistan's fintech ecosystem, acquiring this expertise will enable me to spearhead AI-driven financial solutions upon my return to Tashkent."
      });
    }, 1200);
  };

  return (
    <div id="mock-interview-sim-root" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-blue-900/40 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider border border-cyan-500/40">
              <Sparkles className="w-3.5 h-3.5" /> Real-time Speech & Consular Simulation
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              🎙 Viza & Grant Mock Interview AI Simulyatori
            </h2>
            <p className="text-sm text-slate-300">
              AQSH elchixonasi F1 vizasi, xalqaro IT ish suhbatlari va xorijiy grantlar uchun ovozli simulyatsiya o'tkazing.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 p-1.5 rounded-xl">
            {MOCK_TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTrack(t);
                  setCurrentQIndex(0);
                  setEvaluationResult(null);
                  setUserSpeechInput('');
                }}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${selectedTrack.id === t.id ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                <span>{t.icon}</span>
                <span>{t.id === 'us_visa' ? 'US Visa' : t.id === 'tech_job' ? 'IT Job' : 'Scholarship'}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interrogator / Question area */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                {selectedTrack.icon} {selectedTrack.category}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-mono">
                Savol {currentQIndex + 1} / {selectedTrack.questions.length}
              </span>
            </div>

            {/* Consular Officer Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 to-cyan-950/30 border border-cyan-500/20 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-xl">
                  👨‍💼
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold">US Consular Officer / AI Examiner</div>
                  <div className="text-sm font-bold text-white">Live Interview Session</div>
                </div>
              </div>
              <div className="text-base font-bold text-cyan-200 leading-relaxed font-sans">
                "{activeQ.qEn}"
              </div>
              <div className="text-xs text-slate-400 italic">
                🇺🇿 "{activeQ.qUz}"
              </div>
            </div>

            {/* Examiner tip */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1">
              <div className="font-bold text-amber-300">💡 Qanday javob berish kerak (Examiner Tip):</div>
              <div className="text-slate-300">{activeQ.idealAnswerTip}</div>
            </div>

            {/* User Speech / Answer Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                🗣 Sizning Javobingiz (Ovozli yoki Matn):
              </label>
              <textarea
                rows={4}
                value={userSpeechInput}
                onChange={(e) => setUserSpeechInput(e.target.value)}
                placeholder="Ovoz yozish tugmasini bosing yoki inglizcha javobingizni yozing..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleRecord}
                className={`py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                {isRecording ? "Yozib olinmoqda (3s)..." : "Ovozli Yozish"}
              </button>

              <button
                onClick={handleEvaluate}
                disabled={evaluating || !userSpeechInput.trim()}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {evaluating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
                {evaluating ? "Tahlil qilinmoqda..." : "Konsul Bahosini Olish"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Feedback & Evaluation */}
        <div className="lg:col-span-5 space-y-4">
          {evaluationResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-950/80 to-slate-950 border border-cyan-500/30">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase">Viza Olish Ehtimoli / Baho</div>
                  <div className="text-2xl font-black text-cyan-400 mt-0.5">
                    {evaluationResult.score} / 10.0 (✅ PASSED)
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                  Konsul Ma'qulladi
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-white mb-1">Xulosa:</div>
                {evaluationResult.feedback}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Muvaffaqiyatli dalillar:
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {evaluationResult.strengths.map((st, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-emerald-400">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-cyan-300">🌟 Mukammal C1 variant (Executive Model):</div>
                <div className="text-slate-300 italic leading-relaxed">
                  "{evaluationResult.betterAnswer}"
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    if (currentQIndex + 1 < selectedTrack.questions.length) {
                      setCurrentQIndex(currentQIndex + 1);
                      setEvaluationResult(null);
                      setUserSpeechInput('');
                    } else {
                      alert("Barcha savollar yakunlandi!");
                    }
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Keyingi Savolga O'tish ➡️
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Intervyu Javobini Kutmoqda</h3>
              <p className="text-xs text-slate-400 max-w-xs">
                Savolga inglizcha javob bering va konsul / recruiter bahosini oling.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
