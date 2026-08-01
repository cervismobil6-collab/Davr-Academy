import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Copy,
  Send,
  Sparkles,
  ChevronRight,
  Bookmark,
  HelpCircle,
  Layers,
  Check,
  AlertCircle,
  X,
  CreditCard,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  User,
  ExternalLink,
  Phone,
  Trophy,
  TrendingUp,
  Map,
  Award,
  CheckCircle,
  CircleDot,
  Lock,
  RotateCcw,
  Flame,
  Clock,
  XCircle,
  UserCheck,
  FileText,
} from 'lucide-react';
import { LessonItem, LessonLevel } from '../types';

export interface PaymentRequestItem {
  id: string;
  userHandle: string;
  courseTitle: string;
  amount: string;
  date: string;
  cardNumber: string;
  receiverName: string;
  screenshotUrl?: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const LessonsManager: React.FC = () => {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [activeLesson, setActiveLesson] = useState<LessonItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendModalLesson, setSendModalLesson] = useState<LessonItem | null>(null);
  const [targetChatId, setTargetChatId] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Student Learning Progress State (Completed Lesson IDs)
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('telegram_ai_completed_lessons');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading completed lessons from localStorage', e);
    }
    // Default initial completed lessons so progress bar and roadmap are active out of the box
    return ['a1_1', 'a1_2', 'a1_3', 'a2_1'];
  });

  const toggleLessonCompleted = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const updated = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      try {
        localStorage.setItem('telegram_ai_completed_lessons', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving completed lessons to localStorage', e);
      }
      return updated;
    });
  };

  const resetAllProgress = () => {
    setCompletedLessons([]);
    try {
      localStorage.removeItem('telegram_ai_completed_lessons');
    } catch (e) {
      console.warn('Error clearing completed lessons', e);
    }
  };

  const [showRoadmap, setShowRoadmap] = useState(true);

  // Premium Payment Verification State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    userHandle: '',
    courseTitle: "IELTS Pro 8.0+ Mastery (B2-C1) — 149,000 so'm",
    cardNumber: '5614 6818 8730 1095',
    receiverName: "G'aniyev Sardorbek",
    screenshotName: '',
    screenshotUrl: '',
    note: '',
    adminUsername: '@jasurdos',
  });

  // Payment Requests Verification List (Admin Panel)
  const [showAdminRequests, setShowAdminRequests] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestItem[]>(() => {
    try {
      const saved = localStorage.getItem('telegram_ai_payment_requests');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading payment requests', e);
    }
    return [
      {
        id: 'req_1',
        userHandle: '@aziza_ielts9',
        courseTitle: "IELTS Pro 8.0+ Mastery (B2-C1) — 149,000 so'm",
        amount: "149,000 so'm",
        date: "Bugun, 14:30",
        cardNumber: "5614 6818 8730 1095",
        receiverName: "G'aniyev Sardorbek",
        note: "+998901234567 • Payme orqali to'lov qilindi",
        status: 'pending',
      },
      {
        id: 'req_2',
        userHandle: '@sardor_dev_student',
        courseTitle: "Barcha 45+ Darsliklar & AI Ustoz VIP — 199,000 so'm",
        amount: "199,000 so'm",
        date: "Bugun, 12:15",
        cardNumber: "5614 6818 8730 1095",
        receiverName: "G'aniyev Sardorbek",
        note: "Chek skrinshoti yuborildi",
        status: 'pending',
      },
      {
        id: 'req_3',
        userHandle: '@bekzod_a1',
        courseTitle: "A1-A2 Boshlang'ich Intensiv Kurs — 99,000 so'm",
        amount: "99,000 so'm",
        date: "Kecha, 18:40",
        cardNumber: "5614 6818 8730 1095",
        receiverName: "G'aniyev Sardorbek",
        note: "Tasdiqlangan",
        status: 'approved',
      },
    ];
  });

  const handleUpdatePaymentStatus = (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    setPaymentRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      );
      try {
        localStorage.setItem('telegram_ai_payment_requests', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving payment requests', e);
      }
      return updated;
    });
  };
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/lessons');
      const data = await res.json();
      if (data.lessons) {
        setLessons(data.lessons);
        if (data.lessons.length > 0 && !activeLesson) {
          setActiveLesson(data.lessons[0]);
        }
      }
    } catch (e) {
      console.warn("Darsliklarni yuklashda uzilish:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons =
    selectedLevel === 'all'
      ? lessons
      : lessons.filter((l) => l.level === selectedLevel);

  const handleCopyCommand = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendModalLesson || !targetChatId.trim()) return;

    try {
      setSendLoading(true);
      setSendStatus(null);
      const res = await fetch('/api/lessons/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: targetChatId.trim(),
          lessonId: sendModalLesson.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendStatus({
          type: 'success',
          message: `"${sendModalLesson.title}" darsligi muvaffaqiyatli yuborildi!`,
        });
        setTargetChatId('');
      } else {
        setSendStatus({
          type: 'error',
          message: data.error || "Yuborishda xatolik bo'ldi",
        });
      }
    } catch (e: any) {
      setSendStatus({
        type: 'error',
        message: e.message || 'Tarmoq xatosi',
      });
    } finally {
      setSendLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
        setPaymentForm((prev) => ({
          ...prev,
          screenshotName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.userHandle.trim()) {
      setPaymentStatus({
        type: 'error',
        message: "Foydalanuvchi ismi yoki Telegram Username kiritish shart",
      });
      return;
    }
    if (
      !paymentForm.screenshotName &&
      !paymentForm.screenshotUrl &&
      !screenshotPreview
    ) {
      setPaymentStatus({
        type: 'error',
        message:
          "To'lov skrinshotini (fayl yuklash yoki URL) yuborish shart",
      });
      return;
    }

    try {
      setPaymentLoading(true);
      setPaymentStatus(null);
      const res = await fetch('/api/lessons/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...paymentForm,
          screenshotUrl: paymentForm.screenshotUrl || screenshotPreview || '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentStatus({
          type: 'success',
          message:
            data.message ||
            "✅ To'lov ma'lumotlari admin (@jasurdos - G'aniyev Sardorbek) ga muvaffaqiyatli yuborildi!",
        });
        setPaymentForm({
          userHandle: '',
          courseTitle: "IELTS Pro 8.0+ Mastery (B2-C1) — 149,000 so'm",
          cardNumber: '8600 1402 3456 7890',
          receiverName: "G'aniyev Sardorbek",
          screenshotName: '',
          screenshotUrl: '',
          note: '',
          adminUsername: '@jasurdos',
        });
        setScreenshotPreview(null);
      } else {
        setPaymentStatus({
          type: 'error',
          message: data.error || "Xatolik yuz berdi",
        });
      }
    } catch (err: any) {
      setPaymentStatus({
        type: 'error',
        message: err.message || "Tarmoqda xatolik",
      });
    } finally {
      setPaymentLoading(false);
    }
  };

  const getLevelBadgeColor = (level: LessonLevel) => {
    switch (level) {
      case 'A1':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
      case 'A2':
        return 'bg-teal-500/10 text-teal-700 border-teal-500/20';
      case 'B1':
        return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'B2':
        return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20';
      case 'C1-C2':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>Davr Academy CEFR & IELTS Dasturi</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Tayyor AI Darsliklar & O'quvchi Nazorati
            </h1>
            <p className="text-indigo-200/90 text-sm leading-relaxed">
              Bot ichiga o'quvchilar uchun A1 dan C2 gacha tayyor darsliklar, grammatik qoidalar va interaktiv test mashqlari joylandi. O'quvchilar darslarni o'zlashtirayotganda tushunmagan joylarini AI Ustoz sabr bilan batafsil tushuntirib beradi!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-indigo-300" />
              <div>
                <div className="text-xs text-indigo-300">Jami Darslar</div>
                <div className="text-lg font-bold">{lessons.length} ta mavzu</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 flex items-center space-x-3">
              <Sparkles className="w-6 h-6 text-amber-300" />
              <div>
                <div className="text-xs text-indigo-300">AI Tushuntirish</div>
                <div className="text-lg font-bold">24/7 Faol</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Darsliklar & To'lovni Tasdiqlash bo'limi (Banner & Quick Actions) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-2 border-amber-400/40 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
              <CreditCard className="w-3 h-3" />
              PREMIUM DARSLIKLAR & TO'LOV
            </span>
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <span>Admin nazorati: @jasurdos</span>
              <span className="text-amber-400">•</span>
              <a href="tel:+998945181161" className="inline-flex items-center gap-1 hover:underline text-amber-900 font-extrabold">
                <Phone className="w-3 h-3 text-amber-700" />
                <span>+998 94 518 11 61</span>
              </a>
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Premium Darsliklarga ruxsat olish va To'lovni tasdiqlash
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            To'lov qabul qiluvchi: <b>G'aniyev Sardorbek</b> • Karta raqami:{' '}
            <b className="font-mono text-slate-900 bg-amber-100/80 px-2 py-0.5 rounded">
              5614 6818 8730 1095
            </b>{' '}
            (Humo / Uzcard) • Admin Tel: <b className="text-slate-900">+998 94 518 11 61</b>. To'lov skrinshotini yuboring, admin (@jasurdos)
            tekshirib Premium kirish ruxsatini beradi!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText('5614 6818 8730 1095');
              setCopiedId('card_number');
              setTimeout(() => setCopiedId(null), 2500);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            {copiedId === 'card_number' ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Karta Nusxalandi</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-700" />
                <span>5614 6818 8730 1095</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowPaymentModal(true);
              setPaymentStatus(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>To'lov Skrinshotini Yuborish</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAdminRequests(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 text-xs font-bold shadow-md transition-all flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin: To'lov So'rovlarini Tekshirish</span>
            {paymentRequests.filter((r) => r.status === 'pending').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
                {paymentRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowPaymentModal(true);
              setPaymentStatus(null);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>To'lov Skrinshotini Yuborish</span>
          </button>
        </div>
      </div>

      {/* O'quv Jarayoni (Progress Bar) va Darslar Xaritasi (Learning Roadmap) */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 shadow-xl text-white border border-indigo-500/30 space-y-5">
        {/* Top title and stats bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-900 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-extrabold text-white">
                  O'quv Jarayoni & Darslar Xaritasi
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold">
                  PRO ROADMAP
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Barcha 5 ta daraja bo'yicha shaxsiy o'zlashtirish va rivojlanish xaritangiz
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowRoadmap(!showRoadmap)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center space-x-1.5 border border-white/10"
            >
              <Map className="w-3.5 h-3.5 text-amber-400" />
              <span>{showRoadmap ? "Xaritani yashirish" : "Xaritani ko'rsatish"}</span>
            </button>
            <button
              type="button"
              onClick={resetAllProgress}
              title="Jarayonni qayta boshlash"
              className="p-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-slate-300 transition-colors border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visual Animated Progress Bar & Percent Pill */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 flex items-center gap-1">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>
                  Yakunlandi:{' '}
                  <strong className="text-white">
                    {completedLessons.length} ta
                  </strong>{' '}
                  / {lessons.length} ta dars
                </span>
              </span>
            </div>
            <span className="text-sm font-black text-amber-400 font-mono">
              {lessons.length ? Math.round((completedLessons.length / lessons.length) * 100) : 0}%
            </span>
          </div>

          {/* Bar track */}
          <div className="h-3.5 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{
                width: `${
                  lessons.length
                    ? Math.round((completedLessons.length / lessons.length) * 100)
                    : 0
                }%`,
              }}
            />
          </div>

          {/* Level completion pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {(['A1', 'A2', 'B1', 'B2', 'C1-C2'] as const).map((lvl) => {
              const lvlLessons = lessons.filter((l) => l.level === lvl);
              const lvlCompleted = lvlLessons.filter((l) =>
                completedLessons.includes(l.id)
              );
              const isAllDone =
                lvlLessons.length > 0 && lvlCompleted.length === lvlLessons.length;

              return (
                <div
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center space-x-1.5 border ${
                    selectedLevel === lvl
                      ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>{lvl}:</span>
                  <span
                    className={`font-mono font-black ${
                      isAllDone ? 'text-emerald-400' : 'text-amber-300'
                    }`}
                  >
                    {lvlCompleted.length}/{lvlLessons.length}
                  </span>
                  {isAllDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Darslar Xaritasi (Roadmap View) */}
        {showRoadmap && (
          <div className="pt-3 border-t border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Darajalar bo'yicha Darslar Xaritasi (Bosib o'rganing)</span>
              </span>
              <span className="text-[11px] text-slate-400">
                Yashil belgilar = Bajarilgan darslar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {(['A1', 'A2', 'B1', 'B2', 'C1-C2'] as const).map((lvl) => {
                const lvlLessons = lessons.filter((l) => l.level === lvl);
                return (
                  <div
                    key={lvl}
                    className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wide">
                        {lvl} Daraja
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        {lvlLessons.filter((l) => completedLessons.includes(l.id)).length}/{lvlLessons.length}
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {lvlLessons.map((lesson, index) => {
                        const isDone = completedLessons.includes(lesson.id);
                        const isCurrent = activeLesson?.id === lesson.id;
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`p-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center justify-between gap-1.5 border ${
                              isCurrent
                                ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-sm'
                                : isDone
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5 overflow-hidden">
                              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                {index + 1}.
                              </span>
                              <span className="truncate">{lesson.title}</span>
                            </div>
                            {isDone ? (
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <CircleDot className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Level filter tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Barchasi', count: lessons.length },
            { id: 'A1', label: 'A1 (Beginner)', count: lessons.filter((l) => l.level === 'A1').length },
            { id: 'A2', label: 'A2 (Elementary)', count: lessons.filter((l) => l.level === 'A2').length },
            { id: 'B1', label: 'B1 (Intermediate)', count: lessons.filter((l) => l.level === 'B1').length },
            { id: 'B2', label: 'B2 (Upper-Intermediate)', count: lessons.filter((l) => l.level === 'B2').length },
            { id: 'C1-C2', label: 'C1–C2 (Advanced Mastery)', count: lessons.filter((l) => l.level === 'C1-C2').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedLevel(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                selectedLevel === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedLevel === tab.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowPaymentModal(true);
            setPaymentStatus(null);
          }}
          className="px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 transition-colors flex items-center space-x-1.5 shadow-xs"
        >
          <CreditCard className="w-3.5 h-3.5 text-amber-600" />
          <span>💎 Premium To'lovni Tasdiqlash</span>
        </button>
      </div>

      {/* Main content grid: Left list of lessons, Right active lesson preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lesson Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {loading ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Darsliklar yuklanmoqda...
            </div>
          ) : filteredLessons.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              Bu darajada hozircha darslar mavjud emas
            </div>
          ) : (
            filteredLessons.map((lesson) => {
              const isActive = activeLesson?.id === lesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50/80 border-indigo-500 shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold border ${getLevelBadgeColor(
                            lesson.level
                          )}`}
                        >
                          {lesson.level}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">
                          {lesson.command}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {lesson.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyCommand(lesson.command, lesson.id);
                        }}
                        title="Buyruqni nusxalash"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        {copiedId === lesson.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSendModalLesson(lesson);
                          setSendStatus(null);
                        }}
                        title="Telegram foydalanuvchiga yuborish"
                        className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLessonCompleted(lesson.id);
                        }}
                        title={
                          completedLessons.includes(lesson.id)
                            ? 'Bajarildi (bechor qilish)'
                            : 'Bajarildi deb belgilash'
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          completedLessons.includes(lesson.id)
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                        }`}
                      >
                        {completedLessons.includes(lesson.id) ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <CircleDot className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Summary badges */}
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>• {lesson.grammarRules.length} ta qoida</span>
                    <span>• {lesson.vocabulary.length} ta yangi so'z</span>
                    <span>• {lesson.practiceQuestions.length} ta test mashqi</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Active Lesson Detailed Preview */}
        <div className="lg:col-span-7">
          {activeLesson ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${getLevelBadgeColor(
                        activeLesson.level
                      )}`}
                    >
                      {activeLesson.level} • {activeLesson.lessonNumber}-Dars
                    </span>
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {activeLesson.command}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    {activeLesson.title}
                  </h2>
                  <p className="text-sm text-slate-600">{activeLesson.subtitle}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(activeLesson.command, activeLesson.id + '_top')}
                    className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    {copiedId === activeLesson.id + '_top' ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                        Nusxalandi
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1.5" />
                        Buyruq ({activeLesson.command})
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSendModalLesson(activeLesson);
                      setSendStatus(null);
                    }}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Foydalanuvchiga yuborish
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLessonCompleted(activeLesson.id)}
                    className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      completedLessons.includes(activeLesson.id)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {completedLessons.includes(activeLesson.id) ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                        <span>Bajarildi (100%)</span>
                      </>
                    ) : (
                      <>
                        <CircleDot className="w-4 h-4 mr-1.5 text-slate-500" />
                        <span>Bajarilmadi deb belgilash</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main formatted content */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Dars Matni (Telegram formatda):
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-sans text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                    {activeLesson.content}
                  </div>
                </div>

                {/* Grammar rules */}
                {activeLesson.grammarRules.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4" />
                      Eng Muhim Grammatik Qoidalar
                    </h4>
                    <ul className="space-y-2">
                      {activeLesson.grammarRules.map((rule, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 flex items-start space-x-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Vocabulary */}
                {activeLesson.vocabulary.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      Yangi So'zlar va Kollokatsiyalar
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeLesson.vocabulary.map((vocab, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-900">
                              {vocab.en}
                            </span>
                            <span className="text-xs font-semibold text-indigo-600">
                              {vocab.uz}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 italic">
                            "{vocab.example}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice questions */}
                {activeLesson.practiceQuestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      Test va Mashq Savollari
                    </h4>
                    <div className="space-y-3">
                      {activeLesson.practiceQuestions.map((q, idx) => (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-amber-50/30 border border-amber-200/60 space-y-2.5"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold text-amber-900">
                              {idx + 1}-Savol: {q.question}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isCorrect = optIdx === q.correctIndex;
                              return (
                                <div
                                  key={optIdx}
                                  className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between border ${
                                    isCorrect
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 font-bold'
                                      : 'bg-white border-slate-200 text-slate-700'
                                  }`}
                                >
                                  <span>
                                    {['A', 'B', 'C', 'D'][optIdx]}) {opt}
                                  </span>
                                  {isCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="pt-2 border-t border-amber-200/40 text-xs text-amber-900/80">
                            💡 <b>Tushuntirish:</b> {q.explanation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Explanation note */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex items-start space-x-3 shadow-md">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <b>AI Ustoz Interaktivligi:</b> Telegramda o'quvchilar ushbu dars bo'yicha savol berganda (masalan: <i>"Present simple inkorida negative fe'l qanday o'zgaradi?"</i>), bot bu darslik kontekstidan kelib chiqib 100% sabrli, o'zbekcha-inglizcha tushuntirish beradi.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center p-8 bg-white rounded-3xl border border-slate-200 text-slate-400">
              Chap tomondan darslardan birini tanlang
            </div>
          )}
        </div>
      </div>

      {/* Modal to send lesson to a Telegram user */}
      {sendModalLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Darsni Foydalanuvchiga Yuborish
                  </h3>
                  <p className="text-xs text-slate-500">
                    "{sendModalLesson.title}"
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSendModalLesson(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foydalanuvchi Telegram Chat ID raqami:
                </label>
                <input
                  type="text"
                  value={targetChatId}
                  onChange={(e) => setTargetChatId(e.target.value)}
                  placeholder="masalan: 123456789"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Maslahat: O'quvchi botga kamida bir marta yozgan bo'lishi kerak.
                </p>
              </div>

              {sendStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start space-x-2 ${
                    sendStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{sendStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSendModalLesson(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Yopish
                </button>
                <button
                  type="submit"
                  disabled={sendLoading || !targetChatId.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all flex items-center space-x-1.5"
                >
                  {sendLoading ? (
                    <span>Yuborilmoqda...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Yuborish</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Premium Darsliklar uchun To'lovni Tasdiqlash */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 md:p-7 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Premium To'lovni Tasdiqlash
                  </h3>
                  <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                    <span>Admin: @jasurdos</span>
                    <span>•</span>
                    <a href="tel:+998945181161" className="hover:underline font-bold text-amber-900">
                      +998 94 518 11 61
                    </a>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Karta ma'lumotlari qutisi */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50/70 to-amber-50 border-2 border-amber-300/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Qabul Qiluvchi Karta Egasi:
                </span>
                <span className="text-slate-900 font-extrabold">
                  G'aniyev Sardorbek
                </span>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-200 shadow-xs">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Karta Raqami (Humo / Uzcard)
                  </div>
                  <div className="text-base font-mono font-extrabold text-slate-900 tracking-wider">
                    5614 6818 8730 1095
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('5614 6818 8730 1095');
                    setCopiedId('modal_card_number');
                    setTimeout(() => setCopiedId(null), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center space-x-1"
                >
                  {copiedId === 'modal_card_number' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Nusxalandi</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Nusxalash</span>
                    </>
                  )}
                </button>
              </div>

              {/* Admin Aloqa raqami va Telegram */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900/90 pt-2 border-t border-amber-200/50">
                <div className="flex items-center gap-2">
                  <span>
                    Admin Telegram: <b>@jasurdos</b>
                  </span>
                  <a
                    href="https://t.me/jasurdos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:underline font-bold"
                  >
                    <span>Yozish</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5 text-amber-700" />
                  <span>Admin Tel:</span>
                  <a href="tel:+998945181161" className="text-slate-900 hover:underline font-extrabold">
                    +998 94 518 11 61
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. O'quvchi ismi yoki Telegram Username: *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={paymentForm.userHandle}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        userHandle: e.target.value,
                      })
                    }
                    placeholder="masalan: @jasurdos_student yoki Azizbek"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Tanlangan Premium Kurs yoki Daraja: *
                </label>
                <select
                  value={paymentForm.courseTitle}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      courseTitle: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  required
                >
                  <option value="IELTS Pro 8.0+ Mastery (B2-C1) — 149,000 so'm">
                    IELTS Pro 8.0+ Mastery (B2-C1) — 149,000 so'm
                  </option>
                  <option value="Barcha 45+ Darsliklar & AI Ustoz VIP — 199,000 so'm">
                    Barcha 45+ Darsliklar & AI Ustoz VIP — 199,000 so'm
                  </option>
                  <option value="A1-A2 Boshlang'ich Intensiv Kurs — 99,000 so'm">
                    A1-A2 Boshlang'ich Intensiv Kurs — 99,000 so'm
                  </option>
                  <option value="B1-B2 O'rta Daraja Intensiv — 129,000 so'm">
                    B1-B2 O'rta Daraja Intensiv — 129,000 so'm
                  </option>
                  <option value="C1 Advanced Grammar & Academic Vocab — 139,000 so'm">
                    C1 Advanced Grammar & Academic Vocab — 139,000 so'm
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. To'lov Skrinshoti (Fayl yuklang yoki URL kiriting): *
                </label>

                {/* File input drag / select box */}
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-amber-500 transition-colors bg-slate-50/50">
                  {screenshotPreview ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <img
                          src={screenshotPreview}
                          alt="To'lov skrinshoti"
                          className="max-h-40 rounded-xl border border-slate-200 shadow-sm mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setScreenshotPreview(null);
                            setPaymentForm((prev) => ({
                              ...prev,
                              screenshotName: '',
                            }));
                          }}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700"
                          title="O'chirish"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-emerald-700">
                        📎 {paymentForm.screenshotName || 'Skrinshot tanlandi'}
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center space-y-1.5 py-2">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        Skrinshot rasm faylini tanlang
                      </span>
                      <span className="text-[11px] text-slate-500">
                        JPG, PNG, WEBP (maksimal 10 MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Optional URL Input if not uploading file */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={paymentForm.screenshotUrl}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        screenshotUrl: e.target.value,
                      })
                    }
                    placeholder="Yoki skrinshot URL / rasm havolasini kiriting..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. Qo'shimcha Izoh / Telefon raqam (Ixtiyoriy):
                </label>
                <input
                  type="text"
                  value={paymentForm.note}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, note: e.target.value })
                  }
                  placeholder="masalan: +998901234567, hozirgina Payme orqali o'tkazdim"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {paymentStatus && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start space-x-2.5 ${
                    paymentStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-medium'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{paymentStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Yopish
                </button>
                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center space-x-1.5"
                >
                  {paymentLoading ? (
                    <span>Yuborilmoqda...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Adminga (@jasurdos) Yuborish</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin Paneli — Premium To'lov So'rovlarini Tekshirish va Tasdiqlash */}
      {showAdminRequests && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 md:p-7 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-amber-400 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Admin Paneli — Premium To'lov So'rovlari
                  </h3>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <span>Nazoratchi: @jasurdos (+998 94 518 11 61)</span>
                    <span>•</span>
                    <span className="text-emerald-600">G'aniyev Sardorbek (5614 6818 8730 1095)</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminRequests(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Top Stats Banner */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-[11px] font-bold text-amber-800">Kutilmoqda (Pending)</div>
                <div className="text-xl font-black text-amber-900">
                  {paymentRequests.filter((r) => r.status === 'pending').length} ta
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="text-[11px] font-bold text-emerald-800">Tasdiqlangan (Approved)</div>
                <div className="text-xl font-black text-emerald-900">
                  {paymentRequests.filter((r) => r.status === 'approved').length} ta
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200">
                <div className="text-[11px] font-bold text-red-800">Rad etilgan (Rejected)</div>
                <div className="text-xl font-black text-red-900">
                  {paymentRequests.filter((r) => r.status === 'rejected').length} ta
                </div>
              </div>
            </div>

            {/* Payment Requests List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {paymentRequests.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 text-center text-slate-400 font-bold text-sm">
                  Hozircha hech qanday to'lov so'rovlari yo'q
                </div>
              ) : (
                paymentRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      req.status === 'approved'
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : req.status === 'rejected'
                        ? 'bg-red-50/50 border-red-200'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {req.userHandle}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              req.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : req.status === 'rejected'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {req.status === 'approved'
                              ? 'Tasdiqlangan ✅'
                              : req.status === 'rejected'
                              ? 'Rad Etildi ❌'
                              : 'Kutilmoqda ⏳'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 font-semibold">
                          {req.courseTitle} •{' '}
                          <span className="text-indigo-600 font-bold">{req.amount}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                          <span>{req.date}</span>
                          <span>•</span>
                          <span>Karta: {req.cardNumber}</span>
                          <span>•</span>
                          <span>Qabul qiluvchi: {req.receiverName}</span>
                        </div>
                        {req.note && (
                          <div className="text-xs bg-slate-50 p-2 rounded-xl border border-slate-100 text-slate-600 mt-1">
                            💬 <strong>Izoh:</strong> {req.note}
                          </div>
                        )}
                      </div>

                      {/* Approve / Reject Actions */}
                      <div className="flex items-center space-x-2 shrink-0">
                        {req.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleUpdatePaymentStatus(req.id, 'approved')}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center space-x-1 shadow-sm shadow-emerald-500/20"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Tasdiqlash</span>
                          </button>
                        )}

                        {req.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleUpdatePaymentStatus(req.id, 'rejected')}
                            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center space-x-1 shadow-sm shadow-red-500/20"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Rad etish</span>
                          </button>
                        )}

                        {(req.status === 'approved' || req.status === 'rejected') && (
                          <button
                            type="button"
                            onClick={() => handleUpdatePaymentStatus(req.id, 'pending')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
                            title="Qayta kutilmoqda holatiga o'tkazish"
                          >
                            Qayta ko'rish
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-semibold">
                * Tasdiqlanganda o'quvchining Premium bo'limlariga ruxsati ochiladi
              </span>
              <button
                type="button"
                onClick={() => setShowAdminRequests(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
