import React, { useState } from 'react';
import {
  History,
  Download,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  FileSpreadsheet,
  FileText,
  Trash2
} from 'lucide-react';
import { useHerFinance } from '../../../context/HerFinanceContext';
import { useToast } from '../../../context/ToastContext';

export const TransactionHistoryView: React.FC = () => {
  const { filteredTransactions, deleteTransaction, dateFilter } = useHerFinance();
  const { showToast } = useToast();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Title', 'Category', 'Amount', 'PaymentMethod', 'Notes'];
    const rows = filteredTransactions.map((t) => [
      t.id,
      t.date,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount,
      t.paymentMethod,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `herfinance_transactions_${dateFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV Exported', 'Financial records downloaded in CSV format', 'success');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredTransactions, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `herfinance_transactions_${dateFilter}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('JSON Exported', 'Ledger exported in structured JSON format', 'success');
  };

  // Sorting
  const sortedList = [...filteredTransactions]
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'date') {
        const d1 = new Date(a.date).getTime();
        const d2 = new Date(b.date).getTime();
        return sortDirection === 'desc' ? d2 - d1 : d1 - d2;
      } else {
        return sortDirection === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
    });

  const totalInflow = sortedList.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOutflow = sortedList.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Transaction History & Master Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full audit log of verified income receipts and expense disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Quick Inflow vs Outflow Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 block font-semibold">Filtered Inflow</span>
          <strong className="text-lg text-emerald-600">+₹{totalInflow.toLocaleString()}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 block font-semibold">Filtered Outflow</span>
          <strong className="text-lg text-rose-600">-₹{totalOutflow.toLocaleString()}</strong>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-400 block font-semibold">Net Filtered Cashflow</span>
          <strong className={`text-lg ${totalInflow - totalOutflow >= 0 ? 'text-teal-700' : 'text-rose-600'}`}>
            ₹{(totalInflow - totalOutflow).toLocaleString()}
          </strong>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ledger entries..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border rounded-xl text-xs outline-none focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Sort:</span>
            <button
              onClick={() => {
                if (sortField === 'date') {
                  setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortField('date');
                  setSortDirection('desc');
                }
              }}
              className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold cursor-pointer"
            >
              <span>Date</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                if (sortField === 'amount') {
                  setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
                } else {
                  setSortField('amount');
                  setSortDirection('desc');
                }
              }}
              className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold cursor-pointer"
            >
              <span>Amount</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedList.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{tx.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div>
                      {tx.title}
                      {tx.notes && <p className="text-[10px] text-slate-400 font-normal">{tx.notes}</p>}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{tx.paymentMethod}</td>
                  <td className="py-3 px-4 text-right font-black">
                    <span className={tx.type === 'income' ? 'text-emerald-600 text-sm' : 'text-slate-900 text-sm'}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
