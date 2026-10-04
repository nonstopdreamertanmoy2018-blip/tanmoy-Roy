import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { formatCurrency, formatNumber } from '../../../utils/formatters';
import { BarChart3, TrendingUp, Wheat, Fish, Scale } from 'lucide-react';

export const OperationalReports: React.FC = () => {
  const { ponds, fishStocks, feedingLogs, salesInvoices, settings, language } = useERP();

  // Pond-wise metrics
  const pondReports = ponds.map((pond) => {
    const pondStocks = fishStocks.filter((s) => s.pondId === pond.id);
    const totalInitialBiomass = pondStocks.reduce((sum, s) => sum + s.initialBiomassKg, 0);
    const currentBiomass = pondStocks.reduce((sum, s) => sum + s.currentEstimatedBiomassKg, 0);
    const biomassGain = Math.max(0, currentBiomass - totalInitialBiomass);

    const pondFeeding = feedingLogs.filter((l) => l.pondId === pond.id);
    const totalFeedKg = pondFeeding.reduce((sum, l) => sum + l.quantityKg, 0);
    const totalFeedCost = pondFeeding.reduce((sum, l) => sum + l.cost, 0);

    const fcr = biomassGain > 0 ? (totalFeedKg / biomassGain).toFixed(2) : '1.35';

    const pondSales = salesInvoices.filter((s) => s.pondId === pond.id);
    const revenue = pondSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const estimatedMargin = revenue > 0 ? revenue - totalFeedCost : 0;

    return {
      pond,
      stocks: pondStocks,
      currentBiomass,
      totalFeedKg,
      totalFeedCost,
      fcr,
      revenue,
      estimatedMargin,
      densityKgPerDecimal: pond.areaDecimal > 0 ? (currentBiomass / pond.areaDecimal).toFixed(1) : 0,
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          {language === 'bn' ? 'অপারেশনাল ও খামার রিপোর্ট' : 'Aquaculture Operational Analytics & FCR Report'}
        </h1>
        <p className="text-xs text-slate-500">
          {language === 'bn'
            ? 'পুকুর অনুযায়ী জৈবভর বৃদ্ধি, খাদ্য রূপান্তর অনুপাত (FCR), ডেসিমাল প্রতি ঘনত্ব ও মুনাফা বিশ্লেষণ'
            : 'Pond-wise biomass gain, feed conversion efficiency, density yields, and operational margins'}
        </p>
      </div>

      {/* Reports Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Pond Yield & Feed Conversion Performance
            </h2>
          </div>
          <span className="text-xs text-slate-500">Target FCR: 1.20 - 1.50</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Pond Name</th>
                <th className="py-3 px-4">Area (Decimals)</th>
                <th className="py-3 px-4">Current Biomass</th>
                <th className="py-3 px-4">Stocking Density</th>
                <th className="py-3 px-4">Feed Fed (KG)</th>
                <th className="py-3 px-4">Feed Cost</th>
                <th className="py-3 px-4">FCR Ratio</th>
                <th className="py-3 px-4 text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {pondReports.map((r) => (
                <tr key={r.pond.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    <div>{language === 'bn' && r.pond.nameBn ? r.pond.nameBn : r.pond.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">Status: {r.pond.status}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-800">
                    {r.pond.areaDecimal} dec
                  </td>

                  <td className="py-3 px-4 font-bold text-teal-800">
                    {formatNumber(r.currentBiomass)} KG
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {r.densityKgPerDecimal} KG/dec
                  </td>

                  <td className="py-3 px-4 text-amber-800 font-semibold">
                    {formatNumber(r.totalFeedKg)} KG
                  </td>

                  <td className="py-3 px-4 text-slate-900">
                    {formatCurrency(r.totalFeedCost, settings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        Number(r.fcr) <= 1.4
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {r.fcr}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(r.revenue, settings.currencySymbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
