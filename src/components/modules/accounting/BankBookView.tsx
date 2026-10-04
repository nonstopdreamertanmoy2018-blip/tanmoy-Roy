import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { generateLedger } from '../../../utils/accountingEngine';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Landmark, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const BankBookView: React.FC = () => {
  const { accounts, journalVouchers, settings, language } = useERP();

  const bankAccounts = accounts.filter((a) => a.code === '1100' || a.code === '1002' || a.code === '1003');
  const [activeBankCode, setActiveBankCode] = useState(bankAccounts[0]?.code || '1100');

  const selectedBank = accounts.find((a) => a.code === activeBankCode) || bankAccounts[0];
  const entries = selectedBank ? generateLedger(selectedBank, journalVouchers) : [];

  const totalDeposits = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalWithdrawals = entries.reduce((sum, e) => sum + e.credit, 0);
  const closingBankBalance = totalDeposits - totalWithdrawals;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'ব্যাংক হিসাব বহি (Bank Book)' : 'Bank Book & Reconciliation'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'ব্যাংক জমা, অনলাইন স্থানান্তর ও চেক প্রদানের হিসাব'
              : 'Electronic deposits, vendor cheque disbursements, and reconcilable bank balances'}
          </p>
        </div>

        {/* Bank Account Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
          {bankAccounts.map((b) => (
            <button
              key={b.code}
              onClick={() => setActiveBankCode(b.code)}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeBankCode === b.code
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Total Bank Deposits</span>
            <p className="text-xl font-bold text-emerald-800 font-mono mt-1">
              {formatCurrency(totalDeposits, settings.currencySymbol)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Cheques / Withdrawals</span>
            <p className="text-xl font-bold text-rose-800 font-mono mt-1">
              {formatCurrency(totalWithdrawals, settings.currencySymbol)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 uppercase font-semibold">Available Bank Balance</span>
            <p className="text-xl font-bold text-slate-900 font-mono mt-1">
              {formatCurrency(closingBankBalance, settings.currencySymbol)}
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bank Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider font-sans">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Particulars / Cheque Ref</th>
                <th className="py-3 px-4 text-right">Deposited (Dr.)</th>
                <th className="py-3 px-4 text-right">Withdrawn (Cr.)</th>
                <th className="py-3 px-4 text-right">Bank Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                    No transactions recorded for this bank account yet.
                  </td>
                </tr>
              ) : (
                entries.map((entry, idx) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
