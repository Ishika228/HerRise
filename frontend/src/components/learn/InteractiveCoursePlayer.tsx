import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  CheckCircle2,
  Award,
  Download,
  Clock,
  Sparkles,
  Volume2,
  Volume1,
  VolumeX,
  Maximize2,
  BookmarkCheck,
  ChevronRight,
  ShieldCheck,
  MonitorPlay,
  Presentation,
  BookOpen,
  Mic,
  MessageSquare,
  Radio,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, Certificate } from '../../types';
import { API_BASE } from '../../config/api';
import { generateCertificatePdf } from '../../services/certificateService';

interface InteractiveCoursePlayerProps {
  course: Course;
  userEmail: string;
  userName: string;
  activeModuleIndex: number;
  onSelectModule: (index: number) => void;
  onModuleComplete: (moduleId: string) => void;
  onOpenCertificate: (cert: Certificate) => void;
  onToast?: (title: string, msg: string, type?: 'success' | 'error' | 'info') => void;
}

function parseDurationToSeconds(durStr?: string): number {
  if (!durStr) return 360;
  const match = durStr.match(/(\d+)\s*m/i);
  if (match) return parseInt(match[1]) * 60;
  const matchColon = durStr.match(/(\d+):(\d+)/);
  if (matchColon) return parseInt(matchColon[1]) * 60 + parseInt(matchColon[2]);
  return 360;
}

// Generate dynamic educational spoken narration script for any course & module
function getLessonScript(courseTitle: string, moduleTitle: string, instructor: string): string[] {
  return [
    `Welcome to ${moduleTitle} in your masterclass on ${courseTitle}. I am your lead instructor, ${instructor}.`,
    `In this section, we break down actionable formulas and strategic frameworks designed for real-world execution.`,
    `Notice the primary benchmarks highlighted on your screen. Building disciplined habits and tracking your progress daily is key.`,
    `Take a moment to review the practical equations, calibrate your goals, and apply these methods directly into your portfolio.`,
    `Excellent progress on this lesson. Complete your module notes to earn your verified credential.`
  ];
}

