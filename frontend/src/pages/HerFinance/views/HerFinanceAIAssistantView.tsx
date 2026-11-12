import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  PieChart,
  Lightbulb,
  Zap,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import {
  generateHerFinanceAIResponse,
  fetchHerFinanceAIResponse
} from '../../../services/financeAiService';
import { HerFinanceTab } from '../HerFinanceLayout';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionSuggestion?: { label: string; tab: string };
}

interface HerFinanceAIAssistantViewProps {
  onNavigateTab: (tab: HerFinanceTab) => void;
}

const SUGGESTED_QUERIES = [
  'Where am I spending the most money?',
  'How much should I save every month?',
  'How can I manage my ₹30,000 monthly salary?',
  'How do I build an emergency fund?',
  'Explain compound interest in simple language',
  'How can I reduce unnecessary expenses?'
];

export const HerFinanceAIAssistantView: React.FC<HerFinanceAIAssistantViewProps> = ({
  onNavigateTab
}) => {
  const { profile, transactions, goals, budget, totalIncome, totalExpenses, netBalance } =
    useHerFinance();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `### 🌸 Hello, ${(profile.fullName || 'Member').split(' ')[0]}!\nI am your **HerFinance AI Copilot**. I analyze your live ledger data to help you allocate income, build emergency reserves, optimize category budgets, and demystify financial concepts.\n\nWhat would you like to examine today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionSuggestion: { label: 'Explore Category Budgets', tab: 'budget' }
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Derive top spending category
  const categorySpends: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categorySpends[t.category] = (categorySpends[t.category] || 0) + t.amount;
    });
  const sortedCategories = Object.entries(categorySpends).sort((a, b) => b[1] - a[1]);
  const topCategoryName = sortedCategories[0]?.[0] || 'Housing / Rent';
  const topCategoryAmount = sortedCategories[0]?.[1] || 0;

  const savingsRate =
    totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await fetchHerFinanceAIResponse(query, {
        profile,
        transactions,
        goals,
        activeBudget: budget,
        hasUserPermission: true
      });

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestion: response.actionSuggestion
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      // Fallback
      const fallbackResponse = generateHerFinanceAIResponse(query, {
        profile,
        transactions,
        goals,
        activeBudget: budget,
        hasUserPermission: true
      });

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: fallbackResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionSuggestion: fallbackResponse.actionSuggestion
      };

      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'ai',
        text: `### 🔄 Session Cleared\nReady for fresh questions! How can I assist your financial planning right now?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Ledger Snapshot Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Verified Income
          </p>
          <p className="text-lg font-extrabold text-slate-900 mt-0.5">
            ₹{totalIncome.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold inline-flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Live Inflows
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Current Outgoings
          </p>
          <p className="text-lg font-extrabold text-slate-900 mt-0.5">
            ₹{totalExpenses.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500 inline-flex items-center gap-1 mt-1">
            {transactions.filter((t) => t.type === 'expense').length} transactions
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Savings Capacity
          </p>
          <p className="text-lg font-extrabold text-teal-700 mt-0.5">{savingsRate}%</p>
          <span className="text-[10px] text-teal-600 font-medium inline-flex items-center gap-1 mt-1">
            ₹{netBalance > 0 ? netBalance.toLocaleString() : 0} surplus
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Top Outflow Area
          </p>
          <p className="text-sm font-extrabold text-slate-900 truncate mt-1">{topCategoryName}</p>
          <span className="text-[10px] text-slate-500 inline-flex items-center gap-1 mt-1">
            ₹{topCategoryAmount.toLocaleString()} logged
          </span>
        </div>
      </div>

      {/* Main Chat Engine Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0f172a] text-teal-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-900">HerFinance AI Copilot</h3>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Groq LPU™ Cloud AI
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Grounded In User Ledger
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Personalized budgeting, expense auditing, and plain-English financial concepts
              </p>
            </div>
          </div>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white transition-colors cursor-pointer"
            title="Reset Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Chat Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-white to-slate-50/40">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-teal-400 flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-white border border-slate-200 text-slate-800'
                      : 'bg-[#0f172a] text-white'
                  }`}
                >
                  <div className="space-y-2 prose prose-sm max-w-none text-slate-700">
                    {msg.text.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h4
                            key={idx}
                            className={`font-bold text-sm sm:text-base mb-1 ${
                              isAi ? 'text-[#0f172a]' : 'text-teal-300'
                            }`}
                          >
                            {paragraph.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (paragraph.startsWith('#### ')) {
                        return (
                          <h5
                            key={idx}
                            className={`font-bold text-xs sm:text-sm mb-1 ${
                              isAi ? 'text-teal-800' : 'text-teal-200'
                            }`}
                          >
                            {paragraph.replace('#### ', '')}
                          </h5>
                        );
                      }
                      if (paragraph.startsWith('> ')) {
                        return (
                          <div
                            key={idx}
                            className="bg-teal-50 border-l-4 border-teal-600 p-2.5 rounded-r-xl text-xs text-teal-900 font-medium"
                          >
                            {paragraph.replace('> ', '')}
                          </div>
                        );
                      }

                      return (
                        <p
                          key={idx}
                          className={`${
                            isAi ? 'text-slate-700' : 'text-slate-100'
                          } whitespace-pre-line`}
                        >
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>

                  {msg.actionSuggestion && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">
                        Recommended Next Step:
                      </span>
                      <button
                        onClick={() =>
                          onNavigateTab(msg.actionSuggestion!.tab as HerFinanceTab)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-lg border border-teal-200 transition-colors cursor-pointer"
                      >
                        <span>{msg.actionSuggestion.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div
                    className={`mt-2 text-[10px] text-right ${
                      isAi ? 'text-slate-400' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3.5 justify-start">
              <div className="w-8 h-8 rounded-xl bg-[#0f172a] text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                <span
                  className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
                <span className="text-xs text-slate-500 font-medium ml-1">
                  Synthesizing real ledger data...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="p-3 bg-slate-50/90 border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Prompts:
          </span>
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-xs bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about your income, expenses, SIPs, emergency fund, or 50/30/20..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="bg-[#0f172a] hover:bg-slate-800 disabled:opacity-40 text-teal-400 p-3 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shrink-0"
            >
              <span className="hidden sm:inline">Ask AI</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer Banner */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">
            Regulatory Notice: Financial Education Only – Not Regulated Financial Advice.
          </span>{' '}
          HerFinance AI Copilot provides automated numerical calculations, educational concepts, and
          budget heuristics based on your recorded ledger entries. It is not a registered
          SEBI/regulatory investment advisor or licensed tax practitioner. For bespoke asset
          management, tax filing, or contractual debt decisions, always consult a certified
          financial planner.
        </div>
      </div>
    </div>
  );
};
