import React, { useState } from 'react';
import { PollutionReport } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SeverityBadge } from '../components/SeverityBadge.tsx';
import { PollutionMap } from '../components/PollutionMap.tsx';
import {
  FileText,
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  Eye,
  ArrowRight,
  MapPin,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface CitizenDashboardProps {
  reports: PollutionReport[];
  onNavigate: (tab: string, reportId?: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ reports, onNavigate }) => {
  const { user } = useAuth();

  // Filter reports submitted by current citizen or show relevant local reports
  const myReports = reports.filter((r) => r.user_id === user?.id || r.citizen_email === user?.email);
  const displayReports = myReports.length > 0 ? myReports : reports.slice(0, 5);

  const total = myReports.length || reports.length;
  const pending = reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
  const verified = reports.filter((r) => r.status === 'Verified' || r.status === 'Assigned' || r.status === 'Under Investigation').length;
  const resolved = reports.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;

  // Nearby urgent alerts
  const urgentAlerts = reports.filter((r) => r.severity === 'critical' || r.severity === 'high').slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-400/30">
            Citizen Action Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Welcome, {user?.name || 'Resident'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
            Track official remediation on your reported environmental incidents, review neighborhood air and water telemetry, and help protect our community.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report-form')}
          className="px-6 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-700 stroke-[2.5]" />
          Submit New Complaint
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Reports</span>
            <span className="text-2xl font-black text-slate-900">{total}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Pending Review</span>
            <span className="text-2xl font-black text-amber-700">{pending}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">In Action / Verified</span>
            <span className="text-2xl font-black text-blue-700">{verified}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Remediated & Closed</span>
            <span className="text-2xl font-black text-emerald-700">{resolved}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: My Reports Table + Nearby Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: My Reports */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">My Registered Complaints</h2>
              <p className="text-xs text-slate-500">Live timeline and official authority status</p>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              All Community Reports <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Report ID</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Incident Title</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {displayReports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.report_number}</td>
                      <td className="py-3 px-4 uppercase font-bold text-[10px] text-slate-500">{r.pollution_type}</td>
                      <td className="py-3 px-4 max-w-[200px] truncate font-semibold text-slate-900">{r.title}</td>
                      <td className="py-3 px-4">
                        <SeverityBadge severity={r.severity} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={r.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onNavigate('report-details', r.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-emerald-600 text-white font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Track
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Nearby Urgent Alerts & Tips */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Nearby Pollution Alerts</h2>
            <p className="text-xs text-slate-500">Active regional environmental advisories</p>
          </div>

          <div className="space-y-3">
            {urgentAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onNavigate('report-details', alert.id)}
                className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{alert.report_number}</span>
                  <SeverityBadge severity={alert.severity} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{alert.title}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">{alert.address}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-400">{new Date(alert.reported_at).toLocaleDateString()}</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    Inspect <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Environmental Awareness Tip Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-xs space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              Citizen Rights & Evidence Protocols
            </div>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              When capturing evidence, maintain safe distance from hazardous chemicals. Take multiple angles of discharge culverts, vehicle license plates, and noticeable odors.
            </p>
            <button
              onClick={() => onNavigate('awareness')}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer pt-1"
            >
              Read Full Public Health Guidelines <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Neighborhood Map Telemetry */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Active Incidents in Your Area</h2>
          <p className="text-xs text-slate-500">Geospatial layout of confirmed citizen reports</p>
        </div>
        <PollutionMap reports={reports} height="360px" onReportSelect={(r) => onNavigate('report-details', r.id)} />
      </div>
    </div>
  );
};
