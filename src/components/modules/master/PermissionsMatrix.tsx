import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { Check, X } from 'lucide-react';

export const PermissionsMatrix: React.FC = () => {
  const { language } = useERP();

  const roles = [
    { key: 'master', label: 'Master Admin' },
    { key: 'owner', label: 'Owner Admin' },
    { key: 'manager', label: 'Farm Manager' },
    { key: 'accountant', label: 'Accountant' },
    { key: 'sales', label: 'Sales Employee' },
    { key: 'store', label: 'Store Employee' },
    { key: 'viewer', label: 'Viewer / Auditor' },
  ];

  const modules = [
    {
      id: 'companies',
      name: 'All Companies',
      perms: { master: true, owner: false, manager: false, accountant: false, sales: false, store: false, viewer: false },
    },
    {
      id: 'users',
      name: 'User Administration',
      perms: { master: true, owner: true, manager: false, accountant: false, sales: false, store: false, viewer: false },
    },
    {
      id: 'ponds',
      name: 'Ponds Management & Aerators',
      perms: { master: true, owner: true, manager: true, accountant: false, sales: false, store: true, viewer: true },
    },
    {
      id: 'fish',
      name: 'Fish Stock & Biomass',
      perms: { master: true, owner: true, manager: true, accountant: false, sales: false, store: true, viewer: true },
    },
    {
      id: 'feed',
      name: 'Feed Stock & Daily Feeding',
      perms: { master: true, owner: true, manager: true, accountant: false, sales: false, store: true, viewer: true },
    },
    {
      id: 'harvest',
      name: 'Harvest Logging',
      perms: { master: true, owner: true, manager: true, accountant: false, sales: true, store: true, viewer: true },
    },
    {
      id: 'sales',
      name: 'Sales Invoices & Cash Collections',
      perms: { master: true, owner: true, manager: true, accountant: true, sales: true, store: false, viewer: true },
    },
    {
      id: 'purchases',
      name: 'Purchases & Supplier Dues',
      perms: { master: true, owner: true, manager: true, accountant: true, sales: false, store: true, viewer: true },
    },
    {
      id: 'expenses',
      name: 'Farm Operating Expenses',
      perms: { master: true, owner: true, manager: true, accountant: true, sales: false, store: false, viewer: true },
    },
    {
      id: 'coa',
      name: 'Chart of Accounts & Journal',
      perms: { master: true, owner: true, manager: false, accountant: true, sales: false, store: false, viewer: false },
    },
    {
      id: 'financials',
      name: 'P&L, Balance Sheet, Trial Balance',
      perms: { master: true, owner: true, manager: false, accountant: true, sales: false, store: false, viewer: true },
    },
    {
      id: 'backup',
      name: 'Database Backup & System Reset',
      perms: { master: true, owner: false, manager: false, accountant: false, sales: false, store: false, viewer: false },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {language === 'bn' ? 'অনুমতি ও ভূমিকা নিয়ন্ত্রণ (RBAC Matrix)' : 'Role-Based Access Control (RBAC Matrix)'}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'প্রতিটি কর্মচারীর ভূমিকা অনুযায়ী নিরাপত্তা ও অনুমতি নিয়ন্ত্রণ তালিকা'
            : 'Operational and financial module authorization matrix across all organizational tiers'}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4 min-w-[200px]">System Module</th>
                {roles.map((r) => (
                  <th key={r.key} className="py-3 px-3 text-center min-w-[100px]">
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {modules.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {m.name}
                  </td>
                  {roles.map((r) => {
                    const hasPerm = (m.perms as Record<string, boolean>)[r.key];
                    return (
                      <td key={r.key} className="py-3 px-3 text-center">
                        {hasPerm ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
