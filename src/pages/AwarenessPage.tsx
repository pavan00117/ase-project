import React from 'react';
import { Wind, Droplet, Trash2, Volume2, ShieldCheck, AlertCircle, Phone, BookOpen, HeartPulse } from 'lucide-react';

export const AwarenessPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
          Public Health & Citizen Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Environmental Awareness & Safety Standards
        </h1>
        <p className="text-sm text-slate-600">
          Recognize dangerous pollution indicators in your community and learn how official authorities respond to toxic exposures.
        </p>
      </div>

      {/* Air Quality (AQI) Reference */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
            <Wind className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Air Pollution & Particulate Matter (PM2.5 / VOCs)</h2>
            <p className="text-xs text-slate-500">Health thresholds for smoke, diesel exhaust, and chemical refinery flares</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-800 text-sm">AQI 0 - 50: Good</span>
            <p className="text-emerald-700">Air quality is considered satisfactory, posing little or no health risk.</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
            <span className="font-bold text-amber-800 text-sm">AQI 51 - 100: Moderate</span>
            <p className="text-amber-700">Acceptable air quality; slight risk for individuals unusually sensitive to ozone.</p>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 space-y-1">
            <span className="font-bold text-orange-800 text-sm">AQI 101 - 150: Sensitive</span>
            <p className="text-orange-700">Vulnerable groups (children, elderly, asthmatics) experience respiratory impacts.</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="font-bold text-rose-800 text-sm">AQI 151+: Hazardous</span>
            <p className="text-rose-700">Immediate trigger for official stop-work orders and active enforcement inspections.</p>
          </div>
        </div>
      </div>

      {/* Water & Chemical Runoff Standards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b pb-4 border-slate-100">
          <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Freshwater & Storm Drainage Discharge Protocols</h2>
            <p className="text-xs text-slate-500">Detecting illegal industrial sewer dumping and agricultural runoff</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <h3 className="font-bold text-slate-800">Iridescent Oil Sheens</h3>
            <p className="text-slate-600 leading-relaxed">
              Thin rainbow films indicate petroleum distillate or diesel fuel leakage. Spreads rapidly across stream surface tension and starves oxygen from aquatic organisms.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <h3 className="font-bold text-slate-800">Persistent Chemical Foam</h3>
            <p className="text-slate-600 leading-relaxed">
              Industrial surfactants, vehicle wash bays, and paper mills produce dense white foam that persists over downstream obstacles rather than dissolving like natural organic foam.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <h3 className="font-bold text-slate-800">Toxic Blue-Green Algae</h3>
            <p className="text-slate-600 leading-relaxed">
              Excess fertilizer phosphorus causes explosive cyanobacteria blooms that produce potent neurotoxins deadly to domestic dogs and children wading in shorelines.
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Collection Best Practices */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b pb-4 border-emerald-900">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <div>
            <h2 className="text-lg font-bold">Official Citizen Evidence Best Practices</h2>
            <p className="text-xs text-emerald-300">How to capture legally actionable evidence safely</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-900/50 border border-emerald-800 space-y-1">
            <span className="font-bold text-emerald-300 block text-sm">1. Stay Clear & Prioritize Personal Safety</span>
            <p className="text-emerald-100/90 leading-relaxed">
              Never trespass on private industrial compounds or inhale fumes directly. Zoom lenses and boundary photographs are fully admissible.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-900/50 border border-emerald-800 space-y-1">
            <span className="font-bold text-emerald-300 block text-sm">2. Capture Identifiers & Time Markers</span>
            <p className="text-emerald-100/90 leading-relaxed">
              Record visible truck company names, commercial license plates, outfall drainage pipe markings, and exact timestamps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
