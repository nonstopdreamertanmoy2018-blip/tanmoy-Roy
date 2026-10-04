import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { UserRole } from '../../../types/erp';
import { formatDate } from '../../../utils/formatters';
import { UserPlus, Shield, Trash2 } from 'lucide-react';

export const AllUsers: React.FC = () => {
  const { users, addUser, updateUser, deleteUser, currentCompany, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('manager');
  const [department, setDepartment] = useState('Farm Operations');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !name) return;

    addUser({
      username: username.toLowerCase().trim(),
      name,
      nameBn: nameBn || name,
      email: email || `${username}@padmadelta-aqua.com`,
      role,
      department: department || 'General',
      status: 'Active',
      companyId: currentCompany.id,
      lastLogin: new Date().toISOString(),
    });

    setShowAddModal(false);
    setUsername('');
    setName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'ব্যবহারকারী ও রোল ব্যবস্থাপনা' : 'User Administration & Security'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'মাস্টার অ্যাডমিন, ওনার, ম্যানেজার, অ্যাকাউন্ট্যান্ট ও কর্মচারীদের দায়িত্ব নির্ধারণ'
              : 'Provision credentials and RBAC roles across administrative and operational staff'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <UserPlus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন ব্যবহারকারী যোগ করুন' : 'Create User'}
        </button>
      </div>

      {/* Users Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">@{u.username} · {u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono text-xs font-semibold uppercase text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-700">{u.department}</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        updateUser(u.id, {
                          status: u.status === 'Active' ? 'Inactive' : 'Active',
                        })
                      }
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {u.status}
                    </button>
                  </td>

                  <td className="py-3 px-4 text-slate-500 font-mono">
                    {formatDate(u.lastLogin || '')}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {u.username !== 'master' && (
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <Shield className="w-5 h-5 text-teal-700" />
              <h2 className="text-base font-bold">Create New ERP User</h2>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Username* (Login handle)</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. javed_manager"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Full Name*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Javed Akhtar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">System Role*</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                >
                  <option value="owner">Owner Admin (Full Farm & Financial Oversight)</option>
                  <option value="manager">Manager (Farm Operations, Ponds, Harvest)</option>
                  <option value="accountant">Accountant (General Ledger, Vouchers, P&L)</option>
                  <option value="sales">Sales Employee (Invoicing & Wholesale)</option>
                  <option value="store">Store Employee (Feed & Stockkeeper)</option>
                  <option value="viewer">Viewer (Read-Only Auditor)</option>
                  <option value="master">Master Admin (System & All Companies)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Field Operations, Warehouse"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@padmadelta-aqua.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
