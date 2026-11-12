import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  Send,
  Loader2,
  Play,
  Volume2
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';
import { useToast } from '../../../context/ToastContext';

export const InterviewPrepView: React.FC = () => {
  const {
    interviewQuestions,
    activeQuestionIndex,
    setActiveQuestionIndex,
    isSimulating,
    startInterviewSimulation,
    submitInterviewAnswer,
    resetInterviewSimulation,
    profile
  } = useHerCareer();
  const { showToast } = useToast();

  const [role, setRole] = useState(profile.targetRole || 'Software Engineer');
  const [category, setCategory] = useState<string>('Technical Interview');
  const [difficulty, setDifficulty] = useState<string>('Intermediate');
  const [userAnswerText, setUserAnswerText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const categories = [
    'Technical Interview',
    'HR Interview',
    'Behavioral Interview',
    'Communication Skills',
    'Situational Questions',
    'Fresher Interview',
    'Management Interview'
  ];

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = true;
        reco.interimResults = true;
        reco.lang = 'en-US';

        reco.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };

        reco.onerror = (err: any) => {
          console.warn('Speech recognition notice:', err);
          setIsRecording(false);
        };

        setRecognition(reco);
      }
    }
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognition) {
      showToast('Speech Not Supported', 'Your browser does not support Web Speech. Please type your response.', 'info');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      showToast('Microphone Stopped', 'Voice transcribed to answer box', 'info');
    } else {
      try {
        recognition.start();
        setIsRecording(true);
        showToast('Listening...', 'Speak your answer clearly into the microphone', 'success');
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const handleStartSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    await startInterviewSimulation(role, category, difficulty);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswerText.trim()) {
      showToast('Input Required', 'Please type or speak your response before evaluating', 'warning');
      return;
    }

    setIsSubmittingAnswer(true);
    if (isRecording && recognition) {
      recognition.stop();
      setIsRecording(false);
    }

    try {
      await submitInterviewAnswer(userAnswerText);
      showToast('Feedback Ready! 🎯', 'AI analyzed your response', 'success');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const currentQ = interviewQuestions[activeQuestionIndex];
  const allAnswered = interviewQuestions.length > 0 && interviewQuestions.every((q) => q.score !== undefined);
  const averageScore =
    interviewQuestions.length > 0
      ? Math.round(
          interviewQuestions.reduce((sum, q) => sum + (q.score || 0), 0) /
            interviewQuestions.filter((q) => q.score !== undefined).length
        ) || 85
      : 0;

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
            <Mic className="w-4 h-4 text-teal-600" />
            <span>AI Interview Simulator & Communication Coach</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">Realistic Job Interview Simulations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Answer questions by typing or speaking. Get instant feedback on clarity, missing technical points, and model answers.
          </p>
        </div>

        {isSimulating && (
          <button
            type="button"
            onClick={resetInterviewSimulation}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        )}
      </div>

      {!isSimulating ? (
        /* Setup Form */
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-2">
              <Play className="w-6 h-6 fill-teal-800" />
            </div>
            <h3 className="text-lg font-black text-slate-900">Configure Your Interview Practice</h3>
            <p className="text-xs text-slate-500">Tailor the simulation to your upcoming interview rounds</p>
          </div>

          <form onSubmit={handleStartSimulation} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Job Role</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Data Analyst, Product Manager"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interview Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white cursor-pointer"
                >
                  <option value="Beginner">Beginner (Foundations & Concepts)</option>
                  <option value="Intermediate">Intermediate (Real Scenarios & Architecture)</option>
                  <option value="Advanced">Advanced (High-Scale & Leadership)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span>Launch AI Interview Simulation</span>
            </button>
          </form>
        </div>
      ) : (
        /* Active Interview Simulator Flow */
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Question {activeQuestionIndex + 1} of {interviewQuestions.length}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {category}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {interviewQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setUserAnswerText(q.userAnswer || '');
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeQuestionIndex === idx
                      ? 'bg-[#0f172a] text-white shadow-xs'
                      : q.score !== undefined
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Current Question Card */}
          {currentQ && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  Interviewer Question:
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  "{currentQ.question}"
                </h3>
              </div>

              {/* User Answer Box */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Your Spoken or Written Response:</span>
                  <button
                    type="button"
                    onClick={toggleVoiceRecording}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isRecording ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-teal-600" />}
                    <span>{isRecording ? 'Recording (Click to stop)' : 'Record Answer (Voice)'}</span>
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={userAnswerText}
                  onChange={(e) => setUserAnswerText(e.target.value)}
                  placeholder="Structure your answer using the STAR method: Situation, Task, Action, Result..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none leading-relaxed"
                />

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-slate-400">
                    {userAnswerText.split(' ').filter(Boolean).length} words
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmitAnswer}
                    disabled={isSubmittingAnswer || !userAnswerText.trim()}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAnswer ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-teal-200" />
                    )}
                    <span>{isSubmittingAnswer ? 'Evaluating...' : 'Evaluate Answer with AI'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback Card (If evaluated) */}
              {currentQ.score !== undefined && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-teal-200 space-y-3 animate-in fade-in slide-in-from-top-1">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>AI Answer Assessment</span>
                    </div>
                    <span className="text-xs font-black text-white bg-teal-700 px-2.5 py-0.5 rounded-lg">
                      Score: {currentQ.score}/100
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong>Clarity & Tone:</strong> {currentQ.feedback}
                  </p>

                  {currentQ.pointsMissed && currentQ.pointsMissed.length > 0 && (
                    <div className="text-xs text-amber-800 space-y-1">
                      <strong>Missing Points to Include:</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {currentQ.pointsMissed.map((pm, idx) => (
                          <li key={idx}>{pm}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentQ.idealSampleAnswer && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                      <span className="font-bold text-teal-900">Recommended Model Answer:</span>
                      <p className="text-slate-700 italic leading-relaxed">"{currentQ.idealSampleAnswer}"</p>
                    </div>
                  )}

                  {/* Next Question Navigation */}
                  <div className="flex justify-end pt-2">
                    {activeQuestionIndex < interviewQuestions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const nextIdx = activeQuestionIndex + 1;
                          setActiveQuestionIndex(nextIdx);
                          setUserAnswerText(interviewQuestions[nextIdx].userAnswer || '');
                        }}
                        className="px-4 py-2 rounded-xl bg-[#0f172a] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-teal-800">
                        All questions in this simulation complete! 🎉
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Final Session Performance Report (When all answered) */}
          {allAnswered && (
            <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-teal-300" />
                  <h3 className="text-lg font-black">Simulation Complete! Average Score: {averageScore}/100</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Great job practicing for <strong>{role}</strong> ({category}). Repeat practice to sharpen your metrics delivery.
                </p>
              </div>

              <button
                type="button"
                onClick={resetInterviewSimulation}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Another Session</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
