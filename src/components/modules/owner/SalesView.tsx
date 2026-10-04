import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { SalesInvoice } from '../../../types/erp';
import { formatCurrency, formatNumber, formatDate } from '../../../utils/formatters';
import { Plus, Printer, TrendingUp, CheckCircle, FileText } from 'lucide-react';

export const SalesView: React.FC = () => {
  const { salesInvoices, ponds, fishStocks, accounts, recordSale, settings, language, currentCompany } = useERP();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<SalesInvoice | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [speciesName, setSpeciesName] = useState('Rohu (Labeo rohita)');
  const [quantityKg, setQuantityKg] = useState('500');
  const [ratePerKg, setRatePerKg] = useState('220');
  const [discount, setDiscount] = useState('0');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank' | 'Due Credit'>('Cash');
  const [paymentAccountCode, setPaymentAccountCode] = useState('1000'); // 1000 Cash, 1100 Bank, 2000 Payable / Receivable
  const [notes, setNotes] = useState('');

  const totalSalesRevenue = salesInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalVolumeSoldKg = salesInvoices.reduce((sum, inv) => sum + inv.quantityKg, 0);

  const calculatedTotal = Math.max(
    0,
    (Number(quantityKg) || 0) * (Number(ratePerKg) || 0) - (Number(discount) || 0)
  );

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || calculatedTotal <= 0) return;

    recordSale({
      date: new Date().toISOString().split('T')[0],
      customerId: `cust-${Date.now()}`,
      customerName,
      customerPhone,
      speciesName,
      quantityKg: Number(quantityKg) || 1,
      ratePerKg: Number(ratePerKg) || 0,
      discount: Number(discount) || 0,
      totalAmount: calculatedTotal,
      paymentMethod,
      paymentAccountCode,
      notes,
    });

    setShowAddModal(false);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'মাছ বিক্রয় ও ইনভয়েসিং' : 'Fish Sales Invoicing & Revenue Ledger'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'ডাবল এন্ট্রি নীতি: ডেবিট ক্যাশ/ব্যাংক — ক্রেডিট মাছ বিক্রয় আয়'
              : 'Enforces fundamental double-entry rule: Dr. Cash / Bank — Cr. Fish Sales Revenue'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন বিক্রয় ইনভয়েস' : 'Create Sales Invoice'}
        </button>
      </div>

      {/* Sales Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Sales Revenue
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">
              {formatCurrency(totalSalesRevenue, settings.currencySymbol)}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Harvest Sold
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {formatNumber(totalVolumeSoldKg)}
            </span>
            <span className="text-xs text-slate-500">KG</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Billed Invoices
          </span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {salesInvoices.length}
            </span>
          </div>
        </div>

        {/* Double-entry prompt highlight */}
        <div className="bg-teal-50/70 p-4 rounded-xl border border-teal-200 text-xs font-mono space-y-1">
          <span className="text-[10px] text-teal-800 font-bold block uppercase tracking-wider">
            Accounting Rule Executed
          </span>
          <div className="text-emerald-800 font-semibold">
            Dr. Cash / Bank (1000/1100)
          </div>
          <div className="text-indigo-800 pl-3">
            Cr. Fish Sales Revenue (4000)
          </div>
        </div>
      </div>

      {/* Sales Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Buyer / Arat Name</th>
                <th className="py-3 px-4">Fish Species</th>
                <th className="py-3 px-4">Weight (KG)</th>
                <th className="py-3 px-4">Rate (৳/KG)</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {salesInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-teal-800 font-sans">
                    {inv.invoiceNumber}
                  </td>

                  <td className="py-3 px-4 text-slate-500 font-sans">
                    {formatDate(inv.date)}
                  </td>

                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    <div>{inv.customerName}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{inv.customerPhone || 'Counter Sale'}</span>
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-700 font-medium">
                    {inv.speciesName}
                  </td>

                  <td className="py-3 px-4 text-slate-900 font-bold">
                    {formatNumber(inv.quantityKg)} KG
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {formatCurrency(inv.ratePerKg, settings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4 font-bold text-emerald-800 text-sm">
                    {formatCurrency(inv.totalAmount, settings.currencySymbol)}
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        inv.paymentMethod === 'Cash'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : inv.paymentMethod === 'Bank'
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {inv.paymentMethod}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => setSelectedInvoiceForPrint(inv)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-slate-700 hover:text-teal-900 bg-slate-100 hover:bg-slate-200 rounded text-xs transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Sales Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Create Fish Sales Invoice & Post Journal Entry
            </h2>
            <form onSubmit={handleCreateSale} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Customer / Arat Name*</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Karwan Bazar Fish Wholesaler"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Customer Mobile</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+880 1711-..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Species Sold*</label>
                <select
                  value={speciesName}
                  onChange={(e) => setSpeciesName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                >
                  <option value="Rohu (Labeo rohita)">Rohu (Labeo rohita) - রুই মাছ</option>
                  <option value="Catla (Gibelion catla)">Catla (Gibelion catla) - কাতলা মাছ</option>
                  <option value="Pangasius (Pangasianodon)">Pangasius (পাঙ্গাশ মাছ)</option>
                  <option value="GIFT Monosex Tilapia">GIFT Monosex Tilapia (তেলাপিয়া)</option>
                  <option value="Shing / Catfish">Shing / Magur (শিং মাছ)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Weight (KG)*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Rate / KG (৳)*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={ratePerKg}
                    onChange={(e) => setRatePerKg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 font-sans">Discount (৳)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => {
                      const val = e.target.value as 'Cash' | 'Bank' | 'Due Credit';
                      setPaymentMethod(val);
                      if (val === 'Cash') setPaymentAccountCode('1000');
                      else if (val === 'Bank') setPaymentAccountCode('1100');
                      else setPaymentAccountCode('2000');
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Cash">Cash in Hand (Dr. 1000 Cash / নগদ)</option>
                    <option value="Bank">Bank Deposit (Dr. 1100 Bank / ব্যাংক)</option>
                    <option value="Due Credit">Due Credit (Dr. 2000 Receivables / দেনাদার)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Total Payable</label>
                  <div className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md font-mono font-bold text-sm text-emerald-800">
                    {formatCurrency(calculatedTotal, settings.currencySymbol)}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-md text-teal-900 text-[11px] font-mono leading-relaxed">
                <strong>Automated Double-Entry Posting:</strong>
                <br />
                Dr. {paymentMethod === 'Cash' ? 'Cash in Hand (1000)' : paymentMethod === 'Bank' ? 'Bank (1100)' : 'Accounts Receivable (2000)'}: {formatCurrency(calculatedTotal, settings.currencySymbol)}
                <br />
                Cr. Fish Sales Revenue (4000): {formatCurrency(calculatedTotal, settings.currencySymbol)}
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
                  Generate Invoice & Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-8 shadow-2xl border border-slate-200 text-slate-900">
            {/* Invoice Printable Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-teal-900">
                  {currentCompany.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {currentCompany.address}, {currentCompany.district}
                </p>
                <p className="text-xs text-slate-500">
                  Phone: {currentCompany.phone} · TIN: {currentCompany.taxId}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-teal-800 font-mono block">
                  {selectedInvoiceForPrint.invoiceNumber}
                </span>
                <span className="text-xs text-slate-500">
                  Date: {formatDate(selectedInvoiceForPrint.date)}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div className="my-5 p-3 bg-slate-50 rounded-lg text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">BILLED TO</span>
              <strong className="text-slate-900 text-sm">{selectedInvoiceForPrint.customerName}</strong>
              <div className="text-slate-600">{selectedInvoiceForPrint.customerPhone}</div>
            </div>

            {/* Line Items */}
            <table className="w-full text-xs text-left mb-6">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2 px-3">Item Description</th>
                  <th className="py-2 px-3 text-right">Quantity</th>
                  <th className="py-2 px-3 text-right">Rate</th>
                  <th className="py-2 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="py-3 px-3 font-sans font-medium text-slate-900">
                    Fresh Harvested {selectedInvoiceForPrint.speciesName}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {formatNumber(selectedInvoiceForPrint.quantityKg)} KG
                  </td>
                  <td className="py-3 px-3 text-right">
                    {formatCurrency(selectedInvoiceForPrint.ratePerKg, settings.currencySymbol)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(selectedInvoiceForPrint.totalAmount, settings.currencySymbol)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Totals & Voucher reference */}
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-xs">
              <div className="text-slate-500 font-mono">
                Payment: <strong className="text-slate-800">{selectedInvoiceForPrint.paymentMethod}</strong>
                <span className="block text-[10px]">GL Reference: {selectedInvoiceForPrint.journalVoucherId}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-xs">Total Amount Paid</span>
                <p className="text-xl font-bold text-emerald-800 font-mono">
                  {formatCurrency(selectedInvoiceForPrint.totalAmount, settings.currencySymbol)}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInvoiceForPrint(null)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded-md text-xs hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-teal-700 text-white rounded-md text-xs font-semibold hover:bg-teal-800"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
