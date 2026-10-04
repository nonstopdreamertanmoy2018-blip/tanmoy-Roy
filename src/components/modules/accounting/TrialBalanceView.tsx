import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { generateTrialBalance } from '../../../utils/accountingEngine';
import { formatCurrency } from '../../../utils/formatters';
import { Scale, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';

export const TrialBalanceView: React.FC = () => {
  const { accounts, journalVouchers, settings, language, currentCompany } = useERP();

  const tb = generateTrialBalance(accounts, journalVouchers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'রেওয়ামিল বিবরণী (Trial Balance)' : 'Trial Balance Verification'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'সকল ডেবিট ও ক্রেডিট হিসাবের গাণিতিক নির্ভুলতা যাচাই (মোট ডেবিট = মোট ক্রেডিট)'
              : 'Verifies arithmetic accuracy of double-entry ledger by testing: Total Debits == Total Credits'}
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

      {/* Balance Verification Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
          tb.isBalanced
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {tb.isBalanced ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <div>
            <strong className="text-sm font-bold block">
              {tb.isBalanced ? 'Trial Balance is Mathematically Balanced' : 'Trial Balance Variance Detected'}
            </strong>
            <span className="text-[11px] opacity-80">
              {tb.isBalanced
                ? `Total Debit ${formatCurrency(tb.totalDebit, settings.currencySymbol)} equals Total Credit ${formatCurrency(tb.totalCredit, settings.currencySymbol)}. Variance = 0.00`
                : `Discrepancy of ${formatCurrency(tb.difference, settings.currencySymbol)} between Debits and Credits`}
            </span>
          </div>
        </div>

        <div className="font-mono text-right">
          <span className="text-[10px] block opacity-70">VARIANCE</span>
          <span className="text-base font-bold">
            {formatCurrency(tb.difference, settings.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Trial Balance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-center">
          <h2 className="text-base font-bold text-slate-900">{currentCompany.name}</h2>
          <p className="text-xs text-slate-500">Trial Balance as of {new Date().toLocaleDateString('en-GB')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider font-sans">
              <tr>
                <th className="py-3 px-4 w-28">Code</th>
                <th className="py-3 px-4">Account Title</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4 text-right w-44">Debit Balance (Dr.)</th>
                <th className="py-3 px-4 text-right w-44">Credit Balance (Cr.)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {tb.items.map((item) => (
                <tr key={item.accountCode} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-teal-800">
                    {item.accountCode}
                  </td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-900">
                    {item.accountName}
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-600">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]">
                      {item.accountType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-800 tabular-nums">
                    {item.debitBalance > 0 ? formatCurrency(item.debitBalance, settings.currencySymbol) : '-'}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-indigo-800 tabular-nums">
                    {item.creditBalance > 0 ? formatCurrency(item.creditBalance, settings.currencySymbol) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-mono font-bold text-sm">
              <tr>
                <td colSpan={3} className="py-3 px-4 text-right font-sans uppercase tracking-wider text-slate-900">
                  Total Trial Balance:
                </td>
                <td className="py-3 px-4 text-right text-emerald-800 border-b-4 border-double border-slate-400 tabular-nums">
                  {formatCurrency(tb.totalDebit, settings.currencySymbol)}
                </td>
                <td className="py-3 px-4 text-right text-indigo-800 border-b-4 border-double border-slate-400 tabular-nums">
                  {formatCurrency(tb.totalCredit, settings.currencySymbol)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
