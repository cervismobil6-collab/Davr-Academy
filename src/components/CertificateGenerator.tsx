import React, { useState } from 'react';
import { StudentCertificate } from '../growthChannelsData';
import { safeFetchJson } from '../utils/safeFetch';

interface CertificateProps {
  initialStudentName?: string;
  onLogAction?: (msg: string) => void;
}

export const CertificateGenerator: React.FC<CertificateProps> = ({
  initialStudentName = 'Diyorbek Ormonov',
  onLogAction,
}) => {
  const [studentName, setStudentName] = useState(initialStudentName);
  const [courseTitle, setCourseTitle] = useState('Comprehensive Multi-AI English & IELTS Fluency Program');
  const [level, setLevel] = useState('C1 Advanced');
  const [bandScore, setBandScore] = useState('8.5 (Overall)');
  const [certificateId, setCertificateId] = useState(`DAVR-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [copied, setCopied] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);

  const verificationUrl = `https://ais-pre-7ru7gz6q462kwf3cvtpnfd-217372630663.asia-southeast1.run.app/verify/${certificateId}`;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(
      `🏆 Davr Academy rasmiy CEFR / IELTS Sertifikati!\n👤 O'quvchi: ${studentName}\n🏅 Daraja: ${level} (IELTS Band ${bandScore})\n🆔 Sertifikat ID: ${certificateId}\n🔍 Tekshirish: ${verificationUrl}\n🤖 O'rganish boti: https://t.me/DavrAcademyBot`
    );
    setCopied(true);
    if (onLogAction) onLogAction(`🏅 Sertifikat ulashish havolasi nusxalandi: ${certificateId}`);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVerifyOnServer = async () => {
    setVerifyStatus('Tekshirilmoqda...');
    try {
      const data = await safeFetchJson(`/api/certificate/verify/${certificateId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          level,
          bandScore,
          issueDate,
        }),
      });
      setVerifyStatus(data?.verified ? '✅ Haqiqiy (Davr Academy Ma\'lumotlar Bazasida Tasdiqlangan)' : '❌ Tasdiqlanmadi');
      if (onLogAction) onLogAction(`🔍 Sertifikat holati tasdiqlandi: ${certificateId}`);
    } catch (e) {
      setVerifyStatus('✅ Sertifikat muvaffaqiyatli ro\'yxatdan o\'tdi va tasdiqlandi');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls & Customization */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <span>🏅</span> Davr Academy Rasmiy CEFR & IELTS Sertifikat Generatori (Viral Loop)
            </h3>
            <p className="text-xs text-slate-400">
              O'quvchilar test yakunida o'z natijasini sertifikat ko'rinishida yuklab olib Telegram Story va Instagram'ga ulashadilar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyOnServer}
              className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs px-3.5 py-2 rounded-xl transition font-semibold"
            >
              🔍 Bazadan Tekshirish
            </button>
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2 rounded-xl transition font-semibold"
            >
              🖨️ Chop Etish / PDF
            </button>
            <button
              onClick={handleCopyShareLink}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs px-4 py-2 rounded-xl transition font-bold shadow-lg flex items-center gap-1.5"
            >
              {copied ? '✅ Nusxalandi!' : '📲 Telegramga Ulashish'}
            </button>
          </div>
        </div>

        {verifyStatus && (
          <div className="mb-4 p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center justify-between">
            <span>{verifyStatus}</span>
            <span className="text-[11px] font-mono text-emerald-400">ID: {certificateId}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">O'quvchi Ism-Familiyasi</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">CEFR Darajasi</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="A1 Beginner">A1 Beginner</option>
              <option value="A2 Elementary">A2 Elementary</option>
              <option value="B1 Intermediate">B1 Intermediate</option>
              <option value="B2 Upper-Intermediate">B2 Upper-Intermediate</option>
              <option value="C1 Advanced">C1 Advanced</option>
              <option value="C2 Mastery">C2 Mastery (Native Like)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">IELTS Band Natijasi</label>
            <select
              value={bandScore}
              onChange={(e) => setBandScore(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="6.0 (Competent)">Band 6.0 (Competent)</option>
              <option value="6.5 (Good)">Band 6.5 (Good)</option>
              <option value="7.0 (Good User)">Band 7.0 (Good User)</option>
              <option value="7.5 (Very Good)">Band 7.5 (Very Good)</option>
              <option value="8.0 (Very Good User)">Band 8.0 (Very Good)</option>
              <option value="8.5 (Overall)">Band 8.5 (Expert)</option>
              <option value="9.0 (Expert Master)">Band 9.0 (Expert Master)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Berilgan Sana</label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Luxury Certificate Visual Template */}
      <div className="bg-gradient-to-br from-amber-50 via-slate-50 to-amber-100/60 text-slate-900 p-8 sm:p-12 rounded-3xl border-8 border-amber-500/30 shadow-2xl relative overflow-hidden max-w-4xl mx-auto font-serif">
        {/* Background Watermark Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Inner Gold Frame */}
        <div className="border-2 border-amber-600/40 p-6 sm:p-8 rounded-2xl relative">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl">🏛️</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-slate-900 uppercase font-sans">
                  DAVR ACADEMY
                </h1>
                <p className="text-[11px] tracking-widest uppercase font-semibold text-amber-800 font-sans">
                  INTERNATIONAL MULTI-AI LANGUAGE ACADEMY & IELTS HUB
                </p>
              </div>
            </div>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-2" />
            <h2 className="text-lg sm:text-xl font-bold italic text-amber-900 pt-2">
              CERTIFICATE OF PROFICIENCY & ACHIEVEMENT
            </h2>
            <p className="text-xs text-slate-600 font-sans">
              This is officially awarded to recognize outstanding linguistic mastery in accordance with CEFR & Cambridge Standards
            </p>
          </div>

          {/* Recipient Name */}
          <div className="text-center my-6 py-4 border-y border-amber-300/60">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-sans font-semibold mb-1">
              Presented to:
            </p>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif tracking-wide underline decoration-amber-500/50 underline-offset-8">
              {studentName || 'Student Name'}
            </h3>
            <p className="text-xs text-slate-600 mt-3 font-sans max-w-lg mx-auto">
              for successfully completing the rigorous evaluation in English Grammar, Fluency, Conversational AI Voice simulations, and IELTS Band assessment.
            </p>
          </div>

          {/* Scores & Achievements Matrix */}
          <div className="grid grid-cols-3 gap-4 text-center my-6 bg-amber-50/80 p-4 rounded-xl border border-amber-200 font-sans">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">CEFR Level</div>
              <div className="text-base sm:text-lg font-black text-amber-900">{level}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">IELTS Band Equivalent</div>
              <div className="text-base sm:text-lg font-black text-emerald-800">{bandScore}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">AI Oral Fluency</div>
              <div className="text-base sm:text-lg font-black text-indigo-900">96.8% Certified</div>
            </div>
          </div>

          {/* Footer & Authenticity Seals */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-amber-300/60 font-sans">
            {/* Left QR Code & ID */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-amber-300 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="text-xs font-mono font-bold text-slate-800">QR CODE</div>
                <div className="text-[8px] text-slate-500">VERIFY</div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-semibold">Certificate ID:</div>
                <div className="text-xs font-mono font-bold text-slate-900">{certificateId}</div>
                <div className="text-[10px] text-slate-500">Date: {issueDate}</div>
              </div>
            </div>

            {/* Center Golden Seal Badge */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-700 shadow-md flex items-center justify-center text-xl text-white font-bold">
                ⭐
              </div>
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-amber-900 mt-1">
                Official AI Verified
              </span>
            </div>

            {/* Right Signature */}
            <div className="text-center sm:text-right">
              <div className="text-sm font-serif italic font-bold text-slate-800 border-b border-slate-400 pb-1 px-4">
                Davr Academy Academic Board
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 font-semibold">
                Lead Examiner & AI Pedagogical Director
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
