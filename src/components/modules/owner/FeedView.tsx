import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { FeedItem } from '../../../types/erp';
import { formatCurrency, formatNumber, formatDate } from '../../../utils/formatters';
import { Plus, Wheat, AlertTriangle, CheckCircle2, History } from 'lucide-react';

export const FeedView: React.FC = () => {
  const { feedItems, feedingLogs, ponds, addFeedItem, recordFeeding, settings, language } = useERP();

  const [showAddFeedModal, setShowAddFeedModal] = useState(false);
  const [showLogFeedingModal, setShowLogFeedingModal] = useState(false);

  // New Feed Catalog Form
  const [feedName, setFeedName] = useState('');
  const [feedNameBn, setFeedNameBn] = useState('');
  const [brand, setBrand] = useState('Mega Feeds Ltd.');
  const [proteinPercent, setProteinPercent] = useState('28');
  const [feedType, setFeedType] = useState<FeedItem['feedType']>('Floating');
  const [bagWeightKg, setBagWeightKg] = useState('25');
  const [bagsInStock, setBagsInStock] = useState('50');
  const [unitCostPerBag, setUnitCostPerBag] = useState('2200');
  const [reorderLevelBags, setReorderLevelBags] = useState('15');

  // Daily Feeding Form
  const [selectedPondId, setSelectedPondId] = useState(ponds[0]?.id || '');
  const [selectedFeedId, setSelectedFeedId] = useState(feedItems[0]?.id || '');
  const [feedQtyKg, setFeedQtyKg] = useState('50');
  const [timeSlot, setTimeSlot] = useState<'Morning (07:00)' | 'Noon (13:00)' | 'Evening (17:30)'>('Morning (07:00)');
  const [feedingNotes, setFeedingNotes] = useState('');

  const totalBagsInStock = feedItems.reduce((acc, f) => acc + f.bagsInStock, 0);
  const totalStockValue = feedItems.reduce((acc, f) => acc + f.bagsInStock * f.unitCostPerBag, 0);
  const totalFeedDispensedKg = feedingLogs.reduce((acc, l) => acc + l.quantityKg, 0);

  const handleAddFeedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedName) return;

    addFeedItem({
      name: feedName,
      nameBn: feedNameBn || feedName,
      brand,
      proteinPercent: Number(proteinPercent) || 28,
      feedType,
      bagWeightKg: Number(bagWeightKg) || 25,
      bagsInStock: Number(bagsInStock) || 0,
      unitCostPerBag: Number(unitCostPerBag) || 2000,
      reorderLevelBags: Number(reorderLevelBags) || 10,
    });

    setShowAddFeedModal(false);
    setFeedName('');
  };

  const handleRecordFeeding = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(feedQtyKg) || 0;
    if (qty <= 0) return;

    recordFeeding({
      date: new Date().toISOString().split('T')[0],
      pondId: selectedPondId,
      feedItemId: selectedFeedId,
      quantityKg: qty,
      timeSlot,
      loggedBy: 'Pond In-Charge',
      notes: feedingNotes || 'Regular daily feeding schedule',
    });

    setShowLogFeedingModal(false);
    setFeedQtyKg('50');
    setFeedingNotes('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'খাবার ব্যবস্থাপনা ও দৈনিক খাদ্য প্রয়োগ' : 'Feed Stock Inventory & Daily Feeding'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'গুদামের খাদ্য বস্তা মজুদ, পুকুরে খাদ্য প্রয়োগ ও স্বয়ংক্রিয় জাবেদা পোস্টিং (Dr. Feed Expense)'
              : 'Warehouse bag stock, crude protein metrics, daily pond rations, and automated GL expense postings'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <button
            onClick={() => setShowLogFeedingModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Wheat className="w-4 h-4" />
            {language === 'bn' ? 'দৈনিক খাদ্য প্রয়োগ করুন' : 'Record Pond Feeding'}
          </button>

          <button
            onClick={() => setShowAddFeedModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            {language === 'bn' ? 'নতুন খাবার ক্যাটালগ' : 'Add Feed Item'}
          </button>
        </div>
      </div>

      {/* Feed Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Warehouse Feed Stock
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatNumber(totalBagsInStock)}
            </span>
            <span className="text-xs text-slate-500">Bags</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Inventory Value
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-teal-800 font-mono tabular-nums">
              {formatCurrency(totalStockValue, settings.currencySymbol)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Feed Dispensed To Date
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatNumber(totalFeedDispensedKg)}
            </span>
            <span className="text-xs text-slate-500">KG</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Automated Accounting Rule
          </span>
          <div className="mt-1 text-xs font-mono text-emerald-700 font-semibold leading-tight">
            Dr. Feed Expense (5001)
            <span className="block text-slate-500 text-[10px] font-normal">Cr. Feed Inventory (1011)</span>
          </div>
        </div>
      </div>

      {/* Feed Inventory Cards */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Warehouse Feed Brands & Bag Counts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {feedItems.map((feed) => {
            const isLow = feed.bagsInStock <= feed.reorderLevelBags;
            return (
              <div
                key={feed.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs text-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{feed.name}</h3>
                    <span className="text-slate-500">{feed.brand}</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                      isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {isLow ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">PROTEIN</span>
                    <strong className="text-slate-800">{feed.proteinPercent}% Crude Protein</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">TYPE</span>
                    <strong className="text-teal-700">{feed.feedType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">AVAILABLE BAGS</span>
                    <strong className="text-slate-900 text-base">{feed.bagsInStock} Bags</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans">UNIT COST</span>
                    <strong className="text-slate-900">{formatCurrency(feed.unitCostPerBag, settings.currencySymbol)}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Reorder threshold: {feed.reorderLevelBags} bags</span>
                  <span>{feed.bagWeightKg} KG / bag</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feeding Activity Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h2 className="text-sm font-bold text-slate-900">
              Pond Feeding Execution Records
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {feedingLogs.length} total entries recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Pond</th>
                <th className="py-3 px-4">Feed Brand</th>
                <th className="py-3 px-4">Quantity (KG)</th>
                <th className="py-3 px-4">Estimated Cost</th>
                <th className="py-3 px-4">Time Slot</th>
                <th className="py-3 px-4">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {feedingLogs.map((log) => {
                const pond = ponds.find((p) => p.id === log.pondId);
                const feed = feedItems.find((f) => f.id === log.feedItemId);

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-600 font-sans">
                      {formatDate(log.date)}
                    </td>
                    <td className="py-3 px-4 font-sans font-bold text-slate-900">
                      {pond?.name || 'Pond'}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-700">
                      {feed?.name || 'Feed Pellet'}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-700 text-sm">
                      {log.quantityKg} KG
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-bold">
                      {formatCurrency(log.cost, settings.currencySymbol)}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans">
                      {log.timeSlot}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-sans">
                      {log.loggedBy}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Feeding Modal */}
      {showLogFeedingModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Record Daily Pond Feeding
            </h2>
            <form onSubmit={handleRecordFeeding} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Pond*</label>
                <select
                  value={selectedPondId}
                  onChange={(e) => setSelectedPondId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                >
                  {ponds.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.areaDecimal} dec)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Feed Type / Brand*</label>
                <select
                  value={selectedFeedId}
                  onChange={(e) => setSelectedFeedId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                >
                  {feedItems.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.bagsInStock} bags in store)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quantity (KG)*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={feedQtyKg}
                    onChange={(e) => setFeedQtyKg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Schedule Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value as typeof timeSlot)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Morning (07:00)">Morning (07:00)</option>
                    <option value="Noon (13:00)">Noon (13:00)</option>
                    <option value="Evening (17:30)">Evening (17:30)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Notes / Feeding Observation</label>
                <input
                  type="text"
                  value={feedingNotes}
                  onChange={(e) => setFeedingNotes(e.target.value)}
                  placeholder="e.g. Vigorous feeding response, oxygen optimal"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-[11px] font-mono">
                Automatically posts:
                <br />
                Dr. Feed Expense (5001) / Cr. Feed Inventory (1011)
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogFeedingModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700"
                >
                  Save & Post Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Feed Catalog Modal */}
      {showAddFeedModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Catalog New Commercial Feed Brand
            </h2>
            <form onSubmit={handleAddFeedItem} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Feed Item Name*</label>
                <input
                  type="text"
                  required
                  value={feedName}
                  onChange={(e) => setFeedName(e.target.value)}
                  placeholder="e.g. Mega Floating Pellet 28% CP"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Manufacturer Brand*</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Mega Feeds Ltd."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Feed Type</label>
                  <select
                    value={feedType}
                    onChange={(e) => setFeedType(e.target.value as FeedItem['feedType'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Floating">Floating Pellet</option>
                    <option value="Sinking">Sinking Pellet</option>
                    <option value="Powder / Starter">Nursery Starter / Crumble</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Crude Protein (%)</label>
                  <input
                    type="number"
                    value={proteinPercent}
                    onChange={(e) => setProteinPercent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Initial Bags</label>
                  <input
                    type="number"
                    value={bagsInStock}
                    onChange={(e) => setBagsInStock(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Cost / Bag (৳)</label>
                  <input
                    type="number"
                    value={unitCostPerBag}
                    onChange={(e) => setUnitCostPerBag(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFeedModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-medium rounded-md hover:bg-teal-800"
                >
                  Save Feed Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
