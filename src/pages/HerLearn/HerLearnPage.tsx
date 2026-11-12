import React, { useState } from 'react';
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Search,
  Check,
  ChevronRight,
  Download,
  Share2,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  initialCourses,
  sampleQuizQuestions,
  userCertificates,
  personalized30DayPlan
} from '../../data/mockData/learnData';
import { Course, Certificate } from '../../types';

export const HerLearnPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [activeTab, setActiveTab] = useState<'catalog' | 'player' | 'quiz' | 'certificates' | 'roadmap'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Video Lesson Player State
  const [selectedCourseForLearning, setSelectedCourseForLearning] = useState<Course>(initialCourses[0]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Certificate Modal Preview
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const courseCategories = [
    'All',
    'Financial Literacy',
    'Entrepreneurship',
    'Artificial Intelligence',
    'Communication Skills',
    'Programming',
    'Digital Marketing'
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEnroll = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, isEnrolled: true, progressPercent: 10 } : c))
    );
    const target = courses.find((c) => c.id === courseId);
    showToast('Enrolled Successfully!', `You can now access lessons for ${target?.title}`, 'success');
  };

  const handleCompleteModule = (moduleId: string) => {
    const updatedModules = selectedCourseForLearning.modules.map((m) =>
      m.id === moduleId ? { ...m, completed: true } : m
    );
    const completedCount = updatedModules.filter((m) => m.completed).length;
    const progressPercent = Math.round((completedCount / updatedModules.length) * 100);

    const updatedCourse = {
      ...selectedCourseForLearning,
      modules: updatedModules,
      progressPercent
    };

    setSelectedCourseForLearning(updatedCourse);
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));

    if (progressPercent === 100) {
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {}
      showToast('Course Completed! 🎓', 'Congratulations! Your certificate is now ready in the Certificates tab.', 'success');
    } else {
      showToast('Lesson Completed', `Progress updated to ${progressPercent}%`, 'info');
    }
  };

  const handleQuizAnswer = (qId: number, optionIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    let score = 0;
    sampleQuizQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 3) {
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch {}
      showToast('Knowledge Quiz Passed! 🎉', `You scored ${score} of ${sampleQuizQuestions.length}`, 'success');
    } else {
      showToast('Quiz Evaluated', `You scored ${score} of ${sampleQuizQuestions.length}. Review answers below.`, 'warning');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-100 text-[#4A154B]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                HerLearn — Skill Academy & Certifications
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Gain verified competencies in personal finance, AI tools, commercial pricing, and executive leadership.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-purple-50/70 p-1.5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'catalog' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Course Catalog
            </button>
            <button
              onClick={() => setActiveTab('player')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'player' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Lesson Player</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'quiz' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Knowledge Quiz
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'certificates' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              Certificates ({userCertificates.length})
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'roadmap' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
              }`}
            >
              30-Day Plan
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Courses In Progress"
            value="2 Enrolled"
            subtitle="72% Average completion"
            icon={BookOpen}
            iconColor="text-[#4A154B]"
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Total Learning Hours"
            value="34.5 Hrs"
            subtitle="4.5 hrs logged this week"
            icon={Clock}
            iconColor="text-emerald-700"
            bgColor="bg-emerald-50"
          />
          <StatCard
            title="Quiz Average Score"
            value="92%"
            subtitle="Top 10% across cohort"
            icon={Award}
            iconColor="text-[#be185d]"
            bgColor="bg-pink-50"
          />
          <StatCard
            title="Certificates Earned"
            value={userCertificates.length}
            subtitle="Verifiable on LinkedIn"
            icon={CheckCircle2}
            iconColor="text-indigo-700"
            bgColor="bg-indigo-50"
          />
        </div>

        {/* TAB 1: COURSE DISCOVERY CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, instructors, or topics..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-xl text-xs outline-none"
                  />
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  Showing {filteredCourses.length} Accredited Masterclasses
                </span>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-purple-50">
                {courseCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#4A154B] text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl border border-purple-100 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                      <img
                        src={c.thumbnail}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#4A154B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        {c.category}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                        {c.duration} • {c.totalLessons} Lessons
                      </span>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.instructorAvatar}
                          alt={c.instructor}
                          className="w-6 h-6 rounded-full object-cover border border-purple-200"
                        />
                        <span className="text-xs text-gray-700 font-semibold">{c.instructor}</span>
                      </div>

                      <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#4A154B] transition-colors leading-snug">
                        {c.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] pt-1 text-gray-500">
                        <span className="flex items-center gap-1 font-bold text-gray-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {c.rating} ({c.enrolledStudents} students)
                        </span>
                        <span className="font-semibold text-purple-900">{c.level}</span>
                      </div>

                      {c.isEnrolled && (
                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1">
                            <span>Your Progress</span>
                            <span className="text-[#4A154B]">{c.progressPercent || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#4A154B] h-full rounded-full transition-all"
                              style={{ width: `${c.progressPercent || 0}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    {c.isEnrolled ? (
                      <button
                        onClick={() => {
                          setSelectedCourseForLearning(c);
                          setActiveTab('player');
                        }}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#4A154B] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Continue Learning</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(c.id)}
                        className="w-full bg-purple-50 hover:bg-[#4A154B] hover:text-white text-[#4A154B] py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer"
                      >
                        Enroll Free (Demo)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE VIDEO LESSON PLAYER */}
        {activeTab === 'player' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Player Canvas (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center">
                <img
                  src={selectedCourseForLearning.thumbnail}
                  alt={selectedCourseForLearning.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-6">
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full w-max backdrop-blur-md">
                    Now Playing: Module 0{activeModuleIndex + 1}
                  </span>

                  <div className="text-center">
                    <button
                      onClick={() => showToast('Playing Simulation', 'Simulating HD video playback', 'info')}
                      className="w-16 h-16 rounded-full bg-[#fb7185] hover:scale-110 text-white flex items-center justify-center mx-auto shadow-2xl transition-transform cursor-pointer"
                    >
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-white text-xs">
                    <span className="font-semibold">
                      {selectedCourseForLearning.modules[activeModuleIndex]?.title || 'Lesson Introduction'}
                    </span>
                    <span>1080p HD • Speed 1.0x</span>
                  </div>
                </div>
              </div>

              {/* Lesson Overview & Mark Complete */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
                  <div>
                    <h3 className="font-black text-lg text-gray-900">
                      {selectedCourseForLearning.modules[activeModuleIndex]?.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Instructor: {selectedCourseForLearning.instructor} ({selectedCourseForLearning.instructorRole})
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const curModule = selectedCourseForLearning.modules[activeModuleIndex];
                      if (curModule) handleCompleteModule(curModule.id);
                    }}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Lesson Complete</span>
                  </button>
                </div>

                <div className="text-xs text-gray-700 leading-relaxed space-y-2">
                  <p>
                    In this lesson, we break down actionable steps to build your financial resilience. Review the practical formulas in the spreadsheet and take notes for the end-of-module assessment.
                  </p>
                </div>
              </div>
            </div>

            {/* Course Playlist Sidebar (4 cols) */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-purple-50">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Course Modules ({selectedCourseForLearning.modules.length})
                </h3>
                <span className="text-xs font-bold text-[#4A154B]">
                  {selectedCourseForLearning.progressPercent || 0}%
                </span>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {selectedCourseForLearning.modules.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => setActiveModuleIndex(idx)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      activeModuleIndex === idx
                        ? 'border-[#4A154B] bg-purple-50/70 shadow-xs'
                        : 'border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          m.completed ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {m.completed ? '✓' : idx + 1}
                      </div>
                      <span className="text-xs font-semibold text-gray-800 truncate">{m.title}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{m.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KNOWLEDGE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-purple-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">End-of-Track Mastery Knowledge Quiz</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Answer these 4 questions to test your financial resilience and earn your certified badge.
              </p>
            </div>

            <div className="space-y-6">
              {sampleQuizQuestions.map((q, idx) => {
                const selectedOpt = quizAnswers[q.id];
                const isCorrect = selectedOpt === q.correctAnswer;
                return (
                  <div key={q.id} className="p-5 rounded-2xl border border-purple-100 bg-[#faf9fd] space-y-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      Question 0{idx + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                      {q.question}
                    </h4>

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          onClick={() => handleQuizAnswer(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                            selectedOpt === optIdx
                              ? 'border-[#4A154B] bg-purple-50 font-bold text-purple-900'
                              : 'border-gray-200 bg-white hover:border-purple-200 text-gray-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOpt === optIdx && <Check className="w-4 h-4 text-[#4A154B]" />}
                        </div>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className={`p-3 rounded-xl text-xs mt-2 ${isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'}`}>
                        <strong>{isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleQuizSubmit}
              className="w-full bg-[#4A154B] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer shadow-md transition-all"
            >
              Submit Quiz Answers & Record Score
            </button>

            {quizScore !== null && (
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
                <span className="text-xs font-bold text-[#4A154B] uppercase tracking-wider">Your Score</span>
                <div className="text-3xl font-black text-gray-900">
                  {quizScore} / {sampleQuizQuestions.length} ({Math.round((quizScore / sampleQuizQuestions.length) * 100)}%)
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CERTIFICATES SECTION */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Issued HerRise Credentials</h3>
              <p className="text-xs text-gray-500">
                Verifiable certificates demonstrating verified competencies in financial architecture and digital commerce.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Verified Credential
                      </span>
                      <span className="text-xs font-mono text-gray-400">{cert.credentialId}</span>
                    </div>

                    <h4 className="font-extrabold text-base text-gray-900">{cert.courseTitle}</h4>
                    <p className="text-xs text-gray-500">Issued to: <strong>{cert.issuedTo}</strong></p>
                    <p className="text-xs text-gray-500">Instructor: {cert.instructorName}</p>
                    <p className="text-[11px] text-gray-400">Date of Award: {cert.issueDate}</p>
                  </div>

                  <div className="pt-4 border-t border-purple-50 flex items-center justify-between mt-4">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs font-bold text-[#4A154B] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Credential</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        showToast('Certificate Downloaded', 'Demo certificate exported in PDF format', 'success');
                      }}
                      className="flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-[#4A154B] px-3 py-1 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: 30-DAY PERSONALISED LEARNING PLAN */}
        {activeTab === 'roadmap' && (
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">30-Day Personalized Skill Sprint</h3>
              <p className="text-xs text-gray-500">Structured weekly goals based on your active platform targets.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {personalized30DayPlan.map((plan, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#faf9fd] border border-purple-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A154B] bg-purple-100 px-2 py-0.5 rounded-full">
                    {plan.week}
                  </span>
                  <h4 className="font-bold text-xs text-gray-900">{plan.focus}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{plan.task}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Certificate Preview */}
      {selectedCert && (
        <Modal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          title="Certificate of Accomplishment"
          subtitle={`Credential ID: ${selectedCert.credentialId}`}
          maxWidth="2xl"
        >
          <div className="p-8 border-4 border-double border-purple-200 rounded-3xl bg-gradient-to-tr from-purple-50/50 to-pink-50/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#4A154B] text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-6 h-6 text-pink-300" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A154B]">
                HerRise AI Educational Institute
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">Certificate of Completion</h3>
            </div>

            <p className="text-xs text-gray-600">This certifies that</p>
            <h4 className="text-xl font-extrabold text-[#4A154B] underline decoration-[#fb7185] decoration-2">
              {selectedCert.issuedTo}
            </h4>
            <p className="text-xs text-gray-600">has successfully completed the comprehensive masterclass in</p>
            <h5 className="text-base font-bold text-gray-900">{selectedCert.courseTitle}</h5>

            <div className="pt-4 border-t border-purple-200 flex justify-between items-center text-xs text-gray-500">
              <span>Instructor: {selectedCert.instructorName}</span>
              <span>Date: {selectedCert.issueDate}</span>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

