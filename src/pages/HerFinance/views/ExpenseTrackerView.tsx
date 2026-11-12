import React, { useState } from 'react';
import {
  Receipt,
  PlusCircle,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit2,
  Camera,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  CreditCard,
  Eye,
  FileText
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { Modal } from '../../../components/common/Modal';
import { useToast } from '../../../context/ToastContext';
import { processReceiptOcr, sampleReceiptTemplates, OcrExtractionResult } from '../../../services/receiptOcrService';
import { TransactionRecord, PaymentMethod, TransactionType } from '../../../types/finance';

export const ExpenseTrackerView: React.FC = () => {
  const {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    budget
  } = useHerFinance();

  const { showToast } = useToast();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Modal states
  const [addTxModalOpen, setAddTxModalOpen] = useState(false);
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionRecord | null>(null);

  // Receipt OCR Review Modal State
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrReviewData, setOcrReviewData] = useState<OcrExtractionResult | null>(null);
  const [ocrSelectedImage, setOcrSelectedImage] = useState<string | null>(null);

  // Add / Edit Transaction Form
  const [txForm, setTxForm] = useState({
    title: '',
    amount: '',
    type: 'expense' as TransactionType,
    category: 'Groceries & Staples',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI' as PaymentMethod,
    notes: '',
    isRecurring: false
  });

  // Calculate daily, weekly, monthly summaries
  const today = new Date().toISOString().split('T')[0];
  const expenseList = transactions.filter((t) => t.type === 'expense');

  const todayExpense = expenseList
    .filter((t) => t.date === today)
    .reduce((sum, t) => sum + t.amount, 0);

  const thisMonthExpense = expenseList.reduce((sum, t) => sum + t.amount, 0);

  // Filtered transactions
  const filteredList = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesPayment = paymentFilter === 'All' || t.paymentMethod === paymentFilter;

    return matchesSearch && matchesType && matchesCat && matchesPayment;
  });

  const handleOpenAddTx = (type: TransactionType = 'expense') => {
    setTxForm({
      title: '',
      amount: '',
      type,
      category: type === 'income' ? 'Consulting / Salary' : 'Groceries & Staples',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      notes: '',
      isRecurring: false
    });
    setEditingTx(null);
    setAddTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: TransactionRecord) => {
    setEditingTx(tx);
    setTxForm({
      title: tx.title,
      amount: tx.amount.toString(),
      type: tx.type,
      category: tx.category,
      date: tx.date,
      paymentMethod: tx.paymentMethod,
      notes: tx.notes || '',
      isRecurring: !!tx.isRecurring
    });
    setAddTxModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txForm.title || !txForm.amount) return;

    if (editingTx) {
      editTransaction(editingTx.id, {
        title: txForm.title,
        amount: Number(txForm.amount),
        type: txForm.type,
        category: txForm.category,
        date: txForm.date,
        paymentMethod: txForm.paymentMethod,
        notes: txForm.notes,
        isRecurring: txForm.isRecurring
      });
    } else {
      addTransaction({
        title: txForm.title,
        amount: Number(txForm.amount),
        type: txForm.type,
        category: txForm.category,
        date: txForm.date,
        paymentMethod: txForm.paymentMethod,
        notes: txForm.notes,
        isRecurring: txForm.isRecurring
      });
      showToast(
        txForm.type === 'income' ? 'Income Logged' : 'Expense Recorded',
        `₹${Number(txForm.amount).toLocaleString()} added to ledger`,
        'success'
      );
    }
    setAddTxModalOpen(false);
  };

  // OCR Processing Flow
  const handleProcessSampleReceipt = async (sampleUrl: string) => {
    setOcrSelectedImage(sampleUrl);
    setOcrProcessing(true);
    const result = await processReceiptOcr(sampleUrl);
    setOcrReviewData(result);
    setOcrProcessing(false);
  };

  const handleConfirmOcrRecord = () => {
    if (!ocrReviewData) return;
    addTransaction({
      title: ocrReviewData.merchant,
      amount: ocrReviewData.amount,
      type: 'expense',
      category: ocrReviewData.category,
      date: ocrReviewData.date,
      paymentMethod: ocrReviewData.detectedPaymentMethod,
      notes: 'Logged via Smart Receipt OCR verification',
      receiptUrl: ocrSelectedImage || undefined,
      receiptOcrData: {
        merchant: ocrReviewData.merchant,
        amount: ocrReviewData.amount,
        date: ocrReviewData.date,
        confidence: ocrReviewData.confidence
      }
    });

    setOcrReviewData(null);
    setOcrModalOpen(false);
    showToast('Receipt Verified & Recorded', `₹${ocrReviewData.amount.toLocaleString()} from ${ocrReviewData.merchant}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* 3 Summary Cards: Today, Month, Recurring */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Today's Outflow
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{todayExpense.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{new Date().toLocaleDateString()}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Month Total Outflow
          </span>
          <div className="text-2xl font-black text-rose-600 mt-1">₹{thisMonthExpense.toLocaleString()}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Across all logged categories</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Recurring Active Subscriptions
          </span>
          <div className="text-2xl font-black text-teal-700 mt-1">
            {transactions.filter((t) => t.isRecurring).length} Detected
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Rent, WiFi, SIPs & Services</span>
        </div>
      </div>

      {/* Main Header & Receipt OCR Launcher */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Expense Tracking & Receipt Verification</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log manual outlays or upload paper receipts with reviewable OCR extraction.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setOcrModalOpen(true)}
            className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-teal-200" />
            <span>Upload Receipt (OCR)</span>
          </button>

          <button
            onClick={() => handleOpenAddTx('expense')}
            className="flex items-center gap-1.5 bg-[#0f172a] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>Log Transaction</span>
          </button>
        </div>
      </div>

      {/* Search & Comprehensive Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search merchant, category, or notes..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <span>Showing {filteredList.length} Transactions</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                  typeFilter === t ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-xl outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {budget.categories.map((c) => (
              <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border rounded-xl outline-none cursor-pointer"
          >
            <option value="All">All Payment Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Transaction / Merchant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div>
                        {tx.title}
                        {tx.notes && <p className="text-[10px] text-slate-400 font-normal">{tx.notes}</p>}
                      </div>
                      {tx.isRecurring && (
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border">
                          Recurring
                        </span>
                      )}
                      {tx.receiptOcrData && (
                        <span className="text-[9px] font-bold bg-teal-50 text-teal-800 px-1.5 py-0.5 rounded border border-teal-200">
                          OCR Verified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">{tx.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                  <td className="py-3.5 px-4 text-right font-black">
                    <span className={tx.type === 'income' ? 'text-emerald-600 text-sm' : 'text-slate-900 text-sm'}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEditTx(tx)}
                        className="text-slate-400 hover:text-slate-800 p-1 cursor-pointer transition-colors"
                        title="Edit entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Transaction */}
      <Modal
        isOpen={addTxModalOpen}
        onClose={() => setAddTxModalOpen(false)}
        title={editingTx ? 'Edit Transaction' : 'Record New Transaction'}
        subtitle="Manage financial records in your verified ledger"
        maxWidth="md"
      >
        <form onSubmit={handleSaveTransaction} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Type</label>
              <select
                value={txForm.type}
                onChange={(e) => setTxForm({ ...txForm, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
              >
                <option value="expense">Expense (Outflow)</option>
                <option value="income">Income (Inflow)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Amount (₹)</label>
              <input
                type="number"
                required
                value={txForm.amount}
                onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
                placeholder="2500"
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-black text-sm outline-none focus:border-teal-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Title / Merchant</label>
            <input
              type="text"
              required
              value={txForm.title}
              onChange={(e) => setTxForm({ ...txForm, title: e.target.value })}
              placeholder="e.g. Reliance Fresh Groceries, Client Retainer"
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none focus:border-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
              <select
                value={txForm.category}
                onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
              >
                {budget.categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Payment Method</label>
              <select
                value={txForm.paymentMethod}
                onChange={(e) => setTxForm({ ...txForm, paymentMethod: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Date</label>
              <input
                type="date"
                required
                value={txForm.date}
                onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={txForm.isRecurring}
                  onChange={(e) => setTxForm({ ...txForm, isRecurring: e.target.checked })}
                  className="rounded text-teal-600 focus:ring-teal-600"
                />
                <span>Recurring Monthly</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Notes</label>
            <input
              type="text"
              value={txForm.notes}
              onChange={(e) => setTxForm({ ...txForm, notes: e.target.value })}
              placeholder="Invoice number or item details"
              className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#0f172a] text-white py-3 rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
          >
            {editingTx ? 'Update Record' : 'Save to Ledger'}
          </button>
        </form>
      </Modal>

      {/* Modal: Receipt OCR Upload & Review (Section 6 Requirement) */}
      <Modal
        isOpen={ocrModalOpen}
        onClose={() => {
          setOcrModalOpen(false);
          setOcrReviewData(null);
        }}
        title="Smart Receipt OCR Scanner"
        subtitle="Extract and review merchant, date, and amount before recording"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs">
          {!ocrReviewData ? (
            <div>
              <p className="text-slate-600 mb-3">
                Select a sample receipt below or simulate uploading a physical invoice photo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleReceiptTemplates.map((template, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleProcessSampleReceipt(template.imageUrl)}
                    className="p-3 border border-slate-200 rounded-2xl bg-slate-50 hover:border-teal-500 hover:bg-teal-50/40 cursor-pointer transition-all space-y-2 group"
                  >
                    <div className="h-28 rounded-xl overflow-hidden bg-slate-200">
                      <img src={template.imageUrl} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <strong className="block text-slate-900 text-xs font-bold leading-tight">{template.name}</strong>
                    <span className="text-[10px] text-teal-700 font-bold block">₹{template.data.amount} • {template.data.category}</span>
                  </div>
                ))}
              </div>

              {ocrProcessing && (
                <div className="p-6 text-center space-y-2">
                  <div className="w-8 h-8 rounded-full border-4 border-teal-600 border-t-transparent animate-spin mx-auto" />
                  <span className="font-bold text-slate-700 block">Extracting merchant, date, and tax line items...</span>
                </div>
              )}
            </div>
          ) : (
            /* Review & Confirm Extracted Information (Section 6 requirement: Do not assume receipt upload proves transaction. User reviews before saving!) */
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-between text-teal-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span className="font-bold">OCR Confidence Score: {ocrReviewData.confidence}%</span>
                </div>
                <span className="text-[11px] text-teal-700">Please review & confirm extracted values below</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Extracted Merchant</label>
                  <input
                    type="text"
                    value={ocrReviewData.merchant}
                    onChange={(e) => setOcrReviewData({ ...ocrReviewData, merchant: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Extracted Amount (₹)</label>
                  <input
                    type="number"
                    value={ocrReviewData.amount}
                    onChange={(e) => setOcrReviewData({ ...ocrReviewData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl font-black text-sm text-teal-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Receipt Date</label>
                  <input
                    type="date"
                    value={ocrReviewData.date}
                    onChange={(e) => setOcrReviewData({ ...ocrReviewData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Assigned Category</label>
                  <select
                    value={ocrReviewData.category}
                    onChange={(e) => setOcrReviewData({ ...ocrReviewData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl"
                  >
                    {budget.categories.map((c) => (
                      <option key={c.categoryId} value={c.categoryName}>{c.categoryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border font-mono text-[10px] text-slate-600 whitespace-pre-line max-h-24 overflow-y-auto">
                {ocrReviewData.rawTextPreview}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOcrReviewData(null)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Scan Another
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOcrRecord}
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl font-bold hover:bg-teal-500 cursor-pointer shadow-md"
                >
                  Confirm & Save to Ledger
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

