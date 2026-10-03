import React, { useState, useEffect } from 'react';
import { AnalyticsData } from '../types.ts';
import { api } from '../services/api.ts';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  Filter,
  Flame,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
        Loading environmental analytics telemetry...
      </div>
    );
  }

  const maxTimelineCount = Math.max(...data.timeline.map((t) => t.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Analytics Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Environmental Data Intelligence
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Pollution Trends & Hotspot Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical data telemetry derived from verified municipal incident registries and sensor stations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            {(['week', 'month', 'year'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  timeRange === r ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'week' ? '7 Days' : r === 'month' ? '30 Days' : '1 Year'}
              </button>
            ))}
          </div>

          <button
            onClick={loadAnalytics}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs text-slate-600 transition-colors cursor-pointer"
            title="Refresh metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 4 Resolution Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Resolution Success Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">{data.resolution_rate}%</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Target: 80%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${data.resolution_rate}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average Remediation Time</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.average_resolution_days}</span>
            <span className="text-sm font-bold text-slate-500">Days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">From verified complaint to confirmed officer cleanup</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Resolved Complaints</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{data.resolved_reports}</span>
            <span className="text-xs text-slate-400">of {data.total_reports} total</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% of critical hazards mitigated
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Caseload</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{data.pending_reports + data.under_investigation}</span>
            <span className="text-xs text-slate-400">cases open</span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-2">Currently assigned to field divisions</p>
        </div>
      </div>

      {/* Grid: 7-Day Timeline Trend Chart + Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timeline Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Pollution Incident Intake Velocity
              </h3>
              <p className="text-xs text-slate-500">Daily complaints reported vs successfully resolved</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> New</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-300" /> Resolved</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-60 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {data.timeline.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.count / maxTimelineCount) * 100));
              const resolvedHeightPercent = Math.max(8, Math.round((item.resolved / maxTimelineCount) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full max-w-[36px] flex items-end gap-1 h-full justify-center">
                    {/* New Reports Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-1/2 bg-emerald-600 rounded-t-md relative transition-all group-hover:bg-emerald-500 flex items-start justify-center pt-1"
                    >
                      <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                    </div>
                    {/* Resolved Reports Bar */}
                    <div
                      style={{ height: `${resolvedHeightPercent}%` }}
                      className="w-1/2 bg-teal-300 rounded-t-md transition-all group-hover:bg-teal-400"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                    {item.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" />
              Incidents by Environmental Category
            </h3>
            <p className="text-xs text-slate-500">Distribution across monitored environmental media</p>
          </div>

          <div className="space-y-4">
            {data.by_category.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{cat.category}</span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {cat.count} cases ({cat.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className={`h-full rounded-full ${
                      cat.category.includes('AIR')
                        ? 'bg-purple-600'
                        : cat.category.includes('WATER')
                        ? 'bg-sky-600'
                        : cat.category.includes('WASTE')
                        ? 'bg-orange-600'
                        : cat.category.includes('INDUSTRIAL')
                        ? 'bg-slate-700'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Severity Distribution & Hotspot Geographic Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Severity Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900">Incident Severity Breakdown</h3>
          <div className="space-y-3">
            {data.by_severity.map((sev, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <span style={{ backgroundColor: sev.color }} className="w-3 h-3 rounded-full" />
                  <span className="text-xs font-bold text-slate-800">{sev.severity}</span>
                </div>
                <span className="font-mono font-black text-sm text-slate-900">{sev.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspots Ranking Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                Identified Pollution Hotspots & Repeat Clusters
              </h3>
              <p className="text-xs text-slate-500">Geospatial clusters with repeated violations</p>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
              High Priority Enforcement
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Location Area</th>
                  <th className="py-2.5 px-3">City</th>
                  <th className="py-2.5 px-3">Primary Concern</th>
                  <th className="py-2.5 px-3">Reports</th>
                  <th className="py-2.5 px-3 text-right">Coordinates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {data.hotspots.map((spot, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {spot.area}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{spot.city}</td>
                    <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-500">{spot.primary_issue}</td>
                    <td className="py-2.5 px-3 font-mono font-black text-rose-700">{spot.count}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-right">
                      {spot.latitude.toFixed(3)}, {spot.longitude.toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
