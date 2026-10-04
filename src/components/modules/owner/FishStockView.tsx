import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { FishSpeciesStock } from '../../../types/erp';
import { formatNumber, formatCurrency, formatDate } from '../../../utils/formatters';
import { Plus, Fish, Activity, AlertCircle, TrendingUp } from 'lucide-react';

export const FishStockView: React.FC = () => {
  const { fishStocks, ponds, addFishStock, updateFishStock, settings, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [mortalityModalStock, setMortalityModalStock] = useState<FishSpeciesStock | null>(null);
  const [mortalityCount, setMortalityCount] = useState('');

  const [pondId, setPondId] = useState(ponds[0]?.id || '');
  const [speciesName, setSpeciesName] = useState('Rohu (Labeo rohita)');
  const [speciesNameBn, setSpeciesNameBn] = useState('রুই মাছ');
  const [stockingDate, setStockingDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialQuantityCount, setInitialQuantityCount] = useState('10000');
  const [initialBiomassKg, setInitialBiomassKg] = useState('500');
  const [averageWeightGrams, setAverageWeightGrams] = useState('50');
  const [unitCostPerFingerling, setUnitCostPerFingerling] = useState('4.5');

  const totalBiomass = fishStocks.reduce((sum, s) => sum + s.currentEstimatedBiomassKg, 0);
  const totalStockCount = fishStocks.reduce((sum, s) => sum + s.initialQuantityCount - s.mortalityCount, 0);

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(initialQuantityCount) || 1000;
    const unitCost = Number(unitCostPerFingerling) || 3.0;
    const initialBio = Number(initialBiomassKg) || 100;
    const avgWeight = Number(averageWeightGrams) || 50;

    addFishStock({
      pondId,
      speciesName,
      speciesNameBn: speciesNameBn || speciesName,
      stockingDate,
      initialQuantityCount: count,
      initialBiomassKg: initialBio,
      currentEstimatedBiomassKg: initialBio,
      averageWeightGrams: avgWeight,
      unitCostPerFingerling: unitCost,
      totalCost: count * unitCost,
      mortalityCount: 0,
      status: 'Growing',
    });

    setShowAddModal(false);
  };

  const handleRecordMortality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mortalityModalStock) return;
    const dead = Number(mortalityCount) || 0;
    const newDead = mortalityModalStock.mortalityCount + dead;
    const weightLossKg = (dead * mortalityModalStock.averageWeightGrams) / 1000;
    const newBiomass = Math.max(0, mortalityModalStock.currentEstimatedBiomassKg - weightLossKg);

    updateFishStock(mortalityModalStock.id, {
      mortalityCount: newDead,
      currentEstimatedBiomassKg: Math.round(newBiomass),
    });

    setMortalityModalStock(null);
    setMortalityCount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'মাছের মজুদ ও প্রজাতি বৃদ্ধি' : 'Fish Stock Inventory & Growth Tracking'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'পুকুর অনুযায়ী মাছের সংখ্যা, আনুমানিক জৈবভর (KG), গড় ওজন ও মড়ক লগ'
              : 'Fingerling stocking batches, estimated living biomass, average body weight, and mortality'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন পোনা স্টক করুন' : 'Stock Fingerlings'}
        </button>
      </div>

      {/* Stock KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Living Biomass
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatNumber(totalBiomass)}
            </span>
            <span className="text-xs text-slate-500">KG</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Fish Population
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-teal-800 font-mono tabular-nums">
              {formatNumber(totalStockCount)}
            </span>
            <span className="text-xs text-slate-500">Pieces</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Active Batches
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {fishStocks.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Fingerling Cost Invested
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCurrency(
                fishStocks.reduce((sum, s) => sum + s.totalCost, 0),
                settings.currencySymbol
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Fish Stocks Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Species</th>
                <th className="py-3 px-4">Pond Location</th>
                <th className="py-3 px-4">Stocked Date</th>
                <th className="py-3 px-4">Est. Biomass</th>
                <th className="py-3 px-4">Avg Weight</th>
                <th className="py-3 px-4">Mortality Count</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {fishStocks.map((stock) => {
                const pond = ponds.find((p) => p.id === stock.pondId);
                const survivalRate = (
                  ((stock.initialQuantityCount - stock.mortalityCount) / stock.initialQuantityCount) *
                  100
                ).toFixed(1);

                return (
                  <tr key={stock.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">
                      <div>{language === 'bn' && stock.speciesNameBn ? stock.speciesNameBn : stock.speciesName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatNumber(stock.initialQuantityCount)} pcs stocked @ {formatCurrency(stock.unitCostPerFingerling, settings.currencySymbol)}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans text-slate-800">
                      {pond?.name || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(stock.stockingDate)}
                    </td>

                    <td className="py-3 px-4 font-bold text-teal-800 text-sm">
                      {formatNumber(stock.currentEstimatedBiomassKg)} KG
                    </td>

                    <td className="py-3 px-4 text-slate-800">
                      {stock.averageWeightGrams} g
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <span className="text-rose-700 font-semibold">{stock.mortalityCount} pcs</span>
                      <span className="text-[10px] text-slate-400 ml-1">({survivalRate}% survival)</span>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                          stock.status === 'Growing'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-teal-50 text-teal-700'
                        }`}
                      >
                        {stock.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => setMortalityModalStock(stock)}
                        className="px-2 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50 rounded border border-rose-200 transition-colors"
                      >
                        Log Mortality
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Fingerlings Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Stock New Fish Fingerlings Batch
            </h2>
            <form onSubmit={handleAddStock} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Pond*</label>
                <select
                  value={pondId}
                  onChange={(e) => setPondId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                >
                  {ponds.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.areaDecimal} dec)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Species Name (English)*</label>
                  <input
                    type="text"
                    required
                    value={speciesName}
                    onChange={(e) => setSpeciesName(e.target.value)}
                    placeholder="e.g. Rohu (Labeo rohita)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Species Name (বাংলা)</label>
                  <input
                    type="text"
                    value={speciesNameBn}
                    onChange={(e) => setSpeciesNameBn(e.target.value)}
                    placeholder="রুই মাছ"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Fingerling Count*</label>
                  <input
                    type="number"
                    required
                    value={initialQuantityCount}
                    onChange={(e) => setInitialQuantityCount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Initial Biomass (KG)*</label>
                  <input
                    type="number"
                    required
                    value={initialBiomassKg}
                    onChange={(e) => setInitialBiomassKg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Average Weight (Grams)*</label>
                  <input
                    type="number"
                    value={averageWeightGrams}
                    onChange={(e) => setAverageWeightGrams(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Unit Cost per Fingerling (৳)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={unitCostPerFingerling}
                    onChange={(e) => setUnitCostPerFingerling(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Stocking Date</label>
                <input
                  type="date"
                  value={stockingDate}
                  onChange={(e) => setStockingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800"
                >
                  Save Fish Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Mortality Modal */}
      {mortalityModalStock && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-rose-200 text-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Log Mortality for {mortalityModalStock.speciesName}
            </h3>
            <p className="text-slate-500 text-[11px]">
              Recording mortality reduces active population count and estimated biomass.
            </p>
            <form onSubmit={handleRecordMortality} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dead Fish Count (Pieces)*</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={mortalityCount}
                  onChange={(e) => setMortalityCount(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-rose-600 font-mono text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMortalityModalStock(null)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 text-white font-semibold rounded-md hover:bg-rose-700"
                >
                  Record Mortality
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
