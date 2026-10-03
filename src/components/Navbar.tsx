import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { NotificationDropdown } from './NotificationDropdown.tsx';
import {
  ShieldAlert,
  MapPin,
  FileText,
  BarChart3,
  BookOpen,
  PlusCircle,
  UserCheck,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Building2,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, reportId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
        {/* Top Emergency & Public Notice Ticker */}
        <div className="bg-emerald-800 px-4 py-1 text-[11px] font-semibold text-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded text-[10px] uppercase font-bold tracking-wider">
              OFFICIAL SYSTEM
            </span>
            <span>National Environmental Protection & Rapid Incident Intake Registry</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-emerald-200">
            <span>Incident Hotline: 1-800-ECO-WATCH</span>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-md shadow-emerald-900/40 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-white">EcoWatch</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  GOV.PORTAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block leading-none">Pollution Monitoring & Authority Action</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('landing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentTab === 'landing' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => onNavigate('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentTab === 'map' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              Hotspot Map
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentTab === 'reports' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              Incident Registry
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentTab === 'analytics' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              Analytics
            </button>
            <button
              onClick={() => onNavigate('awareness')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentTab === 'awareness' ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              Guidelines
            </button>
          </nav>

          {/* Right Action Tools & Role Switcher */}
          <div className="flex items-center gap-2.5">
            {/* Report Button */}
            <button
              onClick={() => onNavigate('report-form')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Report Pollution</span>
            </button>

            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold cursor-pointer"
                title="Switch perspective between Citizen, Officer, and Admin"
              >
                {user?.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                ) : user?.role === 'officer' ? (
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="capitalize hidden md:inline">{user?.role || 'Role'} View</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => {
                      demoLogin('citizen');
                      setRoleDropdownOpen(false);
                      onNavigate('citizen-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      user?.role === 'citizen' ? 'bg-emerald-600/30 text-emerald-300' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Citizen (Elena Rostova)</span>
                    {user?.role === 'citizen' && <span className="text-[10px] bg-emerald-700 px-1 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('officer');
                      setRoleDropdownOpen(false);
                      onNavigate('officer-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      user?.role === 'officer' ? 'bg-amber-600/30 text-amber-300' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Officer (Marcus Chen)</span>
                    {user?.role === 'officer' && <span className="text-[10px] bg-amber-700 px-1 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => {
                      demoLogin('admin');
                      setRoleDropdownOpen(false);
                      onNavigate('admin-dashboard');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between cursor-pointer ${
                      user?.role === 'admin' ? 'bg-rose-600/30 text-rose-300' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Authority Admin (Dr. Vance)</span>
                    {user?.role === 'admin' && <span className="text-[10px] bg-rose-700 px-1 rounded">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Portal Tab Quick Access */}
            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  currentTab === 'admin-dashboard'
                    ? 'bg-rose-900/60 text-rose-300 border-rose-500'
                    : 'bg-slate-800 text-rose-300 border-rose-500/40 hover:bg-slate-750'
                }`}
              >
                Admin Panel
              </button>
            )}

            {user?.role === 'officer' && (
              <button
                onClick={() => onNavigate('officer-dashboard')}
                className={`hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  currentTab === 'officer-dashboard'
                    ? 'bg-amber-900/60 text-amber-300 border-amber-500'
                    : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-750'
                }`}
              >
                Officer Queue
              </button>
            )}

            {user?.role === 'citizen' && (
              <button
                onClick={() => onNavigate('citizen-dashboard')}
                className={`hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  currentTab === 'citizen-dashboard'
                    ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500'
                    : 'bg-slate-800 text-emerald-300 border-emerald-500/40 hover:bg-slate-750'
                }`}
              >
                My Dashboard
              </button>
            )}

            {/* Notifications */}
            <div className="bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <NotificationDropdown onSelectReport={(id) => onNavigate('report-details', id)} />
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-2">
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => {
                onNavigate('map');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Hotspot Map
            </button>
            <button
              onClick={() => {
                onNavigate('reports');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Incident Registry
            </button>
            <button
              onClick={() => {
                onNavigate('analytics');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Analytics
            </button>
            <button
              onClick={() => {
                onNavigate('awareness');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Guidelines
            </button>
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  onNavigate(
                    user?.role === 'admin'
                      ? 'admin-dashboard'
                      : user?.role === 'officer'
                      ? 'officer-dashboard'
                      : 'citizen-dashboard'
                  );
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-emerald-400 bg-slate-800/80 cursor-pointer"
              >
                Go to {user?.role ? user.role.toUpperCase() : 'USER'} Portal
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
