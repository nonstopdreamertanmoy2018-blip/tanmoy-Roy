import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Company,
  User,
  UserRole,
  Language,
  Pond,
  FishSpeciesStock,
  FeedItem,
  FeedingLog,
  HarvestRecord,
  SalesInvoice,
  PurchaseBill,
  FarmExpense,
  Account,
  JournalVoucher,
  AuditLogEntry,
  SystemSettingsState,
} from '../types/erp';
import {
  initialCompanies,
  initialUsers,
  initialPonds,
  initialFishStocks,
  initialFeedItems,
  initialFeedingLogs,
  initialHarvestRecords,
  initialSalesInvoices,
  initialPurchaseBills,
  initialExpenses,
  initialAccounts,
  initialJournalVouchers,
  initialAuditLogs,
  initialSettings,
} from '../data/initialData';

interface ERPContextType {
  // Current session & preferences
  isAuthenticated: boolean;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  currentCompany: Company;
  setCurrentCompany: (company: Company) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: SystemSettingsState;
  updateSettings: (newSettings: Partial<SystemSettingsState>) => void;

  // Master Data
  companies: Company[];
  users: User[];
  auditLogs: AuditLogEntry[];
  addCompany: (comp: Omit<Company, 'id'>) => void;
  addUser: (usr: Omit<User, 'id'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Farm & Aquaculture Data
  ponds: Pond[];
  fishStocks: FishSpeciesStock[];
  feedItems: FeedItem[];
  feedingLogs: FeedingLog[];
  harvestRecords: HarvestRecord[];
  salesInvoices: SalesInvoice[];
  purchaseBills: PurchaseBill[];
  expenses: FarmExpense[];

  // Aquaculture Actions
  addPond: (pond: Omit<Pond, 'id'>) => void;
  updatePond: (id: string, updates: Partial<Pond>) => void;
  deletePond: (id: string) => void;
  addFishStock: (stock: Omit<FishSpeciesStock, 'id'>) => void;
  updateFishStock: (id: string, updates: Partial<FishSpeciesStock>) => void;
  addFeedItem: (item: Omit<FeedItem, 'id'>) => void;
  updateFeedItem: (id: string, updates: Partial<FeedItem>) => void;
  recordFeeding: (log: Omit<FeedingLog, 'id' | 'cost'>) => void;
  recordHarvest: (rec: Omit<HarvestRecord, 'id'>) => void;

  // Double-Entry Accounting
  accounts: Account[];
  journalVouchers: JournalVoucher[];
  addAccount: (acc: Account) => void;
  addJournalVoucher: (voucher: Omit<JournalVoucher, 'id' | 'voucherNumber' | 'createdAt' | 'createdBy'>) => void;
  recordSale: (sale: Omit<SalesInvoice, 'id' | 'invoiceNumber' | 'journalVoucherId'>) => void;
  recordPurchase: (purchase: Omit<PurchaseBill, 'id' | 'billNumber' | 'journalVoucherId'>) => void;
  recordExpense: (expense: Omit<FarmExpense, 'id' | 'voucherNumber' | 'journalVoucherId'>) => void;

  // Direct Quick Double-Entry Action Triggers (matching prompt)
  executeQuickDoubleEntry: (
    type: 'fish_sales' | 'feed_expense',
    amount: number,
    channel?: 'Cash' | 'Bank' | 'Payable'
  ) => void;
  executeQuickFishSale10k: () => void;
  executeQuickFeedPurchase5k: () => void;

  // System & Database Management
  exportDatabaseJson: () => string;
  importDatabaseJson: (jsonString: string) => boolean;
  loadDemoData: () => void;
  resetToFreshSystem: () => void;
  logAudit: (action: string, module: string, details: string) => void;
}

const STORAGE_KEY = 'pond_erp_v2_data';

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initialData
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [currentCompany, setCurrentCompany] = useState<Company>(initialCompanies[0]);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);
  const [language, setLanguageState] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [settings, setSettings] = useState<SystemSettingsState>(initialSettings);

  const [ponds, setPonds] = useState<Pond[]>(initialPonds);
  const [fishStocks, setFishStocks] = useState<FishSpeciesStock[]>(initialFishStocks);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [feedingLogs, setFeedingLogs] = useState<FeedingLog[]>(initialFeedingLogs);
  const [harvestRecords, setHarvestRecords] = useState<HarvestRecord[]>(initialHarvestRecords);
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(initialSalesInvoices);
  const [purchaseBills, setPurchaseBills] = useState<PurchaseBill[]>(initialPurchaseBills);
  const [expenses, setExpenses] = useState<FarmExpense[]>(initialExpenses);

  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [journalVouchers, setJournalVouchers] = useState<JournalVoucher[]>(initialJournalVouchers);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

  // Authentication
  const login = (username: string, pass: string): { success: boolean; message?: string } => {
    const trimmed = username.toLowerCase().trim();
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === trimmed &&
        ((u.password && u.password === pass) ||
          (trimmed === 'master' && pass === 'master123') ||
          (trimmed === 'owner' && pass === 'owner123'))
    );

    if (user && user.status === 'Active') {
      setCurrentUser(user);
      setIsAuthenticated(true);
      logAudit('LOGIN', 'Authentication', `User @${user.username} logged in successfully`);
      return { success: true };
    }

    return {
      success: false,
      message: language === 'bn' ? 'ভুল ইউজারনেম অথবা পাসওয়ার্ড!' : 'Invalid username or password!',
    };
  };

  const logout = () => {
    logAudit('LOGOUT', 'Authentication', `User @${currentUser.username} logged out`);
    setIsAuthenticated(false);
  };

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.companies) setCompanies(parsed.companies);
        if (parsed.users) setUsers(parsed.users);
        if (parsed.ponds) setPonds(parsed.ponds);
        if (parsed.fishStocks) setFishStocks(parsed.fishStocks);
        if (parsed.feedItems) setFeedItems(parsed.feedItems);
        if (parsed.feedingLogs) setFeedingLogs(parsed.feedingLogs);
        if (parsed.harvestRecords) setHarvestRecords(parsed.harvestRecords);
        if (parsed.salesInvoices) setSalesInvoices(parsed.salesInvoices);
        if (parsed.purchaseBills) setPurchaseBills(parsed.purchaseBills);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.journalVouchers) setJournalVouchers(parsed.journalVouchers);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.settings) {
          setSettings(parsed.settings);
          if (parsed.settings.language) setLanguageState(parsed.settings.language);
        }
      }
    } catch (e) {
      console.error('Error loading Pond ERP state from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const stateToSave = {
        companies,
        users,
        ponds,
        fishStocks,
        feedItems,
        feedingLogs,
        harvestRecords,
        salesInvoices,
        purchaseBills,
        expenses,
        accounts,
        journalVouchers,
        auditLogs,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Error saving Pond ERP state to localStorage:', e);
    }
  }, [
    isInitialized,
    companies,
    users,
    ponds,
    fishStocks,
    feedItems,
    feedingLogs,
    harvestRecords,
    salesInvoices,
    purchaseBills,
    expenses,
    accounts,
    journalVouchers,
    auditLogs,
    settings,
  ]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setSettings((prev) => ({ ...prev, language: lang }));
  };

  const updateSettings = (newSettings: Partial<SystemSettingsState>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAudit('Settings Updated', 'System Settings', 'Updated system preferences');
  };

  const logAudit = (action: string, module: string, details: string) => {
    if (!settings.enableAuditLogging) return;
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 499)]); // Keep last 500
  };

  // Companies & Users
  const addCompany = (comp: Omit<Company, 'id'>) => {
    const id = `comp-${Date.now()}`;
    const newCompany: Company = { ...comp, id };
    setCompanies((prev) => [...prev, newCompany]);
    logAudit('Create Company', 'Master Admin', `Added new company/farm: ${comp.name}`);
  };

  const addUser = (usr: Omit<User, 'id'>) => {
    const id = `usr-${Date.now()}`;
    const newUser: User = { ...usr, id };
    setUsers((prev) => [...prev, newUser]);
    logAudit('Create User', 'Master Admin', `Created user @${usr.username} (${usr.role})`);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
    logAudit('Update User', 'Master Admin', `Updated profile for user ID: ${id}`);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    logAudit('Delete User', 'Master Admin', `Removed user ID: ${id}`);
  };

  // Ponds
  const addPond = (pond: Omit<Pond, 'id'>) => {
    const id = `pond-${Date.now()}`;
    const newPond: Pond = { ...pond, id };
    setPonds((prev) => [...prev, newPond]);
    logAudit('Add Pond', 'Ponds', `Created pond ${pond.name} (${pond.areaDecimal} decimals)`);
  };

  const updatePond = (id: string, updates: Partial<Pond>) => {
    setPonds((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    logAudit('Update Pond', 'Ponds', `Updated parameters for pond ID: ${id}`);
  };

  const deletePond = (id: string) => {
    setPonds((prev) => prev.filter((p) => p.id !== id));
    logAudit('Delete Pond', 'Ponds', `Deleted pond ID: ${id}`);
  };

  // Fish Stock
  const addFishStock = (stock: Omit<FishSpeciesStock, 'id'>) => {
    const id = `stk-${Date.now()}`;
    const newStock: FishSpeciesStock = { ...stock, id };
    setFishStocks((prev) => [...prev, newStock]);
    logAudit('Stock Fingerlings', 'Fish Stock', `Stocked ${stock.initialQuantityCount} pcs of ${stock.speciesName}`);
  };

  const updateFishStock = (id: string, updates: Partial<FishSpeciesStock>) => {
    setFishStocks((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  // Feed
  const addFeedItem = (item: Omit<FeedItem, 'id'>) => {
    const id = `fd-${Date.now()}`;
    const newFeed: FeedItem = { ...item, id };
    setFeedItems((prev) => [...prev, newFeed]);
    logAudit('Add Feed Item', 'Feed', `Cataloged feed ${item.name} (${item.brand})`);
  };

  const updateFeedItem = (id: string, updates: Partial<FeedItem>) => {
    setFeedItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const recordFeeding = (log: Omit<FeedingLog, 'id' | 'cost'>) => {
    const feed = feedItems.find((f) => f.id === log.feedItemId);
    const pond = ponds.find((p) => p.id === log.pondId);
    const costPerKg = feed ? feed.unitCostPerBag / (feed.bagWeightKg || 25) : 85;
    const totalCost = Math.round(log.quantityKg * costPerKg);

    const id = `fdl-${Date.now()}`;
    const newLog: FeedingLog = { ...log, id, cost: totalCost };
    setFeedingLogs((prev) => [newLog, ...prev]);

    // Deduct stock from feed items
    if (feed) {
      const bagsConsumed = log.quantityKg / feed.bagWeightKg;
      const updatedBags = Math.max(0, Number((feed.bagsInStock - bagsConsumed).toFixed(2)));
      updateFeedItem(feed.id, { bagsInStock: updatedBags });
    }

    // Auto-post double-entry journal entry:
    // Dr. Feed Expense (5000) / Cr. Feed Inventory (1300)
    if (settings.autoPostAccountingVouchers) {
      const vNum = `JV-${new Date().getFullYear()}-${String(journalVouchers.length + 1).padStart(4, '0')}`;
      const voucher: JournalVoucher = {
        id: `jv-${Date.now()}`,
        voucherNumber: vNum,
        date: log.date,
        referenceType: 'Feeding',
        referenceId: id,
        description: `Pond feeding: ${log.quantityKg} KG ${feed?.name || 'Feed'} dispensed to ${pond?.name || 'Pond'}`,
        lines: [
          {
            accountCode: '5000',
            accountName: 'Feed Expense',
            debit: totalCost,
            credit: 0,
            narration: `Dr. Feed Expense (${log.quantityKg} KG @ ৳${costPerKg.toFixed(2)}/KG)`,
          },
          {
            accountCode: '1300',
            accountName: 'Feed Inventory',
            debit: 0,
            credit: totalCost,
            narration: 'Cr. Feed Inventory (Consumed)',
          },
        ],
        totalDebit: totalCost,
        totalCredit: totalCost,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.name,
      };
      setJournalVouchers((prev) => [voucher, ...prev]);
    }

    logAudit('Feed Dispensed', 'Feed', `Dispensed ${log.quantityKg} KG feed to ${pond?.name} (Cost: ৳${totalCost})`);
  };

  // Harvest
  const recordHarvest = (rec: Omit<HarvestRecord, 'id'>) => {
    const id = `hrv-${Date.now()}`;
    const newRec: HarvestRecord = { ...rec, id };
    setHarvestRecords((prev) => [newRec, ...prev]);

    // Update fish stock biomass
    const stock = fishStocks.find((s) => s.id === rec.speciesStockId);
    if (stock) {
      const remainingBiomass = Math.max(0, stock.currentEstimatedBiomassKg - rec.harvestedKg);
      updateFishStock(stock.id, {
        currentEstimatedBiomassKg: remainingBiomass,
        status: remainingBiomass <= 50 ? 'Harvested' : 'Growing',
      });
    }

    logAudit('Fish Harvested', 'Harvest', `Harvested ${rec.harvestedKg} KG ${rec.speciesName}`);
  };

  // Accounting Actions
  const addAccount = (acc: Account) => {
    setAccounts((prev) => [...prev, acc]);
    logAudit('Add Account', 'Chart of Accounts', `Created account ${acc.code} - ${acc.name}`);
  };

  const addJournalVoucher = (
    voucherData: Omit<JournalVoucher, 'id' | 'voucherNumber' | 'createdAt' | 'createdBy'>
  ) => {
    const vNum = `JV-${new Date().getFullYear()}-${String(journalVouchers.length + 1).padStart(4, '0')}`;
    const voucher: JournalVoucher = {
      ...voucherData,
      id: `jv-${Date.now()}`,
      voucherNumber: vNum,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };
    setJournalVouchers((prev) => [voucher, ...prev]);
    logAudit('Manual Journal Entry', 'Journal', `Posted voucher ${vNum} (${voucherData.description})`);
  };

  // Sales (Dr. Cash / Bank — Cr. Fish Sales Revenue)
  const recordSale = (saleData: Omit<SalesInvoice, 'id' | 'invoiceNumber' | 'journalVoucherId'>) => {
    const invNum = `INV-${new Date().getFullYear()}-${String(salesInvoices.length + 1).padStart(4, '0')}`;
    const vNum = `JV-${new Date().getFullYear()}-${String(journalVouchers.length + 1).padStart(4, '0')}`;
    const invId = `inv-${Date.now()}`;
    const jvId = `jv-${Date.now()}`;

    // Auto-create journal voucher
    const debitAccount = accounts.find((a) => a.code === saleData.paymentAccountCode) || accounts.find((a) => a.code === '1000') || accounts[0];
    const revenueAccount = accounts.find((a) => a.code === '4000') || accounts.find((a) => a.type === 'Revenue')!;

    const voucher: JournalVoucher = {
      id: jvId,
      voucherNumber: vNum,
      date: saleData.date,
      referenceType: 'Sales',
      referenceId: invId,
      description: `Sale to ${saleData.customerName} (${saleData.quantityKg} KG ${saleData.speciesName})`,
      lines: [
        {
          accountCode: debitAccount.code,
          accountName: debitAccount.name,
          debit: saleData.totalAmount,
          credit: 0,
          narration: `Dr. ${debitAccount.name} (${saleData.paymentMethod} receipt)`,
        },
        {
          accountCode: revenueAccount.code,
          accountName: revenueAccount.name,
          debit: 0,
          credit: saleData.totalAmount,
          narration: `Cr. Fish Sales Revenue (${invNum})`,
        },
      ],
      totalDebit: saleData.totalAmount,
      totalCredit: saleData.totalAmount,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };

    const newInvoice: SalesInvoice = {
      ...saleData,
      id: invId,
      invoiceNumber: invNum,
      journalVoucherId: jvId,
    };

    setSalesInvoices((prev) => [newInvoice, ...prev]);
    if (settings.autoPostAccountingVouchers) {
      setJournalVouchers((prev) => [voucher, ...prev]);
    }
    logAudit('Sales Invoice Created', 'Sales', `Created ${invNum} for ${saleData.customerName} (৳ ${saleData.totalAmount})`);
  };

  // Purchases (Dr. Inventory / Asset — Cr. Cash / Bank / Payable)
  const recordPurchase = (purchaseData: Omit<PurchaseBill, 'id' | 'billNumber' | 'journalVoucherId'>) => {
    const pbNum = `PB-${new Date().getFullYear()}-${String(purchaseBills.length + 1).padStart(4, '0')}`;
    const vNum = `JV-${new Date().getFullYear()}-${String(journalVouchers.length + 1).padStart(4, '0')}`;
    const pbId = `pb-${Date.now()}`;
    const jvId = `jv-${Date.now()}`;

    // Target debit account: Feed Inventory (1300) or Fish Stock (1200) or Equipment (1502)
    let debitCode = '1300';
    let debitName = 'Feed Inventory';
    if (purchaseData.category === 'Fish Fingerlings') {
      debitCode = '1200';
      debitName = 'Fish Inventory';
    } else if (purchaseData.category === 'Equipment & Aeration') {
      debitCode = '1502';
      debitName = 'Aerators & Water Machinery';
    } else if (purchaseData.category === 'Medicines & Lime') {
      debitCode = '5100';
      debitName = 'Farm Expense';
    }

    // Target credit account
    let creditCode = '2000';
    let creditName = 'Accounts Payable';
    if (purchaseData.paymentMethod === 'Cash') {
      creditCode = '1000';
      creditName = 'Cash';
    } else if (purchaseData.paymentMethod === 'Bank') {
      creditCode = '1100';
      creditName = 'Bank';
    }

    const voucher: JournalVoucher = {
      id: jvId,
      voucherNumber: vNum,
      date: purchaseData.date,
      referenceType: 'Purchase',
      referenceId: pbId,
      description: `Purchase of ${purchaseData.itemName} from ${purchaseData.supplierName}`,
      lines: [
        {
          accountCode: debitCode,
          accountName: debitName,
          debit: purchaseData.totalAmount,
          credit: 0,
          narration: `Dr. ${debitName} (${purchaseData.quantity} ${purchaseData.unit})`,
        },
        {
          accountCode: creditCode,
          accountName: creditName,
          debit: 0,
          credit: purchaseData.totalAmount,
          narration: `Cr. ${creditName} (${purchaseData.paymentMethod})`,
        },
      ],
      totalDebit: purchaseData.totalAmount,
      totalCredit: purchaseData.totalAmount,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };

    const newPurchase: PurchaseBill = {
      ...purchaseData,
      id: pbId,
      billNumber: pbNum,
      journalVoucherId: jvId,
    };

    setPurchaseBills((prev) => [newPurchase, ...prev]);
    if (settings.autoPostAccountingVouchers) {
      setJournalVouchers((prev) => [voucher, ...prev]);
    }
    logAudit('Purchase Bill Created', 'Purchases', `Purchased ${purchaseData.itemName} (৳ ${purchaseData.totalAmount})`);
  };

  // Expenses (Dr. Feed / Labor / Power Expense — Cr. Cash / Bank / Payable)
  const recordExpense = (expenseData: Omit<FarmExpense, 'id' | 'voucherNumber' | 'journalVoucherId'>) => {
    const expNum = `EXP-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(4, '0')}`;
    const vNum = `JV-${new Date().getFullYear()}-${String(journalVouchers.length + 1).padStart(4, '0')}`;
    const expId = `exp-${Date.now()}`;
    const jvId = `jv-${Date.now()}`;

    const expAccount = accounts.find((a) => a.code === expenseData.accountCode) || {
      code: '5100',
      name: expenseData.expenseCategory,
    };

    let creditCode = '1000';
    let creditName = 'Cash';
    if (expenseData.paymentMethod === 'Bank') {
      creditCode = '1100';
      creditName = 'Bank';
    } else if (expenseData.paymentMethod === 'Payable') {
      creditCode = '2000';
      creditName = 'Accounts Payable';
    }

    const voucher: JournalVoucher = {
      id: jvId,
      voucherNumber: vNum,
      date: expenseData.date,
      referenceType: 'Expense',
      referenceId: expId,
      description: `${expenseData.expenseCategory}: ${expenseData.description}`,
      lines: [
        {
          accountCode: expAccount.code,
          accountName: expAccount.name,
          debit: expenseData.amount,
          credit: 0,
          narration: `Dr. ${expAccount.name} (${expenseData.paidTo})`,
        },
        {
          accountCode: creditCode,
          accountName: creditName,
          debit: 0,
          credit: expenseData.amount,
          narration: `Cr. ${creditName} (${expenseData.paymentMethod})`,
        },
      ],
      totalDebit: expenseData.amount,
      totalCredit: expenseData.amount,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    };

    const newExpense: FarmExpense = {
      ...expenseData,
      id: expId,
      voucherNumber: expNum,
      journalVoucherId: jvId,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    if (settings.autoPostAccountingVouchers) {
      setJournalVouchers((prev) => [voucher, ...prev]);
    }
    logAudit('Expense Recorded', 'Expenses', `Logged ৳${expenseData.amount} for ${expenseData.expenseCategory}`);
  };

  // Direct Quick Double-Entry Action Triggers (matching user prompt: Dr. Cash/Bank Cr. Fish Sales & Dr. Feed Expense Cr. Cash/Payable)
  const executeQuickDoubleEntry = (
    type: 'fish_sales' | 'feed_expense',
    amount: number,
    channel: 'Cash' | 'Bank' | 'Payable' = 'Cash'
  ) => {
    if (amount <= 0) return;
    if (type === 'fish_sales') {
      const payCode = channel === 'Bank' ? '1100' : '1000';
      recordSale({
        date: new Date().toISOString().split('T')[0],
        customerId: `cust-quick-${Date.now()}`,
        customerName: 'Direct Fishery Arat (Cash Counter)',
        customerPhone: '+880 1711-000000',
        speciesName: 'Live Farm Fish Harvest',
        quantityKg: Math.round(amount / 200),
        ratePerKg: 200,
        discount: 0,
        totalAmount: amount,
        paymentMethod: channel === 'Bank' ? 'Bank' : 'Cash',
        paymentAccountCode: payCode,
        notes: `Quick Double Entry: Dr. ${channel === 'Bank' ? 'Bank (1100)' : 'Cash (1000)'} ৳${amount} / Cr. Fish Sales Revenue (4000) ৳${amount}`,
      });
    } else {
      recordExpense({
        date: new Date().toISOString().split('T')[0],
        expenseCategory: 'Feed Expense',
        amount: amount,
        paymentMethod: channel === 'Payable' ? 'Payable' : channel === 'Bank' ? 'Bank' : 'Cash',
        paidTo: 'Aqua Feed Supplier',
        accountCode: '5000',
        description: `Direct Feed Expense: Dr. Feed Expense ৳${amount} / Cr. ${channel} ৳${amount}`,
      });
    }
  };

  const executeQuickFishSale10k = () => {
    executeQuickDoubleEntry('fish_sales', 10000, 'Cash');
  };

  const executeQuickFeedPurchase5k = () => {
    executeQuickDoubleEntry('feed_expense', 5000, 'Cash');
  };

  // Database Backup & Restore
  const exportDatabaseJson = (): string => {
    const data = {
      exportVersion: '2.0',
      exportDate: new Date().toISOString(),
      exportedBy: currentUser.username,
      companies,
      users,
      ponds,
      fishStocks,
      feedItems,
      feedingLogs,
      harvestRecords,
      salesInvoices,
      purchaseBills,
      expenses,
      accounts,
      journalVouchers,
      auditLogs,
      settings,
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.companies) setCompanies(parsed.companies);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.ponds) setPonds(parsed.ponds);
      if (parsed.fishStocks) setFishStocks(parsed.fishStocks);
      if (parsed.feedItems) setFeedItems(parsed.feedItems);
      if (parsed.feedingLogs) setFeedingLogs(parsed.feedingLogs);
      if (parsed.harvestRecords) setHarvestRecords(parsed.harvestRecords);
      if (parsed.salesInvoices) setSalesInvoices(parsed.salesInvoices);
      if (parsed.purchaseBills) setPurchaseBills(parsed.purchaseBills);
      if (parsed.expenses) setExpenses(parsed.expenses);
      if (parsed.accounts) setAccounts(parsed.accounts);
      if (parsed.journalVouchers) setJournalVouchers(parsed.journalVouchers);
      if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      if (parsed.settings) setSettings(parsed.settings);
      logAudit('Database Restored', 'Database Backup', 'Imported backup JSON file successfully');
      return true;
    } catch (e) {
      console.error('Failed to import database JSON:', e);
      return false;
    }
  };

  const loadDemoData = () => {
    setCompanies(initialCompanies);
    setUsers(initialUsers);
    setPonds(initialPonds);
    setFishStocks(initialFishStocks);
    setFeedItems(initialFeedItems);
    setFeedingLogs(initialFeedingLogs);
    setHarvestRecords(initialHarvestRecords);
    setSalesInvoices(initialSalesInvoices);
    setPurchaseBills(initialPurchaseBills);
    setExpenses(initialExpenses);
    setAccounts(initialAccounts);
    setJournalVouchers(initialJournalVouchers);
    setAuditLogs(initialAuditLogs);
    setSettings(initialSettings);
    logAudit('Demo Loaded', 'Database Backup', 'Reset system to rich aquaculture demonstration data');
  };

  // Fresh System with 0 balances (as highlighted in prototype)
  const resetToFreshSystem = () => {
    setPonds([]);
    setFishStocks([]);
    setFeedItems([]);
    setFeedingLogs([]);
    setHarvestRecords([]);
    setSalesInvoices([]);
    setPurchaseBills([]);
    setExpenses([]);
    setJournalVouchers([]); // 0 Opening balance
    logAudit('System Reset', 'Database Backup', 'Reset database to fresh system with 0 balances');
  };

  return (
    <ERPContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        currentUser,
        setCurrentUser,
        currentCompany,
        setCurrentCompany,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        settings,
        updateSettings,
        companies,
        users,
        auditLogs,
        addCompany,
        addUser,
        updateUser,
        deleteUser,
        ponds,
        fishStocks,
        feedItems,
        feedingLogs,
        harvestRecords,
        salesInvoices,
        purchaseBills,
        expenses,
        addPond,
        updatePond,
        deletePond,
        addFishStock,
        updateFishStock,
        addFeedItem,
        updateFeedItem,
        recordFeeding,
        recordHarvest,
        accounts,
        journalVouchers,
        addAccount,
        addJournalVoucher,
        recordSale,
        recordPurchase,
        recordExpense,
        executeQuickDoubleEntry,
        executeQuickFishSale10k,
        executeQuickFeedPurchase5k,
        exportDatabaseJson,
        importDatabaseJson,
        loadDemoData,
        resetToFreshSystem,
        logAudit,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = (): ERPContextType => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
