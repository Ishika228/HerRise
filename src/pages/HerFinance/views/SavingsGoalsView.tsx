import React, { useState } from 'react';
import {
  PiggyBank,
  PlusCircle,
  TrendingUp,
  Calendar,
  Clock,
  Sparkles,
  Pause,
  Play,
  Trash2,
  Edit2,
  CheckCircle2,
  History,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { Modal } from '../../../components/common/Modal';
import { useToast } from '../../../context/ToastContext';
import { SavingsGoalRecord } from '../../../types/finance';

export const SavingsGoalsView: React.FC = () => {
  const {
    goals,
    totalSavings,
    netBalance,
    profile,
    addSavingsGoal,
    editSavingsGoal,
    deleteSavingsGoal,
    togglePauseGoal,
    contributeToGoal
  } = useHerFinance();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  // Modals
  const [createGoalModalOpen, setCreateGoalModalOpen] = useState(false);
  const [depositModalGoal, setDepositModalGoal] = useState<SavingsGoalRecord | null>(null);
  const [depositAmount, setDepositAmount] = useState('2000');
  const [depositNote, setDepositNote] = useState('Surplus transfer');
  const [viewHistoryGoal, setViewHistoryGoal] = useState<SavingsGoalRecord | null>(null);

  // New Goal Form
  const [newGoalForm, setNewGoalForm] = useState({
    title: '',
    targetAmount: '',
    targetDate: '2027-06-30',
    startDate: new Date().toISOString().split('T')[0],
    category: 'Emergency Fund' as SavingsGoalRecord['category'],
    color: '#0d9488'
  });

  const activeGoals = goals.filter((g) => g.status !== 'completed');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalForm.title || !newGoalForm.targetAmount) return;
    addSavingsGoal({
      title: newGoalForm.title,
      targetAmount: Number(newGoalForm.targetAmount),
      targetDate: newGoalForm.targetDate,
      startDate: newGoalForm.startDate,
      category: newGoalForm.category,
      color: newGoalForm.color
    });
    setCreateGoalModalOpen(false);
    setNewGoalForm({
      title: '',
      targetAmount: '',
      targetDate: '2027-06-30',
      startDate: new Date().toISOString().split('T')[0],
      category: 'Emergency Fund',
      color: '#0d9488'
    });
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal || Number(depositAmount) <= 0) return;
    contributeToGoal(depositModalGoal.id, Number(depositAmount), depositNote);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {}
    setDepositModalGoal(null);
    setDepositAmount('2000');
  };

  // Helper: compute monthly savings needed
  const calculatePacing = (goal: SavingsGoalRecord) => {
    const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
    const today = new Date();
    const target = new Date(goal.targetDate);
    const diffMonths = Math.max(1, (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()));
    const diffDays = Math.max(1, Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    const requiredMonthly = Math.ceil(remaining / diffMonths);
    const requiredDaily = Math.ceil(remaining / diffDays);

    // AI Feasibility Check based on user surplus
    const isAchievable = requiredMonthly <= (profile.monthlySavingsTarget || netBalance || 15000);

    return {
      remaining,
      diffMonths,
      diffDays,
      requiredMonthly,
      requiredDaily,
      isAchievable
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Savings Goals Management</h2>
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              ₹{totalSavings.toLocaleString()} Total Accumulated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic milestone tracking with automated required monthly/daily savings pacing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'active' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Active ({activeGoals.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'completed' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Completed ({completedGoals.length})
            </button>
          </div>

          <button
            onClick={() => setCreateGoalModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>Create New Goal</span>
          </button>
        </div>
      </div>

      {/* Goals Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(activeTab === 'active' ? activeGoals : completedGoals).map((goal) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const pacing = calculatePacing(goal);

          return (
            <div
              key={goal.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                    {goal.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      goal.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : goal.status === 'paused'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                  {goal.title}
                </h3>

                {/* Amount and Percent */}
                <div className="mt-3 flex items-baseline justify-between">
                  <div className="text-xl font-black text-slate-900">
                    ₹{goal.currentAmount.toLocaleString()}
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      / ₹{goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-teal-700">{percent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${percent}%`, backgroundColor: goal.color || '#0d9488' }}
                  />
                </div>

                {/* Dynamic AI Pacing Box */}
                {goal.status !== 'completed' && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs my-3">
                    <div className="flex justify-between text-slate-600 font-medium">
                      <span>Monthly Required:</span>
                      <strong className="text-slate-900">₹{pacing.requiredMonthly.toLocaleString()}/mo</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Daily Pacing:</span>
                      <span>₹{pacing.requiredDaily.toLocaleString()} / day ({pacing.diffMonths} months remaining)</span>
                    </div>

                    <div className="pt-1 flex items-center gap-1.5 text-[10px] font-bold">
                      {pacing.isAchievable ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Target Achievable with your current savings capacity
                        </span>
                      ) : (
                        <span className="text-amber-700 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          High Target Pace: Consider extending deadline by 2 months
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {goal.status !== 'completed' && (
                    <button
                      onClick={() => setDepositModalGoal(goal)}
                      className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs cursor-pointer"
                    >
                      + Deposit Money
                    </button>
                  )}

                  <button
                    onClick={() => setViewHistoryGoal(goal)}
                    className="text-slate-500 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="View contributions"
                  >
                    <History className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePauseGoal(goal.id)}
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title={goal.status === 'paused' ? 'Resume goal' : 'Pause goal'}
                  >
                    {goal.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => deleteSavingsGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Goal */}
      <Modal
        isOpen={createGoalModalOpen}
        onClose={() => setCreateGoalModalOpen(false)}
        title="Create Dedicated Savings Goal"
        subtitle="Set a clear target amount and deadline to achieve independence"
        maxWidth="md"
      >
        <form onSubmit={handleCreateGoal} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Goal Name</label>
            <input
              type="text"
              required
              value={newGoalForm.title}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, title: e.target.value })}
              placeholder="e.g. Emergency Fund (6 Months)"
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:border-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Target Amount (₹)</label>
              <input
                type="number"
                required
                value={newGoalForm.targetAmount}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, targetAmount: e.target.value })}
                placeholder="100000"
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:border-teal-600 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={newGoalForm.category}
                onChange={(e) => setNewGoalForm({ ...newGoalForm, category: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
              >
                <option value="Emergency Fund">Emergency Fund</option>
                <option value="Starting a Business">Starting a Business</option>
                <option value="Education">Education & Certifications</option>
                <option value="New Laptop">New Laptop / Tech</option>
                <option value="Home Purchase">Home Purchase</option>
                <option value="Travel">Travel & Sabbatical</option>
                <option value="General">General Wealth</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Target Completion Date</label>
            <input
              type="date"
              required
              value={newGoalForm.targetDate}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, targetDate: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#0f172a] text-white py-3 rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
          >
            Create Goal
          </button>
        </form>
      </Modal>

      {/* Modal: Deposit Funds */}
      {depositModalGoal && (
        <Modal
          isOpen={!!depositModalGoal}
          onClose={() => setDepositModalGoal(null)}
          title={`Add Funds to ${depositModalGoal.title}`}
          subtitle={`Current balance: ₹${depositModalGoal.currentAmount.toLocaleString()} of ₹${depositModalGoal.targetAmount.toLocaleString()}`}
          maxWidth="sm"
        >
          <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Deposit Amount (₹)</label>
              <input
                type="number"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-base font-black outline-none focus:border-teal-600"
              />
            </div>

            <div className="flex gap-2">
              {[1000, 2500, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setDepositAmount(amt.toString())}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-800 font-bold text-[11px] rounded-lg cursor-pointer"
                >
                  +₹{amt}
                </button>
              ))}
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Deposit Note</label>
              <input
                type="text"
                value={depositNote}
                onChange={(e) => setDepositNote(e.target.value)}
                placeholder="e.g. Monthly automated allocation"
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-500 cursor-pointer"
            >
              Confirm Deposit
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: View Contributions History */}
      {viewHistoryGoal && (
        <Modal
          isOpen={!!viewHistoryGoal}
          onClose={() => setViewHistoryGoal(null)}
          title={`Contribution History: ${viewHistoryGoal.title}`}
          subtitle={`${viewHistoryGoal.contributions.length} recorded deposits`}
          maxWidth="md"
        >
          <div className="space-y-3 text-xs">
            {viewHistoryGoal.contributions.length === 0 ? (
              <p className="text-slate-400 text-center py-6">No deposit history logged yet for this goal.</p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {viewHistoryGoal.contributions.map((c) => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 block font-bold">+₹{c.amount.toLocaleString()}</strong>
                      <span className="text-[11px] text-slate-400">{c.notes || 'Deposit'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{c.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
