import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { FarmExpense } from '../../../types/erp';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Plus, Receipt, Zap, Users, Fuel, Droplet, Wrench } from 'lucide-react';

export const ExpensesView: React.FC = () => {
  const { expenses, ponds, recordExpense, settings, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);

  const [category, setCategory] = useState<FarmExpense['expenseCategory']>('Electricity & Aeration Power');
  const [amount, setAmount] = useState('15000');
  const [paidTo, setPaidTo] = useState('PDB Rural Electrification Board');
  const [paymentMethod, setPaymentMethod] = useState<FarmExpense['paymentMethod']>('Cash');
  const [pondId, setPondId] = useState(ponds[0]?.id || '');
  const [description, setDescription] = useState('Monthly electricity consumption for continuous aeration');

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const getAccountCode = (cat: FarmExpense['expenseCategory']) => {
    switch (cat) {
      case 'Labor & Wages':
        return '5200'; // Salary / Wages
      default:
        return '5100'; // Farm Expense
    }
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amount) || 0;
    if (val <= 0) return;

    recordExpense({
      date: new Date().toISOString().split('T')[0],
      expenseCategory: category,
      amount: val,
      paymentMethod,
      paidTo,
      accountCode: getAccountCode(category),
      pondId,
      description,
    });

    setShowAddModal(false);
    setPaidTo('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'খামার পরিচালন খরচ ও ভাউচার' : 'Farm Operating Expenses & Vouchers'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'ডাবল এন্ট্রি নীতি: ডেবিট খরচ হিসাব — ক্রেডিট নগদ / প্রদেয় হিসাব'
              : 'Enforces fundamental accounting rule: Dr. Expense (5000 series) — Cr. Cash / Payable'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন খরচ ভাউচার' : 'Record Expense'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Operational Costs
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-rose-800 font-mono tabular-nums">
              {formatCurrency(totalExpenses, settings.currencySymbol)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Vouchers Issued
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {expenses.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Aeration & Grid Power
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCurrency(
                expenses
                  .filter((e) => e.expenseCategory === 'Electricity & Aeration Power')
                  .reduce((sum, e) => sum + e.amount, 0),
                settings.currencySymbol
              )}
            </span>
          </div>
        </div>

        <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 text-xs font-mono space-y-1">
          <span className="text-[10px] text-teal-800 font-bold block uppercase tracking-wider">
            Double Entry Rule
          </span>
          <div className="text-rose-800 font-semibold">
            Dr. Feed / Farm Expense
          </div>
          <div className="text-slate-800 pl-3">
            Cr. Cash / Payable
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Expense Category</th>
                <th className="py-3 px-4">Paid To</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 font-sans">
                    {exp.voucherNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-sans">
                    {formatDate(exp.date)}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    {exp.expenseCategory}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">
                    {exp.paidTo}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 truncate max-w-xs">
                    {exp.description}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        exp.paymentMethod === 'Cash'
                          ? 'bg-emerald-50 text-emerald-800'
                          : exp.paymentMethod === 'Bank'
                          ? 'bg-sky-50 text-sky-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {exp.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-800 text-sm">
                    {formatCurrency(exp.amount, settings.currencySymbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Record Farm Operational Expense Voucher
            </h2>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Expense Category*</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FarmExpense['expenseCategory'])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                >
                  <option value="Electricity & Aeration Power">Electricity & Aeration Power (Dr. 5004)</option>
                  <option value="Labor & Wages">Labor & Farm Wages (Dr. 5003)</option>
                  <option value="Diesel & Generator Fuel">Diesel & Generator Fuel (Dr. 5005)</option>
                  <option value="Pond Lease & Rent">Pond Lease & Rent (Dr. 5006)</option>
                  <option value="Lime & Water Conditioning">Lime & Water Treatment (Dr. 5007)</option>
                  <option value="Equipment Maintenance & Nets">Equipment Maintenance & Nets (Dr. 5008)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Expense Amount (৳)*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono text-sm font-bold text-rose-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Method*</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as FarmExpense['paymentMethod'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Cash">Cash in Hand (Cr. 1000 Cash / নগদ)</option>
                    <option value="Bank">Bank Cheque / Online (Cr. 1100 Bank / ব্যাংক)</option>
                    <option value="Payable">Accrued / Due (Cr. 2000 Accounts Payable / দেনা)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Paid To / Recipient*</label>
                <input
                  type="text"
                  required
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  placeholder="e.g. Rural Electrification Board or Netting Crew"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Narration / Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Electricity bill for 3-phase aerators across ponds"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-md text-teal-900 text-[11px] font-mono leading-relaxed">
                <strong>Accounting Post:</strong>
                <br />
                Dr. {category} ({getAccountCode(category)}): {formatCurrency(Number(amount) || 0, settings.currencySymbol)}
                <br />
                Cr. {paymentMethod === 'Cash' ? 'Cash in Hand (1000)' : paymentMethod === 'Bank' ? 'Bank (1100)' : 'Accounts Payable (2000)'}: {formatCurrency(Number(amount) || 0, settings.currencySymbol)}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-semibold rounded-md hover:bg-teal-800"
                >
                  Post Expense Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
