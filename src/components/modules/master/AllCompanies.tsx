import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Company } from '../../../types/erp';
import { Building2, Plus, Check } from 'lucide-react';

export const AllCompanies: React.FC = () => {
  const { companies, currentCompany, setCurrentCompany, addCompany, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [totalAcreage, setTotalAcreage] = useState('15');
  const [registrationNo, setRegistrationNo] = useState('');
  const [taxId, setTaxId] = useState('');

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addCompany({
      name,
      nameBn: nameBn || name,
      district: district || 'Mymensingh',
      address: address || 'Fisheries Belt',
      phone: phone || '+880 1700-000000',
      email: email || 'farm@ponderp.com',
      totalAcreage: Number(totalAcreage) || 10,
      registrationNo: registrationNo || `REG-${Date.now().toString().slice(-6)}`,
      taxId: taxId || `TIN-${Date.now().toString().slice(-8)}`,
      currency: 'BDT',
      currencySymbol: '৳',
      fiscalYear: '2026-2027',
    });

    setShowAddModal(false);
    setName('');
    setNameBn('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {language === 'bn' ? 'সকল কোম্পানি ও খামার শাখা' : 'All Companies & Farm Entities'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'মাল্টি-কোম্পানি ব্যবস্থাপনা, পৃথক খামার ও শাখা নিরীক্ষা'
              : 'Multi-entity corporate structure, separate farm locations and tax registrations'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন কোম্পানি যোগ করুন' : 'Add New Company'}
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((comp) => {
          const isSelected = comp.id === currentCompany.id;
          return (
            <div
              key={comp.id}
              className={`p-5 rounded-xl border bg-white shadow-xs transition-all relative ${
                isSelected ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  Active Entity
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="min-w-0 pr-16">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {language === 'bn' && comp.nameBn ? comp.nameBn : comp.name}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{comp.address}, {comp.district}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">TOTAL WATER ACREAGE</span>
                  <span className="font-semibold text-slate-800">{comp.totalAcreage} Acres</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">REGISTRATION / TIN</span>
                  <span className="font-mono text-slate-800 truncate block">{comp.registrationNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">FISCAL YEAR</span>
                  <span className="font-mono text-slate-800">{comp.fiscalYear}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CONTACT PHONE</span>
                  <span className="text-slate-800 truncate block">{comp.phone}</span>
                </div>
              </div>

              {!isSelected && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setCurrentCompany(comp)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-900 py-1 px-3 rounded hover:bg-teal-50 transition-colors"
                  >
                    Switch to this Company →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Company Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Add Aquaculture Company / Farm Entity
            </h2>
            <form onSubmit={handleCreateCompany} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Company / Farm Name (English)*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Padma Delta Fisheries Ltd."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Company Name (বাংলা)</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="পদ্মা ডেল্টা ফিশারিজ লিমিটেড"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">District*</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Mymensingh"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Total Acreage</label>
                  <input
                    type="number"
                    step="0.5"
                    value={totalAcreage}
                    onChange={(e) => setTotalAcreage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Farm Location / Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Fishery Zone, Trishal"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Reg No.</label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="REG-2026-..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Tax / TIN</label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    placeholder="TIN-..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                  />
                </div>
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
                  Create Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
