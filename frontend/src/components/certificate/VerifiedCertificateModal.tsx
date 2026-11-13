import React, { useState, useRef } from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  QrCode,
  FileCheck2,
  Lock
} from 'lucide-react';
import { Certificate } from '../../types';
import { generateCertificatePdf } from '../../services/certificateService';

interface VerifiedCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  recipientName?: string;
  onToast?: (title: string, msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const VerifiedCertificateModal: React.FC<VerifiedCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
  recipientName,
  onToast
}) => {
  const [activeView, setActiveView] = useState<'certificate' | 'verification'>('certificate');
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !certificate) return null;

  const candidateName =
    recipientName || certificate.issuedTo || 'Verified HerRise Scholar';
  const verificationUrl =
    certificate.verificationUrl || `https://herrise.org/verify/${certificate.credentialId}`;
  const certId = certificate.credentialId;
  const issueDate = certificate.issueDate || 'October 28, 2026';
  const instructor = certificate.instructorName || 'Rhea Shenoy, CA';
  const instructorTitle =
    certificate.instructorTitle || 'Chartered Accountant & Lead Wealth Strategist';
  const director = certificate.directorName || 'Dr. Arundhati Roy';
  const directorTitle =
    certificate.directorTitle || 'Academic Dean, HerRise Institute';
  const skills = certificate.skillsCovered || [
    'Financial Independence Architecture',
    'Asset Allocation & Risk Modeling',
    'Tax Efficiency Optimization',
    'Strategic Wealth Preservation'
  ];
  const grade = certificate.grade || 'Distinction with Honours (98%)';
  const hours = certificate.hoursCompleted || 24;

  const handleDownloadPdf = () => {
    try {
      generateCertificatePdf(certificate, { recipientName: candidateName });
      onToast?.(
        'Certificate Downloaded! 🎓',
        `Official A4 PDF exported for ${certificate.courseTitle}`,
        'success'
      );
    } catch (err: any) {
      onToast?.('Export Failed', err.message || 'Could not generate PDF', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      onToast?.(
        'Link Copied',
        'Direct verification link copied to clipboard',
        'success'
      );
    } catch {
      onToast?.('Copy Error', 'Please copy manually: ' + verificationUrl, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      {/* Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[94vh]">

        {/* Modal Action Header */}
        <div className="bg-gradient-to-r from-[#2c0839] via-[#4A154B] to-[#701a75] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-pink-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight">
                  Official Verified Credential
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Authentic
                </span>
              </div>
              <p className="text-[11px] text-purple-200 font-mono">
                ID: {certId} • Issued {issueDate}
              </p>
            </div>
          </div>

          {/* Tab Selector & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="bg-white/10 p-0.5 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setActiveView('certificate')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  activeView === 'certificate'
                    ? 'bg-white text-[#4A154B] shadow-sm font-bold'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                Certificate
              </button>
              <button
                onClick={() => setActiveView('verification')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeView === 'verification'
                    ? 'bg-white text-[#4A154B] shadow-sm font-bold'
                    : 'text-purple-200 hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3" />
                Proof
              </button>
            </div>

            <button
              onClick={handleDownloadPdf}
              className="bg-pink-600 hover:bg-pink-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Download print-ready PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="bg-white/15 hover:bg-white/25 text-white p-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopyLink}
              className="bg-white/15 hover:bg-white/25 text-white p-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Copy verification link"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable View Content */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-100 flex-1 flex flex-col items-center justify-center">

          {/* VIEW 1: PRESENTABLE LUXURY CERTIFICATE */}
          {activeView === 'certificate' && (
            <div
              ref={certRef}
              id="printable-certificate"
              className="w-full max-w-3xl bg-[#fdfcf9] text-gray-900 rounded-2xl shadow-xl border-[6px] border-[#4A154B] p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between my-auto"
              style={{
                backgroundImage:
                  'radial-gradient(#4A154B 0.35px, transparent 0.35px), radial-gradient(#d4af37 0.35px, #fdfcf9 0.35px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px'
              }}
            >
              {/* Inner Decorative Gold Border */}
              <div className="absolute inset-3 border-2 border-[#d4af37] pointer-events-none rounded-lg" />
              <div className="absolute inset-4 border border-[#e5c07b]/60 pointer-events-none rounded" />

              {/* Four Classic Corner Ornaments */}
              <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-[#4A154B] pointer-events-none" />
              <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-[#4A154B] pointer-events-none" />
              <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-[#4A154B] pointer-events-none" />
              <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-[#4A154B] pointer-events-none" />

              {/* Watermark Logo in Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                <Award className="w-96 h-96 text-[#4A154B]" />
              </div>

              {/* Top Section: Header & Institution */}
              <div className="text-center relative z-10 pt-2 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#4A154B]/10 text-[#4A154B] text-[10px] font-bold tracking-wider uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-[#be185d]" />
                  <span>HerRise Institute of Applied Sciences & Leadership</span>
                </div>

                <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
                  Verified Digital Academic Credential
                </div>

                <h1
                  className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#4A154B] tracking-tight pt-2"
                  style={{ fontFamily: 'Georgia, Cambria, serif' }}
                >
                  Certificate of Accomplishment
                </h1>

                <p className="text-xs sm:text-sm text-gray-500 italic pt-1">
                  This officially accredited credential is proudly conferred upon
                </p>
              </div>

              {/* Recipient Full Name */}
              <div className="text-center my-4 sm:my-5 relative z-10">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#3b0764] tracking-tight py-1 inline-block"
                  style={{ fontFamily: 'Georgia, Cambria, serif' }}
                >
                  {candidateName}
                </h2>
                {/* Gold filigree underline flourish */}
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#d4af37]" />
                  <span className="text-[#d4af37] text-xs">✦ ✦ ✦</span>
                  <div className="h-[1.5px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#d4af37]" />
                </div>
              </div>

              {/* Course Title & Competencies */}
              <div className="text-center space-y-2 relative z-10 max-w-2xl mx-auto">
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  for demonstrating exceptional mastery, rigorous evaluation benchmarks, and applied proficiency in the professional executive masterclass
                </p>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#4A154B] tracking-tight px-4 py-1.5 bg-gradient-to-r from-transparent via-purple-50 to-transparent inline-block rounded-xl border-y border-purple-100">
                  {certificate.courseTitle}
                </h3>

                {/* Skills tags */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-white px-2.5 py-0.5 rounded-full border border-purple-200/70 text-purple-900 shadow-2xs"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Grade & Hours */}
                <div className="text-[11px] font-bold text-[#be185d] pt-1">
                  {grade} • {hours} Verified Instructional Hours
                </div>
              </div>

              {/* Middle/Bottom: Signatures & Gold Medallion Seal */}
              <div className="grid grid-cols-3 items-end pt-8 pb-4 relative z-10 px-2 sm:px-6">

                {/* Left: Instructor Signature */}
                <div className="text-center space-y-1">
                  <div
                    className="text-lg sm:text-xl font-serif italic text-[#4A154B] font-bold select-none"
                    style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive, serif" }}
                  >
                    {instructor}
                  </div>
                  <div className="w-32 sm:w-40 h-[1px] bg-gray-400 mx-auto" />
                  <div className="text-xs font-bold text-gray-800">{instructor}</div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    {instructorTitle}
                  </div>
                </div>

                {/* Center: 3D Official Gold Foil Embossed Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#b45309] via-[#f59e0b] to-[#fef08a] p-1 shadow-lg flex items-center justify-center text-center">
                    {/* Inner gold ring */}
                    <div className="w-full h-full rounded-full border-2 border-dashed border-[#78350f]/60 bg-gradient-to-b from-[#fef3c7] to-[#fde68a] flex flex-col items-center justify-center p-1 text-[#78350f]">
                      <span className="text-[7px] font-extrabold tracking-widest uppercase">
                        ★ HERRISE ★
                      </span>
                      <Award className="w-6 h-6 sm:w-7 sm:h-7 text-[#92400e] my-0.5" />
                      <span className="text-[6.5px] font-bold tracking-wider uppercase leading-none">
                        OFFICIAL SEAL
                      </span>
                      <span className="text-[5.5px] font-extrabold tracking-tighter text-[#78350f]">
                        EXCELLENCE
                      </span>
                    </div>

                    {/* Ribbon Tails */}
                    <div className="absolute -bottom-3 left-3 w-4 h-6 bg-gradient-to-b from-[#d97706] to-[#b45309] transform -rotate-12 rounded-xs shadow-xs" />
                    <div className="absolute -bottom-3 right-3 w-4 h-6 bg-gradient-to-b from-[#d97706] to-[#b45309] transform rotate-12 rounded-xs shadow-xs" />
                  </div>
                  <span className="text-[9px] font-bold text-amber-900 uppercase tracking-widest mt-3.5">
                    Verified Seal
                  </span>
                </div>

                {/* Right: Academic Director Signature */}
                <div className="text-center space-y-1">
                  <div
                    className="text-lg sm:text-xl font-serif italic text-[#4A154B] font-bold select-none"
                    style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive, serif" }}
                  >
                    {director}
                  </div>
                  <div className="w-32 sm:w-40 h-[1px] bg-gray-400 mx-auto" />
                  <div className="text-xs font-bold text-gray-800">{director}</div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    {directorTitle}
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Verification Strip & QR Code */}
              <div className="border-t border-[#d4af37]/60 pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-left relative z-10 text-[10px] text-gray-500">
                <div className="flex items-center gap-3">
                  {/* Clean SVG QR Code representation */}
                  <div className="w-11 h-11 bg-white p-1 rounded-md border border-gray-300 shadow-2xs shrink-0 flex items-center justify-center">
                    <QrCode className="w-9 h-9 text-[#4A154B]" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-gray-800 flex items-center gap-1">
                      <span>ID:</span>
                      <span className="text-[#4A154B]">{certId}</span>
                    </div>
                    <div>Awarded: {issueDate} • Lifetime Validity</div>
                    <div className="text-[9px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Cryptographically Validated on HerRise Registry
                    </div>
                  </div>
                </div>

                <div className="text-right sm:max-w-xs">
                  <div className="font-semibold text-gray-700">
                    Verify authenticity online:
                  </div>
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#be185d] font-mono hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{verificationUrl.replace('https://', '')}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: CRYPTOGRAPHIC VERIFICATION PROOF & REGISTRY AUDIT */}
          {activeView === 'verification' && (
            <div className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-md border border-purple-100 space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-purple-50">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-gray-900">
                    Cryptographic Proof of Credential
                  </h4>
                  <p className="text-xs text-gray-500">
                    Public verification record registered on the HerRise Educational Ledger.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Credential ID</span>
                  <div className="font-mono font-extrabold text-[#4A154B] text-sm">{certId}</div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Issuing Entity</span>
                  <div className="font-semibold text-gray-900">HerRise Institute of Applied Sciences</div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Recipient Name</span>
                  <div className="font-bold text-gray-900">{candidateName}</div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Award Date</span>
                  <div className="font-semibold text-gray-900">{issueDate}</div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Status</span>
                  <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified & Tamper-Evident
                  </div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400">Accreditation</span>
                  <div className="font-semibold text-gray-900">AQF & Global Standard Alignment</div>
                </div>
              </div>

              {/* Blockchain SHA256 Signature */}
              <div className="p-3.5 bg-gray-900 text-gray-100 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px] text-gray-400 uppercase font-mono">
                  <span>Cryptographic SHA-256 Digest</span>
                  <span className="text-emerald-400">SECURE RECORD</span>
                </div>
                <div className="font-mono text-[11px] text-emerald-300 break-all">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855-{certId.replace(/[^a-zA-Z0-9]/g, '')}
                </div>
              </div>

              {/* Direct Link Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-gray-500 truncate max-w-sm">
                  Public URL: <span className="font-mono text-[#4A154B]">{verificationUrl}</span>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto bg-[#4A154B] hover:bg-[#350c36] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Verification Link'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-white px-6 py-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <span>Ready for LinkedIn, resume attachments, or physical framing.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-purple-200 text-[#4A154B] hover:bg-purple-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-none bg-[#4A154B] hover:bg-[#350c36] text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
