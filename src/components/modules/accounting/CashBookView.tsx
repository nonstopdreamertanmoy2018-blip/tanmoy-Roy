import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { generateLedger } from '../../../utils/accountingEngine';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Coins, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const CashBookView: React.FC = () => {
  const { accounts, journalVouchers, settings, language } = useERP();

  const cashAccount = accounts.find((a) => a.code === '1000' || a.code === '1001') || accounts[0];
  const entries = cashAccount ? generateLedger(cashAccount, journalVouchers) : [];

  const totalReceipts = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalDisbursements = entries.reduce((sum, e) => sum + e.credit, 0);
  const closingCash = totalReceipts - totalDisbursements;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'নগদান বহি রেজিস্টার (Cash Book)' : 'Cash Book (Vault & Petty Cash)'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'খামারে নগদ অর্থ প্রাপ্তি ও প্রদানের পুঙ্খানুপুঙ্খ বিবরণী'
              : 'Physical cash inflows (sales receipts), farm disbursements, and closing vault balance'}
          </p>
        </div>

        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-mono font-bold">
          Vault Balance: {formatCurrency(closingCash, settings.currencySymbol)}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Cash Receipts (Inflow)</span>
            <p className="text-xl font-bold text-emerald-800 font-mono mt-1">
              {formatCurrency(totalReceipts, settings.currencySymbol)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Cash Disbursements (Outflow)</span>
            <p className="text-xl font-bold text-rose-800 font-mono mt-1">
              {formatCurrency(totalDisbursements, settings.currencySymbol)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Net Cash in Vault</span>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">
              {formatCurrency(closingCash, settings.currencySymbol)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
            <Coins className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Cash Book Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider font-sans">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Description / Particulars</th>
                <th className="py-3 px-4 text-right">Cash Received (Dr.)</th>
                <th className="py-3 px-4 text-right">Cash Paid (Cr.)</th>
                <th className="py-3 px-4 text-right">Cash Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-slate-600 font-sans">
                    {formatDate(entry.date)}
                  </td>
                  <td className="py-3 px-4 font-bold text-teal-800">
                    {entry.voucherNumber}
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">
                    {entry.narration}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-800 tabular-nums">
                    {entry.debit > 0 ? formatCurrency(entry.debit, settings.currencySymbol) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-800 tabular-nums">
                    {entry.credit > 0 ? formatCurrency(entry.credit, settings.currencySymbol) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatCurrency(entry.balance, settings.currencySymbol)}
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
