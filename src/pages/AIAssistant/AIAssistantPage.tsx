import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Trash2,
  Download,
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
  GraduationCap
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  assistantTopics,
  initialAssistantMessages,
  smartAIResponses
} from '../../data/mockData/aiPromptsData';
import { ChatMessage } from '../../types';

export const AIAssistantPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('herrise_ai_chat');
      return stored ? JSON.parse(stored) : initialAssistantMessages;
    } catch {
      return initialAssistantMessages;
    }
  });

  const [inputValue, setInputValue] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('herrise_ai_chat', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate smart AI response generation
    await new Promise((res) => setTimeout(res, 800));

    let reply = smartAIResponses['default'];
    const lower = query.toLowerCase();

    if (lower.includes('budget') || lower.includes('50/30/20') || lower.includes('money') || lower.includes('sip') || lower.includes('invest')) {
      reply = smartAIResponses['budget'];
    } else if (lower.includes('break') || lower.includes('gap') || lower.includes('resume') || lower.includes('interview') || lower.includes('job')) {
      reply = smartAIResponses['break'];
    } else if (lower.includes('price') || lower.includes('margin') || lower.includes('cost') || lower.includes('cogs') || lower.includes('business')) {
      reply = smartAIResponses['margin'];
    } else if (lower.includes('pitch') || lower.includes('fund') || lower.includes('grant') || lower.includes('loan') || lower.includes('angel')) {
      reply = smartAIResponses['pitch'];
    }

    const assistantMessage: ChatMessage = {
      id: 'msg-' + (Date.now() + 1).toString(36),
      sender: 'assistant',
      content: reply,
      timestamp: 'Just now'
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMessage]);
  };

  const toggleMic = () => {
    if (!isListening) {
      setIsListening(true);
      showToast('Voice Simulation Active', 'Speak clearly into your microphone...', 'info');
      setTimeout(() => {
        setIsListening(false);
        setInputValue('How should I allocate my 50/30/20 budget on a ₹60,000 monthly income?');
        showToast('Voice Transcribed', 'Simulated speech converted to text', 'success');
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    setMessages(initialAssistantMessages);
    localStorage.removeItem('herrise_ai_chat');
    showToast('Chat History Cleared', 'Conversation reset to default', 'info');
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to Clipboard', 'Assistant answer copied', 'info');
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8.5rem)] flex flex-col bg-white rounded-3xl border border-purple-100 shadow-xs overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-purple-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-50/60 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3b0764] via-[#4A154B] to-[#fb7185] flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-gray-900">Unified HerRise AI Assistant</h1>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready • v2.6
                </span>
              </div>
              <p className="text-xs text-gray-500">Autonomous Copilot for Finance, Careers, Ventures & Capital</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Chat</span>
            </button>
          </div>
        </div>

        {/* Module Category Selector Pills */}
        <div className="px-6 py-2.5 border-b border-purple-50 bg-[#faf9fd] flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] shrink-0 mr-1">
            Focus Discipline:
          </span>
          {assistantTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedTopic === topic.id
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-200'
              }`}
            >
              <span>{topic.icon}</span>
              <span>{topic.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Message Scroll Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center text-[#4A154B] shrink-0 shadow-2xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-5 text-xs sm:text-sm leading-relaxed relative group ${
                  msg.sender === 'user'
                    ? 'bg-[#4A154B] text-white rounded-tr-xs shadow-md'
                    : 'bg-[#faf9fd] text-gray-800 rounded-tl-xs border border-purple-100 shadow-2xs'
                }`}
              >
                {/* Content */}
                <div className="whitespace-pre-line prose prose-purple max-w-none text-xs sm:text-sm">
                  {msg.content}
                </div>

                {/* Suggested actions if present */}
                {msg.suggestedActions && (
                  <div className="pt-3 mt-3 border-t border-purple-100/60 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (action.actionPath) window.location.href = action.actionPath;
                        }}
                        className="bg-white hover:bg-purple-100/80 text-[#4A154B] border border-purple-200 px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        {action.label} →
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer time & copy */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-gray-700 cursor-pointer flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
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
              <span className="text-[11px] font-medium text-gray-500">HerRise AI is synthesizing strategy...</span>
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
                placeholder="Ask financial rules, resume tips, startup pricing, or funding options..."
                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#4A154B] rounded-2xl text-xs sm:text-sm outline-none transition-all"
              />
              <button
                type="button"
                onClick={toggleMic}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl transition-colors cursor-pointer ${
                  isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-gray-400 hover:text-gray-600'
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

