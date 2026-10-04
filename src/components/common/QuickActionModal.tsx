import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  TrendingUp,
  Wheat,
  Receipt,
  ShoppingCart,
  FileSpreadsheet,
  X,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const {
    setActiveTab,
    language,
    settings,
    executeQuickDoubleEntry,
  } = useERP();

  const [activeTabMode, setActiveTabMode] = useState<'prompt-quick' | 'modules'>('prompt-quick');
  const [saleAmount, setSaleAmount] = useState<string>('25000');
  const [saleChannel, setSaleChannel] = useState<'Cash' | 'Bank'>('Cash');
  const [feedAmount, setFeedAmount] = useState<string>('15000');
  const [feedChannel, setFeedChannel] = useState<'Cash' | 'Payable'>('Cash');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 2800);
  };

  const handleExecuteSale = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(saleAmount) || 0;
    if (val <= 0) return;
    executeQuickDoubleEntry('fish_sales', val, saleChannel);
    showSuccess(
      `✓ Posted: Dr. ${saleChannel} ${formatCurrency(val, settings.currencySymbol)} / Cr. Fish Sales Revenue ${formatCurrency(val, settings.currencySymbol)}`
    );
  };

  const handleExecuteFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(feedAmount) || 0;
    if (val <= 0) return;
    executeQuickDoubleEntry('feed_expense', val, feedChannel);
    showSuccess(
      `✓ Posted: Dr. Feed Expense ${formatCurrency(val, settings.currencySymbol)} / Cr. ${feedChannel} ${formatCurrency(val, settings.currencySymbol)}`
    );
  };

  const actions = [
    {
      id: 'sales',
      title: language === 'bn' ? 'মাছ বিক্রয় ইনভয়েস' : 'Record Fish Sale',
      desc: 'Dr. Cash/Bank (1000/1100) — Cr. Fish Sales Revenue (4000)',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'feed',
      title: language === 'bn' ? 'পুকুরে খাবার প্রয়োগ' : 'Daily Pond Feeding',
      desc: 'Dr. Feed Expense (5000) — Cr. Feed Inventory (1300)',
      icon: Wheat,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'expenses',
      title: language === 'bn' ? 'খামার পরিচালন খরচ' : 'Farm Operating Expense',
      desc: 'Dr. Electricity / Labor (5100/5200) — Cr. Cash / Payable (1000/2000)',
      icon: Receipt,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'purchases',
      title: language === 'bn' ? 'খাবার ও পোনা ক্রয়' : 'Inward Stock Purchase',
      desc: 'Dr. Feed / Fish Inventory (1300/1200) — Cr. Cash / Payable (1000/2000)',
      icon: ShoppingCart,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'journal',
      title: language === 'bn' ? 'সাধারণ জাবেদা ভাউচার' : 'Manual Journal Entry',
      desc: 'Custom multi-line balanced Dr/Cr general journal voucher',
      icon: FileSpreadsheet,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  const handleSelectModule = (tab: string) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-600" />
              {language === 'bn' ? 'দ্রুত লেনদেন এন্ট্রি' : 'Quick Accounting & Double-Entry'}
            </h2>
            <p className="text-slate-500 text-[11px]">
              Execute immediate double-entry vouchers or jump to operational modules
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs my-3 shrink-0">
          <button
            onClick={() => setActiveTabMode('prompt-quick')}
            className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
              activeTabMode === 'prompt-quick'
                ? 'bg-white text-teal-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1-Click Double Entry (Dr / Cr)
          </button>
          <button
            onClick={() => setActiveTabMode('modules')}
            className={`flex-1 py-1.5 font-medium rounded-md transition-colors ${
              activeTabMode === 'modules'
                ? 'bg-white text-teal-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Module Invoices & Logs
          </button>
        </div>

        {/* Toast confirmation */}
        {successToast && (
          <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2 font-mono shrink-0 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">{successToast}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 space-y-4 flex-1">
          {activeTabMode === 'prompt-quick' ? (
            <div className="space-y-4">
              {/* Box 1: Dr. Cash / Bank, Cr. Fish Sales Revenue */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      Dr. Cash / Bank — Cr. Fish Sales Revenue
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                    REVENUE
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-100 text-[11px] font-mono space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-emerald-800 font-semibold">
                      Dr. {saleChannel === 'Cash' ? 'Cash (1000)' : 'Bank (1100)'}
                    </span>
                    <span className="font-bold">{formatCurrency(Number(saleAmount) || 0, settings.currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span className="text-indigo-800 font-semibold">
                      Cr. Fish Sales Revenue (4000)
                    </span>
                    <span className="font-bold">{formatCurrency(Number(saleAmount) || 0, settings.currencySymbol)}</span>
                  </div>
                </div>

                <form onSubmit={handleExecuteSale} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                        Debit Channel
                      </label>
                      <select
                        value={saleChannel}
                        onChange={(e) => setSaleChannel(e.target.value as 'Cash' | 'Bank')}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-teal-600 font-mono"
                      >
                        <option value="Cash">Cash / নগদ (1000)</option>
                        <option value="Bank">Bank / ব্যাংক (1100)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                        Amount (৳)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={saleAmount}
                        onChange={(e) => setSaleAmount(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-teal-600 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {['10000', '25000', '50000', '100000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setSaleAmount(amt)}
                          className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 rounded text-[10px] font-mono"
                        >
                          +{parseInt(amt) / 1000}k
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Post Fish Sale</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Box 2: Dr. Feed Expense, Cr. Cash / Payable */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      Dr. Feed Expense — Cr. Cash / Payable
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                    EXPENSE
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-amber-100 text-[11px] font-mono space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-amber-800 font-semibold">
                      Dr. Feed Expense (5000)
                    </span>
                    <span className="font-bold">{formatCurrency(Number(feedAmount) || 0, settings.currencySymbol)}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span className="text-slate-800 font-semibold">
                      Cr. {feedChannel === 'Cash' ? 'Cash (1000)' : 'Accounts Payable (2000)'}
                    </span>
                    <span className="font-bold">{formatCurrency(Number(feedAmount) || 0, settings.currencySymbol)}</span>
                  </div>
                </div>

                <form onSubmit={handleExecuteFeed} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                        Credit Channel
                      </label>
                      <select
                        value={feedChannel}
                        onChange={(e) => setFeedChannel(e.target.value as 'Cash' | 'Payable')}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-teal-600 font-mono"
                      >
                        <option value="Cash">Cash / নগদ (1000)</option>
                        <option value="Payable">Accounts Payable / দেনা (2000)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                        Amount (৳)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={feedAmount}
                        onChange={(e) => setFeedAmount(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-teal-600 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1">
                      {['5000', '15000', '30000', '60000'].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFeedAmount(amt)}
                          className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 hover:border-amber-500 rounded text-[10px] font-mono"
                        >
                          +{parseInt(amt) / 1000}k
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Post Feed Expense</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {actions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.id}
                    onClick={() => handleSelectModule(act.id)}
                    className="w-full p-3 rounded-lg border border-slate-200 hover:border-teal-500 hover:bg-slate-50 flex items-start gap-3 transition-colors text-left group"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${act.color}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-900 text-xs">
                        {act.title}
                      </h3>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">{act.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>All vouchers automatically update Journal, Ledger & Balance Sheet</span>
          <button
            onClick={() => handleSelectModule('journal')}
            className="text-teal-700 font-semibold hover:underline"
          >
            View Journal →
          </button>
        </div>
      </div>
    </div>
  );
};
