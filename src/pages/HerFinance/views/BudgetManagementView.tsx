import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  Sparkles,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Edit2,
  Trash2,
  Info,
  ArrowRight,
  ShieldCheck,
  Save
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { Modal } from '../../../components/common/Modal';
import { useToast } from '../../../context/ToastContext';

export const BudgetManagementView: React.FC = () => {
  const {
    profile,
    budget,
    totalIncome,
    totalExpenses,
    remainingBudget,
    updateBudgetCategoryLimit,
    addCustomCategory,
    deleteCategory,
    updateProfile
  } = useHerFinance();

  const { showToast } = useToast();

  // Modals & form state
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; limit: number } | null>(null);
  const [newLimitInput, setNewLimitInput] = useState('');
  const [addCustomCatModal, setAddCustomCatModal] = useState(false);
  const [customCatName, setCustomCatName] = useState('');
  const [customCatLimit, setCustomCatLimit] = useState('');
  const [customCatColor, setCustomCatColor] = useState('#0d9488');

  // AI Personalized Budget Recommendation State
  const [aiBudgetAnalysis, setAiBudgetAnalysis] = useState<string | null>(null);
  const [aiIsAnalyzing, setAiIsAnalyzing] = useState(false);

  // Income update inline
  const [incomeEditMode, setIncomeEditMode] = useState(false);
  const [incomeInput, setIncomeInput] = useState(profile.monthlyIncome.toString());

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(incomeInput);
    if (val > 0) {
      updateProfile({ monthlyIncome: val });
      setIncomeEditMode(false);
      showToast('Baseline Income Updated', `Monthly income set to ₹${val.toLocaleString()}`, 'success');
    }
  };

  const handleUpdateLimitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !newLimitInput) return;
    updateBudgetCategoryLimit(editingCategory.id, Number(newLimitInput));
    setEditingCategory(null);
  };

  const handleCreateCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCatName.trim() || !customCatLimit) return;
    addCustomCategory(customCatName.trim(), Number(customCatLimit), customCatColor);
    setAddCustomCatModal(false);
    setCustomCatName('');
    setCustomCatLimit('');
  };

  const handleRunAIBudgetAnalysis = () => {
    setAiIsAnalyzing(true);
    setTimeout(() => {
      setAiIsAnalyzing(false);
      const recommendedNeeds = Math.round(totalIncome * 0.5);
      const recommendedWants = Math.round(totalIncome * 0.3);
      const recommendedSavings = Math.round(totalIncome * 0.2);

      const highSpendingCats = budget.categories.filter((c) => (c.spent / (c.limit || 1)) >= 0.8);
      const overspendNames = highSpendingCats.map((c) => c.categoryName).join(', ');

      const insight = `### 🤖 HerFinance AI Personalized Budget Matrix\n\nBased on your monthly verified inflow of **₹${totalIncome.toLocaleString()}** and current spending pattern of **₹${totalExpenses.toLocaleString()}**:\n\n1. **Recommended 50/30/20 Benchmark:**\n   - **Essential Needs Cap (50%):** ₹${recommendedNeeds.toLocaleString()} (Rent, Groceries, Utilities)\n   - **Lifestyle Wants Cap (30%):** ₹${recommendedWants.toLocaleString()} (Dining, Shopping)\n   - **Guaranteed Savings & Wealth (20%):** ₹${recommendedSavings.toLocaleString()} (Emergency Buffer & Index SIPs)\n\n2. **High-Spend Risk Areas Detected:**\n   ${highSpendingCats.length > 0 ? `⚠️ Categories approaching or exceeding spending ceilings: **${overspendNames}**.` : `✓ All categories are currently operating within healthy safe margins!`}\n\n3. **Practical Action Recommendation:**\n   Reduce dining and impulse shopping outlays by 15% to immediately free up an extra **₹${Math.round(totalIncome * 0.05).toLocaleString()} / month** towards your seed capital goal.`;
      setAiBudgetAnalysis(insight);
      showToast('AI Budget Analyzed', 'Custom financial plan synthesized', 'success');
    }, 700);
  };

  const totalAllocated = budget.categories.reduce((s, c) => s + c.limit, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner: Income Control & Total Budget Utilization */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monthly Net Inflow Baseline:
              </span>
              {!incomeEditMode ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900">
                    ₹{profile.monthlyIncome.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setIncomeInput(profile.monthlyIncome.toString());
                      setIncomeEditMode(true);
                    }}
                    className="text-xs text-teal-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Baseline</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveIncome} className="flex items-center gap-2">
                  <input
                    type="number"
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    className="px-3 py-1 text-sm font-bold bg-slate-50 border rounded-lg w-32 outline-none focus:border-teal-600"
                  />
                  <button
                    type="submit"
                    className="bg-teal-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-teal-700 cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncomeEditMode(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Spending limits should align with your net take-home salary.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAddCustomCatModal(true)}
              className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
              <span>Add Custom Category</span>
            </button>

            <button
              onClick={handleRunAIBudgetAnalysis}
              className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>{aiIsAnalyzing ? 'Analyzing...' : 'AI Budget Suggestion'}</span>
            </button>
          </div>
        </div>

        {/* Global Budget Utilization Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-semibold">Total Category Limits Allocated</span>
            <strong className="text-lg text-slate-900">₹{totalAllocated.toLocaleString()}</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-semibold">Actual Spending to Date</span>
            <strong className="text-lg text-rose-600">₹{totalExpenses.toLocaleString()}</strong>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block font-semibold">Remaining Available Budget</span>
            <strong className="text-lg text-teal-700">₹{remainingBudget.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* AI Analysis Card if generated */}
      {aiBudgetAnalysis && (
        <div className="bg-gradient-to-r from-teal-900 to-[#0f172a] text-white p-6 rounded-3xl shadow-md border border-teal-800 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-teal-800/80">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <h4 className="font-bold text-sm text-teal-200">AI Budget Recommendations & Audit</h4>
            </div>
            <button
              onClick={() => setAiBudgetAnalysis(null)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
          <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line prose prose-invert max-w-none">
            {aiBudgetAnalysis}
          </div>
        </div>
      )}

      {/* Category Budget Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Category Budget Limits & Live Spend ({budget.categories.length} Categories)
          </h3>
          <span className="text-xs text-slate-500">
            Automated alerts fire at 80% and 100% of limits.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budget.categories.map((cat) => {
            const percent = Math.round((cat.spent / (cat.limit || 1)) * 100);
            const isOver = percent >= 100;
            const isWarning = percent >= 80 && percent < 100;
            const remaining = Math.max(0, cat.limit - cat.spent);

            return (
              <div
                key={cat.categoryId}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{cat.categoryName}</h4>
                      <span className="text-[10px] text-slate-400">Limit: ₹{cat.limit.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isOver && (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          100% Breached
                        </span>
                      )}
                      {isWarning && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          80% Alert
                        </span>
                      )}
                      {!isOver && !isWarning && (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                          On Track
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 my-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Spent: ₹{cat.spent.toLocaleString()}</span>
                      <span className={isOver ? 'text-rose-600 font-bold' : isWarning ? 'text-amber-700 font-bold' : 'text-slate-700'}>
                        {percent}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, percent)}%`,
                          backgroundColor: isOver ? '#e11d48' : isWarning ? '#d97706' : cat.color || '#0d9488'
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Remaining Cushion:</span>
                    <strong className={isOver ? 'text-rose-600' : 'text-slate-800'}>
                      {isOver ? `₹0 (Over by ₹${(cat.spent - cat.limit).toLocaleString()})` : `₹${remaining.toLocaleString()}`}
                    </strong>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setEditingCategory({ id: cat.categoryId, name: cat.categoryName, limit: cat.limit });
                      setNewLimitInput(cat.limit.toString());
                    }}
                    className="text-teal-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Adjust Limit</span>
                  </button>

                  <button
                    onClick={() => deleteCategory(cat.categoryId)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                    title="Remove category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Adjust Category Limit */}
      {editingCategory && (
        <Modal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          title={`Adjust Limit for ${editingCategory.name}`}
          subtitle="Set a spending ceiling to enforce budget discipline"
          maxWidth="sm"
        >
          <form onSubmit={handleUpdateLimitSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">New Monthly Limit (₹)</label>
              <input
                type="number"
                required
                value={newLimitInput}
                onChange={(e) => setNewLimitInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold outline-none focus:border-teal-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#0f172a] text-white py-2.5 rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
            >
              Update Category Limit
            </button>
          </form>
        </Modal>
      )}

      {/* Modal: Add Custom Category */}
      <Modal
        isOpen={addCustomCatModal}
        onClose={() => setAddCustomCatModal(false)}
        title="Add Custom Expense Category"
        subtitle="Create a personalized budget allocation bucket"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateCustomCategory} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Category Name</label>
            <input
              type="text"
              required
              value={customCatName}
              onChange={(e) => setCustomCatName(e.target.value)}
              placeholder="e.g. Pet Care, Co-working, Art Supplies"
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Allocated Monthly Limit (₹)</label>
            <input
              type="number"
              required
              value={customCatLimit}
              onChange={(e) => setCustomCatLimit(e.target.value)}
              placeholder="5000"
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Color Marker</label>
            <div className="flex gap-2">
              {['#0d9488', '#059669', '#1e3a8a', '#d97706', '#9333ea', '#e11d48'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCustomCatColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    customCatColor === c ? 'scale-110 border-slate-900 ring-2 ring-slate-300' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-teal-600 text-white py-2.5 rounded-xl font-bold hover:bg-teal-500 cursor-pointer"
          >
            Create Category
          </button>
        </form>
      </Modal>
    </div>
  );
};
