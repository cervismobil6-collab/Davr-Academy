import React, { useState } from 'react';
import { KIDS_STORIES, CEFR_MOCK_EXAMS } from '../data/kidsAndCefrData';
import { KidsStoryTopic, CefrMockExam } from '../types';

interface Props {
  onLogAction?: (msg: string) => void;
  onSetStatusMsg?: (msg: string) => void;
}

export const KidsAndCefrHub: React.FC<Props> = ({ onLogAction, onSetStatusMsg }) => {
  const [activeMode, setActiveMode] = useState<'kids' | 'cefr_mock'>('kids');

  // Kids State
  const [selectedKidStory, setSelectedKidStory] = useState<KidsStoryTopic>(KIDS_STORIES[0]);
  const [kidQuizAnswer, setKidQuizAnswer] = useState<number | null>(null);
  const [kidStars, setKidStars] = useState<number>(35);
  const [playingVoice, setPlayingVoice] = useState(false);

  // CEFR Mock State
  const [selectedExam, setSelectedExam] = useState<CefrMockExam>(CEFR_MOCK_EXAMS[0]);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [candidateName, setCandidateName] = useState('Diyorbek Ormonov');
  const [examScore, setExamScore] = useState<number | null>(null);

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      if (onSetStatusMsg) onSetStatusMsg('⚠️ Brauzeringiz ovozli o\'qishni qo\'llab-quvvatlamaydi.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    setPlayingVoice(true);
    utterance.onend = () => setPlayingVoice(false);
    utterance.onerror = () => setPlayingVoice(false);
    window.speechSynthesis.speak(utterance);
    if (onLogAction) onLogAction(`🔊 Ovozli o'qildi: "${text.substring(0, 30)}..."`);
  };

  const handleKidsQuiz = (idx: number) => {
    setKidQuizAnswer(idx);
    if (idx === selectedKidStory.quizQuestion.correctIndex) {
      setKidStars((prev) => prev + 10);
      if (onSetStatusMsg) onSetStatusMsg('🌟 Barakalla! To\'g\'ri javob! +10 Oltin Yulduzcha qo\'shildi!');
    } else {
      if (onSetStatusMsg) onSetStatusMsg('🤔 Yana bir bor urinib ko\'ring!');
    }
  };

  const handleSubmitCefrExam = () => {
    let total = 0;
    let correct = 0;

    // Listening
    selectedExam.sections.listening.forEach((q, idx) => {
      total++;
      if (userAnswers[`l_${idx}`] === q.answer) correct++;
    });

    // Reading
    selectedExam.sections.reading.forEach((q, idx) => {
      total++;
      if (userAnswers[`r_${idx}`] === q.answer) correct++;
    });

    // Grammar
    selectedExam.sections.grammar.forEach((q, idx) => {
      total++;
      if (userAnswers[`g_${idx}`] === q.answer) correct++;
    });

    const percent = Math.round((correct / Math.max(total, 1)) * 100);
    setExamScore(percent);
    setExamSubmitted(true);
    if (onLogAction) onLogAction(`🏆 CEFR ${selectedExam.level} Mock Test topshirildi: ${percent}% natija`);
    if (onSetStatusMsg) onSetStatusMsg(`🎉 Natijangiz: ${percent}%! Sertifikat tayyorlandi.`);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Selector Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-700 p-6 rounded-3xl text-white shadow-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-black uppercase bg-white/20 px-3 py-1 rounded-full tracking-wider">
            👶 Kids World & 🎓 CEFR Official Mock
          </span>
          <h2 className="text-2xl font-black">Bolalar Ingliz Tili & CEFR Rasmiy Mock Imtihonlar</h2>
          <p className="text-xs text-white/90">
            Barcha yoshdagi o'quvchilar uchun qiziqarli multfilmlar, ertaklar va xalqaro CEFR daraja sinovlari.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/40 p-1.5 rounded-2xl backdrop-blur border border-white/20">
          <button
            onClick={() => setActiveMode('kids')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeMode === 'kids'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'text-white hover:text-amber-300'
            }`}
          >
            <span>🎈 Bolalar Ingliz Tili</span>
          </button>
          <button
            onClick={() => setActiveMode('cefr_mock')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeMode === 'cefr_mock'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'text-white hover:text-indigo-300'
            }`}
          >
            <span>📜 CEFR Mock Imtihon</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Kids English World */}
      {activeMode === 'kids' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                🌟 Ertaklar & Darsliklar
              </h3>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                ⭐ {kidStars} Yulduzcha
              </span>
            </div>

            <div className="space-y-2">
              {KIDS_STORIES.map((story) => (
                <div
                  key={story.id}
                  onClick={() => {
                    setSelectedKidStory(story);
                    setKidQuizAnswer(null);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedKidStory.id === story.id
                      ? 'bg-amber-950/40 border-amber-500 shadow-xl ring-1 ring-amber-500/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{story.emoji}</span>
                    <div>
                      <h4 className="text-sm font-black text-white">{story.title}</h4>
                      <span className="text-xs text-amber-300 font-medium">{story.titleUz}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Story Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedKidStory.emoji}</span>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedKidStory.title}</h3>
                  <span className="text-xs text-amber-400 font-semibold">{selectedKidStory.titleUz}</span>
                </div>
              </div>

              <button
                onClick={() => handleSpeak(selectedKidStory.englishStory)}
                disabled={playingVoice}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <span>{playingVoice ? '🔊 O\'qilmoqda...' : '🔊 Ertakni Eshitish'}</span>
              </button>
            </div>

            {/* Story Text Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  🇬🇧 English Story
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                  {selectedKidStory.englishStory}
                </p>
              </div>

              <div className="p-4 bg-amber-950/20 rounded-2xl border border-amber-900/40 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  🇺🇿 O'zbekcha Tarjimasi
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedKidStory.uzbekStory}
                </p>
              </div>
            </div>

            {/* Vocabulary Flashcards */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                🎒 Muhim So'zlar (Flashcards)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {selectedKidStory.vocabulary.map((v, vIdx) => (
                  <div
                    key={vIdx}
                    onClick={() => handleSpeak(v.word)}
                    className="p-3 bg-slate-950 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/50 rounded-xl text-center cursor-pointer transition space-y-1"
                  >
                    <span className="text-2xl block">{v.icon}</span>
                    <span className="text-xs font-bold text-white block">{v.word}</span>
                    <span className="text-[10px] text-slate-400 block">{v.translation}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Quiz */}
            <div className="p-5 bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-950 border border-amber-500/30 rounded-2xl space-y-3">
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                🎯 Qiziqarli Viktorina: {selectedKidStory.quizQuestion.question}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedKidStory.quizQuestion.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleKidsQuiz(oIdx)}
                    className={`p-3 rounded-xl text-xs font-bold transition text-left ${
                      kidQuizAnswer === oIdx
                        ? oIdx === selectedKidStory.quizQuestion.correctIndex
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-rose-600 text-white shadow-lg'
                        : 'bg-slate-900 text-slate-200 border border-slate-700 hover:border-amber-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {kidQuizAnswer !== null && (
                <p className="text-xs text-amber-200 mt-2 font-medium">
                  💡 {selectedKidStory.quizQuestion.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: CEFR Multi-Level Mock Exam */}
      {activeMode === 'cefr_mock' && (
        <div className="space-y-6">
          {/* Level Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CEFR_MOCK_EXAMS.map((exam) => (
              <button
                key={exam.id}
                onClick={() => {
                  setSelectedExam(exam);
                  setUserAnswers({});
                  setExamSubmitted(false);
                  setExamScore(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap ${
                  selectedExam.id === exam.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                CEFR {exam.level} Daraja Mock
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Section 1: Listening */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-black text-indigo-400 uppercase tracking-wide flex items-center gap-2">
                    <span>🎧 1-Bo'lim: Listening Comprehension</span>
                  </h4>
                  <span className="text-xs text-slate-400">Audio savollarni tinglang</span>
                </div>

                {selectedExam.sections.listening.map((lq, lIdx) => (
                  <div key={lIdx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">Savol #{lIdx + 1}</span>
                      <button
                        onClick={() => handleSpeak(lq.audioPrompt)}
                        className="px-3 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold rounded-lg border border-indigo-500/40 flex items-center gap-1.5"
                      >
                        <span>🔊 Audioni Tinglash</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 italic">"{lq.audioPrompt}"</p>
                    <p className="text-xs font-bold text-white">{lq.question}</p>
                    <div className="space-y-1.5">
                      {lq.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition ${
                            userAnswers[`l_${lIdx}`] === oIdx
                              ? 'bg-indigo-600/40 border border-indigo-500 text-white font-bold'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`listening_${lIdx}`}
                            checked={userAnswers[`l_${lIdx}`] === oIdx}
                            onChange={() => setUserAnswers({ ...userAnswers, [`l_${lIdx}`]: oIdx })}
                            className="accent-indigo-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 2: Reading */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wide border-b border-slate-800 pb-3">
                  📖 2-Bo'lim: Reading Comprehension
                </h4>
                {selectedExam.sections.reading.map((rq, rIdx) => (
                  <div key={rIdx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800 font-serif">
                      {rq.passage}
                    </p>
                    <p className="text-xs font-bold text-white">{rq.question}</p>
                    <div className="space-y-1.5">
                      {rq.options.map((opt, oIdx) => (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-2 p-2 rounded-lg text-xs cursor-pointer transition ${
                            userAnswers[`r_${rIdx}`] === oIdx
                              ? 'bg-emerald-600/40 border border-emerald-500 text-white font-bold'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`reading_${rIdx}`}
                            checked={userAnswers[`r_${rIdx}`] === oIdx}
                            onChange={() => setUserAnswers({ ...userAnswers, [`r_${rIdx}`]: oIdx })}
                            className="accent-emerald-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 3: Grammar */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wide border-b border-slate-800 pb-3">
                  ✏️ 3-Bo'lim: Grammar & Lexis
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedExam.sections.grammar.map((gq, gIdx) => (
                    <div key={gIdx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-white leading-relaxed">{gq.question}</p>
                      <div className="space-y-1">
                        {gq.options.map((opt, oIdx) => (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition ${
                              userAnswers[`g_${gIdx}`] === oIdx
                                ? 'bg-amber-600/40 border border-amber-500 text-white font-bold'
                                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`grammar_${gIdx}`}
                              checked={userAnswers[`g_${gIdx}`] === oIdx}
                              onChange={() => setUserAnswers({ ...userAnswers, [`g_${gIdx}`]: oIdx })}
                              className="accent-amber-500"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmitCefrExam}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-xl transition"
              >
                🏁 Testni Yakunlash & CEFR Sertifikatini Olish
              </button>
            </div>

            {/* Candidate & Certificate Preview */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ishtirokchi Ma'lumotlari
                </h4>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Ism va Familiyangiz:</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Dynamic Certificate Card */}
              <div className="bg-gradient-to-br from-amber-950/60 via-slate-950 to-indigo-950 border border-amber-500/40 p-6 rounded-3xl shadow-2xl space-y-4 text-center relative overflow-hidden">
                <div className="text-xs font-black uppercase text-amber-400 tracking-widest">
                  CEFR OFFICIAL CERTIFICATE
                </div>
                <div className="text-lg font-black text-white">{candidateName}</div>
                <div className="text-xs text-slate-300">
                  Has successfully completed the <b>CEFR {selectedExam.level}</b> examination
                </div>

                <div className="py-2">
                  <span className="text-3xl font-black text-emerald-400">
                    {examScore !== null ? `${examScore}%` : '---%'}
                  </span>
                  <span className="text-xs text-slate-400 block">
                    {examScore !== null ? (examScore >= 70 ? 'PASS WITH MERIT 🏅' : 'PASS ✅') : 'Test topshirilmagan'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                  <span>ID: CEFR-{Date.now().toString().slice(-6)}</span>
                  <span>Verified by Davr Academy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
