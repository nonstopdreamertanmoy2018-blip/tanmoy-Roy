import { Account, JournalVoucher, AccountType } from '../types/erp';

export interface LedgerEntry {
  date: string;
  voucherNumber: string;
  referenceType: string;
  narration: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface TrialBalanceItem {
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debitBalance: number;
  creditBalance: number;
}

export interface ProfitLossStatement {
  operatingRevenue: { code: string; name: string; amount: number }[];
  totalRevenue: number;
  costOfGoodsSold: { code: string; name: string; amount: number }[];
  totalCOGS: number;
  grossProfit: number;
  operatingExpenses: { code: string; name: string; amount: number }[];
  totalOperatingExpenses: number;
  netProfit: number;
}

export interface BalanceSheetStatement {
  currentAssets: { code: string; name: string; amount: number }[];
  totalCurrentAssets: number;
  nonCurrentAssets: { code: string; name: string; amount: number }[];
  totalNonCurrentAssets: number;
  totalAssets: number;

  currentLiabilities: { code: string; name: string; amount: number }[];
  totalCurrentLiabilities: number;
  nonCurrentLiabilities: { code: string; name: string; amount: number }[];
  totalNonCurrentLiabilities: number;
  totalLiabilities: number;

  equityItems: { code: string; name: string; amount: number }[];
  retainedEarnings: number; // Current period Net Profit from P&L
  totalEquity: number;

  totalLiabilitiesAndEquity: number;
  isBalanced: boolean;
  variance: number;
}

// Compute account balance based on normal balance convention
export function getAccountBalance(
  account: Account,
  vouchers: JournalVoucher[]
): number {
  let totalDebit = 0;
  let totalCredit = 0;

  for (const v of vouchers) {
    for (const line of v.lines) {
      if (line.accountCode === account.code) {
        totalDebit += Number(line.debit || 0);
        totalCredit += Number(line.credit || 0);
      }
    }
  }

  if (account.normalBalance === 'Debit') {
    return totalDebit - totalCredit;
  } else {
    return totalCredit - totalDebit;
  }
}

// Generate General Ledger for an account
export function generateLedger(
  account: Account,
  vouchers: JournalVoucher[]
): LedgerEntry[] {
  const sorted = [...vouchers].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const entries: LedgerEntry[] = [];
  let runningBalance = 0;

  for (const v of sorted) {
    for (const line of v.lines) {
      if (line.accountCode === account.code) {
        const debit = Number(line.debit || 0);
        const credit = Number(line.credit || 0);

        if (account.normalBalance === 'Debit') {
          runningBalance += debit - credit;
        } else {
          runningBalance += credit - debit;
        }

        entries.push({
          date: v.date,
          voucherNumber: v.voucherNumber,
          referenceType: v.referenceType,
          narration: line.narration || v.description,
          debit,
          credit,
          balance: runningBalance,
        });
      }
    }
  }

  return entries;
}

// Generate Trial Balance
export function generateTrialBalance(
  accounts: Account[],
  vouchers: JournalVoucher[]
): {
  items: TrialBalanceItem[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  difference: number;
} {
  const items: TrialBalanceItem[] = [];
  let totalDebit = 0;
  let totalCredit = 0;

  for (const acc of accounts) {
    let rawDebit = 0;
    let rawCredit = 0;

    for (const v of vouchers) {
      for (const line of v.lines) {
        if (line.accountCode === acc.code) {
          rawDebit += Number(line.debit || 0);
          rawCredit += Number(line.credit || 0);
        }
      }
    }

    const net = rawDebit - rawCredit;
    let debitBalance = 0;
    let creditBalance = 0;

    if (acc.normalBalance === 'Debit') {
      if (net >= 0) {
        debitBalance = net;
      } else {
        creditBalance = Math.abs(net);
      }
    } else {
      if (net <= 0) {
        creditBalance = Math.abs(net);
      } else {
        debitBalance = net;
      }
    }

    if (debitBalance > 0 || creditBalance > 0) {
      items.push({
        accountCode: acc.code,
        accountName: acc.name,
        accountType: acc.type,
        debitBalance,
        creditBalance,
      });

      totalDebit += debitBalance;
      totalCredit += creditBalance;
    }
  }

  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference < 0.01;

  return {
    items,
    totalDebit,
    totalCredit,
    isBalanced,
    difference,
  };
}

// Generate Profit & Loss Statement
export function generateProfitLoss(
  accounts: Account[],
  vouchers: JournalVoucher[]
): ProfitLossStatement {
  const operatingRevenue: { code: string; name: string; amount: number }[] = [];
  const costOfGoodsSold: { code: string; name: string; amount: number }[] = [];
  const operatingExpenses: { code: string; name: string; amount: number }[] = [];

  for (const acc of accounts) {
    const balance = getAccountBalance(acc, vouchers);
    if (balance === 0) continue;

    if (acc.type === 'Revenue') {
      operatingRevenue.push({
        code: acc.code,
        name: acc.name,
        amount: balance,
      });
    } else if (acc.type === 'Expense') {
      // Direct aquaculture expenses (Feed, Seed/Fingerlings) are COGS
      if (acc.code === '5000' || acc.code === '5001' || acc.code === '5002') {
        costOfGoodsSold.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
        });
      } else {
        operatingExpenses.push({
          code: acc.code,
          name: acc.name,
          amount: balance,
        });
      }
    }
  }

