import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Account, AccountType } from '../../../types/erp';
import { getAccountBalance } from '../../../utils/accountingEngine';
import { formatCurrency } from '../../../utils/formatters';
import { Plus, BookOpen, Search } from 'lucide-react';

export const ChartOfAccountsView: React.FC = () => {
  const { accounts, journalVouchers, addAccount, settings, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [type, setType] = useState<AccountType>('Expense');
  const [normalBalance, setNormalBalance] = useState<'Debit' | 'Credit'>('Debit');
  const [description, setDescription] = useState('');

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.code.includes(searchTerm) ||
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (acc.nameBn && acc.nameBn.includes(searchTerm));
    const matchesType = selectedType === 'all' || acc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;

    addAccount({
      code: code.trim(),
      name,
      nameBn: nameBn || name,
      type,
      normalBalance,
      isSystemAccount: false,
      description,
    });

    setShowAddModal(false);
    setCode('');
    setName('');
    setNameBn('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'হিসাবের তালিকা (Chart of Accounts)' : 'Chart of Accounts (COA)'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'সম্পদ (1000s), দায় (2000s), মূলধন (3000s), আয় (4000s), ও ব্যয় (5000s) এর প্রমিত তালিকা'
              : 'Standardized 5-tier aquaculture general ledger accounts with normal balance rules'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or account..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-teal-600 w-48"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'bn' ? 'নতুন হিসাব কোড' : 'Add Account'}
          </button>
        </div>
      </div>

      {/* Account Type Filters */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit text-xs">
        {['all', 'Asset', 'Liability', 'Equity', 'Revenue', 'Expense'].map((t) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-3 py-1 font-medium rounded-md transition-colors ${
              selectedType === t
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t === 'all' ? 'All Accounts' : t}
          </button>
        ))}
      </div>

      {/* Chart of Accounts Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Account Title</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Normal Balance</th>
                <th className="py-3 px-4 text-right">Current Ledger Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredAccounts.map((acc) => {
                const balance = getAccountBalance(acc, journalVouchers);
                return (
                  <tr key={acc.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-teal-800">
                      {acc.code}
                    </td>

                    <td className="py-3 px-4 font-sans font-semibold text-slate-900">
                      <div>{language === 'bn' && acc.nameBn ? acc.nameBn : acc.name}</div>
                      {acc.description && (
                        <span className="text-[10px] text-slate-400 font-normal block">{acc.description}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          acc.type === 'Asset'
                            ? 'bg-sky-50 text-sky-800'
                            : acc.type === 'Liability'
                            ? 'bg-amber-50 text-amber-800'
                            : acc.type === 'Equity'
                            ? 'bg-purple-50 text-purple-800'
                            : acc.type === 'Revenue'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-rose-50 text-rose-800'
                        }`}
                      >
                        {acc.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-sans">
                      {acc.normalBalance}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(balance, settings.currencySymbol)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Add New General Ledger Account
            </h2>
            <form onSubmit={handleAddAccount} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Account Code*</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. 5009"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Account Type*</label>
                  <select
                    value={type}
                    onChange={(e) => {
                      const newType = e.target.value as AccountType;
                      setType(newType);
                      setNormalBalance(
                        newType === 'Asset' || newType === 'Expense' ? 'Debit' : 'Credit'
                      );
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Asset">Asset (1000s)</option>
                    <option value="Liability">Liability (2000s)</option>
                    <option value="Equity">Equity (3000s)</option>
                    <option value="Revenue">Revenue (4000s)</option>
                    <option value="Expense">Expense (5000s)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Name (English)*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Solar Power & Inverter Maintenance"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Account Name (বাংলা)</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="সৌর বিদ্যুৎ ও ইনভার্টার রক্ষণাবেক্ষণ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Normal Balance</label>
                <div className="flex gap-4 font-sans">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={normalBalance === 'Debit'}
                      onChange={() => setNormalBalance('Debit')}
                      name="balanceType"
                    />
                    <span>Debit (Normal for Assets & Expenses)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={normalBalance === 'Credit'}
                      onChange={() => setNormalBalance('Credit')}
                      name="balanceType"
                    />
                    <span>Credit (Normal for Liabilities, Equity & Revenue)</span>
                  </label>
                </div>
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
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
