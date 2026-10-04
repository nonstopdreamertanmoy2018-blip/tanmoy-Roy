import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { generateBalanceSheet } from '../../../utils/accountingEngine';
import { formatCurrency } from '../../../utils/formatters';
import { Scale, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

export const BalanceSheetView: React.FC = () => {
  const { accounts, journalVouchers, settings, language, currentCompany } = useERP();

  const bs = generateBalanceSheet(accounts, journalVouchers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'উদ্বৃত্তপত্র বিবরণী (Balance Sheet)' : 'Balance Sheet (Statement of Financial Position)'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'মৌলিক হিসাব সমীকরণ: সম্পদ = দায় + মালিকানাস্বত্ব (Assets = Liabilities + Equity)'
              : 'Verifies the primary accounting equation: Total Assets == Total Liabilities + Owner Equity'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Statement
        </button>
      </div>

      {/* Accounting Equation Verification Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
          bs.isBalanced
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {bs.isBalanced ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div>
            <strong className="text-sm font-bold block">
              {bs.isBalanced ? 'Accounting Equation is Fully Balanced' : 'Accounting Equation Imbalance'}
            </strong>
            <span className="text-[11px] opacity-80">
              Assets ({formatCurrency(bs.totalAssets, settings.currencySymbol)}) = Liabilities ({formatCurrency(bs.totalLiabilities, settings.currencySymbol)}) + Equity ({formatCurrency(bs.totalEquity, settings.currencySymbol)})
            </span>
          </div>
        </div>

        <div className="font-mono text-right">
          <span className="text-[10px] block opacity-70">EQUATION STATUS</span>
          <span className="text-xs font-bold uppercase tracking-wider">
            {bs.isBalanced ? 'Balanced (Δ = 0.00)' : 'Unbalanced'}
          </span>
        </div>
      </div>

      {/* Balance Sheet Statement */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-center">
          <h2 className="text-base font-bold text-slate-900">{currentCompany.name}</h2>
          <p className="text-xs text-slate-500">
            Statement of Financial Position as of {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-mono">
          {/* LEFT COLUMN: ASSETS */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 font-sans pb-2 border-b-2 border-slate-900 uppercase tracking-wider">
              ASSETS
            </h3>

            {/* Current Assets */}
            <div>
              <h4 className="font-sans font-bold text-slate-800 mb-2">1. Current Assets</h4>
              <div className="divide-y divide-slate-100 pl-2">
                {bs.currentAssets.map((item) => (
                  <div key={item.code} className="py-1.5 flex justify-between text-slate-700">
                    <span className="font-sans">{item.code} - {item.name}</span>
                    <span className="tabular-nums">{formatCurrency(item.amount, settings.currencySymbol)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                <span className="font-sans">Total Current Assets:</span>
                <span className="tabular-nums">{formatCurrency(bs.totalCurrentAssets, settings.currencySymbol)}</span>
              </div>
            </div>

            {/* Non-Current Assets */}
            <div>
              <h4 className="font-sans font-bold text-slate-800 mb-2">2. Non-Current / Fixed Assets</h4>
              <div className="divide-y divide-slate-100 pl-2">
                {bs.nonCurrentAssets.map((item) => (
                  <div key={item.code} className="py-1.5 flex justify-between text-slate-700">
                    <span className="font-sans">{item.code} - {item.name}</span>
                    <span className="tabular-nums">{formatCurrency(item.amount, settings.currencySymbol)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                <span className="font-sans">Total Non-Current Assets:</span>
                <span className="tabular-nums">{formatCurrency(bs.totalNonCurrentAssets, settings.currencySymbol)}</span>
              </div>
            </div>

            {/* TOTAL ASSETS FOOTER */}
            <div className="p-3 bg-slate-50 border-t-2 border-b-4 border-double border-slate-300 flex justify-between font-bold text-slate-900 text-sm">
              <span className="font-sans uppercase">TOTAL ASSETS:</span>
              <span className="text-teal-900 tabular-nums">
                {formatCurrency(bs.totalAssets, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: LIABILITIES & EQUITY */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-900 font-sans pb-2 border-b-2 border-slate-900 uppercase tracking-wider">
              LIABILITIES & OWNER'S EQUITY
            </h3>

            {/* Current Liabilities */}
            <div>
              <h4 className="font-sans font-bold text-slate-800 mb-2">1. Current Liabilities</h4>
              <div className="divide-y divide-slate-100 pl-2">
                {bs.currentLiabilities.length === 0 ? (
                  <div className="py-1 text-slate-400 font-sans">No current payables outstanding.</div>
                ) : (
                  bs.currentLiabilities.map((item) => (
                    <div key={item.code} className="py-1.5 flex justify-between text-slate-700">
                      <span className="font-sans">{item.code} - {item.name}</span>
                      <span className="tabular-nums">{formatCurrency(item.amount, settings.currencySymbol)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                <span className="font-sans">Total Current Liabilities:</span>
                <span className="tabular-nums">{formatCurrency(bs.totalCurrentLiabilities, settings.currencySymbol)}</span>
              </div>
            </div>

            {/* Non-Current Liabilities */}
            <div>
              <h4 className="font-sans font-bold text-slate-800 mb-2">2. Long-Term Liabilities</h4>
              <div className="divide-y divide-slate-100 pl-2">
                {bs.nonCurrentLiabilities.length === 0 ? (
                  <div className="py-1 text-slate-400 font-sans">No long-term bank financing.</div>
                ) : (
                  bs.nonCurrentLiabilities.map((item) => (
                    <div key={item.code} className="py-1.5 flex justify-between text-slate-700">
                      <span className="font-sans">{item.code} - {item.name}</span>
                      <span className="tabular-nums">{formatCurrency(item.amount, settings.currencySymbol)}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                <span className="font-sans">Total Liabilities:</span>
                <span className="tabular-nums">{formatCurrency(bs.totalLiabilities, settings.currencySymbol)}</span>
              </div>
            </div>

            {/* Owner Equity */}
            <div>
              <h4 className="font-sans font-bold text-slate-800 mb-2">3. Owner's Equity & Retained Earnings</h4>
              <div className="divide-y divide-slate-100 pl-2">
                {bs.equityItems.map((item) => (
                  <div key={item.code} className="py-1.5 flex justify-between text-slate-700">
                    <span className="font-sans">{item.code} - {item.name}</span>
                    <span className="tabular-nums">{formatCurrency(item.amount, settings.currencySymbol)}</span>
                  </div>
                ))}
                <div className="py-1.5 flex justify-between text-emerald-800 font-semibold">
                  <span className="font-sans">Retained Earnings (Net Profit from P&L)</span>
                  <span className="tabular-nums">{formatCurrency(bs.retainedEarnings, settings.currencySymbol)}</span>
                </div>
              </div>
              <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-800">
                <span className="font-sans">Total Equity:</span>
                <span className="tabular-nums">{formatCurrency(bs.totalEquity, settings.currencySymbol)}</span>
              </div>
            </div>

            {/* TOTAL LIABILITIES & EQUITY FOOTER */}
            <div className="p-3 bg-slate-50 border-t-2 border-b-4 border-double border-slate-300 flex justify-between font-bold text-slate-900 text-sm">
              <span className="font-sans uppercase">TOTAL LIABILITIES & EQUITY:</span>
              <span className="text-teal-900 tabular-nums">
                {formatCurrency(bs.totalLiabilitiesAndEquity, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
