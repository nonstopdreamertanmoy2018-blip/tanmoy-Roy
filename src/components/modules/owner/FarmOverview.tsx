import React from 'react';
import { useERP } from '../../../context/ERPContext';
import { formatNumber, formatCurrency } from '../../../utils/formatters';
import { generateProfitLoss } from '../../../utils/accountingEngine';
import { Pond3DVisualizer } from '../../pond3d/Pond3DVisualizer';
import {
  Warehouse,
  Waves,
  Fish,
  Wheat,
  Wind,
  Droplets,
  Calendar,
  Award,
  ArrowRight,
} from 'lucide-react';

export const FarmOverview: React.FC = () => {
  const { currentCompany, ponds, fishStocks, feedItems, accounts, journalVouchers, settings, language, setActiveTab } = useERP();

  const pnl = generateProfitLoss(accounts, journalVouchers);
  const totalDecimals = ponds.reduce((acc, p) => acc + p.areaDecimal, 0);
  const totalBiomassKg = fishStocks.reduce((acc, s) => acc + s.currentEstimatedBiomassKg, 0);
  const totalAerators = ponds.filter((p) => p.aerationEquipped).length;
  const activeAerators = ponds.filter((p) => p.aeratorRunning).length;

  return (
    <div className="space-y-6">
      {/* Editorial Farm Intro Banner */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                <Warehouse className="w-4 h-4" />
                {currentCompany.name}
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                {language === 'bn' ? 'খামার বিবরণ ও পরিকাঠামো' : 'Aquaculture Facility & Farm Operations'}
              </h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {language === 'bn'
                  ? `মোট আয়তন ${currentCompany.totalAcreage} একর (${totalDecimals} ডেসিমাল জলাশয়)। নদী ও গভীর নলকূপ পানির উৎস এবং সার্বক্ষণিক সৌর ও বিদ্যুৎ এরেটর ব্যবস্থা।`
                  : `Total estate of ${currentCompany.totalAcreage} acres comprising ${totalDecimals} decimals of active water bodies. Deep tube-well filtration, 3-phase grid power with generator backup, and automated paddlewheel aeration.`}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">WATER ACREAGE</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{totalDecimals} Dec</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ACTIVE PONDS</span>
                <span className="font-bold text-teal-800 font-mono text-sm">{ponds.length} Units</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">CURRENT BIOMASS</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{formatNumber(totalBiomassKg)} KG</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PADDLEWHEELS</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{activeAerators} / {totalAerators} ON</span>
              </div>
            </div>
          </div>

          <div className="relative h-48 md:h-auto min-h-[200px]">
            <img
              src="/src/assets/images/aquaculture_harvest_fresh_1791092732537.jpg"
              alt="Fresh Aquaculture Harvest"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-semibold">
                High-Density Polyculture Harvest Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3D Pond Simulator */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Interactive 3D Pond Simulator (Live Feed & Water Current)
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('ponds')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            Manage Ponds <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <Pond3DVisualizer />
      </div>

      {/* Pond Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-900">
            {language === 'bn' ? 'সক্রিয় পুকুরসমূহ' : 'Waterbody Inventory'}
          </h2>
          <button
            onClick={() => setActiveTab('ponds')}
            className="text-xs text-teal-700 hover:text-teal-900 font-medium"
          >
            {language === 'bn' ? 'পুকুর তালিকায় যান →' : 'View Full List →'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ponds.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveTab('ponds')}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer text-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{language === 'bn' && p.nameBn ? p.nameBn : p.name}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{p.areaDecimal} Decimals · {p.depthFeet} ft depth</span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    p.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : p.status === 'Harvest Ready'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-teal-50 text-teal-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px]">DISSOLVED O2</span>
                  <strong className="text-teal-700">{p.dissolvedOxygen.toFixed(1)} mg/L</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">WATER pH</span>
                  <strong className="text-slate-800">{p.waterPh.toFixed(1)}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-slate-400" />
                  {p.aeratorRunning ? 'Aeration ON' : 'Off'}
                </span>
                <span className="font-semibold text-slate-700">{p.stockingCapacityKg.toLocaleString()} KG Cap</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
