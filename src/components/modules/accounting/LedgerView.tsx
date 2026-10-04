import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { generateLedger } from '../../../utils/accountingEngine';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { BookOpen, FileText } from 'lucide-react';

export const LedgerView: React.FC = () => {
  const { accounts, journalVouchers, settings, language } = useERP();
  const [selectedAccountCode, setSelectedAccountCode] = useState<string>(accounts[0]?.code || '1001');

  const selectedAccount = accounts.find((a) => a.code === selectedAccountCode) || accounts[0];
  const ledgerEntries = selectedAccount ? generateLedger(selectedAccount, journalVouchers) : [];

  const totalDebit = ledgerEntries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = ledgerEntries.reduce((sum, e) => sum + e.credit, 0);
  const closingBalance = ledgerEntries.length > 0 ? ledgerEntries[ledgerEntries.length - 1].balance : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'সাধারণ খতিয়ান বহি (General Ledger)' : 'General Ledger (Account Statement)'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'হিসাব ভিত্তিক বিস্তারিত লেনদেন, ডেবিট, ক্রেডিট এবং ক্রমযোজিত চলমান ব্যালেন্স'
              : 'Detailed transaction history, debit/credit flow, and running balance per individual account'}
          </p>
        </div>

        {/* Account Selector Dropdown */}
        <div className="flex items-center gap-2 self-start">
          <label className="text-xs font-semibold text-slate-700">Select Account:</label>
          <select
            value={selectedAccountCode}
            onChange={(e) => setSelectedAccountCode(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
          >
            {accounts.map((acc) => (
              <option key={acc.code} value={acc.code}>
                {acc.code} - {acc.name} ({acc.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Account Profile Header Card */}
      {selectedAccount && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
              {selectedAccount.code.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-teal-800 font-bold text-sm">{selectedAccount.code}</span>
                <span className="text-slate-400">·</span>
                <span className="text-base font-bold text-slate-900">{selectedAccount.name}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Type: <strong className="text-slate-700">{selectedAccount.type}</strong> · Normal Balance:{' '}
                <strong className="text-slate-700">{selectedAccount.normalBalance}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL DEBITS</span>
              <span className="font-bold text-emerald-800 tabular-nums">
                {formatCurrency(totalDebit, settings.currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TOTAL CREDITS</span>
              <span className="font-bold text-indigo-800 tabular-nums">
                {formatCurrency(totalCredit, settings.currencySymbol)}
              </span>
            </div>
            <div className="pl-4 border-l border-slate-200">
              <span className="text-slate-400 block text-[10px]">CLOSING BALANCE</span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatCurrency(closingBalance, settings.currencySymbol)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider font-sans">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Narration / Particulars</th>
                <th className="py-3 px-4 text-right">Debit (Dr.)</th>
                <th className="py-3 px-4 text-right">Credit (Cr.)</th>
                <th className="py-3 px-4 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {ledgerEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                    No transactions recorded for this ledger account yet.
                  </td>
                </tr>
              ) : (
                ledgerEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-600 font-sans">
                      {formatDate(entry.date)}
                    </td>
                    <td className="py-3 px-4 font-bold text-teal-800">
                      {entry.voucherNumber}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {entry.referenceType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-800 font-medium">
                      {entry.narration}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-800 tabular-nums">
                      {entry.debit > 0 ? formatCurrency(entry.debit, settings.currencySymbol) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-indigo-800 tabular-nums">
                      {entry.credit > 0 ? formatCurrency(entry.credit, settings.currencySymbol) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                      {formatCurrency(entry.balance, settings.currencySymbol)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
