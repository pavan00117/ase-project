import React, { useState } from 'react';
import { PollutionReport } from '../types.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SeverityBadge } from '../components/SeverityBadge.tsx';
import { Search, Filter, MapPin, Calendar, Eye, PlusCircle, ArrowUpDown } from 'lucide-react';

interface PublicReportsPageProps {
  reports: PollutionReport[];
  onNavigate: (tab: string, reportId?: string) => void;
}

export const PublicReportsPage: React.FC<PublicReportsPageProps> = ({ reports, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = reports.filter((r) => {
    if (filterType !== 'all' && r.pollution_type !== filterType) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.report_number.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Transparent Public Registry
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Community Pollution Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified environmental complaints, official inspection findings, and remediation status.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report-form')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer self-start"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          Submit New Complaint
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search complaints by ID, title, keyword, or street address..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="air">Air Pollution</option>
            <option value="water">Water Pollution</option>
            <option value="waste">Waste / Dumping</option>
            <option value="industrial">Industrial Chemical</option>
            <option value="noise">Noise Violations</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Verified">Verified</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Action Taken">Action Taken</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <div
            key={r.id}
            onClick={() => onNavigate('report-details', r.id)}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              {/* Evidence image preview banner if available */}
              {r.images && r.images.length > 0 && (
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 relative">
                  <img
                    src={r.images[0].image_url}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-white backdrop-blur-xs">
                      {r.report_number}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {r.pollution_type}
                </span>
                <div className="flex items-center gap-1.5">
                  <SeverityBadge severity={r.severity} size="sm" />
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-1">
                {r.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{r.description}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{r.address}, {r.city}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <StatusBadge status={r.status} size="sm" />
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  Inspect <Eye className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
