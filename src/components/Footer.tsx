import React from 'react';
import { ShieldAlert, Phone, Mail, MapPin, ExternalLink, Leaf, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">EcoWatch Registry</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Municipal and regional platform for real-time environmental complaint intake, forensic investigation, and transparent authority enforcement.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Leaf className="w-3.5 h-3.5" />
              <span>Clean Air & Clean Water Accord 2026</span>
            </div>
          </div>

          {/* Citizen Services */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Citizen Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('report-form')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Submit Pollution Complaint
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Explore Active Hotspot Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('citizen-dashboard')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Track My Reports
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('awareness')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Public Health Safety Advisory
                </button>
              </li>
            </ul>
          </div>

          {/* Environmental Authority */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Authority & Enforcement</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Central Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('officer-dashboard')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Officer Field Inspection Queue
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Hotspot Analytics & Trends
                </button>
              </li>
              <li>
                <span className="text-slate-500">PostgreSQL / Neon DB Engine Active</span>
              </li>
            </ul>
          </div>

          {/* Emergency Dispatch */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Emergency Hotline</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span className="font-semibold text-white">1-800-ECO-WATCH</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>intake@ecowatch.gov</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Regional Environmental Protection Division</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                For immediate life-threatening toxic emergencies, evacuate the area and call 911 immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright and compliance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EcoWatch – Environmental Monitoring & Pollution Reporting System. Public Service Infrastructure.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              Verified Public Registry
            </span>
            <span>All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
