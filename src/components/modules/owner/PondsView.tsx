import React, { useState } from 'react';
import { useERP } from '../../../context/ERPContext';
import { Pond } from '../../../types/erp';
import { Plus, Waves, Wind, Droplets, Trash2, Edit2 } from 'lucide-react';
import { Pond3DVisualizer } from '../../pond3d/Pond3DVisualizer';

export const PondsView: React.FC = () => {
  const { ponds, addPond, updatePond, deletePond, currentCompany, language } = useERP();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPondId, setSelectedPondId] = useState<string>(ponds[0]?.id || '');

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [areaDecimal, setAreaDecimal] = useState('50');
  const [depthFeet, setDepthFeet] = useState('6.0');
  const [waterSource, setWaterSource] = useState('Deep Tube-well with Sand Filter');
  const [waterPh, setWaterPh] = useState('7.6');
  const [dissolvedOxygen, setDissolvedOxygen] = useState('6.8');
  const [salinityPpt, setSalinityPpt] = useState('0.5');
  const [temperatureC, setTemperatureC] = useState('28.5');
  const [stockingCapacityKg, setStockingCapacityKg] = useState('5000');
  const [status, setStatus] = useState<Pond['status']>('Active');

  const handleCreatePond = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addPond({
      name,
      nameBn: nameBn || name,
      companyId: currentCompany.id,
      areaDecimal: Number(areaDecimal) || 50,
      depthFeet: Number(depthFeet) || 6.0,
      waterSource: waterSource || 'Deep Tube-well',
      status,
      aerationEquipped: true,
      aeratorRunning: true,
      waterPh: Number(waterPh) || 7.5,
      dissolvedOxygen: Number(dissolvedOxygen) || 6.5,
      salinityPpt: Number(salinityPpt) || 0.5,
      temperatureC: Number(temperatureC) || 28.0,
      stockingCapacityKg: Number(stockingCapacityKg) || 5000,
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
            {language === 'bn' ? 'পুকুর ব্যবস্থাপনা ও পানির মান' : 'Pond Management & Water Quality Telemetry'}
          </h1>
          <p className="text-xs text-slate-500">
            {language === 'bn'
              ? 'আয়তন (ডেসিমাল), গভীরতা, দ্রবীভূত অক্সিজেন (DO), পিএইচ এবং এরেটর নিয়ন্ত্রণ'
              : 'Individual pond telemetry, aeration paddlewheel state, and stocking thresholds'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          {language === 'bn' ? 'নতুন পুকুর যোগ করুন' : 'Add New Pond'}
        </button>
      </div>

      {/* 3D Visualizer Embedded with Pond Selector */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Live 3D Aquatic View
        </h2>
        <Pond3DVisualizer
          selectedPondId={selectedPondId}
          onPondChange={(id) => setSelectedPondId(id)}
        />
      </div>

      {/* Ponds Table & Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Pond Name</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Depth</th>
                <th className="py-3 px-4">Water Health (DO / pH / Temp)</th>
                <th className="py-3 px-4">Aerator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {ponds.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPondId(p.id)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    p.id === selectedPondId ? 'bg-teal-50/50' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-sans font-bold text-slate-900">
                    <div>{language === 'bn' && p.nameBn ? p.nameBn : p.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{p.waterSource}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-800">
                    {p.areaDecimal} Decimals
                  </td>

                  <td className="py-3 px-4 text-slate-800">
                    {p.depthFeet} ft
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-teal-700 font-bold">DO: {p.dissolvedOxygen.toFixed(1)} mg/L</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-700">pH: {p.waterPh.toFixed(1)}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{p.temperatureC.toFixed(1)}°C</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePond(p.id, { aeratorRunning: !p.aeratorRunning });
                      }}
                      className={`text-[11px] font-sans font-semibold px-2 py-0.5 rounded transition-colors ${
                        p.aeratorRunning
                          ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {p.aeratorRunning ? 'Running (ON)' : 'Stopped (OFF)'}
                    </button>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                        p.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.status === 'Harvest Ready'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePond(p.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete pond"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Pond Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">
              Add New Aquaculture Pond
            </h2>
            <form onSubmit={handleCreatePond} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pond Name (English)*</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. South Grow-Out Pond #5"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pond Name (বাংলা)</label>
                <input
                  type="text"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="দক্ষিণ গ্রো-আউট পুকুর ৫"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Area (Decimals / শতাংশ)*</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={areaDecimal}
                    onChange={(e) => setAreaDecimal(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Average Depth (Feet)*</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={depthFeet}
                    onChange={(e) => setDepthFeet(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dissolved O2</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dissolvedOxygen}
                    onChange={(e) => setDissolvedOxygen(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">pH</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waterPh}
                    onChange={(e) => setWaterPh(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Capacity (KG)</label>
                  <input
                    type="number"
                    value={stockingCapacityKg}
                    onChange={(e) => setStockingCapacityKg(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Pond['status'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-teal-600 bg-white"
                  >
                    <option value="Active">Active (Growing)</option>
                    <option value="Nursery">Nursery (Fingerling)</option>
                    <option value="Harvest Ready">Harvest Ready</option>
                    <option value="Preparation">Preparation / Lime</option>
                    <option value="Fallow">Fallow / Dry</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Water Source</label>
                  <input
                    type="text"
                    value={waterSource}
                    onChange={(e) => setWaterSource(e.target.value)}
                    placeholder="e.g. Deep Tube-well"
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
                  Save Pond
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
