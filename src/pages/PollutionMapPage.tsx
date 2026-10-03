import React, { useState } from 'react';
import { PollutionReport } from '../types.ts';
import { PollutionMap } from '../components/PollutionMap.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SeverityBadge } from '../components/SeverityBadge.tsx';
import { MapPin, Search, Eye, Filter, Flame, ChevronRight, Layers } from 'lucide-react';

interface PollutionMapPageProps {
  reports: PollutionReport[];
  onNavigate: (tab: string, reportId?: string) => void;
}

export const PollutionMapPage: React.FC<PollutionMapPageProps> = ({ reports, onNavigate }) => {
  const [selectedReport, setSelectedReport] = useState<PollutionReport | null>(reports[0] || null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const filtered = reports.filter((r) => {
    if (selectedType !== 'all' && r.pollution_type !== selectedType) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.address.toLowerCase().includes(q) || r.report_number.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Geospatial Environmental Monitoring
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Active Pollution Hotspots & Surveillance Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time geospatial layout of confirmed citizen reports, environmental hazard perimeters, and authority actions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report-form')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer self-start"
        >
          + Report Incident at this Location
        </button>
      </div>

      {/* Main Grid: Interactive Map + Side Case Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Big Map (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <PollutionMap
            reports={filtered}
            height="580px"
            enableHotspotOverlayDefault={true}
            selectedLocation={selectedReport ? { lat: selectedReport.latitude, lng: selectedReport.longitude } : null}
            onReportSelect={(r) => setSelectedReport(r)}
          />
        </div>

        {/* Right: Incident Selector Drawer */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col h-[580px]">
          <div className="space-y-3 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Area Incidents ({filtered.length})
              </h3>
              <span className="text-[11px] font-bold text-emerald-700">Click to Inspect</span>
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search location or keyword..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Scrollable Incidents List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pt-2 space-y-1">
            {filtered.map((r) => {
              const isSelected = selectedReport?.id === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedReport(r)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected ? 'bg-emerald-50/80 border border-emerald-300' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{r.report_number}</span>
                    <SeverityBadge severity={r.severity} size="sm" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{r.title}</h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{r.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100/60 text-[10px]">
                    <StatusBadge status={r.status} size="sm" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('report-details', r.id);
                      }}
                      className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5 cursor-pointer"
                    >
                      Dossier <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Incident Bottom Quick Bar */}
          {selectedReport && (
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => onNavigate('report-details', selectedReport.id)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Eye className="w-3.5 h-3.5" /> Open Full Incident Case
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
