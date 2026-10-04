import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { HarvestRecord } from '../../../types/erp';
import { formatNumber, formatCurrency, formatDate } from '../../../utils/formatters';
import { Plus, Anchor, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const HarvestView: React.FC = () => {
  const { harvestRecords, fishStocks, ponds, recordHarvest, settings, language, setActiveTab } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);

  const [pondId, setPondId] = useState(ponds[0]?.id || '');
  const [speciesStockId, setSpeciesStockId] = useState(fishStocks[0]?.id || '');
  const [harvestedKg, setHarvestedKg] = useState('500');
  const [fishCount, setFishCount] = useState('400');
  const [averageWeightGrams, setAverageWeightGrams] = useState('1250');
  const [grade, setGrade] = useState<HarvestRecord['grade']>('Grade A');
  const [packingCost, setPackingCost] = useState('1500');
  const [iceTransportCost, setIceTransportCost] = useState('2500');
  const [notes, setNotes] = useState('Direct netting harvest');

  const totalHarvestedKg = harvestRecords.reduce((sum, h) => sum + h.harvestedKg, 0);

  const handleRecordHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    const kg = Number(harvestedKg) || 0;
    if (kg <= 0) return;

    const stock = fishStocks.find((s) => s.id === speciesStockId);

    recordHarvest({
      date: new Date().toISOString().split('T')[0],
      pondId,
      speciesStockId,
      speciesName: stock?.speciesName || 'Harvested Fish',
      harvestedKg: kg,
      fishCount: Number(fishCount) || 100,
      averageWeightGrams: Number(averageWeightGrams) || 1000,
      grade,
      packingCost: Number(packingCost) || 0,
      iceTransportCost: Number(iceTransportCost) || 0,
      notes,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'মাছ আহরণ ও গ্রেডিং লগ' : 'Harvest Logging & Yield Records'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'পুকুর থেকে পরিণত মাছ আহরণ, ওজন, গ্রেড এবং সরাসরি পাইকারি বিক্রয়ে রূপান্তর'
              : 'Log batch netting, grading classification, packing costs, and convert directly to sales invoices'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন আহরণ রেকর্ড' : 'Log Harvest Batch'}
        </button>
      </div>

      {/* Harvest KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Fish Harvested
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatNumber(totalHarvestedKg)}
            </span>
            <span className="text-xs text-slate-500">KG</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Harvest Batches
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {harvestRecords.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Packing & Transport
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCurrency(
                harvestRecords.reduce((sum, h) => sum + h.packingCost + h.iceTransportCost, 0),
                settings.currencySymbol
              )}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Wholesale Conversion
          </span>
          <div className="mt-1 text-xs text-teal-800 font-semibold">
            Ready to Invoice
            <span className="block text-[11px] text-slate-500 font-normal">Direct link to Cash Sales</span>
          </div>
        </div>
      </div>

      {/* Harvest Records Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Harvest Date</th>
                <th className="py-3 px-4">Pond Origin</th>
                <th className="py-3 px-4">Species</th>
                <th className="py-3 px-4">Harvested (KG)</th>
                <th className="py-3 px-4">Fish Count</th>
                <th className="py-3 px-4">Avg Weight</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Logistics Cost</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {harvestRecords.map((rec) => {
                const pond = ponds.find((p) => p.id === rec.pondId);
                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-600 font-sans">
                      {formatDate(rec.date)}
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">
                      {pond?.name || 'Pond'}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700 font-medium">
                      {rec.speciesName}
                    </td>
                    <td className="py-3 px-4 font-bold text-teal-800 text-sm">
                      {formatNumber(rec.harvestedKg)} KG
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {formatNumber(rec.fishCount)} pcs
                    </td>
                    <td className="py-3 px-4 text-slate-800">
                      {rec.averageWeightGrams} g
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        {rec.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatCurrency(rec.packingCost + rec.iceTransportCost, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-4 text-right font-sans">
                      <button
                        onClick={() => setActiveTab('sales')}
                        className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-semibold"
                      >
                        Create Sale <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Harvest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Record Aquaculture Fish Harvest
            </h2>
            <form onSubmit={handleRecordHarvest} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Harvest Pond*</label>
                  <select
                    value={pondId}
                    onChange={(e) => setPondId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    {ponds.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Species Stock Batch*</label>
                  <select
                    value={speciesStockId}
                    onChange={(e) => setSpeciesStockId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    {fishStocks.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.speciesName} ({s.currentEstimatedBiomassKg} KG)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Harvested (KG)*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={harvestedKg}
                    onChange={(e) => setHarvestedKg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 text-sm font-bold text-teal-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Count (Pieces)</label>
                  <input
                    type="number"
                    value={fishCount}
                    onChange={(e) => setFishCount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Avg Weight (Grams)</label>
                  <input
                    type="number"
                    value={averageWeightGrams}
                    onChange={(e) => setAverageWeightGrams(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Quality Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value as HarvestRecord['grade'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white font-sans"
                  >
                    <option value="Grade A">Grade A (Premium)</option>
                    <option value="Grade B">Grade B (Standard)</option>
                    <option value="Export">Export Grade</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Packing Cost (৳)</label>
                  <input
                    type="number"
                    value={packingCost}
                    onChange={(e) => setPackingCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Ice & Transport (৳)</label>
                  <input
                    type="number"
                    value={iceTransportCost}
                    onChange={(e) => setIceTransportCost(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Early morning netting, chilled in crushed ice"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
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
                  Record Harvest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