export const InteractiveCoursePlayer: React.FC<InteractiveCoursePlayerProps> = ({
  course,
  userEmail,
  userName,
  activeModuleIndex,
  onSelectModule,
  onModuleComplete,
  onOpenCertificate,
  onToast
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const activeModule = course.modules[activeModuleIndex] || course.modules[0];
  const initialDuration = parseDurationToSeconds(activeModule?.duration);
  const [duration, setDuration] = useState(initialDuration);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(0.9); // 90% default volume
  const [isMuted, setIsMuted] = useState(false);
  const [savedResumeTime, setSavedResumeTime] = useState<number | null>(null);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const [lastSavedNotice, setLastSavedNotice] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(Boolean(course.isCompleted || (course.progressPercent && course.progressPercent >= 100)));
  const [certificateData, setCertificateData] = useState<Certificate | null>(null);

  // Watch-time enforcement: track how many seconds user has actually watched
  const [watchedSeconds, setWatchedSeconds] = useState<number>(0);
  const watchTimerRef = useRef<any>(null);
  // YouTube IFrame play-state tracking via postMessage API
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isYouTubePlayingRef = useRef<boolean>(false);
  const [isYouTubePlaying, setIsYouTubePlaying] = useState<boolean>(false);

  // Player view mode: 'video' = Real Embedded Video Lecture with full human audio voice; 'interactive' = AI Spoken Voice Narration Canvas
  const [playerMode, setPlayerMode] = useState<'video' | 'interactive'>('video');

  // Voice narration & subtitle state
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [captionIndex, setCaptionIndex] = useState(0);
  const narrationScript = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  const storageKey = `herrise_course_progress_${userEmail || 'guest'}_${course.id}`;

  // Helper format mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Initialize narration script for active module
  useEffect(() => {
    const script = getLessonScript(course.title, activeModule?.title || 'Lesson', course.instructor);
    narrationScript.current = script;
    setCurrentCaption(script[0]);
    setCaptionIndex(0);
  }, [course.title, activeModule?.title, course.instructor]);

  // Update duration when module changes — also reset watch timer
  useEffect(() => {
    const modDur = parseDurationToSeconds(activeModule?.duration);
    setDuration(modDur);
    setCurrentTime(0);
    setIsPlaying(false);
    stopVoiceNarration();
    // Reset watch-time counter for new module (keep if already completed)
    if (!activeModule?.completed) {
      setWatchedSeconds(0);
    }
    // Reset YouTube play state tracking for the new module
    isYouTubePlayingRef.current = false;
    setIsYouTubePlaying(false);
    if (watchTimerRef.current) {
      clearInterval(watchTimerRef.current);
      watchTimerRef.current = null;
    }
  }, [activeModuleIndex, activeModule?.duration]);

  // =========================================================================
  // VOICE SYNTHESIS ENGINE (Plays audible spoken lesson audio through browser)
  // =========================================================================
  const stopVoiceNarration = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    isSpeakingRef.current = false;
  }, []);

  const speakSentence = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window) || isMuted || volume <= 0) return;

      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.resume();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = playbackRate * 0.95;
        utterance.pitch = 1.05;
        utterance.volume = isMuted ? 0 : volume;

        // Try to pick natural English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Female') ||
              v.name.includes('Zira') ||
              v.name.includes('Samantha') ||
              v.name.includes('Jenny') ||
              v.name.includes('Google UK English Female') ||
              v.name.includes('Google US English'))
        ) || voices.find((v) => v.lang.startsWith('en'));

        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => {
          isSpeakingRef.current = true;
        };

        utterance.onend = () => {
          isSpeakingRef.current = false;
        };

        utterance.onerror = () => {
          isSpeakingRef.current = false;
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('[HerLearn Voice Engine] Speech error:', err);
      }
    },
    [isMuted, volume, playbackRate]
  );

  // Audible tone to unlock and verify browser audio
  const playStartChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.18); // A5
      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }, [isMuted, volume]);

  // Test speaker voice button action
  const handleTestVoice = () => {
    playStartChime();
    speakSentence(`Hello, this is ${course.instructor}. Your course voice narration is active and ready.`);
    onToast?.('Voice Active 🔊', `Instructor audio is playing at ${Math.round(volume * 100)}% volume`, 'success');
  };

  // Sync spoken sentences as the timer advances in Interactive mode
  useEffect(() => {
    if (!isPlaying || playerMode !== 'interactive') {
      if (playerMode !== 'interactive') stopVoiceNarration();
      return;
    }

    const script = narrationScript.current;
    if (!script || script.length === 0) return;

    const totalScriptSecs = Math.max(30, duration);
    const intervalPerSentence = totalScriptSecs / script.length;
    const targetIdx = Math.min(script.length - 1, Math.floor(currentTime / intervalPerSentence));

    if (targetIdx !== captionIndex || !isSpeakingRef.current) {
      setCaptionIndex(targetIdx);
      setCurrentCaption(script[targetIdx]);
      speakSentence(script[targetIdx]);
    }
  }, [isPlaying, playerMode, Math.floor(currentTime / 10), duration, captionIndex, speakSentence, stopVoiceNarration]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      stopVoiceNarration();
    };
  }, [stopVoiceNarration]);

  // =========================================================================
  // YOUTUBE IFRAME PLAY-STATE DETECTION via postMessage API
  // YouTube sends state-change messages: 1=playing, 2=paused, 0=ended, 3=buffering
  // We listen here and gate the watch-timer so it only counts REAL watch time.
  // =========================================================================
  useEffect(() => {
    const handleYouTubeMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        // YouTube IFrame API onStateChange event
        let playerState: number | undefined;
        if (data?.event === 'onStateChange') {
          playerState = data.info;
        } else if (data?.event === 'infoDelivery' && data?.info?.playerState !== undefined) {
          playerState = data.info.playerState;
        }

        if (playerState !== undefined) {
          // 1 = playing, 3 = buffering (count as watching); anything else = not playing
          const playing = playerState === 1 || playerState === 3;
          isYouTubePlayingRef.current = playing;
          setIsYouTubePlaying(playing);
        }
      } catch {
        // non-YouTube or malformed message — ignore
      }
    };

    window.addEventListener('message', handleYouTubeMessage);
    return () => window.removeEventListener('message', handleYouTubeMessage);
  }, []);

  // Register this page as a YouTube IFrame API listener after iframe loads
  const handleIframeLoad = () => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 1 }),
        '*'
      );
    } catch {}
  };

  // Watch-time counter for Video Lecture mode
  // ONLY increments when YouTube is actually PLAYING (gated by isYouTubePlayingRef)
  useEffect(() => {
    if (playerMode !== 'video' || activeModule?.completed) {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
        watchTimerRef.current = null;
      }
      return;
    }

    watchTimerRef.current = setInterval(() => {
      // Only count a second if YouTube video is genuinely playing right now
      if (!isYouTubePlayingRef.current) return;
      setWatchedSeconds((prev) => Math.min(prev + 1, duration || 360));
    }, 1000);

    return () => {
      if (watchTimerRef.current) {
        clearInterval(watchTimerRef.current);
        watchTimerRef.current = null;
      }
    };
  }, [playerMode, activeModule?.id, activeModule?.completed, duration]);

  // 1. Load saved playback state from Database & LocalStorage on mount
  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      let remoteProgress: any = null;

      if (userEmail) {
        try {
          const res = await fetch(
            `${API_BASE}/api/courses/progress/${course.id}?userEmail=${encodeURIComponent(userEmail)}`
          );
          const data = await res.json();
          if (data.success && data.progress) {
            remoteProgress = data.progress;
          }
        } catch (err) {
          console.warn('[HerLearn] Error loading remote progress:', err);
        }
      }

      let localProgress: any = null;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) localProgress = JSON.parse(stored);
      } catch {}

      const progress = remoteProgress || localProgress;

      if (progress && isMounted) {
        const stoppedTime = progress.currentTimeSeconds || 0;
        const stoppedMod = progress.currentModuleIndex ?? activeModuleIndex;

        if (progress.isCompleted || progress.progressPercent >= 100) {
          setIsCompleted(true);
        }

        if (stoppedTime > 3) {
          setSavedResumeTime(stoppedTime);
          setShowResumeBanner(true);
          // Note: watchedSeconds is NOT pre-populated from DB —
          // it must be earned by actually playing the video this session
        }

        if (stoppedMod !== activeModuleIndex && course.modules[stoppedMod]) {
          onSelectModule(stoppedMod);
        }

        if (progress.certificateId || progress.isCompleted) {
          setCertificateData({
            id: `cert-${course.id}`,
            courseTitle: course.title,
            issuedTo: userName || 'Verified HerRise Scholar',
            issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            credentialId: progress.certificateId || `HR-CRS-${Math.floor(100000 + Math.random() * 900000)}`,
            instructorName: course.instructor,
            instructorTitle: course.instructorRole || 'Course Author',
            skillsCovered: [course.category, 'Applied Competency', 'Practical Mastery', 'Executive Review'],
            grade: 'Distinction with Honours (98%)',
            hoursCompleted: 24,
            credentialType: 'Verified Course Credential'
          });
        }
      }
    };

    loadProgress();
    return () => {
      isMounted = false;
    };
  }, [course.id, userEmail]);

  // 2. Save Progress Function (Saves to MongoDB Atlas and LocalStorage)
  const saveProgressToDb = useCallback(
    async (timeToSave: number, currentDuration: number, completedNow: boolean = false) => {
      if (!userEmail) return;

      const completedIds = course.modules.filter((m) => m.completed).map((m) => m.id);
      const computedPercent = completedNow
        ? 100
        : Math.min(
            99,
            Math.round(
              ((completedIds.length + (timeToSave / (currentDuration || 360)) * 0.9) /
                course.modules.length) *
                100
            )
          );

      const payload = {
        userEmail,
        courseId: course.id,
        courseTitle: course.title,
        currentModuleIndex: activeModuleIndex,
        currentModuleTitle: activeModule?.title || 'Lesson',
        currentTimeSeconds: Math.round(timeToSave),
        durationSeconds: Math.round(currentDuration || duration || 360),
        completedModuleIds: completedIds,
        progressPercent: computedPercent,
        isCompleted: completedNow || isCompleted
      };

      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {}

      try {
        const res = await fetch(`${API_BASE}/api/courses/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resJson = await res.json();
        if (resJson.success && resJson.progress) {
          setLastSavedNotice(`Saved at ${formatTime(timeToSave)}`);
          if (resJson.progress.certificateId && !certificateData) {
            setCertificateData({
              id: `cert-${course.id}`,
              courseTitle: course.title,
              issuedTo: userName || 'Verified HerRise Scholar',
              issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              credentialId: resJson.progress.certificateId,
              instructorName: course.instructor,
              instructorTitle: course.instructorRole || 'Course Author',
              skillsCovered: [course.category, 'Practical Competency', 'Applied Strategy'],
              grade: 'Distinction with Honours (98%)',
              hoursCompleted: 24
            });
          }
        }
      } catch (err) {
        console.warn('[HerLearn] Background progress save error:', err);
      }
    },
    [
      userEmail,
      course.id,
      course.title,
      course.modules,
      activeModuleIndex,
      activeModule,
      duration,
      isCompleted,
      storageKey,
      userName,
      certificateData
    ]
  );

  // 3. Playback timer for interactive simulation or fallback
  const lastSaveRef = useRef<number>(0);
  useEffect(() => {
    let interval: any = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          const curDur = duration || 360;

          const now = Date.now();
          if (now - lastSaveRef.current > 5000) {
            lastSaveRef.current = now;
            saveProgressToDb(next, curDur, false);
          }

          if (next >= curDur) {
            setIsPlaying(false);
            stopVoiceNarration();
            handleMarkModuleComplete();
            return curDur;
          }
          return next;
        });
      }, 1000 / playbackRate);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, playbackRate, saveProgressToDb, stopVoiceNarration]);

  // 4. Reliable Play/Pause Toggle with Direct Voice Trigger
  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopVoiceNarration();
      saveProgressToDb(currentTime, duration, false);
      onToast?.('Paused', `Stopped at ${formatTime(currentTime)}`, 'info');
    } else {
      setIsPlaying(true);
      setShowResumeBanner(false);
      playStartChime();
      if (playerMode === 'interactive' && currentCaption) {
        speakSentence(currentCaption);
      }
    }
  };

  // 5. Resume from previous saved position
  const handleResumePlayback = () => {
    if (savedResumeTime !== null) {
      setCurrentTime(savedResumeTime);
      setIsPlaying(true);
      setShowResumeBanner(false);
      playStartChime();
      if (playerMode === 'interactive' && currentCaption) {
        speakSentence(currentCaption);
      }
      onToast?.(
        'Resumed Successfully ▶',
        `Continuing from ${formatTime(savedResumeTime)}`,
        'success'
      );
    }
  };

  // 6. Scrubbing — block forward skip if module not yet completed
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = Number(e.target.value);
    // Block seeking forward if module is not yet complete
    if (targetTime > currentTime && !activeModule?.completed) {
      onToast?.('No Skipping Allowed 🔒', 'You must watch the full lesson. Skipping forward is disabled.', 'error');
      return;
    }
    setCurrentTime(targetTime);
    saveProgressToDb(targetTime, duration, false);
  };

  const skipTime = (seconds: number) => {
    // Block skipping forward if module not yet completed
    if (seconds > 0 && !activeModule?.completed) {
      onToast?.('No Skipping Allowed 🔒', 'You must watch the full lesson before skipping ahead.', 'error');
      return;
    }
    const newTime = Math.max(0, Math.min(duration || 360, currentTime + seconds));
    setCurrentTime(newTime);
    saveProgressToDb(newTime, duration, false);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopVoiceNarration();
      onToast?.('Voice Muted', 'Lesson voice muted', 'info');
    } else {
      speakSentence(currentCaption);
      onToast?.('Voice Active 🔊', `Volume set to ${Math.round(volume * 100)}%`, 'success');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const changeSpeed = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    onToast?.('Speed Changed', `Playback speed set to ${nextRate}x`, 'info');
  };

  // 7. Complete Module — only allowed after full watch
  const handleMarkModuleComplete = async () => {
    if (!activeModule) return;

    // Determine if the user has watched enough of the current module
    const watchThreshold = Math.max(30, Math.round((duration || 360) * 0.9));
    const isModuleWatchComplete = activeModule.completed || watchedSeconds >= watchThreshold;

    if (!isModuleWatchComplete) {
      const remaining = Math.max(0, watchThreshold - watchedSeconds);
      onToast?.(
        'Complete the Video First 🔒',
        `Watch ${formatTime(remaining)} more to unlock this lesson. You cannot skip the video.`,
        'error'
      );
      return;
    }

    if (activeModule) {
      onModuleComplete(activeModule.id);
      stopVoiceNarration();

      const remaining = course.modules.filter((m) => m.id !== activeModule.id && !m.completed);
      const isNowCompleted = remaining.length === 0;      if (isNowCompleted) {
        setIsCompleted(true);
        setIsPlaying(false);
        try {
          confetti({ particleCount: 110, spread: 80, origin: { y: 0.55 } });
        } catch {}

        try {
          const res = await fetch(`${API_BASE}/api/courses/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail,
              courseId: course.id,
              courseTitle: course.title,
              candidateName: userName
            })
          });
          const resData = await res.json();
          if (resData.success) {
            setCertificateData({
              id: `cert-${course.id}`,
              courseTitle: course.title,
              issuedTo: userName || 'Verified HerRise Scholar',
              issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              credentialId: resData.certificate?.credentialId || `HR-CRS-${Math.floor(100000 + Math.random() * 900000)}`,
              instructorName: course.instructor,
              instructorTitle: course.instructorRole || 'Course Author',
              skillsCovered: [course.category, 'Applied Mastery', 'Executive Review'],
              grade: 'Distinction with Honours (98%)',
              hoursCompleted: 24,
              credentialType: 'Verified Course Credential'
            });
          }
        } catch {}

        onToast?.(
          'Course 100% Completed! 🎓',
          'Your official certificate is generated and ready to view or download right below.',
          'success'
        );
      } else {
        if (activeModuleIndex < course.modules.length - 1) {
          onSelectModule(activeModuleIndex + 1);
        }
        onToast?.('Lesson Completed ✓', 'Progress saved to database.', 'info');
      }

      saveProgressToDb(currentTime, duration, isNowCompleted);
    }
  };

  // Direct PDF Download
  const handleDirectDownloadCertificate = () => {
    const certToDownload: Certificate = certificateData || {
      id: `cert-${course.id}`,
      courseTitle: course.title,
      issuedTo: userName || 'Verified HerRise Scholar',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      credentialId: course.certificateId || `HR-CRS-${Math.floor(100000 + Math.random() * 900000)}`,
      instructorName: course.instructor,
      instructorTitle: course.instructorRole || 'Lead Instructor',
      skillsCovered: [course.category, 'Professional Certification', 'Verified Core Competency'],
      grade: 'Distinction with Honours (98%)',
      hoursCompleted: 24
    };

    generateCertificatePdf(certToDownload, { recipientName: userName });
    onToast?.(
      'Certificate Downloaded! 🎓',
      `Official A4 PDF exported for ${course.title}`,
      'success'
    );
  };

  const handleOpenCertificateModal = () => {
    const certToView: Certificate = certificateData || {
      id: `cert-${course.id}`,
      courseTitle: course.title,
      issuedTo: userName || 'Verified HerRise Scholar',
      issueDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      credentialId: course.certificateId || `HR-CRS-${Math.floor(100000 + Math.random() * 900000)}`,
      instructorName: course.instructor,
      instructorTitle: course.instructorRole || 'Lead Instructor',
      skillsCovered: [course.category, 'Professional Certification', 'Verified Core Competency'],
      grade: 'Distinction with Honours (98%)',
      hoursCompleted: 24
    };
    onOpenCertificate(certToView);
  };

  const activeVideoUrl = activeModule?.videoEmbedUrl || course.videoEmbedUrl || 'https://www.youtube-nocookie.com/embed/WEDIj9JBTC8';

  return (
    <div className="space-y-6">

      {/* ========================================================= */}
      {/* 1. RESUME NOTIFICATION BANNER (IF USER STOPPED EARLIER)    */}
      {/* ========================================================= */}
      {showResumeBanner && savedResumeTime && !isCompleted && (
        <div className="bg-gradient-to-r from-purple-900 via-[#4A154B] to-[#701a75] text-white p-4 rounded-2xl shadow-lg border border-purple-300/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-pink-300 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">Continue where you stopped</span>
                <span className="text-[10px] bg-pink-500/30 text-pink-200 px-2 py-0.5 rounded-full border border-pink-400/30 font-mono">
                  Saved at {formatTime(savedResumeTime)}
                </span>
              </div>
              <p className="text-xs text-purple-200">
                You were watching <span className="font-semibold text-white">Module {activeModuleIndex + 1}: {activeModule?.title}</span>. We saved your exact second in MongoDB.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResumePlayback}
              className="bg-white hover:bg-pink-50 text-[#4A154B] font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-[#4A154B]" />
              <span>Resume at {formatTime(savedResumeTime)}</span>
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="text-xs text-purple-300 hover:text-white px-2 py-1 rounded-lg cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. COMPLETED COURSE CELEBRATION & IN-PLACE CERTIFICATE    */}
      {/* ========================================================= */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-emerald-950 via-[#064e3b] to-[#047857] text-white p-6 rounded-3xl shadow-xl border border-emerald-400/30 relative overflow-hidden space-y-4 animate-in fade-in duration-300">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Course 100% Completed • Verified Credential Issued</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Congratulations, {userName}! 🎓
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                You have mastered all modules in <strong className="text-white">{course.title}</strong>. Your official credential has been issued and is available for instant download right here.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                onClick={handleOpenCertificateModal}
                className="flex-1 sm:flex-none bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs px-4 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-102"
              >
                <Award className="w-4 h-4 text-emerald-700" />
                <span>View Credential</span>
              </button>

              <button
                onClick={handleDirectDownloadCertificate}
                className="flex-1 sm:flex-none bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-102"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN PLAYER CANVAS & MODULE PLAYLIST                    */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Video Canvas Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">

          {/* Mode Selector & Audio Test Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 rounded-2xl border border-purple-100 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lesson Mode:</span>
              <div className="inline-flex rounded-xl bg-purple-50 p-1 border border-purple-100 text-xs font-bold">
                <button
                  onClick={() => {
                    setPlayerMode('video');
                    stopVoiceNarration();
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    playerMode === 'video'
                      ? 'bg-[#4A154B] text-white shadow-xs'
                      : 'text-gray-700 hover:text-[#4A154B]'
                  }`}
                >
                  <MonitorPlay className="w-3.5 h-3.5" />
                  <span>Video Lecture (Spoken Audio)</span>
                </button>
                <button
                  onClick={() => setPlayerMode('interactive')}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                    playerMode === 'interactive'
                      ? 'bg-[#4A154B] text-white shadow-xs'
                      : 'text-gray-700 hover:text-[#4A154B]'
                  }`}
                >
                  <Presentation className="w-3.5 h-3.5" />
                  <span>Interactive Masterclass (AI Voice)</span>
                </button>
              </div>
            </div>

            {/* Quick Test Voice Audio Button */}
            <button
              onClick={handleTestVoice}
              className="flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 text-[#be185d] border border-pink-200 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all"
              title="Test speaker voice audio"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>🔊 Test Voice Audio</span>
            </button>
          </div>

          {/* Media Player Box */}
          <div className="bg-black rounded-3xl overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center group select-none">

            {/* MODE 1: FULL SPOKEN VIDEO LECTURE (WITH NATIVE HUMAN VOICE) */}
            {playerMode === 'video' ? (
              <div className="w-full h-full relative">
                <iframe
                  ref={iframeRef}
                  key={`${course.id}-${activeModule?.id || activeModuleIndex}-${activeVideoUrl}`}
                  src={`${activeVideoUrl}?rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`}
                  title={`${course.title} - ${activeModule?.title || 'Lecture'}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={handleIframeLoad}
                />
              </div>
            ) : (
              /* MODE 2: INTERACTIVE MASTERCLASS (WITH SYNTHESIZED INSTRUCTOR VOICE & DANCING SPECTRUM) */
              <div
                onClick={togglePlayback}
                className="w-full h-full bg-gradient-to-br from-[#1a0520] via-[#2c0839] to-[#0f0214] flex flex-col justify-between p-6 relative overflow-hidden cursor-pointer"
              >
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Top Badge Strip */}
                <div className="flex items-center justify-between text-white relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="bg-pink-600/80 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      Interactive Lecture
                    </span>
                    <span className="text-xs text-purple-200">
                      Module 0{activeModuleIndex + 1} of {course.modules.length}
                    </span>
                  </div>

                  {/* Audible Voice Status Pill */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-pink-200 border border-white/15">
                      {isMuted || volume === 0 ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-red-300" />
                          <span>Voice Muted</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                          <span>Voice: {course.instructor}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center Content: Module Title & Animated Audio Visualizer */}
                <div className="text-center space-y-3 my-auto relative z-10 px-4">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md text-xs text-purple-200">
                    <BookOpen className="w-3.5 h-3.5 text-pink-400" />
                    <span>{course.title}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug max-w-xl mx-auto">
                    {activeModule?.title}
                  </h3>

                  <div className="flex items-center justify-center gap-2 text-xs text-purple-200">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructor}
                      className="w-6 h-6 rounded-full border border-purple-300/40 object-cover"
                    />
                    <span>Instructor Voice: <strong className="text-white">{course.instructor}</strong></span>
                  </div>

                  {/* Audio Visualizer Waves when Playing */}
                  {isPlaying ? (
                    <div className="flex items-center justify-center gap-1.5 pt-2 h-9">
                      {[40, 75, 30, 95, 60, 100, 45, 85, 55, 90, 70, 35, 80, 50, 95, 60].map((h, i) => (
                        <span
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-[#be185d] via-pink-400 to-amber-300 rounded-full animate-pulse shadow-xs"
                          style={{
                            height: isMuted ? '15%' : `${h}%`,
                            animationDelay: `${i * 65}ms`,
                            animationDuration: '750ms'
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-purple-300 italic">Click anywhere to start spoken lesson narration</p>
                  )}
                </div>

                {/* Bottom Closed Captions Subtitle Box */}
                <div className="relative z-10 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-xs text-white max-w-xl mx-auto w-full text-center shadow-lg">
                  <div className="flex items-center justify-center gap-1 text-[10px] text-pink-300 font-bold uppercase tracking-wider mb-0.5">
                    <Mic className="w-3 h-3 text-pink-400" />
                    <span>Instructor Narration</span>
                  </div>
                  <p className="italic text-purple-100 font-medium leading-relaxed">
                    "{currentCaption}"
                  </p>
                </div>
              </div>
            )}

            {/* Overlay Center Big Play Button in Interactive Mode when Paused */}
            {playerMode === 'interactive' && !isPlaying && (
              <div
                onClick={togglePlayback}
                className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-20 cursor-pointer"
              >
                <button
                  type="button"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#be185d] to-[#fb7185] hover:scale-110 text-white flex items-center justify-center shadow-2xl transition-transform"
                  title="Start Lesson with Voice"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1.5" />
                </button>
                <span className="text-white text-xs font-bold mt-3 bg-black/70 px-3.5 py-1 rounded-full border border-white/15 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-pink-300" />
                  <span>Click to Listen: {activeModule?.title}</span>
                </span>
              </div>
            )}
          </div>

          {/* Spoken Audio Helper Bar for Video Lecture Mode — shows live tracking status */}
          {playerMode === 'video' && (
            <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isYouTubePlaying ? 'bg-emerald-100 text-emerald-700' : 'bg-pink-100 text-[#be185d]'}`}>
                  <Volume2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 flex items-center gap-1.5 flex-wrap">
                    <span>Video Watch Tracker</span>
                    {isYouTubePlaying ? (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full animate-pulse">
                        ● Tracking — Video Playing
                      </span>
                    ) : (
                      <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
                        ⏸ Paused — Press Play to earn watch time
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">
                    Playing: <strong className="text-gray-700">{activeModule?.title}</strong>. Watch must be fully earned — no skipping.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const text = activeModule?.summary || `Welcome to ${activeModule?.title}. This session explores core strategies taught by ${course.instructor}.`;
                    speakSentence(text);
                    onToast?.('Spoken Overview Playing 🔊', 'Reading module key takeaway aloud', 'info');
                  }}
                  className="flex items-center gap-1.5 bg-[#4A154B] hover:bg-[#350c36] text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  <Radio className="w-3.5 h-3.5 text-pink-300 animate-pulse" />
                  <span>🔊 Read Lesson Notes Aloud</span>
                </button>

                <button
                  type="button"
                  onClick={stopVoiceNarration}
                  className="px-2.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#4A154B] rounded-xl text-xs font-semibold cursor-pointer"
                  title="Stop audio"
                >
                  Stop Audio
                </button>
              </div>
            </div>
          )}

          {/* Player Timeline & Controls Bar for Interactive Mode */}
          {playerMode === 'interactive' && (
            <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 360}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-[#4A154B] hover:h-2.5 transition-all"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlayback}
                    className="p-2 bg-[#4A154B] hover:bg-[#350c36] text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => skipTime(-10)}
                    className="p-2 bg-purple-50 hover:bg-purple-100 text-[#4A154B] rounded-xl cursor-pointer"
                    title="Rewind 10s"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => skipTime(10)}
                    className="p-2 bg-purple-50 hover:bg-purple-100 text-[#4A154B] rounded-xl cursor-pointer"
                    title="Forward 10s"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <span className="font-mono text-xs text-gray-600 ml-1">
                    <strong className="text-gray-900">{formatTime(currentTime)}</strong> / {formatTime(duration)}
                  </span>

                  {lastSavedNotice && (
                    <span className="hidden sm:inline-block text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono border border-emerald-200">
                      ✓ {lastSavedNotice}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-purple-50 px-2.5 py-1 rounded-xl">
                    <button onClick={toggleMute} className="text-[#4A154B] cursor-pointer">
                      {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-purple-200 rounded appearance-none cursor-pointer accent-[#4A154B]"
                    />
                  </div>

                  <button
                    onClick={changeSpeed}
                    className="px-2 py-1 bg-purple-50 hover:bg-purple-100 rounded-lg font-mono text-[11px] font-bold text-[#4A154B] cursor-pointer"
                  >
                    {playbackRate}x
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Overview & Mark Complete Action */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Module 0{activeModuleIndex + 1} of {course.modules.length}
                </span>
                <h3 className="font-black text-lg text-gray-900 mt-1">
                  {activeModule?.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Instructor: {course.instructor} • {course.instructorRole}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mark Complete button — locked until full video watched */}
                {(() => {
                  const watchThreshold = Math.max(30, Math.round((duration || 360) * 0.9));
                  const isWatchComplete = activeModule?.completed || watchedSeconds >= watchThreshold;
                  return (
                    <button
                      onClick={handleMarkModuleComplete}
                      disabled={!isWatchComplete}
                      title={
                        !isWatchComplete
                          ? `Watch ${formatTime(Math.max(0, watchThreshold - watchedSeconds))} more to unlock`
                          : ''
                      }
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
                        activeModule?.completed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                          : isWatchComplete
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {activeModule?.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isWatchComplete ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      <span>
                        {activeModule?.completed
                          ? 'Lesson Completed ✓'
                          : isWatchComplete
                          ? 'Mark Lesson Complete'
                          : `Watch ${formatTime(Math.max(0, watchThreshold - watchedSeconds))} more`}
                      </span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Watch Progress Bar (Video mode only, until module complete) */}
            {playerMode === 'video' && !activeModule?.completed && (() => {
              const watchThreshold = Math.max(30, Math.round((duration || 360) * 0.9));
              const pct = Math.min(100, Math.round((watchedSeconds / Math.max(1, watchThreshold)) * 100));
              const isWatchComplete = watchedSeconds >= watchThreshold;
              return (
                <div className="mt-1 mb-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Video Watch Progress</span>
                    <span>{pct}% watched</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#4A154B] to-[#be185d] h-full transition-all duration-1000 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {!isWatchComplete && (
                    <p className="text-[10px] text-orange-600 flex items-center gap-1 font-semibold">
                      <Lock className="w-3 h-3" />
                      <span>Watch the full video to unlock completion — skipping is disabled</span>
                    </p>
                  )}
                </div>
              );
            })()}

            <div className="text-xs text-gray-600 leading-relaxed space-y-2">
              {activeModule?.summary && (
                <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-1">
                  <div className="font-bold text-gray-900 text-xs">Module Objective & Key Takeaway:</div>
                  <p className="text-gray-700 leading-normal">
                    {activeModule.summary}
                  </p>
                </div>
              )}

              <div className="p-3 bg-pink-50/60 rounded-2xl border border-pink-100 flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#be185d] mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div className="font-bold text-pink-900 text-xs">Spoken Lesson Narration:</div>
                  <p className="italic text-purple-950 leading-normal">
                    "{currentCaption}"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-purple-900 bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <BookmarkCheck className="w-4 h-4 text-[#4A154B] shrink-0" />
                <span>
                  <strong>Autosave & Database Sync:</strong> Your exact stopped playback position is continuously saved to MongoDB.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Playlist Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-purple-50">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
                  Course Modules ({course.modules.length})
                </h3>
                <p className="text-[11px] text-gray-500">
                  {course.modules.filter((m) => m.completed).length} of {course.modules.length} Completed
                </p>
              </div>
              <span className="text-xs font-bold text-[#4A154B] bg-purple-50 px-2 py-1 rounded-lg">
                {course.progressPercent || 0}%
              </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#4A154B] to-[#be185d] h-full transition-all duration-300 rounded-full"
                style={{ width: `${course.progressPercent || 0}%` }}
              />
            </div>

            {/* Modules List */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {course.modules.map((m, idx) => {
                const isSelected = activeModuleIndex === idx;
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectModule(idx)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-[#4A154B] bg-purple-50/70 shadow-xs'
                        : 'border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                          m.completed
                            ? 'bg-emerald-600 text-white'
                            : isSelected
                            ? 'bg-[#4A154B] text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {m.completed ? '✓' : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-gray-800 truncate block">
                          {m.title}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] text-pink-700 font-bold flex items-center gap-1 mt-0.5">
                            <MonitorPlay className="w-3 h-3" />
                            <span>Playing Topic Video</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                      {m.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate Action Box inside sidebar */}
          <div className="pt-3 border-t border-purple-50">
            {isCompleted ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Credential Ready</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  You finished this course! View or download your verified certificate below.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={handleOpenCertificateModal}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold py-2 rounded-xl text-center cursor-pointer"
                  >
                    View Credential
                  </button>
                  <button
                    onClick={handleDirectDownloadCertificate}
                    className="bg-[#4A154B] hover:bg-[#350c36] text-white text-[11px] font-bold py-2 rounded-xl text-center cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 text-center space-y-1">
                <p className="text-[11px] text-gray-500">
                  Complete all {course.modules.length} modules to unlock your verified certificate.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
