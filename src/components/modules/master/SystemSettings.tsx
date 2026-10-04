import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Save, Check } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const { settings, updateSettings, language, setLanguage } = useERP();

  const [companyName, setCompanyName] = useState(settings.companyName);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [fiscalYearStart, setFiscalYearStart] = useState(settings.fiscalYearStart);
  const [taxVatRate, setTaxVatRate] = useState(String(settings.taxVatRate));
  const [valuationMethod, setValuationMethod] = useState(settings.inventoryValuationMethod);
  const [autoPostVouchers, setAutoPostVouchers] = useState(settings.autoPostAccountingVouchers);
  const [enableAudit, setEnableAudit] = useState(settings.enableAuditLogging);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      companyName,
      currencySymbol,
      fiscalYearStart,
      taxVatRate: Number(taxVatRate) || 0,
      inventoryValuationMethod: valuationMethod,
      autoPostAccountingVouchers: autoPostVouchers,
      enableAuditLogging: enableAudit,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {language === 'bn' ? 'সিস্টেম সেটিংস ও কনফিগারেশন' : 'System Settings & General Preferences'}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'মুদ্রার প্রতীক (৳), আর্থিক বছর, স্বয়ংক্রিয় ডাবল এন্ট্রি জাবেদা ও ভাষা নির্ধারণ'
            : 'Configure currency, valuation methods, automated GL postings, and audit rules'}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5 text-xs">
        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Preferences saved successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Company / Farm Header</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Currency Symbol</label>
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white font-mono"
            >
              <option value="৳">৳ (Bangladeshi Taka - BDT)</option>
              <option value="$">$ (US Dollar - USD)</option>
              <option value="₹">₹ (Indian Rupee - INR)</option>
              <option value="€">€ (Euro - EUR)</option>
              <option value="£">£ (British Pound - GBP)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Fiscal Year Start Date</label>
            <input
              type="date"
              value={fiscalYearStart}
              onChange={(e) => setFiscalYearStart(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tax / VAT Standard Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={taxVatRate}
              onChange={(e) => setTaxVatRate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Primary Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'bn')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
            >
              <option value="en">English (US / International)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Biological Inventory Valuation</label>
            <select
              value={valuationMethod}
              onChange={(e) => setValuationMethod(e.target.value as 'FIFO' | 'Weighted Average')}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
            >
              <option value="Weighted Average">Weighted Average Cost (Aquaculture Standard)</option>
              <option value="FIFO">First-In First-Out (FIFO)</option>
            </select>
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoPostVouchers}
              onChange={(e) => setAutoPostVouchers(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <div>
              <span className="font-semibold text-slate-800 block">
                Automatic Double-Entry Journal Posting
              </span>
              <span className="text-slate-500 text-[11px]">
                When enabled, every sale, feed consumption, and operating expense automatically creates a balanced Dr/Cr voucher.
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enableAudit}
              onChange={(e) => setEnableAudit(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <div>
              <span className="font-semibold text-slate-800 block">
                Enable Audit Log Trail
              </span>
              <span className="text-slate-500 text-[11px]">
                Records timestamp, user handle, and action summary across all operational modules.
              </span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-md shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
