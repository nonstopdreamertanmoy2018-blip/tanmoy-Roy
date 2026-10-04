import { Language } from '../types/erp';

export const t = {
  // Navigation & Hierarchy
  appTitle: { en: 'POND ERP', bn: 'পন্ড ইআরপি' },
  subTitle: { en: 'Aquaculture & Financial Accounting ERP', bn: 'মৎস্য খামার ও আর্থিক অ্যাকাউন্টিং ইআরপি' },
  
  // Section Headers
  masterAdmin: { en: 'MASTER ADMIN', bn: 'মাস্টার অ্যাডমিন' },
  ownerAdmin: { en: 'OWNER ADMIN', bn: 'ওনার অ্যাডমিন' },
  accounting: { en: 'ACCOUNTING', bn: 'হিসাবরক্ষণ' },
  employees: { en: 'EMPLOYEES', bn: 'কর্মকর্তা ও কর্মচারী' },

  // Master Admin items
  allCompanies: { en: 'All Companies', bn: 'সকল কোম্পানি' },
  allUsers: { en: 'All Users', bn: 'সকল ব্যবহারকারী' },
  permissions: { en: 'Permissions', bn: 'অনুমতি ও এক্সেস' },
  databaseBackup: { en: 'Database Backup', bn: 'ডাটাবেস ব্যাকআপ' },
  systemSettings: { en: 'System Settings', bn: 'সিস্টেম সেটিংস' },
  auditLog: { en: 'Audit Log', bn: 'অডিট লগ' },

  // Owner Admin items
  farm: { en: 'Farm Overview', bn: 'খামার ওভারভিউ' },
  ponds: { en: 'Ponds Management', bn: 'পুকুর ব্যবস্থাপনা' },
  fishStock: { en: 'Fish Stock', bn: 'মাছের মজুদ' },
  feed: { en: 'Feed & Nutrition', bn: 'খাবার ও পুষ্টি' },
  harvest: { en: 'Harvest', bn: 'মাছ আহরণ' },
  sales: { en: 'Sales & Invoicing', bn: 'বিক্রয় ও ইনভয়েস' },
  purchases: { en: 'Purchases & Bills', bn: 'ক্রয় ও বিল' },
  expenses: { en: 'Farm Expenses', bn: 'খামার খরচ' },
  reports: { en: 'Operational Reports', bn: 'অপারেশনাল রিপোর্ট' },

  // Accounting items
  chartOfAccounts: { en: 'Chart of Accounts', bn: 'হিসাবের তালিকা' },
  journal: { en: 'Journal Entries', bn: 'জাবেদা বই' },
  ledger: { en: 'General Ledger', bn: 'খতিয়ান বই' },
  cashBook: { en: 'Cash Book', bn: 'নগদান বই' },
  bankBook: { en: 'Bank Book', bn: 'ব্যাংক হিসাব বই' },
  trialBalance: { en: 'Trial Balance', bn: 'রেওয়ামিল' },
  profitLoss: { en: 'Profit & Loss', bn: 'লাভ ও ক্ষতি হিসাব' },
  balanceSheet: { en: 'Balance Sheet', bn: 'উদ্বৃত্তপত্র' },

  // Employees items
  manager: { en: 'Manager', bn: 'ম্যানেজার' },
  accountant: { en: 'Accountant', bn: 'অ্যাকাউন্ট্যান্ট' },
  salesRole: { en: 'Sales Officer', bn: 'বিক্রয় কর্মকর্তা' },
  store: { en: 'Store In-Charge', bn: 'স্টোর ইন-চার্জ' },
  viewer: { en: 'Viewer / Auditor', bn: 'পর্যবেক্ষক' },

  // Common UI words
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  logout: { en: 'Logout', bn: 'লগআউট' },
  switchRole: { en: 'Switch Role', bn: 'রোল পরিবর্তন' },
  company: { en: 'Company', bn: 'কোম্পানি' },
  date: { en: 'Date', bn: 'তারিখ' },
  actions: { en: 'Actions', bn: 'পদক্ষেপ' },
  add: { en: 'Add', bn: 'যোগ করুন' },
  save: { en: 'Save', bn: 'সংরক্ষণ' },
  cancel: { en: 'Cancel', bn: 'বাতিল' },
  delete: { en: 'Delete', bn: 'মুছুন' },
  status: { en: 'Status', bn: 'অবস্থা' },
  search: { en: 'Search...', bn: 'অনুসন্ধান...' },
  print: { en: 'Print Statement', bn: 'প্রিন্ট করুন' },
  exportJson: { en: 'Export JSON', bn: 'এক্সপোর্ট জেএসন' },
  importJson: { en: 'Import JSON', bn: 'ইমপোর্ট জেএসন' },
  resetSystem: { en: 'Reset System', bn: 'সিস্টেম রিসেট' },
  
  // Double-entry specifics
  debit: { en: 'Debit (Dr.)', bn: 'ডেবিট (Dr.)' },
  credit: { en: 'Credit (Cr.)', bn: 'ক্রেডিট (Cr.)' },
  drRuleSales: { en: 'Dr. Cash / Bank — Cr. Fish Sales Revenue', bn: 'ডেবিট: নগদ/ব্যাংক — ক্রেডিট: মাছ বিক্রয় আয়' },
  drRuleFeed: { en: 'Dr. Feed Expense — Cr. Cash / Payable', bn: 'ডেবিট: খাদ্য খরচ — ক্রেডিট: নগদ/প্রদেয়' },
  accountingEquation: { en: 'Assets = Liabilities + Owner Equity', bn: 'সম্পদ = দায় + মালিকানাস্বত্ব' },
  equationBalanced: { en: 'Accounting Equation is Balanced', bn: 'হিসাব সমীকরণ সম্পূর্ণ সামঞ্জস্যপূর্ণ' },
  
  // Metrics
  totalPonds: { en: 'Total Ponds', bn: 'মোট পুকুর' },
  totalFishStock: { en: 'Total Fish Stock', bn: 'মোট মাছ মজুদ' },
  totalSales: { en: 'Total Sales Revenue', bn: 'মোট বিক্রয় আয়' },
  netProfit: { en: 'Net Profit', bn: 'নিট লাভ' },
  totalAssets: { en: 'Total Assets', bn: 'মোট সম্পদ' },
  cashInHand: { en: 'Cash in Hand', bn: 'হাতে নগদ' },
  bankBalance: { en: 'Bank Balance', bn: 'ব্যাংক জমা' },
  feedStock: { en: 'Feed in Stock', bn: 'মজুদ খাদ্য' },
  fcr: { en: 'Average FCR', bn: 'গড় এফসিআর (FCR)' },
  feedPond: { en: 'Feed Pond Now', bn: 'খাবার দিন' },
  viewPond3D: { en: 'Interactive 3D Pond Simulator', bn: 'ইন্টারেক্টিভ 3D পুকুর সিমুলেটর' },
};

export function getTranslation(key: keyof typeof t, lang: Language): string {
  if (!t[key]) return key;
  return t[key][lang] || t[key]['en'];
}
