import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Trash2,
  Copy,
  Check,
  Bot,
  User,
  ArrowRight,
  Wallet,
  Briefcase,
  Rocket,
  Landmark,
  ShoppingBag,
  GraduationCap,
  Users2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  assistantTopics,
  initialAssistantMessages
} from '../../data/mockData/aiPromptsData';
import { ChatMessage } from '../../types';
import { API_BASE } from '../../config/api';
import { getClientAssistantAnswer } from '../../services/assistantKnowledge';

// Helper component to render formatted Markdown text safely and beautifully
const FormattedMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-3 text-sm sm:text-base leading-relaxed font-sans text-gray-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-2" />;
        }

        // Horizontal Divider (--- or ***)
        if (trimmed === '---' || trimmed === '***') {
          return <hr key={idx} className="border-t border-purple-200/80 my-3.5" />;
        }

        // H3 Header (### Header)
        if (trimmed.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-base sm:text-lg font-black text-[#4A154B] mt-4 mb-2 flex items-center gap-2 tracking-tight">
              <span>{trimmed.replace('### ', '')}</span>
            </h3>
          );
        }

        // H4 Header (#### Header)
        if (trimmed.startsWith('#### ')) {
          return (
            <h4 key={idx} className="text-sm sm:text-base font-extrabold text-gray-900 mt-3 mb-1.5">
              {trimmed.replace('#### ', '')}
            </h4>
          );
        }

        // Blockquote (> text)
        if (trimmed.startsWith('> ')) {
          return (
            <div
              key={idx}
              className="border-l-4 border-[#4A154B] bg-gradient-to-r from-purple-50 via-purple-50/50 to-transparent px-4 py-3 rounded-r-2xl text-gray-800 font-medium my-3 text-sm sm:text-base shadow-2xs leading-relaxed"
            >
              {renderInlineStyles(trimmed.replace('> ', ''))}
            </div>
          );
        }

        // Bullet point (- or * )
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="text-[#4A154B] font-black text-sm mt-0.5">•</span>
              <div className="flex-1 text-sm sm:text-base leading-relaxed text-gray-800">{renderInlineStyles(trimmed.slice(2))}</div>
            </div>
          );
        }

        // Numbered list (1. 2. etc.)
        const matchNumbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (matchNumbered) {
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 my-1.5">
              <span className="text-[#4A154B] font-black text-sm min-w-5 mt-0.5">{matchNumbered[1]}.</span>
              <div className="flex-1 text-sm sm:text-base leading-relaxed text-gray-800">{renderInlineStyles(matchNumbered[2])}</div>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={idx} className="text-sm sm:text-base text-gray-800 leading-relaxed">
            {renderInlineStyles(line)}
          </p>
        );
      })}
    </div>
  );
};

