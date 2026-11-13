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
  FileCheck,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/cards/StatCard';
import { Modal } from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ModuleRegistrationGate } from '../../components/common/ModuleRegistrationGate';
import {
  initialCourses,
  sampleQuizQuestions,
  userCertificates,
  personalized30DayPlan
} from '../../data/mockData/learnData';
import { Course, Certificate } from '../../types';
import { AustralianCoursesSection } from './AustralianCoursesSection';
import { VerifiedCertificateModal } from '../../components/certificate/VerifiedCertificateModal';
import { generateCertificatePdf } from '../../services/certificateService';
import { InteractiveCoursePlayer } from '../../components/learn/InteractiveCoursePlayer';
import { API_BASE } from '../../config/api';

export const HerLearnPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  // Registration Gate at Starting
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(() => {
    return localStorage.getItem('herrise_learn_setup_completed') === 'true';
  });
  const [gateOpen, setGateOpen] = useState<boolean>(() => {
    return localStorage.getItem('herrise_learn_setup_completed') !== 'true';
  });

  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [activeTab, setActiveTab] = useState<'catalog' | 'australian' | 'player' | 'quiz' | 'certificates' | 'roadmap'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract user education qualification from resume or profile
  const userEducation = (() => {
    try {
      const rawResume = localStorage.getItem('hercareer_resume');
      if (rawResume) {
        const parsed = JSON.parse(rawResume);
        if (parsed.education && Array.isArray(parsed.education) && parsed.education[0]?.degree) {
          return parsed.education[0].degree;
        }
      }
    } catch {}
    return user?.education || user?.resumeData?.education?.[0]?.degree || '';
  })();

  // Dynamic user name resolution for verified credentials
  const userCandidateName = React.useMemo(() => {
    if (user?.name) return user.name;
    try {
      const rawResume = localStorage.getItem('hercareer_resume');
      if (rawResume) {
        const parsed = JSON.parse(rawResume);
        if (parsed?.personalInfo?.fullName) return parsed.personalInfo.fullName;
      }
    } catch {}
    return 'Verified HerRise Scholar';
  }, [user]);

  const handleGateComplete = (data: any) => {
    setIsSetupCompleted(true);
    setGateOpen(false);
    if (data.targetDomain) {
      if (data.targetDomain.includes('AI')) setSelectedCategory('Artificial Intelligence');
      else if (data.targetDomain.includes('FinTech') || data.targetDomain.includes('Finance')) setSelectedCategory('Financial Literacy');
      else if (data.targetDomain.includes('Marketing')) setSelectedCategory('Digital Marketing');
    }
  };

  // Video Lesson Player State
  const [selectedCourseForLearning, setSelectedCourseForLearning] = useState<Course>(initialCourses[0]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Sync user course progress & completed certificates from MongoDB Atlas
  React.useEffect(() => {
    if (!user?.email) return;

    const fetchAllProgress = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses/user-progress?userEmail=${encodeURIComponent(user.email)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.progressList)) {
          setCourses((prevCourses) => {
            const updated = prevCourses.map((c) => {
              const matched = json.progressList.find((p: any) => p.courseId === c.id);
              if (matched) {
                const updatedModules = c.modules.map((m) => ({
                  ...m,
                  completed: Array.isArray(matched.completedModuleIds)
                    ? matched.completedModuleIds.includes(m.id)
                    : m.completed
                }));
                const isAllCompleted =
                  Boolean(matched.isCompleted) ||
                  (updatedModules.length > 0 && updatedModules.every((m) => m.completed));
                const progressPercent = isAllCompleted
                  ? 100
                  : Math.max(
                      matched.progressPercent ?? 0,
                      Math.round(
                        (updatedModules.filter((m) => m.completed).length / updatedModules.length) * 100
                      )
                    );

                return {
                  ...c,
                  isEnrolled: true,
                  modules: updatedModules,
                  progressPercent,
                  isCompleted: isAllCompleted,
                  certificateId: matched.certificateId,
                  stoppedAtSeconds: matched.currentTimeSeconds,
                  stoppedModuleIndex: matched.currentModuleIndex
                };
              }
              return c;
            });

            // Keep selectedCourseForLearning synchronized so active player never gets stale on refresh!
            setSelectedCourseForLearning((curSelected) => {
              const refreshed = updated.find((c) => c.id === curSelected.id);
              return refreshed ? { ...refreshed } : curSelected;
            });

            return updated;
          });
        }
      } catch (err) {
        console.warn('[HerLearn] Error fetching user progress:', err);
      }
    };

    fetchAllProgress();
  }, [user?.email]);

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
      } catch { }
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
      } catch { }
      showToast('Knowledge Quiz Passed! 🎉', `You scored ${score} of ${sampleQuizQuestions.length}`, 'success');
    } else {
      showToast('Quiz Evaluated', `You scored ${score} of ${sampleQuizQuestions.length}. Review answers below.`, 'warning');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Dynamic Setup Intake Prompt Banner */}
        {!isSetupCompleted ? (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-100 text-[#2563eb] shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900">Personalized Learning Intake Required</h4>
                <p className="text-xs text-gray-600 leading-relaxed mt-0.5">
                  Select your target competency domain and available weekly study hours to calculate your certification timeline.
                </p>
              </div>
            </div>
            <button
              onClick={() => setGateOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#4A154B] hover:bg-[#350c36] text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              <span>Complete Academy Registration</span>
            </button>
          </div>
        ) : (
          <div className="bg-purple-50/60 border border-purple-100 px-4 py-2 rounded-2xl flex items-center justify-between text-xs text-purple-900">
            <span>✓ Active Learning Track: <strong>{user?.learnProfile?.targetDomain || 'FinTech & AI Leadership'}</strong></span>
            <button
              onClick={() => setGateOpen(true)}
              className="font-bold text-[#4A154B] hover:underline cursor-pointer"
            >
              Edit Study Plan
            </button>
          </div>
        )}

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
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'catalog' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
                }`}
            >
              Course Catalog
            </button>
            <button
              onClick={() => setActiveTab('australian')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'australian'
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-teal-900 bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200/50'
                }`}
            >
              <span className="text-sm">🇦🇺</span>
              <span>Australian Qualifications</span>
            </button>
            <button
              onClick={() => setActiveTab('player')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${activeTab === 'player' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
                }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Lesson Player</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'quiz' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
                }`}
            >
              Knowledge Quiz
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'certificates' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
                }`}
            >
              Certificates ({userCertificates.length})
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'roadmap' ? 'bg-[#4A154B] text-white shadow-xs' : 'text-gray-700 hover:text-[#4A154B]'
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

              {/* Australian Qualifications Gateway Callout */}
              <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-slate-50 p-4 rounded-2xl border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-teal-800 text-white font-bold text-xs">
                    🇦🇺 AQF
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        Australian Qualifications Recommended for Your Education
                      </h4>
                      {userEducation && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-900 border border-teal-200">
                          {userEducation}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Explore official diplomas, Cert III/IV, and RTO pathways matched to your qualification level from training.gov.au.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('australian')}
                  className="px-4 py-1.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs transition-all cursor-pointer shrink-0 shadow-2xs"
                >
                  View Matched Qualifications →
                </button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 pt-1 border-t border-purple-50">
                {courseCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${selectedCategory === cat
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
                      {c.isCompleted || (c.progressPercent && c.progressPercent >= 100) ? (
                        <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                          Completed
                        </span>
                      ) : (
                        <span className="absolute top-3 left-3 bg-[#4A154B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                          {c.category}
                        </span>
                      )}
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
                    {c.isCompleted || (c.progressPercent && c.progressPercent >= 100) ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCourseForLearning(c);
                            setActiveTab('player');
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => {
                            const cert: Certificate = {
                              id: `cert-${c.id}`,
                              courseTitle: c.title,
                              issuedTo: userCandidateName,
                              issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                              credentialId: c.certificateId || `HR-CRS-${Math.floor(100000 + Math.random() * 900000)}`,
                              instructorName: c.instructor,
                              instructorTitle: c.instructorRole || 'Course Author',
                              skillsCovered: [c.category, 'Applied Competency', 'Practical Mastery'],
                              grade: 'Distinction with Honours (98%)',
                              hoursCompleted: 24
                            };
                            generateCertificatePdf(cert, { recipientName: userCandidateName });
                            showToast('Certificate Downloaded! 🎓', `Official A4 PDF downloaded for ${c.title}`, 'success');
                          }}
                          className="flex items-center justify-center gap-1 bg-[#4A154B] hover:bg-[#350c36] text-white px-3.5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-2xs transition-colors"
                          title="Download Certificate PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    ) : c.isEnrolled ? (
                      <button
                        onClick={() => {
                          setSelectedCourseForLearning(c);
                          setActiveTab('player');
                        }}
                        className="w-full flex items-center justify-center gap-1.5 bg-[#4A154B] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#350c36] cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Continue Learning ({c.progressPercent || 0}%)</span>
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

        {/* TAB 2: AUSTRALIAN QUALIFICATIONS (training.gov.au Integration) */}
        {activeTab === 'australian' && (
          <AustralianCoursesSection />
        )}

        {/* TAB 3: INTERACTIVE VIDEO LESSON PLAYER WITH DATABASE RESUME & IN-PLACE CERTIFICATE */}
        {activeTab === 'player' && (
          <InteractiveCoursePlayer
            course={selectedCourseForLearning}
            userEmail={user?.email || 'member@herrise.org'}
            userName={userCandidateName}
            activeModuleIndex={activeModuleIndex}
            onSelectModule={(idx) => setActiveModuleIndex(idx)}
            onModuleComplete={(moduleId) => handleCompleteModule(moduleId)}
            onOpenCertificate={(cert) => setSelectedCert(cert)}
            onToast={showToast}
          />
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
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${selectedOpt === optIdx
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
              {userCertificates.map((cert) => {
                const displayName = userCandidateName || cert.issuedTo;
                return (
                  <div
                    key={cert.id}
                    className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified Credential
                        </span>
                        <span className="text-xs font-mono text-gray-400 font-semibold">{cert.credentialId}</span>
                      </div>

                      <h4 className="font-extrabold text-base text-gray-900 group-hover:text-[#4A154B] transition-colors leading-snug">
                        {cert.courseTitle}
                      </h4>
                      <p className="text-xs text-gray-600">
                        Issued to: <strong className="text-gray-900">{displayName}</strong>
                      </p>
                      <p className="text-xs text-gray-500">Instructor: {cert.instructorName}</p>
                      <p className="text-[11px] text-gray-400">Date of Award: {cert.issueDate}</p>

                      {cert.skillsCovered && cert.skillsCovered.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {cert.skillsCovered.slice(0, 3).map((sk, i) => (
                            <span key={i} className="text-[10px] bg-purple-50 text-purple-900 px-2 py-0.5 rounded-md border border-purple-100 font-medium">
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}
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
                          generateCertificatePdf(cert, { recipientName: displayName });
                          showToast('Certificate Downloaded! 🎓', `Official A4 PDF exported for ${cert.courseTitle}`, 'success');
                        }}
                        className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                );
              })}
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

      {/* Modal: Verified Certificate Preview */}
      <VerifiedCertificateModal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        certificate={selectedCert}
        recipientName={userCandidateName}
        onToast={showToast}
      />

      {/* Module Registration Gate at Starting */}
      <ModuleRegistrationGate
        module="learn"
        isOpen={gateOpen}
        onClose={() => setGateOpen(false)}
        onComplete={handleGateComplete}
      />
    </DashboardLayout>
  );
};

