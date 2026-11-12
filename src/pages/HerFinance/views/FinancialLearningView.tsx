import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Check,
  Award,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { Modal } from '../../../components/common/Modal';
import { useToast } from '../../../context/ToastContext';
import { FinancialLessonItem } from '../../../types/finance';

export const FinancialLearningView: React.FC = () => {
  const { lessons, markLessonComplete } = useHerFinance();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLessonModal, setActiveLessonModal] = useState<FinancialLessonItem | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // AI Concept Explainer State
  const [conceptQuery, setConceptQuery] = useState('');
  const [aiConceptExplanation, setAiConceptExplanation] = useState<string | null>(null);
  const [explaining, setExplaining] = useState(false);

  const categories = [
    'All',
    'Budgeting Basics',
    'Saving Money',
    'Banking Fundamentals',
    'Understanding Interest',
    'Loans and Debt Management',
    'Credit Scores',
    'Emergency Funds',
    'Financial Planning',
    'Personal Finance for Beginners',
    'Financial Independence'
  ];

  const filteredLessons = lessons.filter(
    (l) => selectedCategory === 'All' || l.category === selectedCategory
  );

  const completedCount = lessons.filter((l) => l.completed).length;
  const progressPercent = Math.round((completedCount / lessons.length) * 100);

  const handleOpenLesson = (lesson: FinancialLessonItem) => {
    setActiveLessonModal(lesson);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleEvaluateQuiz = (lesson: FinancialLessonItem) => {
    let score = 0;
    lesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
    markLessonComplete(lesson.id, score);

    if (score === lesson.quiz.length) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      showToast('Perfect Score! 🌟', `You answered all ${lesson.quiz.length} questions correctly.`, 'success');
    } else {
      showToast('Quiz Completed', `Score: ${score}/${lesson.quiz.length}. Review explanations below.`, 'info');
    }
  };

  const handleAskConcept = () => {
    if (!conceptQuery.trim()) return;
    setExplaining(true);
    setTimeout(() => {
      setExplaining(false);
      const query = conceptQuery.toLowerCase();
      let explanation = `**Concept:** "${conceptQuery}"\n\nIn simple everyday language: Money management is all about cashflow certainty and capital preservation. Focus on keeping fixed needs under 50% of your income and channeling the rest into automated savings before lifestyle spending.`;

      if (query.includes('sip') || query.includes('mutual fund')) {
        explanation = `### 📈 Systematic Investment Plan (SIP) in Simple Terms\n\nA **SIP** is like a recurring digital piggy bank that automatically invests a fixed sum (e.g. ₹1,000) into broad-market shares every month.\n\n- **Why It Works:** You don't have to time market highs and lows. When prices are low, your ₹1,000 buys more units; when prices are high, it buys fewer.\n- **Compound Effect:** Historically, equity index SIPs have returned 11%-13% annually over 10-year horizons, beating inflation hands down.`;
      } else if (query.includes('credit score') || query.includes('cibil')) {
        explanation = `### 💳 Credit Score (CIBIL) in Simple Terms\n\nYour credit score is like your financial reputation score out of 900.\n\n- **750+ is Prime:** Unlocks lower loan interest rates and zero hassle.\n- **Golden Rule:** Never use more than 30% of your credit card limit and pay the entire bill on time every single month.`;
      }

      setAiConceptExplanation(explanation);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Learning Progress Summary Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Financial Literacy & Wealth Academy</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              10 comprehensive curricula designed specifically for women’s financial independence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">Academy Completion:</span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-teal-800">{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* AI Simple Concept Explainer Bar */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Financial Concept Explainer (Ask in Plain Language):</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={conceptQuery}
              onChange={(e) => setConceptQuery(e.target.value)}
              placeholder="e.g. What is compound interest? How does a credit score work? What is a debt avalanche?"
              className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-600"
            />
            <button
              onClick={handleAskConcept}
              className="bg-[#0f172a] hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shrink-0"
            >
              {explaining ? 'Explaining...' : 'Explain Concept'}
            </button>
          </div>

          {aiConceptExplanation && (
            <div className="mt-3 p-4 bg-white rounded-xl border border-teal-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed shadow-2xs">
              {aiConceptExplanation}
            </div>
          )}
        </div>
      </div>

      {/* 10 Category Filter Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0f172a] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            onClick={() => handleOpenLesson(lesson)}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                  {lesson.category}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.durationMinutes} mins
                  </span>

                  {lesson.completed && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-800 transition-colors leading-snug">
                {lesson.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {lesson.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
              <span className="font-bold text-slate-400 text-[11px]">{lesson.quiz.length} Interactive Quiz Questions</span>
              <span className="font-bold text-teal-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                <span>Start Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Interactive Lesson & Quiz Reader */}
      {activeLessonModal && (
        <Modal
          isOpen={!!activeLessonModal}
          onClose={() => setActiveLessonModal(null)}
          title={activeLessonModal.title}
          subtitle={`${activeLessonModal.category} • ${activeLessonModal.durationMinutes} Mins Read • ${activeLessonModal.difficulty} Level`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs sm:text-sm text-slate-800">
            {/* Reading Material Content */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm whitespace-pre-line leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {activeLessonModal.content}
            </div>

            {/* Key Takeaways */}
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 block">
                Key Lesson Takeaways:
              </span>
              <ul className="list-disc list-inside space-y-1 text-xs text-teal-950 font-medium">
                {activeLessonModal.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx}>{takeaway}</li>
                ))}
              </ul>
            </div>

            {/* Interactive Quiz Section */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div>
                <h4 className="font-black text-base text-slate-900">Knowledge Verification Quiz</h4>
                <p className="text-xs text-slate-500">Test your comprehension with instant scoring and explanations.</p>
              </div>

              {activeLessonModal.quiz.map((q, idx) => {
                const selectedOpt = quizAnswers[q.id];
                const isCorrect = selectedOpt === q.correctIndex;
                return (
                  <div key={q.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Question 0{idx + 1}
                    </span>
                    <p className="font-bold text-xs sm:text-sm text-slate-900">{q.question}</p>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          onClick={() => !quizSubmitted && handleSelectQuizOption(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            selectedOpt === optIdx
                              ? 'border-[#0f172a] bg-slate-900 text-white font-bold'
                              : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOpt === optIdx && <Check className="w-4 h-4 text-teal-400" />}
                        </div>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-3 rounded-xl text-xs mt-2 ${isCorrect ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
                        <strong>{isCorrect ? '✓ Correct!' : '✗ Explanation of Incorrect Answer:'}</strong>{' '}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => handleEvaluateQuiz(activeLessonModal)}
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <div className="flex items-center justify-between p-4 bg-slate-100 rounded-2xl">
                  <div>
                    <span className="font-bold text-xs text-slate-900">Your Score:</span>
                    <strong className="text-lg text-teal-800 ml-2">{quizScore} / {activeLessonModal.quiz.length}</strong>
                  </div>
                  <button
                    onClick={() => setActiveLessonModal(null)}
                    className="bg-[#0f172a] text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-slate-800 cursor-pointer"
                  >
                    Done & Return to Academy
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
