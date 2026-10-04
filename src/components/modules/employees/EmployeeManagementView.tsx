import React, { useState, useEffect } from 'react';
import { useERP } from '../../../context/ERPContext';
import { UserRole } from '../../../types/erp';
import { Users, UserCheck, Shield, Phone, Mail, Award, Check } from 'lucide-react';

interface EmployeeManagementViewProps {
  initialRoleFilter?: string;
}

export const EmployeeManagementView: React.FC<EmployeeManagementViewProps> = ({ initialRoleFilter = 'all' }) => {
  const { users, currentUser, setCurrentUser, language } = useERP();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>(initialRoleFilter);

  useEffect(() => {
    if (initialRoleFilter) {
      setSelectedRoleFilter(initialRoleFilter);
    }
  }, [initialRoleFilter]);

  const filteredEmployees = users.filter((u) => {
    return selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'master':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'owner':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'manager':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'accountant':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'sales':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'store':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'কর্মকর্তা ও কর্মচারী নির্দেশিকা' : 'Employee Directory & Role Assignments'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'ম্যানেজার, হিসাবরক্ষক, বিক্রয় কর্মকর্তা, স্টোর ইন-চার্জ ও নিরীক্ষকদের দায়িত্ব বণ্টন'
              : 'Enterprise aquaculture staffing directory categorized across managerial, financial, and store duties'}
          </p>
        </div>

        {/* Quick Role Switcher Simulation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-start">
          {['all', 'manager', 'accountant', 'sales', 'store', 'viewer'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3 py-1 font-medium rounded-md capitalize transition-colors ${
                selectedRoleFilter === r
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'all' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((emp) => {
          const isCurrentActive = emp.id === currentUser.id;
          return (
            <div
              key={emp.id}
              className={`bg-white p-5 rounded-xl border transition-all text-xs space-y-4 shadow-xs relative ${
                isCurrentActive ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {isCurrentActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  <Check className="w-3 h-3" />
                  Logged In As This Role
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="min-w-0 pr-12">
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {language === 'bn' && emp.nameBn ? emp.nameBn : emp.name}
                  </h3>
                  <span className="text-slate-500 block truncate">{emp.department}</span>
                  <div className="mt-1">
                    <span
                      className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded border ${getRoleBadge(
                        emp.role
                      )}`}
                    >
                      {emp.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px] truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px]">System ID: @{emp.username}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Duty
                </span>

                {!isCurrentActive && (
                  <button
                    onClick={() => setCurrentUser(emp)}
                    className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded transition-colors"
                  >
                    Simulate View →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
