import React, { useState } from 'react';
import { PollutionReport } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SeverityBadge } from '../components/SeverityBadge.tsx';
import {
  UserCheck,
  Search,
  Wrench,
  CheckCircle2,
  Clock,
  Eye,
  Calendar,
  MapPin,
  AlertCircle,
  FileCheck,
  Upload,
} from 'lucide-react';

interface OfficerDashboardProps {
  reports: PollutionReport[];
  onNavigate: (tab: string, reportId?: string) => void;
  onReportsChanged: () => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({ reports, onNavigate, onReportsChanged }) => {
  const { user, showToast } = useAuth();

  // Filter complaints assigned to this officer or relevant active complaints
  const assigned = reports.filter((r) => {
    if (r.assignments?.some((a) => a.officer_id === user?.id || a.officer_name.toLowerCase().includes(user?.name?.toLowerCase() || 'chen'))) {
      return true;
    }
    // Also include verified or under investigation cases
    return r.status === 'Assigned' || r.status === 'Under Investigation';
  });

  const displayList = assigned.length > 0 ? assigned : reports.slice(0, 4);

  // Quick Action Modal states
  const [selectedReport, setSelectedReport] = useState<PollutionReport | null>(null);
  const [modalType, setModalType] = useState<'note' | 'action' | null>(null);
  const [inputText, setInputText] = useState('');
  const [actionTitle, setActionTitle] = useState('');
  const [verificationImage, setVerificationImage] = useState(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !inputText) return;
    setSubmitting(true);
    try {
      const res = await api.addInvestigationNote(selectedReport.id, {
        notes: inputText,
        verification_image_url: verificationImage,
      });
      if (res.success) {
        showToast('Field inspection note recorded', 'success');
        onReportsChanged();
        setModalType(null);
        setSelectedReport(null);
        setInputText('');
      }
    } catch (err: any) {
      showToast(err.message || 'Error saving inspection note', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport || !actionTitle || !inputText) return;
    setSubmitting(true);
    try {
      const res = await api.addActionTaken(selectedReport.id, {
        action_title: actionTitle,
        action_details: inputText,
        action_date: new Date().toISOString(),
        mark_resolved: true,
      });
      if (res.success) {
        showToast(`Remediation action committed and report resolved!`, 'success');
        onReportsChanged();
        setModalType(null);
        setSelectedReport(null);
        setActionTitle('');
        setInputText('');
      }
    } catch (err: any) {
      showToast(err.message || 'Error recording action', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950 px-3 py-1 rounded-full border border-amber-400/30">
            Field Officer Operations Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Officer {user?.name || 'Marcus Chen'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {user?.department || 'Industrial Waste & Water Quality Division'} • Active Field Unit #08
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Caseload</span>
            <span className="text-xl font-black text-amber-400">{displayList.length} Active Probes</span>
          </div>
        </div>
      </div>

      {/* Assigned Cases Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Assigned Inspection Queue</h2>
            <p className="text-xs text-slate-500">Cases requiring on-site evidence collection and violation notices</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayList.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-slate-100">
                  <span className="font-mono font-bold text-xs text-slate-500">{r.report_number}</span>
                  <div className="flex items-center gap-1.5">
                    <SeverityBadge severity={r.severity} size="sm" />
                    <StatusBadge status={r.status} size="sm" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{r.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{r.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-medium">
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {r.address}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {new Date(r.reported_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Officer */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('report-details', r.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Full Dossier
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedReport(r);
                      setModalType('note');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" /> Add Notes
                  </button>

                  <button
                    onClick={() => {
                      setSelectedReport(r);
                      setModalType('action');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK MODAL 1: ADD INSPECTION NOTE */}
      {modalType === 'note' && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Log Field Findings for {selectedReport.report_number}
            </h3>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Officer Inspection Findings *
                </label>
                <textarea
                  rows={4}
                  required
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Record gas spectrometry readings, outfall culvert condition, violations observed..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  On-Site Evidence Image URL
                </label>
                <input
                  type="text"
                  value={verificationImage}
                  onChange={(e) => setVerificationImage(e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-indigo-700 text-white rounded-xl shadow-md"
                >
                  {submitting ? 'Saving...' : 'Commit Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK MODAL 2: RECORD ACTION & RESOLVE */}
      {modalType === 'action' && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Record Remediation & Close {selectedReport.report_number}
            </h3>
            <form onSubmit={handleSaveAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Action Taken Title *
                </label>
                <input
                  type="text"
                  required
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder="e.g. Mandatory filter replacement & site cleanup"
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Action Details & Remediation Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe containment actions executed, fines issued, and environmental conditions verified restored..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  {submitting ? 'Resolving...' : 'Commit & Mark Resolved'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
