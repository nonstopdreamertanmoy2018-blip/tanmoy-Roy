import React from 'react';
import { useERP } from '../../context/ERPContext';
import { t } from '../../utils/translations';
import { formatCurrency, formatNumber, formatDate } from '../../utils/formatters';
import { generateProfitLoss, generateBalanceSheet, getAccountBalance } from '../../utils/accountingEngine';
import { Pond3DVisualizer } from '../pond3d/Pond3DVisualizer';
import {
  Waves,
  Fish,
  TrendingUp,
  Scale,
  Coins,
  Landmark,
  Wheat,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    ponds,
    fishStocks,
    feedItems,
    salesInvoices,
    accounts,
    journalVouchers,
    settings,
    language,
    setActiveTab,
  } = useERP();

  // Accounting calculations
  const pnl = generateProfitLoss(accounts, journalVouchers);
  const bs = generateBalanceSheet(accounts, journalVouchers);

  // Cash in Hand (1000 or 1001) & Bank Accounts (1100 or 1002, 1003)
  const cashAcc = accounts.find((a) => a.code === '1000' || a.code === '1001');
  const bankAcc1 = accounts.find((a) => a.code === '1100' || a.code === '1002');
  const bankAcc2 = accounts.find((a) => a.code === '1003');

  const cashInHand = cashAcc ? getAccountBalance(cashAcc, journalVouchers) : 0;
  const bankBalances =
    (bankAcc1 ? getAccountBalance(bankAcc1, journalVouchers) : 0) +
    (bankAcc2 ? getAccountBalance(bankAcc2, journalVouchers) : 0);

  // Total biomass
  const totalBiomassKg = fishStocks.reduce((sum, s) => sum + s.currentEstimatedBiomassKg, 0);

  // Total feed bags in stock
  const totalFeedBags = feedItems.reduce((sum, f) => sum + f.bagsInStock, 0);

  // Low feed alert items
  const lowFeedItems = feedItems.filter((f) => f.bagsInStock <= f.reorderLevelBags);

  // Recent 5 Journal entries
  const recentVouchers = journalVouchers.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Editorial Farm Header Banner */}
      <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 text-white p-6 shadow-sm">
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity">
          <img
            src="/src/assets/images/farm_aerial_ponds_1791092720748.jpg"
            alt="Aquaculture Farm Ponds"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              {language === 'bn' ? 'বাণিজ্যিক মৎস্য খামার ইআরপি' : 'Commercial Aquaculture Operating System'}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {language === 'bn' ? 'খামার ও হিসাব পরিচালনা কেন্দ্র' : 'Pond Operations & Financial Control'}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
              {language === 'bn'
                ? 'ডাবল এন্ট্রি সাধারণ জাবেদা, পুকুরের পানির মান, মাছের জৈবভর ও খাদ্য রূপান্তর হার (FCR) পর্যবেক্ষণ।'
                : 'Integrated double-entry general ledger, water quality telemetries, fish biomass growth, and feeding FCR analytics.'}
            </p>
          </div>

          {/* Double Entry Rule Badge */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 p-3 rounded-lg text-xs font-mono">
            <span className="text-teal-400 font-bold block mb-1">DOUBLE ENTRY PROTOCOL</span>
            <div className="text-slate-300 space-y-0.5">
              <div>Dr. Cash / Bank — Cr. Fish Sales Revenue</div>
              <div>Dr. Feed Expense — Cr. Cash / Payable</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Ponds */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t.totalPonds[language]}
            </span>
            <Waves className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {ponds.length}
            </span>
            <span className="text-xs text-slate-500">
              ({ponds.reduce((sum, p) => sum + p.areaDecimal, 0)} dec)
            </span>
          </div>
          <span className="text-[11px] text-teal-700 mt-1 block">
            {ponds.filter((p) => p.aeratorRunning).length} aerators active
          </span>
        </div>

        {/* Card 2: Fish Stock Biomass */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t.totalFishStock[language]}
            </span>
            <Fish className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatNumber(totalBiomassKg)}
            </span>
            <span className="text-xs text-slate-500">KG</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {fishStocks.length} live species batches
          </span>
        </div>

        {/* Card 3: Total Sales */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t.totalSales[language]}
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCurrency(pnl.totalRevenue, settings.currencySymbol)}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block">
            {salesInvoices.length} billed invoices
          </span>
        </div>

        {/* Card 4: Net Profit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {t.netProfit[language]}
            </span>
            <Scale className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <span
              className={`text-2xl font-bold font-mono tabular-nums ${
                pnl.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}
            >
              {formatCurrency(pnl.netProfit, settings.currencySymbol)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Gross: {formatCurrency(pnl.grossProfit, settings.currencySymbol)}
          </span>
        </div>
      </div>

      {/* Secondary Financial Liquidity Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cash In Hand */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">{t.cashInHand[language]}</span>
              <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(cashInHand, settings.currencySymbol)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('cash-book')}
            className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-0.5"
          >
            {language === 'bn' ? 'বই দেখুন' : 'Cash Book'}
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Bank Balances */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">{t.bankBalance[language]}</span>
              <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(bankBalances, settings.currencySymbol)}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('bank-book')}
            className="text-xs text-teal-700 hover:text-teal-900 font-medium flex items-center gap-0.5"
          >
            {language === 'bn' ? 'ব্যাংক হিসাব' : 'Bank Book'}
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Total Assets & Accounting Equation Status */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">{t.totalAssets[language]}</span>
              <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                {formatCurrency(bs.totalAssets, settings.currencySymbol)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              A = L + E Balanced
            </span>
          </div>
        </div>
      </div>

      {/* 3D Pond Visualizer Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {t.viewPond3D[language]}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'সরাসরি পুকুরের পানির গভীরতা, মাছের সাঁতার এবং খাদ্য ছিটানোর 3D সিমুলেশন'
                : 'Real-time 3D simulation with water surface caustics, fish schooling physics, and pellet feeding'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ponds')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            {language === 'bn' ? 'সকল পুকুর দেখুন' : 'Manage All Ponds'}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* WebGL 3D Canvas */}
        <Pond3DVisualizer />
      </div>

      {/* Two Column Grid: Recent Journal Vouchers & Feed Stock Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Double-Entry Journal Vouchers */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'bn' ? 'সাম্প্রতিক জাবেদা ভাউচার (Double-Entry Ledger)' : 'Recent Journal Entries (Dr / Cr)'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'স্বয়ংক্রিয়ভাবে প্রস্তুতকৃত হিসাব বই' : 'Automatically synchronized balanced vouchers'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('journal')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              {language === 'bn' ? 'সকল জাবেদা' : 'View All'}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentVouchers.map((v) => (
              <div key={v.id} className="p-3 text-xs hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-teal-800">{v.voucherNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{formatDate(v.date)}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-700 font-medium truncate max-w-xs">{v.description}</span>
                  </div>
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    {formatCurrency(v.totalDebit, settings.currencySymbol)}
                  </div>
                </div>

                {/* Sub-lines showing Dr. and Cr. */}
                <div className="pl-3 border-l-2 border-slate-200 space-y-0.5 text-[11px] text-slate-600 font-mono">
                  {v.lines.map((line, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span>
                        {line.debit > 0 ? (
                          <strong className="text-emerald-700">Dr. {line.accountName}</strong>
                        ) : (
                          <span className="text-indigo-700 pl-4">Cr. {line.accountName}</span>
                        )}
                      </span>
                      <span className="tabular-nums">
                        {line.debit > 0
                          ? formatCurrency(line.debit, settings.currencySymbol)
                          : formatCurrency(line.credit, settings.currencySymbol)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Feed Inventory & Reorder Health */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Wheat className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'bn' ? 'খাবার স্টক স্থিতি' : 'Feed Stock Status'}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('feed')}
              className="text-xs text-teal-700 hover:text-teal-900 font-medium"
            >
              {language === 'bn' ? 'মজুদ দেখুন' : 'Feed Log'}
            </button>
          </div>

          {lowFeedItems.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Reorder Alert:</strong> {lowFeedItems.length} feed item(s) are below safety buffer!
              </div>
            </div>
          )}

          <div className="space-y-3">
            {feedItems.map((feed) => (
              <div key={feed.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-800">{feed.name}</span>
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {feed.bagsInStock} Bags
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      feed.bagsInStock <= feed.reorderLevelBags ? 'bg-amber-500' : 'bg-teal-600'
                    }`}
                    style={{ width: `${Math.min(100, (feed.bagsInStock / 100) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{feed.brand} · {feed.proteinPercent}% CP</span>
                  <span>{formatCurrency(feed.unitCostPerBag, settings.currencySymbol)}/bag</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">{t.feedStock[language]}</span>
            <span className="font-mono font-bold text-slate-900">{totalFeedBags} Bags total</span>
          </div>
        </div>
      </div>
    </div>
  );
};