// Robust inline parser for bold links **[label](url)**, links [label](url), **bold**, *italic*, and `code`
function renderInlineStyles(text: string): React.ReactNode {
  // Tokenize all markdown inline patterns in a single regex:
  // 1. **[label](url)** -> Bold link
  // 2. [label](url) -> Standard link
  // 3. **bold** -> Bold text
  // 4. `code` -> Inline code
  // 5. *italic* -> Italic text
  const tokenRegex = /(\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Case 1: **[label](url)** -> Bold styled badge link
    if (match[2] && match[3]) {
      const label = match[2];
      const url = match[3];
      parts.push(
        <Link
          key={match.index}
          to={url}
          className="font-black text-[#4A154B] hover:text-[#3b0764] underline underline-offset-4 decoration-[#4A154B]/50 inline-flex items-center gap-1 mx-1 bg-purple-100/70 hover:bg-purple-200/70 px-2 py-0.5 rounded-md transition-colors"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline-block" />
        </Link>
      );
    }
    // Case 2: [label](url) -> Standard link
    else if (match[4] && match[5]) {
      const label = match[4];
      const url = match[5];
      parts.push(
        <Link
          key={match.index}
          to={url}
          className="font-bold text-[#4A154B] hover:text-[#3b0764] underline underline-offset-2 inline-flex items-center gap-0.5 mx-0.5"
        >
          <span>{label}</span>
          <ExternalLink className="w-3 h-3 inline-block" />
        </Link>
      );
    }
    // Case 3: **bold**
    else if (match[6]) {
      parts.push(
        <strong key={match.index} className="font-extrabold text-gray-900">
          {match[6]}
        </strong>
      );
    }
    // Case 4: `code`
    else if (match[7]) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 bg-purple-100/80 text-[#4A154B] rounded-md font-mono text-[11px] font-semibold border border-purple-200/60">
          {match[7]}
        </code>
      );
    }
    // Case 5: *italic*
    else if (match[8]) {
      parts.push(
        <em key={match.index} className="italic text-gray-700">
          {match[8]}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

const getInitialMessagesForTopic = (topicId: string): ChatMessage[] => {
  const meta: Record<string, { welcome: string; actions: Array<{ label: string; actionPath: string }> }> = {
    general: {
      welcome: `👋 **Welcome to HerRise All-in-One Advisor!**\n\nI am your unified copilot across personal finance, career growth, business ventures, funding, and marketing.\n\n**What would you like to explore today?** Pick a suggested prompt below or type your question!`,
      actions: [
        { label: 'Optimize My Budget', actionPath: '/finance' },
        { label: 'Explore Career Opportunities', actionPath: '/career' },
        { label: 'Draft Business Plan', actionPath: '/business' }
      ]
    },
    finance: {
      welcome: `💰 **Welcome to HerFinance Advisor!**\n\nI specialize in your personal financial independence: 50/30/20 budgeting, building emergency reserves, automated SIP investments, and expense auditing.\n\n**How can I assist your financial goals today?**`,
      actions: [
        { label: 'Calculate 50/30/20 Budget', actionPath: '/finance' },
        { label: 'Set Emergency Fund Goal', actionPath: '/finance' },
        { label: 'SIP vs FD Comparison', actionPath: '/finance' }
      ]
    },
    career: {
      welcome: `💼 **Welcome to HerCareer Coach!**\n\nI am your dedicated career growth strategist: ATS resume building, explaining career gaps with confidence, behavioral interview prep, and salary negotiation.\n\n**What career milestone can we tackle today?**`,
      actions: [
        { label: 'Open ATS Resume Builder', actionPath: '/career' },
        { label: 'Explain Career Break', actionPath: '/career' },
        { label: 'Practice Interview Simulation', actionPath: '/career' }
      ]
    },
    business: {
      welcome: `🚀 **Welcome to HerBusiness Strategist!**\n\nI guide you in launching and scaling profitable ventures: validating high-margin ideas, calculating 55%+ gross margins, unit economics, and client acquisition.\n\n**What business concept would you like to build?**`,
      actions: [
        { label: 'Launch Idea Generator', actionPath: '/business' },
        { label: 'Pricing & Margin Calculator', actionPath: '/business' },
        { label: 'First 20 Customers Playbook', actionPath: '/business' }
      ]
    },
    fund: {
      welcome: `🏛️ **Welcome to HerFund Guide!**\n\nI specialize in capital acquisition for women: Pradhan Mantri Mudra Yojana, Stand-Up India, SIDBI schemes, collateral-free credit, and 6-slide investor pitch decks.\n\n**How can I help you secure funding today?**`,
      actions: [
        { label: 'Explore Mudra & Stand-Up Schemes', actionPath: '/fund' },
        { label: 'Build 6-Slide Pitch Deck', actionPath: '/fund' },
        { label: 'Check Loan Eligibility', actionPath: '/fund' }
      ]
    },
    market: {
      welcome: `🛍️ **Welcome to HerMarket Optimizer!**\n\nI specialize in digital marketplace success: storefront listing optimization, compelling product copywriting, fragile item packaging, and repeat order retention.\n\n**What storefront or product are we optimizing today?**`,
      actions: [
        { label: 'Product Description Formula', actionPath: '/market' },
        { label: 'Sustainable Packaging Guide', actionPath: '/market' },
        { label: 'Double Repeat Orders Playbook', actionPath: '/market' }
      ]
    }
  };

  const item = meta[topicId] || meta.general;
  return [
    {
      id: `welcome-${topicId}-${Date.now()}`,
      sender: 'assistant',
      content: item.welcome,
      timestamp: 'Just now',
      category: topicId,
      suggestedActions: item.actions
    }
  ];
};

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedTopic, setSelectedTopic] = useState('general');

  // Separate, independent chat histories per agent discipline
  const [chatsByTopic, setChatsByTopic] = useState<Record<string, ChatMessage[]>>(() => {
    const initial: Record<string, ChatMessage[]> = {};
    const topicIds = ['general', 'finance', 'career', 'business', 'fund', 'market'];
    topicIds.forEach((tId) => {
      try {
        const stored = localStorage.getItem(`herrise_ai_chat_${tId}`);
        initial[tId] = stored ? JSON.parse(stored) : getInitialMessagesForTopic(tId);
      } catch {
        initial[tId] = getInitialMessagesForTopic(tId);
      }
    });
    return initial;
  });

  // Current active agent's messages (completely isolated per agent)
  const currentMessages = chatsByTopic[selectedTopic] || getInitialMessagesForTopic(selectedTopic);

  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    scrollToBottom();
    const timer1 = setTimeout(scrollToBottom, 100);
    const timer2 = setTimeout(scrollToBottom, 300);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [currentMessages, isTyping, selectedTopic]);

  const currentTopic = assistantTopics.find((t) => t.id === selectedTopic) || assistantTopics[0];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now().toString(36),
      sender: 'user',
      content: query,
      timestamp: 'Just now'
    };

    const topicKey = selectedTopic;
    const priorHistory = currentMessages;

    // Immediately update this agent's chat history only
    setChatsByTopic((prev) => {
      const activeMsgs = prev[topicKey] || getInitialMessagesForTopic(topicKey);
      const updated = {
        ...prev,
        [topicKey]: [...activeMsgs, userMessage]
      };
      localStorage.setItem(`herrise_ai_chat_${topicKey}`, JSON.stringify(updated[topicKey]));
      return updated;
    });

    setInputValue('');
    setIsTyping(true);

    let reply = '';
    let suggestedActions: Array<{ label: string; actionPath: string }> | undefined = undefined;

    // Call Universal Backend AI Assistant Endpoint
    try {
      const res = await fetch(`${API_BASE}/api/assistant/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          topic: topicKey,
          history: priorHistory.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          userProfile: {
            name: user?.name,
            targetRole: user?.careerProfile?.targetRole,
            skills: user?.skills
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.data?.response) {
          reply = data.data.response;
          suggestedActions = data.data.suggestedActions;
        }
      }
    } catch (err) {
      console.warn('Backend Assistant Chat fetch failed, falling back to client knowledge engine:', err);
    }

    // High-fidelity fallback client reasoning if backend was unreachable or returned empty
    if (!reply) {
      const localResult = getClientAssistantAnswer(query, topicKey, user?.name);
      reply = localResult.response;
      suggestedActions = localResult.suggestedActions;
    }

    const assistantMessage: ChatMessage = {
      id: 'msg-' + (Date.now() + 1).toString(36),
      sender: 'assistant',
      content: reply,
      timestamp: 'Just now',
      suggestedActions
    };

    setIsTyping(false);

    // Save assistant reply only to this agent's chat history
    setChatsByTopic((prev) => {
      const activeMsgs = prev[topicKey] || [];
      const updated = {
        ...prev,
        [topicKey]: [...activeMsgs, assistantMessage]
      };
      localStorage.setItem(`herrise_ai_chat_${topicKey}`, JSON.stringify(updated[topicKey]));
      return updated;
    });
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      showToast('Voice Simulation Active', 'Speak clearly into your microphone...', 'info');
      setTimeout(() => {
        setIsListening(false);
        const sampleQuery =
          selectedTopic === 'career'
            ? 'How do I explain a 3-year career break in my resume and interviews?'
            : selectedTopic === 'business'
              ? 'What are 5 low-investment business ideas I can start from home?'
              : selectedTopic === 'fund'
                ? 'What documents do public sector banks ask for women business loans?'
                : selectedTopic === 'market'
                  ? 'How should I package fragile glass items sustainably?'
                  : 'How should I allocate my 50/30/20 budget on a ₹60,000 monthly income?';
        setInputValue(sampleQuery);
        showToast('Voice Transcribed', 'Simulated speech converted to text', 'success');
      }, 1500);
    } else {
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    const fresh = getInitialMessagesForTopic(selectedTopic);
    setChatsByTopic((prev) => ({
      ...prev,
      [selectedTopic]: fresh
    }));
    localStorage.setItem(`herrise_ai_chat_${selectedTopic}`, JSON.stringify(fresh));
    showToast('Chat History Cleared', `${currentTopic.label} conversation reset`, 'info');
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to Clipboard', 'Assistant answer copied', 'info');
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-5.5rem)] min-h-[700px] flex flex-col bg-white rounded-3xl border border-purple-100 shadow-md overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-purple-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#3b0764] via-[#4A154B] to-[#fb7185] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-gray-900">Unified HerRise Assistant</h1>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Ready • Multi-Discipline AI
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Autonomous Copilot for Finance, Careers, Ventures, Capital & Mentorship
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>

        {/* Module Category Selector Pills */}
        <div className="px-6 py-3 border-b border-purple-50 bg-[#faf9fd] flex items-center gap-2.5 overflow-x-auto text-xs">
          <span className="text-gray-400 font-extrabold uppercase tracking-wider text-[10px] shrink-0 mr-1">
            Focus Discipline:
          </span>
          {assistantTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 ${selectedTopic === topic.id
                ? 'bg-[#4A154B] text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'
                }`}
            >
              <span className="text-sm">{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Message Scroll Window */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 bg-slate-50/20">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-10 h-10 rounded-2xl bg-purple-100/90 border border-purple-200/80 flex items-center justify-center text-[#4A154B] shrink-0 shadow-xs mt-1">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`w-full rounded-3xl p-6 sm:p-8 leading-relaxed relative group transition-all ${msg.sender === 'user'
                  ? 'max-w-xl bg-gradient-to-r from-[#4A154B] to-[#5c1c5e] text-white rounded-tr-xs shadow-md'
                  : 'max-w-4xl xl:max-w-5xl bg-white text-gray-800 rounded-tl-xs border border-purple-100 shadow-sm'
                  }`}
              >
                {/* Message Content: Clean White for User, Formatted Markdown for Assistant */}
                {msg.sender === 'user' ? (
                  <p className="text-white text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                ) : (
                  <FormattedMarkdown content={msg.content} />
                )}

                {/* Suggested Navigation Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-purple-100 flex flex-wrap gap-2.5">
                    {msg.suggestedActions.map((action, idx) => {
                      const isTopicSwitch = Boolean(action.actionPath?.startsWith('#topic-'));
                      const targetTopicId = isTopicSwitch ? (action.actionPath?.replace('#topic-', '') ?? null) : null;

                      if (isTopicSwitch && targetTopicId) {
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedTopic(targetTopicId);
                              showToast(
                                'Specialist Switched ✨',
                                `Now chatting with ${assistantTopics.find((t) => t.id === targetTopicId)?.label || targetTopicId}`,
                                'info'
                              );
                            }}
                            className="bg-purple-100 hover:bg-[#4A154B] text-[#4A154B] hover:text-white border border-purple-300 hover:border-[#4A154B] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer inline-flex items-center gap-2 shadow-xs hover:shadow-md"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      }

                      return (
                        <Link
                          key={idx}
                          to={action.actionPath ?? '/'}
                          className="bg-purple-50 hover:bg-[#4A154B] text-[#4A154B] hover:text-white border border-purple-200 hover:border-[#4A154B] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer inline-flex items-center gap-2 shadow-2xs hover:shadow-xs"
                        >
                          <span>{action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Footer time & copy */}
                <div
                  className={`mt-2.5 pt-1.5 flex items-center justify-between text-[10px] ${
                    msg.sender === 'user'
                      ? 'text-purple-200 border-t border-white/20'
                      : 'text-gray-400 border-t border-gray-100/50'
                  }`}
                >
                  <span className={msg.sender === 'user' ? 'text-purple-200 font-medium' : 'text-gray-400'}>
                    {msg.timestamp}
                  </span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-700 cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy Answer</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border border-purple-200 shrink-0 mt-1"
                />
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-gray-400 text-xs pl-11">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] font-medium text-gray-500">HerRise is synthesizing strategy...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Shelf */}
        <div className="px-6 py-2 bg-[#faf9fd] border-t border-purple-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {currentTopic.suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs text-gray-700 bg-white hover:bg-purple-100/80 border border-gray-200 hover:border-purple-300 px-3 py-1 rounded-xl shrink-0 transition-colors cursor-pointer truncate max-w-xs"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Input Form */}
        <div className="p-4 border-t border-purple-100 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about resumes, career breaks, 50/30/20 budgets, business ideas, government grants, or mentorship..."
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-2xl text-xs sm:text-sm outline-none transition-all"
              />
              <button
                type="button"
                onClick={toggleMic}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors cursor-pointer ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-gray-400 hover:text-gray-600'
                  }`}
                title="Voice input simulation"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-[#4A154B] hover:bg-[#350c36] text-white p-3 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4 text-pink-300" />
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};
