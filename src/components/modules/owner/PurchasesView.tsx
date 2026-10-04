import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { PurchaseBill } from '../../../types/erp';
import { formatCurrency, formatNumber, formatDate } from '../../../utils/formatters';
import { Plus, ShoppingCart, Truck } from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const { purchaseBills, recordPurchase, settings, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);

  const [supplierName, setSupplierName] = useState('');
  const [category, setCategory] = useState<PurchaseBill['category']>('Feed Stock');
  const [itemName, setItemName] = useState('Floating Feed Bags (28% CP)');
  const [quantity, setQuantity] = useState('40');
  const [unit, setUnit] = useState<PurchaseBill['unit']>('Bags');
  const [rate, setRate] = useState('2100');
  const [paymentMethod, setPaymentMethod] = useState<PurchaseBill['paymentMethod']>('Cash');
  const [notes, setNotes] = useState('');

  const calculatedTotal = (Number(quantity) || 0) * (Number(rate) || 0);
  const totalPurchasesAmount = purchaseBills.reduce((sum, b) => sum + b.totalAmount, 0);

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName || calculatedTotal <= 0) return;

    recordPurchase({
      date: new Date().toISOString().split('T')[0],
      supplierName,
      category,
      itemName,
      quantity: Number(quantity) || 1,
      unit,
      rate: Number(rate) || 0,
      totalAmount: calculatedTotal,
      paymentMethod,
      notes,
    });

    setShowAddModal(false);
    setSupplierName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'ক্রয় ও সরবরাহকারী বিল' : 'Purchases & Inventory Inward'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'খাদ্য বস্তা, পোনা মাছ ও এরেটর যন্ত্রপাতি ক্রয় (Dr. Inventory — Cr. Cash / Payable)'
              : 'Feed bags, fingerlings, water treatment lime, and machinery asset acquisitions'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন ক্রয় বিল' : 'Record Purchase Bill'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Inward Purchases
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatCurrency(totalPurchasesAmount, settings.currencySymbol)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Bills Recorded
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-teal-800 font-mono tabular-nums">
              {purchaseBills.length}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Accounting Rule
          </span>
          <div className="mt-1 text-xs font-mono text-emerald-800 font-semibold leading-tight">
            Dr. Inventory / Asset
            <span className="block text-slate-500 text-[10px] font-normal">Cr. Cash / Accounts Payable</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Supplier Credit (Payable)
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-amber-700 font-mono tabular-nums">
              {formatCurrency(
                purchaseBills
                  .filter((b) => b.paymentMethod === 'Accounts Payable')
                  .reduce((sum, b) => sum + b.totalAmount, 0),
                settings.currencySymbol
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Bill #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {purchaseBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 font-sans">
                    {bill.billNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-sans">
                    {formatDate(bill.date)}
                  </td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    {bill.supplierName}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px]">
                      {bill.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-800">
                    {bill.itemName}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-semibold">
                    {bill.quantity} {bill.unit}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {formatCurrency(bill.rate, settings.currencySymbol)}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatCurrency(bill.totalAmount, settings.currencySymbol)}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        bill.paymentMethod === 'Cash'
                          ? 'bg-emerald-50 text-emerald-800'
                          : bill.paymentMethod === 'Bank'
                          ? 'bg-sky-50 text-sky-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {bill.paymentMethod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Purchase Bill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Record Inward Purchase Bill
            </h2>
            <form onSubmit={handleCreatePurchase} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Supplier / Vendor Name*</label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. ACI Godrej Agrovet Ltd."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Item Category*</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PurchaseBill['category'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Feed Stock">Feed Stock (Dr. 1011 Feed Inventory)</option>
                    <option value="Fish Fingerlings">Fish Fingerlings (Dr. 1010 Fish Stock)</option>
                    <option value="Equipment & Aeration">Equipment & Aerators (Dr. 1502 Equipment)</option>
                    <option value="Medicines & Lime">Medicines & Lime (Dr. 5007 Conditioning)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Item Description*</label>
                  <input
                    type="text"
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Mega Floating Feed 28% CP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Quantity*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as PurchaseBill['unit'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white font-sans"
                  >
                    <option value="Bags">Bags</option>
                    <option value="KG">KG</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Units">Units</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Rate / Unit (৳)*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PurchaseBill['paymentMethod'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Cash">Cash in Hand (Cr. 1000 Cash / নগদ)</option>
                    <option value="Bank">Bank Transfer (Cr. 1100 Bank / ব্যাংক)</option>
                    <option value="Accounts Payable">Due Credit (Cr. 2000 Accounts Payable / দেনা)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Bill Amount</label>
                  <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md font-mono font-bold text-sm text-slate-900">
                    {formatCurrency(calculatedTotal, settings.currencySymbol)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-700 text-white font-semibold rounded-md hover:bg-teal-800"
                >
                  Record Bill & Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
