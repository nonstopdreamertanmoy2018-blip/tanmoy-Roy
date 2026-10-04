export type UserRole = 
  | 'master' 
  | 'owner' 
  | 'manager' 
  | 'accountant' 
  | 'sales' 
  | 'store' 
  | 'viewer';

export type Language = 'en' | 'bn';

export type Currency = 'BDT' | 'USD' | 'EUR' | 'INR';

export interface User {
  id: string;
  username: string;
  name: string;
  nameBn?: string;
  email: string;
  role: UserRole;
  phone?: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  companyId: string;
  password?: string;
}

export interface Company {
  id: string;
  name: string;
  nameBn?: string;
  registrationNo: string;
  taxId: string;
  currency: string;
  currencySymbol: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  fiscalYear: string;
  totalAcreage: number;
}

export interface Pond {
  id: string;
  name: string;
  nameBn?: string;
  companyId: string;
  areaDecimal: number; // e.g. 50 decimals (100 decimals = 1 acre)
  depthFeet: number;
  waterSource: string;
  status: 'Active' | 'Nursery' | 'Harvest Ready' | 'Fallow' | 'Preparation';
  aerationEquipped: boolean;
  aeratorRunning: boolean;
  waterPh: number;
  dissolvedOxygen: number; // mg/L
  salinityPpt: number;
  temperatureC: number;
  stockingCapacityKg: number;
  notes?: string;
}

export interface FishSpeciesStock {
  id: string;
  pondId: string;
  speciesName: string;
  speciesNameBn: string;
  stockingDate: string;
  initialQuantityCount: number;
  initialBiomassKg: number;
  currentEstimatedBiomassKg: number;
  averageWeightGrams: number;
  unitCostPerFingerling: number;
  totalCost: number;
  mortalityCount: number;
  status: 'Growing' | 'Harvested' | 'Fingerling';
}

export interface FeedItem {
  id: string;
  name: string;
  nameBn: string;
  brand: string;
  proteinPercent: number;
  feedType: 'Floating' | 'Sinking' | 'Powder / Starter';
  bagWeightKg: number;
  bagsInStock: number;
  unitCostPerBag: number;
  reorderLevelBags: number;
}

export interface FeedingLog {
  id: string;
  date: string;
  pondId: string;
  feedItemId: string;
  quantityKg: number;
  timeSlot: 'Morning (07:00)' | 'Noon (13:00)' | 'Evening (17:30)';
  cost: number;
  loggedBy: string;
  notes?: string;
}

export interface HarvestRecord {
  id: string;
  date: string;
  pondId: string;
  speciesStockId: string;
  speciesName: string;
  harvestedKg: number;
  fishCount: number;
  averageWeightGrams: number;
  grade: 'Grade A' | 'Grade B' | 'Export';
  packingCost: number;
  iceTransportCost: number;
  notes?: string;
  salesInvoiceId?: string;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  pondId?: string;
  speciesName: string;
  quantityKg: number;
  ratePerKg: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank' | 'Due Credit';
  paymentAccountCode: string; // 1001 for Cash, 1002 for Bank, 1020 for Accounts Receivable
  journalVoucherId: string;
  notes?: string;
}

export interface PurchaseBill {
  id: string;
  billNumber: string;
  date: string;
  supplierName: string;
  category: 'Fish Fingerlings' | 'Feed Stock' | 'Medicines & Lime' | 'Equipment & Aeration';
  itemName: string;
  quantity: number;
  unit: 'KG' | 'Bags' | 'Pieces' | 'Units';
  rate: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Bank' | 'Accounts Payable';
  journalVoucherId: string;
  pondId?: string;
  notes?: string;
}

export interface FarmExpense {
  id: string;
  voucherNumber: string;
  date: string;
  expenseCategory: 
    | 'Feed Expense'
    | 'Labor & Wages' 
    | 'Electricity & Aeration Power' 
    | 'Diesel & Generator Fuel' 
    | 'Pond Lease & Rent' 
    | 'Lime & Water Conditioning' 
    | 'Equipment Maintenance & Nets' 
    | 'Office & General Admin';
  amount: number;
  paymentMethod: 'Cash' | 'Bank' | 'Payable';
  paidTo: string;
  accountCode: string; // 5000 series
  journalVoucherId: string;
  pondId?: string;
  description: string;
}

// Double Entry Accounting Types
export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';

export interface Account {
  code: string;
  name: string;
  nameBn: string;
  type: AccountType;
  normalBalance: 'Debit' | 'Credit';
  isSystemAccount: boolean;
  description?: string;
}

export interface JournalLine {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  narration?: string;
}

export interface JournalVoucher {
  id: string;
  voucherNumber: string;
  date: string;
  referenceType: 'Sales' | 'Purchase' | 'Feeding' | 'Expense' | 'Capital' | 'Manual';
  referenceId?: string;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
  createdBy: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  details: string;
}

export interface SystemSettingsState {
  companyName: string;
  currencySymbol: string;
  language: Language;
  fiscalYearStart: string;
  taxVatRate: number;
  inventoryValuationMethod: 'FIFO' | 'Weighted Average';
  enableAuditLogging: boolean;
  autoPostAccountingVouchers: boolean;
}

export interface RolePermissions {
  [role: string]: {
    [module: string]: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}
