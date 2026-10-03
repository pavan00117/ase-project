import React from 'react';
import { PollutionReport } from '../types.ts';
import { PollutionMap } from '../components/PollutionMap.tsx';
import {
  ShieldAlert,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Wind,
  Droplet,
  Trash2,
  Volume2,
  Factory,
  Sparkles,
  Search,
  FileCheck,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  reports: PollutionReport[];
  onNavigate: (tab: string, reportId?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ reports, onNavigate }) => {
  const totalCount = reports.length;
  const criticalCount = reports.filter((r) => r.severity === 'critical').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  const categories = [
    {
      type: 'air',
      title: 'Air Pollution',
      desc: 'Toxic chemical smoke plumes, particulate matter, vehicle fleet idling, and acrid industrial gas leaks.',
      icon: Wind,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      activeCount: reports.filter((r) => r.pollution_type === 'air').length,
    },
    {
      type: 'water',
      title: 'Water Contamination',
      desc: 'Industrial runoff, dye dumping, oil sheens, chemical drainage, and microplastic pellet littoral spills.',
      icon: Droplet,
      color: 'bg-sky-50 text-sky-700 border-sky-200',
      activeCount: reports.filter((r) => r.pollution_type === 'water').length,
    },
    {
      type: 'waste',
      title: 'Illegal Waste Dumping',
      desc: 'Demolition rubble fly-tipping, tire dumps, electronic scrap, and hazardous medical bio-waste abandonment.',
      icon: Trash2,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      activeCount: reports.filter((r) => r.pollution_type === 'waste').length,
    },
    {
      type: 'industrial',
      title: 'Industrial Chemical Spills',
      desc: 'Factory flare malfunctions, unlicensed caustic effluents, solvent storage overflows, and heavy metals.',
      icon: Factory,
      color: 'bg-slate-100 text-slate-800 border-slate-300',
      activeCount: reports.filter((r) => r.pollution_type === 'industrial').length,
    },
    {
      type: 'noise',
      title: 'Acoustic / Noise Violations',
      desc: 'High-decibel nocturnal generator vibration, heavy machinery operations exceeding residential ordinances.',
      icon: Volume2,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      activeCount: reports.filter((r) => r.pollution_type === 'noise').length,
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white pt-16 pb-24 border-b border-emerald-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              AI-Assisted Environmental Protection Agency Portal
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Report Pollution. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Protect Our Environment.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-8">
              Help your community identify environmental problems, track official investigation in real-time, and hold polluters accountable for a cleaner future.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('report-form')}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Report Pollution Incident
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => onNavigate('map')}
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-emerald-400" />
                Explore Pollution Map
              </button>
            </div>
          </div>

          {/* Live System Metrics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-800">
            <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-xl border border-slate-700/80">
              <span className="text-xs text-slate-400 font-medium block">Total Complaints Logged</span>
              <span className="text-2xl sm:text-3xl font-black text-white">{totalCount} incidents</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-xl border border-slate-700/80">
              <span className="text-xs text-slate-400 font-medium block">Resolution Success Rate</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">{resolutionRate}% closed</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-xl border border-slate-700/80">
              <span className="text-xs text-slate-400 font-medium block">Active Critical Priorities</span>
              <span className="text-2xl sm:text-3xl font-black text-rose-400">{criticalCount} urgent</span>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-md p-4 rounded-xl border border-slate-700/80">
              <span className="text-xs text-slate-400 font-medium block">Avg Response Time</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-300">2.8 Hours</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (The 4-Step Chain of Custody) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Transparent Government Process
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            How EcoWatch Resolves Environmental Hazards
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Every complaint triggers a verified administrative workflow with legally auditable milestones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Citizen Report',
              desc: 'Upload photo evidence, set GPS coordinates, and get real-time AI assistance to draft formal complaints.',
              icon: FileCheck,
              tag: 'Intake & ID Generation',
            },
            {
              step: '02',
              title: 'Authority Review',
              desc: 'Central environmental officers audit sensory telemetry, check duplicate cases, and verify legal criteria.',
              icon: Search,
              tag: 'Triage & Verification',
            },
            {
              step: '03',
              title: 'Field Investigation',
              desc: 'Assigned division officers inspect the site, conduct air/water spectrometry, and serve notices of violation.',
              icon: ShieldCheck,
              tag: 'On-Site Inspection',
            },
            {
              step: '04',
              title: 'Remediation & Closure',
              desc: 'Containment booms deployed, illegal waste hauled, penalties enforced, and full resolution logged publicly.',
              icon: CheckCircle2,
              tag: 'Enforcement & Cleanup',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 relative group"
              >
                <div className="text-3xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors mb-3">
                  {item.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.tag}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pollution Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Environmental Scope</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Monitored Pollution Categories
            </h2>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
          >
            Browse All Registered Incidents <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                onClick={() => onNavigate('reports')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{cat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{cat.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Logged</span>
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                    {cat.activeCount} reports
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Geospatial Telemetry
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">Regional Pollution Hotspot Radar</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Explore verified environmental incidents. Click any marker to view forensic evidence, status history, and containment measures.
              </p>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 self-start cursor-pointer"
            >
              Full Interactive Map <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <PollutionMap
            reports={reports}
            height="440px"
            enableHotspotOverlayDefault={true}
            onReportSelect={(r) => onNavigate('report-details', r.id)}
          />
        </div>
      </section>

      {/* Authority Response Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl font-black text-slate-900">Are you an authorized Environmental Officer?</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Login to the specialized Officer Inspection Console to review assigned complaints, attach field spectroscopy notes, upload remediation photos, and issue compliance notices.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-emerald-800 pt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Multi-Role Access Control
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Legally Enforceable Records
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('officer-dashboard')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shrink-0 cursor-pointer shadow-lg"
          >
            Access Officer Portal
          </button>
        </div>
      </section>
    </div>
  );
};
