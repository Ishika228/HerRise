import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  ShieldCheck,
  TrendingUp,
  Tag,
  Layers,
  FileCheck
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useToast } from '../../../context/ToastContext';

export const ResumeAnalyzerView: React.FC = () => {
  const {
    resumeAnalysis,
    isAnalyzing,
    analyzeResumeContent,
    parseResumeFile,
    importParsedResume,
    profile,
    activeResume
  } = useHerCareer();
  const { showToast } = useToast();

  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [targetJobDesc, setTargetJobDesc] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);

  // Helper to serialize any parsed resume or active builder resume into comprehensive evaluation text
  const serializeResumeToText = (res: any): string => {
    if (!res) return '';
    const parts: string[] = [];
    const name = res.fullName || res.personalInfo?.fullName;
    const headline = res.headline || res.title || res.personalInfo?.headline;
    const summary = res.summary || '';
    if (name) parts.push(`Candidate: ${name}`);
    if (headline) parts.push(`Target Role: ${headline}`);
    if (summary) parts.push(`Professional Summary:\n${summary}`);

    const skills = res.skills?.technical || res.skills;
    if (Array.isArray(skills) && skills.length > 0) {
      parts.push(`Technical Skills:\n${skills.join(', ')}`);
    }

    const exp = res.experience || [];
    if (Array.isArray(exp) && exp.length > 0) {
      const expStr = exp
        .map((e: any) => {
          const role = e.title || e.role || 'Role';
          const company = e.company || '';
          const duration = e.duration || '';
          const highlights = Array.isArray(e.highlights)
            ? e.highlights.join(' ')
            : e.description || '';
          return `• ${role} at ${company} (${duration})\n  ${highlights}`;
        })
        .join('\n');
      parts.push(`Work Experience:\n${expStr}`);
    }

    const edu = res.education || [];
    if (Array.isArray(edu) && edu.length > 0) {
      const eduStr = edu
        .map((ed: any) => `• ${ed.degree} from ${ed.institution} (${ed.year || ed.graduationYear || ''})`)
        .join('\n');
      parts.push(`Education:\n${eduStr}`);
    }

    const proj = res.projects || [];
    if (Array.isArray(proj) && proj.length > 0) {
      const projStr = proj
        .map((p: any) => `• ${p.title}: ${p.description || ''} (Tech: ${Array.isArray(p.technologies) ? p.technologies.join(', ') : ''})`)
        .join('\n');
      parts.push(`Projects:\n${projStr}`);
    }

    return parts.filter(Boolean).join('\n\n');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsParsingFile(true);
    try {
      const data = await parseResumeFile(file);
      if (data && data.parsed) {
        showToast('Document Analyzed Successfully', `Extracted details from ${file.name}`, 'success');
        // Synchronize and apply extracted resume to Resume Builder & profile
        await importParsedResume(data.parsed);
        // Build rich comprehensive resume text
        const fullResumeText = data.rawText && data.rawText.trim().length > 30
          ? data.rawText
          : serializeResumeToText(data.parsed);

        setPastedText(fullResumeText);
        await analyzeResumeContent(fullResumeText, targetJobDesc);
      }
    } catch (err) {
      showToast('Parsing Notice', 'Could not parse document directly. You can paste the text below.', 'warning');
    } finally {
      setIsParsingFile(false);
    }
  };

  const handleRunAnalysis = async () => {
    let text = pastedText.trim();

    if (!text && activeResume?.personalInfo?.fullName) {
      text = serializeResumeToText(activeResume);
      setPastedText(text);
    }

    if (!text || text.length < 15) {
      showToast('Input Required', 'Please upload a resume or paste your resume text to evaluate.', 'warning');
      return;
    }

    await analyzeResumeContent(text, targetJobDesc);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Resume Evaluation Engine</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Audit Your Resume with Technical Recruiter Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Identify weak descriptions, missing high-demand keywords, and format readiness. Scores are estimated quality assessments.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Upload Document (PDF/Word)
          </button>
          <button
            type="button"
            onClick={() => setInputMode('paste')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Paste Text Directly
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        {inputMode === 'upload' ? (
          <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-teal-500 transition-colors bg-slate-50/50">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">
              {uploadedFile ? uploadedFile.name : 'Upload Your Resume File'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, Word (.docx), or text format (Max 10MB)</p>

            <label className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
              {isParsingFile ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{isParsingFile ? 'Extracting with Eden AI Engine...' : 'Select File from Computer'}</span>
              <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            {activeResume?.personalInfo?.fullName && (
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-slate-500">
                  Or evaluate your active resume: <strong className="text-slate-900">{activeResume.personalInfo.fullName}</strong> ({activeResume.title || 'Builder Resume'})
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const txt = serializeResumeToText(activeResume);
                    setPastedText(txt);
                    analyzeResumeContent(txt, targetJobDesc);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold border border-teal-200 transition-all cursor-pointer"
                >
                  Evaluate Active Resume →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">Paste Resume Raw Content:</label>
              {activeResume?.personalInfo?.fullName && (
                <button
                  type="button"
                  onClick={() => setPastedText(serializeResumeToText(activeResume))}
                  className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
                >
                  Insert from Resume Builder
                </button>
              )}
            </div>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your full resume text here..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
        )}

        {/* Target Job Description (Optional) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Target Job Description (Optional, for tailored alignment score):
          </label>
          <input
            type="text"
            placeholder="Paste target job responsibilities or title (e.g. Senior Frontend Engineer at Atlassian)"
            value={targetJobDesc}
            onChange={(e) => setTargetJobDesc(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        </div>

        {/* Action Trigger Button */}
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing || isParsingFile}
          className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-teal-200" />
              <span>Analyzing with Live AI Engine...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>Evaluate Resume with AI</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results Display */}
      {resumeAnalysis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
          {/* Quality Score Header Card */}
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold">
                <span>Estimated Quality Assessment</span>
              </div>
              <h3 className="text-2xl font-black">Resume Assessment: {resumeAnalysis.summaryRating}</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                This estimated score reflects formatting clarity, impact-oriented metrics, and technical keyword density. It does not guarantee ATS selection by any employer.
              </p>
            </div>

            <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0 self-center">
              <div className="text-4xl font-black text-teal-300">{resumeAnalysis.overallScore}</div>
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">Out of 100</div>
            </div>
          </div>

          {/* 4 Category Score Gauges */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Impact & Metrics</span>
                <span className="text-slate-900">{resumeAnalysis.categoryScores.impactAndMetrics}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${resumeAnalysis.categoryScores.impactAndMetrics}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Skills Alignment</span>
                <span className="text-teal-700">{resumeAnalysis.categoryScores.skillsAlignment}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-600 rounded-full"
                  style={{ width: `${resumeAnalysis.categoryScores.skillsAlignment}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Formatting & Clarity</span>
                <span className="text-indigo-700">{resumeAnalysis.categoryScores.formattingAndClarity}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${resumeAnalysis.categoryScores.formattingAndClarity}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Experience Depth</span>
                <span className="text-cyan-700">{resumeAnalysis.categoryScores.experienceDepth}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-600 rounded-full"
                  style={{ width: `${resumeAnalysis.categoryScores.experienceDepth}%` }}
                />
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Identified Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {resumeAnalysis.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm border-b border-slate-100 pb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Areas for Enhancement</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-700">
                {resumeAnalysis.improvements.map((imp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Missing High-Impact Keywords */}
          {resumeAnalysis.missingKeywords && resumeAnalysis.missingKeywords.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm border-b border-slate-100 pb-2">
                <Tag className="w-4 h-4 text-teal-600" />
                <span>Recommended Missing Keywords for {profile.targetRole}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeAnalysis.missingKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Before vs After Bullet Point Comparison */}
          {resumeAnalysis.improvedSampleBullets && resumeAnalysis.improvedSampleBullets.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Original vs. AI-Improved Bullet Comparison
              </h3>

              <div className="space-y-3">
                {resumeAnalysis.improvedSampleBullets.map((pair, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                        Original (Basic Duty)
                      </span>
                      <p className="text-xs text-slate-600 italic">"{pair.original}"</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        AI Improved (Quantified Impact)
                      </span>
                      <p className="text-xs text-slate-900 font-semibold">"{pair.improved}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

