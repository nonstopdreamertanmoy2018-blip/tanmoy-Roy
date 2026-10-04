import React from 'react';
import { useERP } from '../../context/ERPContext';
import { t } from '../../utils/translations';
import {
  Building2,
  Users,
  ShieldCheck,
  Database,
  Settings,
  FileText,
  Warehouse,
  Waves,
  Fish,
  Wheat,
  Anchor,
  TrendingUp,
  ShoppingCart,
  Receipt,
  BarChart3,
  BookOpen,
  FileSpreadsheet,
  Coins,
  Scale,
  PieChart,
  Landmark,
  UserCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, currentUser, language, logout } = {
    ...useERP(),
    logout: () => {
      // Switch to viewer or show sign-in
    },
  };

  const currentRole = currentUser?.role || 'master';

  // Navigation Items Tree matching the exact prompt hierarchy
  const masterAdminItems = [
    { id: 'companies', label: t.allCompanies[language], icon: Building2 },
    { id: 'users', label: t.allUsers[language], icon: Users },
    { id: 'permissions', label: t.permissions[language], icon: ShieldCheck },
    { id: 'backup', label: t.databaseBackup[language], icon: Database },
    { id: 'settings', label: t.systemSettings[language], icon: Settings },
    { id: 'audit', label: t.auditLog[language], icon: FileText },
  ];

  const ownerAdminItems = [
    { id: 'farm', label: t.farm[language], icon: Warehouse },
    { id: 'ponds', label: t.ponds[language], icon: Waves },
    { id: 'fish', label: t.fishStock[language], icon: Fish },
    { id: 'feed', label: t.feed[language], icon: Wheat },
    { id: 'harvest', label: t.harvest[language], icon: Anchor },
    { id: 'sales', label: t.sales[language], icon: TrendingUp },
    { id: 'purchases', label: t.purchases[language], icon: ShoppingCart },
    { id: 'expenses', label: t.expenses[language], icon: Receipt },
    { id: 'reports', label: t.reports[language], icon: BarChart3 },
  ];

  const accountingItems = [
    { id: 'chart-of-accounts', label: t.chartOfAccounts[language], icon: BookOpen },
    { id: 'journal', label: t.journal[language], icon: FileSpreadsheet },
    { id: 'ledger', label: t.ledger[language], icon: FileText },
    { id: 'cash-book', label: t.cashBook[language], icon: Coins },
    { id: 'bank-book', label: t.bankBook[language], icon: Landmark },
    { id: 'trial-balance', label: t.trialBalance[language], icon: Scale },
    { id: 'profit-loss', label: t.profitLoss[language], icon: PieChart },
    { id: 'balance-sheet', label: t.balanceSheet[language], icon: Scale },
  ];

  const employeeRoles = [
    { id: 'emp-manager', label: t.manager[language], roleKey: 'manager' },
    { id: 'emp-accountant', label: t.accountant[language], roleKey: 'accountant' },
    { id: 'emp-sales', label: t.salesRole[language], roleKey: 'sales' },
    { id: 'emp-store', label: t.store[language], roleKey: 'store' },
    { id: 'emp-viewer', label: t.viewer[language], roleKey: 'viewer' },
  ];

  // Role permissions check
  const canAccessMaster = currentRole === 'master';
  const canAccessOwner = ['master', 'owner', 'manager'].includes(currentRole);
  const canAccessAccounting = ['master', 'owner', 'accountant', 'viewer'].includes(currentRole);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#06332d] text-slate-200 border-r border-[#09473f] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#0a4840]">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold">
              🐟
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                {t.appTitle[language]}
              </span>
              <span className="block text-[10px] text-teal-300/70 tracking-wider uppercase font-medium">
                {language === 'bn' ? 'মৎস্য খামার ও হিসাব' : 'Aquaculture ERP'}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Hierarchy */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Dashboard Link */}
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
              activeTab === 'dashboard'
                ? 'bg-teal-600/30 text-teal-300 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <span>{t.dashboard[language]}</span>
          </button>

          {/* 1. MASTER ADMIN SECTION */}
          {canAccessMaster && (
            <div>
              <div className="px-3 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-200/50 uppercase tracking-wider">
                  {t.masterAdmin[language]}
                </span>
                <span className="text-[10px] text-teal-400 font-mono">SYS</span>
              </div>
              <div className="space-y-0.5">
                {masterAdminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                        isActive
                          ? 'bg-teal-500/20 text-teal-200 font-medium'
                          : 'text-slate-300 hover:bg-[#08423a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3 h-3 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. OWNER ADMIN SECTION */}
          {canAccessOwner && (
            <div>
              <div className="px-3 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-200/50 uppercase tracking-wider">
                  {t.ownerAdmin[language]}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">OPS</span>
              </div>
              <div className="space-y-0.5">
                {ownerAdminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                        isActive
                          ? 'bg-teal-500/20 text-teal-200 font-medium'
                          : 'text-slate-300 hover:bg-[#08423a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3 h-3 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. ACCOUNTING SECTION */}
          {canAccessAccounting && (
            <div>
              <div className="px-3 mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-200/50 uppercase tracking-wider">
                  {t.accounting[language]}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">DR/CR</span>
              </div>
              <div className="space-y-0.5">
                {accountingItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                        isActive
                          ? 'bg-teal-500/20 text-teal-200 font-medium'
                          : 'text-slate-300 hover:bg-[#08423a] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3 h-3 text-teal-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. EMPLOYEES & ROLES SECTION */}
          <div>
            <div className="px-3 mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-200/50 uppercase tracking-wider">
                {t.employees[language]}
              </span>
              <span className="text-[10px] text-sky-400 font-mono">STAFF</span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => handleNavClick('employees')}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                  activeTab === 'employees'
                    ? 'bg-teal-500/20 text-teal-200 font-medium'
                    : 'text-slate-300 hover:bg-[#08423a] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <UserCheck className="w-3.5 h-3.5 shrink-0 text-teal-400" />
                  <span className="truncate">{language === 'bn' ? 'সকল কর্মী ও ডিউটি' : 'Staff Directory & Duty'}</span>
                </div>
              </button>

              {employeeRoles.map((role) => {
                const isActive = activeTab === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => handleNavClick(role.id)}
                    className={`w-full flex items-center justify-between px-3 py-1 text-xs rounded text-left transition-colors pl-8 ${
                      isActive
                        ? 'bg-teal-500/20 text-teal-200 font-medium'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#08423a]/50'
                    }`}
                  >
                    <span className="truncate">{role.label}</span>
                    <span className={`text-[10px] font-mono ${isActive ? 'text-teal-300' : 'text-teal-400/60'}`}>
                      Active
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Card & Role Footnote */}
        <div className="p-3 border-t border-[#0a4840] bg-[#042420]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-teal-800 text-teal-200 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate leading-tight">
                  {currentUser.name}
                </p>
                <span className="text-[10px] text-teal-300/80 uppercase font-mono tracking-tight block">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleNavClick('settings')}
              title="System Settings"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
