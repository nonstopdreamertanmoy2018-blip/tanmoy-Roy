import React, { useState } from 'react';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types/erp';
import {
  Menu,
  Globe,
  PlusCircle,
  Building2,
  UserCheck,
  ChevronDown,
} from 'lucide-react';

interface TopBarProps {
  onToggleSidebar: () => void;
  onOpenQuickAction: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  onOpenQuickAction,
}) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    currentCompany,
    setCurrentCompany,
    companies,
    language,
    setLanguage,
    activeTab,
  } = useERP();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);

  // Tab Breadcrumb text
  const getTabBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard':
        return language === 'bn' ? 'ড্যাশবোর্ড ও ওভারভিউ' : 'Overview & Dashboard';
      case 'companies':
        return language === 'bn' ? 'সকল কোম্পানি ও খামার' : 'All Companies';
      case 'users':
        return language === 'bn' ? 'ব্যবহারকারী ও এক্সেস' : 'User Administration';
      case 'permissions':
        return language === 'bn' ? 'অনুমতি ম্যাট্রিক্স' : 'Access Permissions';
      case 'backup':
        return language === 'bn' ? 'ডাটাবেস ব্যাকআপ ও রিস্টোর' : 'Database Backup';
      case 'settings':
        return language === 'bn' ? 'সিস্টেম সেটিংস' : 'System Settings';
      case 'audit':
        return language === 'bn' ? 'অডিট লগ ও নিরীক্ষা' : 'System Audit Log';
      case 'farm':
        return language === 'bn' ? 'খামার বিবরণ ও পরিকাঠামো' : 'Farm Infrastructure';
      case 'ponds':
        return language === 'bn' ? 'পুকুর ব্যবস্থাপনা' : 'Pond Management';
      case 'fish':
        return language === 'bn' ? 'মাছের মজুদ ও প্রজাতি' : 'Fish Stock Inventory';
      case 'feed':
        return language === 'bn' ? 'খাবার মজুদ ও এফসিআর' : 'Feed & Nutrition';
      case 'harvest':
        return language === 'bn' ? 'মাছ আহরণ লগ' : 'Harvest Logging';
      case 'sales':
        return language === 'bn' ? 'মাছ বিক্রয় ও ইনভয়েস' : 'Sales & Invoicing';
      case 'purchases':
        return language === 'bn' ? 'ক্রয় বিল ও ইনভেন্টরি' : 'Purchases & Stock Inward';
      case 'expenses':
        return language === 'bn' ? 'খামার পরিচালন খরচ' : 'Farm Operating Expenses';
      case 'reports':
        return language === 'bn' ? 'অপারেশনাল রিপোর্ট' : 'Aquaculture Analytics';
      case 'chart-of-accounts':
        return language === 'bn' ? 'হিসাবের তালিকা (COA)' : 'Chart of Accounts';
      case 'journal':
        return language === 'bn' ? 'সাধারণ জাবেদা (General Journal)' : 'General Journal (Dr / Cr)';
      case 'ledger':
        return language === 'bn' ? 'খতিয়ান বই (General Ledger)' : 'General Ledger';
      case 'cash-book':
        return language === 'bn' ? 'নগদান বই (Cash Book)' : 'Cash Book Register';
      case 'bank-book':
        return language === 'bn' ? 'ব্যাংক হিসাব বই (Bank Book)' : 'Bank Book Register';
      case 'trialBalance':
      case 'trial-balance':
        return language === 'bn' ? 'রেওয়ামিল (Trial Balance)' : 'Trial Balance Verification';
      case 'profit-loss':
        return language === 'bn' ? 'লাভ ও ক্ষতি হিসাব (P&L)' : 'Profit & Loss Statement';
      case 'balance-sheet':
        return language === 'bn' ? 'উদ্বৃত্তপত্র (Balance Sheet)' : 'Balance Sheet (A = L + E)';
      case 'employees':
        return language === 'bn' ? 'কর্মকর্তা ও কর্মচারী' : 'Employee Directory & Duties';
      default:
        return 'Pond ERP';
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    const matchedUser = users.find((u) => u.role === role) || {
      ...currentUser,
      role,
      name: `${role.toUpperCase()} User`,
    };
    setCurrentUser(matchedUser);
    setRoleMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between">
      {/* Zone 1: Breadcrumb & Mobile Toggle */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-800 truncate">
          <span className="font-bold text-teal-800 truncate">
            {language === 'bn' && currentCompany.nameBn ? currentCompany.nameBn : currentCompany.name}
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 truncate">{getTabBreadcrumb()}</span>
        </div>
      </div>

      {/* Zone 2: Company Switcher & Quick Navigation */}
      <div className="hidden md:flex items-center gap-2">
        {/* Company Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setCompanyMenuOpen(!companyMenuOpen);
              setRoleMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span className="max-w-[130px] truncate">{currentCompany.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {companyMenuOpen && (
            <div className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Active Farm / Company
              </div>
              {companies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCurrentCompany(c);
                    setCompanyMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs hover:bg-slate-50 flex flex-col ${
                    c.id === currentCompany.id ? 'bg-teal-50 text-teal-900 font-semibold' : 'text-slate-700'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  <span className="text-[10px] text-slate-400">{c.district} · {c.totalAcreage} Acres</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Zone 3: Role Switcher, Language Toggle & Primary Action */}
      <div className="flex items-center gap-2">
        {/* Role Switcher Pill (Critical for immediate user testing of Master, Owner, Accountant, Manager, etc.) */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setCompanyMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors"
            title="Switch User Role to test different permission views"
          >
            <UserCheck className="w-3.5 h-3.5 text-teal-700" />
            <span className="capitalize">{currentUser.role}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                {language === 'bn' ? 'টেস্টের জন্য রোল পরিবর্তন করুন' : 'Simulate Role View'}
              </div>
              {[
                { role: 'master', label: 'Master Admin (Full System)' },
                { role: 'owner', label: 'Owner Admin (Farm & Finance)' },
                { role: 'manager', label: 'Manager (Operations & Harvest)' },
                { role: 'accountant', label: 'Accountant (General Ledger & P&L)' },
                { role: 'sales', label: 'Sales Employee (Invoicing)' },
                { role: 'store', label: 'Store Employee (Feed Stock)' },
                { role: 'viewer', label: 'Viewer / Auditor (Read Only)' },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleRoleSelect(item.role as UserRole)}
                  className={`w-full px-3 py-1.5 text-left text-xs transition-colors flex items-center justify-between ${
                    currentUser.role === item.role
                      ? 'bg-teal-600 text-white font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {currentUser.role === item.role && <span>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bilingual Language Switcher (EN / বাংলা) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded transition-colors font-medium ${
              language === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('bn')}
            className={`px-2 py-1 rounded transition-colors font-medium ${
              language === 'bn' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            বাংলা
          </button>
        </div>

        {/* Primary Action Button (+ New Voucher / Record) */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors whitespace-nowrap"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {language === 'bn' ? 'নতুন লেনদেন' : 'New Entry'}
          </span>
        </button>
      </div>
    </header>
  );
};
