import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { generateProfitLoss } from '../../../utils/accountingEngine';
import { formatCurrency } from '../../../utils/formatters';
import { PieChart, Printer, TrendingUp, TrendingDown } from 'lucide-react';

export const ProfitLossView: React.FC = () => {
  const { accounts, journalVouchers, settings, language, currentCompany } = useERP();

  const pnl = generateProfitLoss(accounts, journalVouchers);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'লাভ ও ক্ষতি হিসাব বিবরণী (Profit & Loss)' : 'Profit & Loss Statement (Income Statement)'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'রাজস্ব আয়, প্রত্যক্ষ খাদ্য খরচ (COGS), খামার পরিচালন ব্যয় এবং নিট মুনাফা'
              : 'Operating revenue minus direct feeding costs (COGS) and operational overhead'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Printer className="w-3.5 h-3.5" />
          Print Statement
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Total Revenue</span>
          <p className="text-2xl font-bold text-slate-900 font-mono mt-1">
            {formatCurrency(pnl.totalRevenue, settings.currencySymbol)}
          </p>
          <span className="text-[11px] text-emerald-700 block mt-1">100% of Sales</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Gross Operating Profit</span>
          <p className="text-2xl font-bold text-emerald-800 font-mono mt-1">
            {formatCurrency(pnl.grossProfit, settings.currencySymbol)}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">
            Margin: {pnl.totalRevenue > 0 ? ((pnl.grossProfit / pnl.totalRevenue) * 100).toFixed(1) : 0}%
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 uppercase font-semibold">Net Operating Income</span>
          <p
            className={`text-2xl font-bold font-mono mt-1 ${
              pnl.netProfit >= 0 ? 'text-emerald-800' : 'text-rose-800'
            }`}
          >
            {formatCurrency(pnl.netProfit, settings.currencySymbol)}
          </p>
          <span className="text-[11px] text-slate-500 block mt-1">
            Net Margin: {pnl.totalRevenue > 0 ? ((pnl.netProfit / pnl.totalRevenue) * 100).toFixed(1) : 0}%
          </span>
        </div>
      </div>

      {/* Structured Income Statement */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-center">
          <h2 className="text-base font-bold text-slate-900">{currentCompany.name}</h2>
          <p className="text-xs text-slate-500">
            Statement of Profit & Loss for Fiscal Period Ending {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>

        <div className="p-6 space-y-6 text-xs font-mono">
          {/* Section 1: Revenue */}
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-sans font-bold text-slate-900 text-sm">
              <span>Operating Revenue (Fish Sales & Fingerlings)</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-slate-100 py-1">
              {pnl.operatingRevenue.length === 0 ? (
                <div className="py-2 text-slate-400 font-sans">No sales revenue recorded in period.</div>
              ) : (
                pnl.operatingRevenue.map((item) => (
                  <div key={item.code} className="py-2 flex justify-between text-slate-700">
                    <span className="font-sans pl-4">
                      {item.code} - {item.name}
                    </span>
                    <span className="font-bold tabular-nums">
                      {formatCurrency(item.amount, settings.currencySymbol)}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
              <span className="font-sans">Total Operating Revenue (A):</span>
              <span className="text-emerald-800 tabular-nums">
                {formatCurrency(pnl.totalRevenue, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Section 2: Cost of Goods Sold */}
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-sans font-bold text-slate-900 text-sm">
              <span>Cost of Goods Sold (Feed & Biological Seed)</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-slate-100 py-1">
              {pnl.costOfGoodsSold.length === 0 ? (
                <div className="py-2 text-slate-400 font-sans">No direct aquaculture feed/fingerling costs.</div>
              ) : (
                pnl.costOfGoodsSold.map((item) => (
                  <div key={item.code} className="py-2 flex justify-between text-slate-700">
                    <span className="font-sans pl-4">
                      {item.code} - {item.name}
                    </span>
                    <span className="tabular-nums">
                      {formatCurrency(item.amount, settings.currencySymbol)}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
              <span className="font-sans">Total Cost of Goods Sold (B):</span>
              <span className="text-rose-800 tabular-nums">
                {formatCurrency(pnl.totalCOGS, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Gross Profit Subtotal */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between font-bold text-slate-900 text-sm">
            <span className="font-sans">Gross Operating Profit (A - B):</span>
            <span className="text-emerald-800 tabular-nums">
              {formatCurrency(pnl.grossProfit, settings.currencySymbol)}
            </span>
          </div>

          {/* Section 3: Operating Expenses */}
          <div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 font-sans font-bold text-slate-900 text-sm">
              <span>Farm Operating Overhead & Expenses</span>
              <span>Amount</span>
            </div>
            <div className="divide-y divide-slate-100 py-1">
              {pnl.operatingExpenses.length === 0 ? (
                <div className="py-2 text-slate-400 font-sans">No operating expenses recorded.</div>
              ) : (
                pnl.operatingExpenses.map((item) => (
                  <div key={item.code} className="py-2 flex justify-between text-slate-700">
                    <span className="font-sans pl-4">
                      {item.code} - {item.name}
                    </span>
                    <span className="tabular-nums">
                      {formatCurrency(item.amount, settings.currencySymbol)}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
              <span className="font-sans">Total Operating Expenses (C):</span>
              <span className="text-rose-800 tabular-nums">
                {formatCurrency(pnl.totalOperatingExpenses, settings.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Net Profit Final Total */}
          <div className="p-4 bg-teal-50 border-2 border-teal-600 rounded-lg flex justify-between items-center font-bold text-base">
            <div>
              <span className="font-sans block text-teal-950">Net Profit / Net Income (A - B - C)</span>
              <span className="text-xs text-teal-800 font-normal font-sans">
                Transferred directly to Owner's Equity on Balance Sheet
              </span>
            </div>
            <span
              className={`text-xl border-b-4 border-double border-teal-800 tabular-nums ${
                pnl.netProfit >= 0 ? 'text-teal-900' : 'text-rose-800'
              }`}
            >
              {formatCurrency(pnl.netProfit, settings.currencySymbol)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
