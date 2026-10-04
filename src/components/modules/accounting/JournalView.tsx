import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { JournalLine } from '../../../types/erp';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Plus, FileSpreadsheet, Search, CheckCircle2, AlertCircle } from 'lucide-react';

export const JournalView: React.FC = () => {
  const { journalVouchers, accounts, addJournalVoucher, settings, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for custom manual journal voucher
  const [description, setDescription] = useState('');
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceType, setReferenceType] = useState<'Manual' | 'Capital' | 'Sales' | 'Purchase'>('Manual');

  const [lines, setLines] = useState<JournalLine[]>([
    { accountCode: accounts[0]?.code || '1001', accountName: accounts[0]?.name || 'Cash in Hand', debit: 10000, credit: 0, narration: '' },
    { accountCode: accounts[10]?.code || '3001', accountName: accounts[10]?.name || "Owner's Capital", debit: 0, credit: 10000, narration: '' },
  ]);

  const totalDebit = lines.reduce((sum, l) => sum + Number(l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + Number(l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

  const filteredVouchers = journalVouchers.filter((v) => {
    return (
      v.voucherNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.lines.some((l) => l.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddLine = () => {
    setLines([
      ...lines,
      { accountCode: accounts[0].code, accountName: accounts[0].name, debit: 0, credit: 0, narration: '' },
    ]);
  };

  const handleRemoveLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(lines.filter((_, idx) => idx !== index));
  };

  const handleLineChange = (index: number, field: keyof JournalLine, value: unknown) => {
    const updated = [...lines];
    if (field === 'accountCode') {
      const codeStr = String(value);
      const acc = accounts.find((a) => a.code === codeStr);
      updated[index] = {
        ...updated[index],
        accountCode: codeStr,
        accountName: acc?.name || updated[index].accountName,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setLines(updated);
  };

  const handlePostVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced || !description) return;

    addJournalVoucher({
      date: voucherDate,
      referenceType,
      description,
      lines,
      totalDebit,
      totalCredit,
    });

    setShowAddModal(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'সাধারণ জাবেদা বহি (General Journal)' : 'General Journal (Double-Entry Vouchers)'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'প্রতিটি আর্থিক লেনদেনের ডেবিট ও ক্রেডিট বিবরণী এবং ভাউচার রেজিস্টার'
              : 'Chronological chronological register of balanced double-entry vouchers (Total Dr = Total Cr)'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voucher # or text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-teal-600 w-52"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'bn' ? 'ম্যানুয়াল জাবেদা ভাউচার' : 'Post Manual Journal Entry'}
          </button>
        </div>
      </div>

      {/* Journal Vouchers List */}
      <div className="space-y-4">
        {filteredVouchers.map((voucher) => (
          <div
            key={voucher.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs text-xs"
          >
            {/* Voucher Header */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-teal-800 text-sm">
                  {voucher.voucherNumber}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600 font-sans">{formatDate(voucher.date)}</span>
                <span className="text-slate-400">·</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-slate-200 text-slate-700 uppercase">
                  {voucher.referenceType}
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-sans text-slate-800 font-medium truncate max-w-md">
                  {voucher.description}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-500 font-sans text-[11px]">By {voucher.createdBy}</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  Total: {formatCurrency(voucher.totalDebit, settings.currencySymbol)}
                </span>
              </div>
            </div>

            {/* Lines Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] text-slate-400 border-b border-slate-100 font-mono">
                  <tr>
                    <th className="py-2 px-4 w-28">Code</th>
                    <th className="py-2 px-4">Account Title & Narration</th>
                    <th className="py-2 px-4 text-right w-36">Debit (Dr.)</th>
                    <th className="py-2 px-4 text-right w-36">Credit (Cr.)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {voucher.lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-4 text-slate-500">
                        {line.accountCode}
                      </td>
                      <td className="py-2 px-4 font-sans">
                        <span
                          className={`font-semibold ${
                            line.debit > 0 ? 'text-emerald-800' : 'text-indigo-800 pl-4 block'
                          }`}
                        >
                          {line.debit > 0 ? 'Dr.' : 'Cr.'} {line.accountName}
                        </span>
                        {line.narration && (
                          <span className="text-[11px] text-slate-400 block font-normal font-sans">
                            {line.narration}
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-emerald-800 tabular-nums">
                        {line.debit > 0 ? formatCurrency(line.debit, settings.currencySymbol) : '-'}
                      </td>
                      <td className="py-2 px-4 text-right font-bold text-indigo-800 tabular-nums">
                        {line.credit > 0 ? formatCurrency(line.credit, settings.currencySymbol) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Add Manual Journal Voucher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">
              Create Double-Entry Journal Voucher
            </h2>
            <form onSubmit={handlePostVoucher} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Voucher Date*</label>
                  <input
                    type="date"
                    required
                    value={voucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Transaction Category</label>
                  <select
                    value={referenceType}
                    onChange={(e) => setReferenceType(e.target.value as typeof referenceType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Manual">Manual Journal Entry</option>
                    <option value="Capital">Owner Capital / Equity</option>
                    <option value="Purchase">Inward Stock Purchase</option>
                    <option value="Sales">Harvest Fish Sales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Narration / Description*</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Month-end adjustment for electricity power and wages"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              {/* Multi-line Entry Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold font-sans">
                    <tr>
                      <th className="py-2 px-3">Account Title</th>
                      <th className="py-2 px-3 w-28">Debit (Dr.)</th>
                      <th className="py-2 px-3 w-28">Credit (Cr.)</th>
                      <th className="py-2 px-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {lines.map((line, idx) => (
                      <tr key={idx}>
                        <td className="p-2">
                          <select
                            value={line.accountCode}
                            onChange={(e) => handleLineChange(idx, 'accountCode', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded focus:outline-teal-600 font-sans text-xs bg-white"
                          >
                            {accounts.map((acc) => (
                              <option key={acc.code} value={acc.code}>
                                {acc.code} - {acc.name} ({acc.type})
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            value={line.debit}
                            onChange={(e) => handleLineChange(idx, 'debit', Number(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded focus:outline-teal-600 text-right font-bold text-emerald-800"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            value={line.credit}
                            onChange={(e) => handleLineChange(idx, 'credit', Number(e.target.value) || 0)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded focus:outline-teal-600 text-right font-bold text-indigo-800"
                          />
                        </td>

                        <td className="p-2 text-center">
                          {lines.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLine(idx)}
                              className="text-slate-400 hover:text-rose-600 font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200 font-mono">
                    <tr>
                      <td className="py-2 px-3 text-right font-sans">
                        Totals:
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-800">
                        {formatCurrency(totalDebit, settings.currencySymbol)}
                      </td>
                      <td className="py-2 px-3 text-right text-indigo-800">
                        {formatCurrency(totalCredit, settings.currencySymbol)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900"
                >
                  + Add Another Line
                </button>

                {/* Validation Indicator */}
                <div className="flex items-center gap-1.5">
                  {isBalanced ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Voucher is Balanced (Dr = Cr)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-700 font-semibold text-xs">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      Unbalanced: Diff = {formatCurrency(Math.abs(totalDebit - totalCredit), settings.currencySymbol)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className={`px-4 py-1.5 font-semibold rounded-md shadow-xs transition-colors ${
                    isBalanced
                      ? 'bg-teal-700 hover:bg-teal-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Post Voucher to GL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
