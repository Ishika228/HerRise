import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Loader2,
  User,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { useHerCareer } from '../../../context/HerCareerContext';

export const HerCareerAssistantView: React.FC = () => {
  const { assistantHistory, isAssistantTyping, askCareerAssistant, profile } = useHerCareer();
  const [prompt, setPrompt] = useState('');

  const samplePrompts = [
    'How do I explain a 3-year childcare break in an interview?',
    'What are the highest demand skills for a Data Analyst in 2026?',
    'How can I convert basic job duties into achievement-oriented resume bullets?',
    'What questions will an engineering director ask in a system design interview?',
    'Can you help me negotiate a higher salary offer?'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isAssistantTyping) return;
    const msg = prompt.trim();
    setPrompt('');
    askCareerAssistant(msg);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-[700px]">
      {/* Assistant Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">HerCareer AI Assistant</h3>
            <p className="text-[11px] text-teal-300">
              Personalized for {profile.fullName} • Target: {profile.targetRole}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-500/30 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          Groq AI Connected
        </span>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-teal-600" />
            Try:
          </span>
          {samplePrompts.map((sp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => askCareerAssistant(sp)}
              className="px-3 py-1 rounded-xl bg-white hover:bg-teal-50 border border-slate-200/90 text-[11px] text-slate-700 font-semibold transition-all hover:border-teal-300 cursor-pointer"
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {assistantHistory.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-teal-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-[#0f172a] text-white rounded-br-none shadow-2xs'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-bl-none shadow-2xs'
                }`}
              >
                {msg.content}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAssistantTyping && (
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-teal-300 flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <span>HerCareer AI is reasoning...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isAssistantTyping}
          placeholder="Ask anything about resume crafting, interview prep, career transitions, or job search..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isAssistantTyping || !prompt.trim()}
          className="px-4.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