  const totalRevenue = operatingRevenue.reduce((sum, item) => sum + item.amount, 0);
  const totalCOGS = costOfGoodsSold.reduce((sum, item) => sum + item.amount, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const totalOperatingExpenses = operatingExpenses.reduce((sum, item) => sum + item.amount, 0);
  const netProfit = grossProfit - totalOperatingExpenses;

  return {
    operatingRevenue,
    totalRevenue,
    costOfGoodsSold,
    totalCOGS,
    grossProfit,
    operatingExpenses,
    totalOperatingExpenses,
    netProfit,
  };
}

// Generate Balance Sheet Statement
export function generateBalanceSheet(
  accounts: Account[],
  vouchers: JournalVoucher[]
): BalanceSheetStatement {
  const pnl = generateProfitLoss(accounts, vouchers);

  const currentAssets: { code: string; name: string; amount: number }[] = [];
  const nonCurrentAssets: { code: string; name: string; amount: number }[] = [];
  const currentLiabilities: { code: string; name: string; amount: number }[] = [];
  const nonCurrentLiabilities: { code: string; name: string; amount: number }[] = [];
  const equityItems: { code: string; name: string; amount: number }[] = [];

  for (const acc of accounts) {
    const balance = getAccountBalance(acc, vouchers);
    if (balance === 0) continue;

    if (acc.type === 'Asset') {
      // Current assets: Cash, Bank, Receivables, Fish inventory, Feed inventory
      if (['1000', '1100', '1200', '1300', '1001', '1002', '1003', '1010', '1011', '1020'].includes(acc.code)) {
        currentAssets.push({ code: acc.code, name: acc.name, amount: balance });
      } else {
        nonCurrentAssets.push({ code: acc.code, name: acc.name, amount: balance });
      }
    } else if (acc.type === 'Liability') {
      if (acc.code.startsWith('21')) {
        nonCurrentLiabilities.push({ code: acc.code, name: acc.name, amount: balance });
      } else {
        currentLiabilities.push({ code: acc.code, name: acc.name, amount: balance });
      }
    } else if (acc.type === 'Equity') {
      equityItems.push({ code: acc.code, name: acc.name, amount: balance });
    }
  }

  const totalCurrentAssets = currentAssets.reduce((s, i) => s + i.amount, 0);
  const totalNonCurrentAssets = nonCurrentAssets.reduce((s, i) => s + i.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = currentLiabilities.reduce((s, i) => s + i.amount, 0);
  const totalNonCurrentLiabilities = nonCurrentLiabilities.reduce((s, i) => s + i.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  const retainedEarnings = pnl.netProfit;
  const baseEquity = equityItems.reduce((s, i) => s + i.amount, 0);
  const totalEquity = baseEquity + retainedEarnings;

  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  const variance = Math.abs(totalAssets - totalLiabilitiesAndEquity);
  const isBalanced = variance < 0.02;

  return {
    currentAssets,
    totalCurrentAssets,
    nonCurrentAssets,
    totalNonCurrentAssets,
    totalAssets,

    currentLiabilities,
    totalCurrentLiabilities,
    nonCurrentLiabilities,
    totalNonCurrentLiabilities,
    totalLiabilities,

    equityItems,
    retainedEarnings,
    totalEquity,

    totalLiabilitiesAndEquity,
    isBalanced,
    variance,
  };
}
