import React, { useState, useRef } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Download, Upload, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const DatabaseBackup: React.FC = () => {
  const {
    exportDatabaseJson,
    importDatabaseJson,
    loadDemoData,
    resetToFreshSystem,
    language,
    ponds,
    journalVouchers,
    fishStocks,
    feedItems,
  } = useERP();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleExport = () => {
    try {
      const json = exportDatabaseJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pond_erp_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusMessage({
        text: language === 'bn' ? 'ডাটাবেস সফলভাবে এক্সপোর্ট হয়েছে!' : 'Database exported successfully!',
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch {
      setStatusMessage({
        text: 'Error exporting database backup',
        type: 'error',
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJson(content);
      if (success) {
        setStatusMessage({
          text: language === 'bn' ? 'ডাটাবেস সফলভাবে রিস্টোর হয়েছে!' : 'Database restored successfully!',
          type: 'success',
        });
      } else {
        setStatusMessage({
          text: 'Invalid JSON backup format. Import rejected.',
          type: 'error',
        });
      }
      setTimeout(() => setStatusMessage(null), 4000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    resetToFreshSystem();
    setShowConfirmReset(false);
    setStatusMessage({
      text: language === 'bn' ? 'সিস্টেম ফ্রেশ করা হয়েছে • প্রারম্ভিক ব্যালেন্স = ০' : 'Fresh system initialized • Opening Balance = 0',
      type: 'success',
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {language === 'bn' ? 'ডাটাবেস ব্যাকআপ ও রিসেট ব্যবস্থাপনা' : 'Database Backup & System Reset'}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'সম্পূর্ণ তথ্য জেএসন ফরম্যাটে ডাউনলোড, পুনরুদ্ধার ও শূন্য ব্যালেন্সের ফ্রেশ সিস্টেমে রূপান্তর'
            : 'JSON snapshots, migration restore, fresh-system zero opening balance reset, and demo datasets'}
        </p>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Snapshot Metrics */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs shadow-xs">
        <h2 className="font-bold text-slate-800 mb-2">Current Database Snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-600 font-mono">
          <div className="p-2 bg-slate-50 rounded">Ponds: <strong className="text-slate-900">{ponds.length}</strong></div>
          <div className="p-2 bg-slate-50 rounded">Fish Batches: <strong className="text-slate-900">{fishStocks.length}</strong></div>
          <div className="p-2 bg-slate-50 rounded">Feed Stock: <strong className="text-slate-900">{feedItems.length}</strong> items</div>
          <div className="p-2 bg-slate-50 rounded">Journal Entries: <strong className="text-slate-900">{journalVouchers.length}</strong></div>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export JSON */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'ডাটাবেস এক্সপোর্ট (JSON Download)' : 'Export Database (JSON)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Download the entire ERP database including chart of accounts, ponds, live fish batches, vouchers, and audit logs.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            {language === 'bn' ? 'ব্যাকআপ ডাউনলোড করুন' : 'Download Backup File'}
          </button>
        </div>

        {/* Import JSON */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'ডাটাবেস রিস্টোর (JSON Upload)' : 'Restore Database (JSON)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload a previously exported JSON backup file to seamlessly restore complete farm operations and financial ledgers.
            </p>
          </div>
          <div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-md transition-colors"
            >
              <Upload className="w-4 h-4" />
              {language === 'bn' ? 'ফাইল নির্বাচন ও রিস্টোর' : 'Select Backup File & Restore'}
            </button>
          </div>
        </div>

        {/* Load Demo Data */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'bn' ? 'ডেমো ডাটা লোড করুন' : 'Load Demo Aquaculture Dataset'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Populate the system with a complete demonstration model: 4 ponds, Rohu/Catla/Tilapia batches, feed bags, and balanced journal vouchers.
            </p>
          </div>
          <button
            onClick={loadDemoData}
            className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            {language === 'bn' ? 'ডেমো ডাটা লোড করুন' : 'Load Demo Dataset'}
          </button>
        </div>

        {/* Fresh System / 0 Opening Balance */}
        <div className="bg-white p-5 rounded-xl border border-rose-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-rose-900">
              {language === 'bn' ? 'ফ্রেশ সিস্টেম রিসেট (Opening Balance = 0)' : 'Reset System (Opening Balance = 0)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Wipes all operational transactions, stock, and vouchers to start with a blank clean slate with zero opening balances.
            </p>
          </div>
          <button
            onClick={() => setShowConfirmReset(true)}
            className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {language === 'bn' ? 'শূন্য ব্যালেন্সে রিসেট' : 'Initialize Fresh System (0 Balance)'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-rose-200 text-xs space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">Confirm Fresh System Reset</h3>
              <p className="text-slate-500 mt-1">
                Are you sure you want to reset all data to a fresh system with 0 opening balance? You can reload the demo data at any time.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2 bg-rose-600 text-white rounded-md font-semibold hover:bg-rose-700"
              >
                Yes, Reset to 0
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
