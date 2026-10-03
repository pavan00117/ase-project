import React, { useState } from 'react';
import { PollutionReport, ReportStatus } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SeverityBadge } from '../components/SeverityBadge.tsx';
import { Timeline } from '../components/Timeline.tsx';
import { PollutionMap } from '../components/PollutionMap.tsx';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Shield,
  FileCheck,
  CheckCircle2,
  XCircle,
  Wrench,
  Search,
  Sparkles,
  Building,
  Upload,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface ReportDetailsPageProps {
  report: PollutionReport;
  onBack: () => void;
  onReportUpdated: (updated: PollutionReport) => void;
}

export const ReportDetailsPage: React.FC<ReportDetailsPageProps> = ({ report, onBack, onReportUpdated }) => {
  const { user, showToast } = useAuth();

  // Dialog & Form states
  const [activeModal, setActiveModal] = useState<'status' | 'assign' | 'investigate' | 'action' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Status Change State
  const [newStatus, setNewStatus] = useState<ReportStatus>(report.status);
  const [statusRemarks, setStatusRemarks] = useState('');

  // Assign Officer State
  const [assigneeId, setAssigneeId] = useState('usr-officer-1');
  const [assigneeName, setAssigneeName] = useState('Marcus Chen');
  const [department, setDepartment] = useState('Industrial Waste & Water Quality Division');
  const [assignNotes, setAssignNotes] = useState('');

  // Investigation Note State
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [verificationImage, setVerificationImage] = useState(
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
  );

  // Action Taken State
  const [actionTitle, setActionTitle] = useState('');
  const [actionDetails, setActionDetails] = useState('');
  const [markResolved, setMarkResolved] = useState(true);

  // Handlers
  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.updateReportStatus(report.id, newStatus, statusRemarks || `Updated to ${newStatus}`);
      if (res.success && res.data) {
        onReportUpdated(res.data);
        showToast(`Status updated to ${newStatus}`, 'success');
        setActiveModal(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.assignOfficer(report.id, {
        officer_id: assigneeId,
        officer_name: assigneeName,
        department,
        notes: assignNotes,
      });
      if (res.success && res.data) {
        onReportUpdated(res.data);
        showToast(`Report assigned to ${assigneeName}`, 'success');
        setActiveModal(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to assign officer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!investigationNotes) return;
    setSubmitting(true);
    try {
      const res = await api.addInvestigationNote(report.id, {
        notes: investigationNotes,
        verification_image_url: verificationImage,
      });
      if (res.success && res.data) {
        onReportUpdated(res.data);
        showToast('Field inspection notes recorded', 'success');
        setActiveModal(null);
        setInvestigationNotes('');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to log investigation', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle || !actionDetails) return;
    setSubmitting(true);
    try {
      const res = await api.addActionTaken(report.id, {
        action_title: actionTitle,
        action_details: actionDetails,
        action_date: new Date().toISOString(),
        mark_resolved: markResolved,
      });
      if (res.success && res.data) {
        onReportUpdated(res.data);
        showToast(markResolved ? 'Incident remediated and resolved!' : 'Action taken logged', 'success');
        setActiveModal(null);
        setActionTitle('');
        setActionDetails('');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to record action', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const canManage = user?.role === 'admin' || user?.role === 'officer';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incident List
        </button>

        {/* Authority Action Trigger Bar */}
        {canManage && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:inline">
              Official Enforcement Actions:
            </span>

            {isAdmin && (
              <button
                onClick={() => setActiveModal('assign')}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <User className="w-3.5 h-3.5" /> Assign Officer
              </button>
            )}

            <button
              onClick={() => setActiveModal('investigate')}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" /> Add Inspection Notes
            </button>

            <button
              onClick={() => setActiveModal('action')}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" /> Record Remediation Action
            </button>

            <button
              onClick={() => setActiveModal('status')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              Change Status
            </button>
          </div>
        )}
      </div>

      {/* Main Details Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-800 tracking-tight">
              {report.report_number}
            </span>
            <span className="text-xs uppercase font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              {report.pollution_type} Pollution
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SeverityBadge severity={report.severity} />
            <StatusBadge status={report.status} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{report.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              Reported: {new Date(report.reported_at).toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              {report.address}, {report.city}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              Filed by: {report.citizen_name}
            </span>
          </div>
        </div>

        {/* Description Body */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Incident Statement & Observations</h3>
          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{report.description}</p>
          {report.suspected_entity && (
            <div className="pt-2 border-t border-slate-200/80 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Suspected Source / Organization:</span> {report.suspected_entity}
            </div>
          )}
        </div>

        {/* AI Analysis Result Card (if attached) */}
        {report.ai_analysis && (
          <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Environmental Telemetry Analysis
              </span>
              <span className="bg-purple-200 text-purple-900 px-2 py-0.5 rounded font-black text-[10px]">
                {report.ai_analysis.confidence}% Confidence
              </span>
            </div>
            <p className="text-purple-800 leading-relaxed">{report.ai_analysis.analysis_text}</p>
          </div>
        )}
      </div>

      {/* Grid: Evidence Photos + Interactive Location Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evidence Photos */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600" />
            Citizen Photo Evidence ({report.images?.length || 0})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.images && report.images.length > 0 ? (
              report.images.map((img, i) => (
                <div key={i} className="group rounded-2xl overflow-hidden border border-slate-200 aspect-video relative bg-slate-100">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-2.5 text-[11px] text-white font-medium">
                    {img.caption || `Evidence Photo ${i + 1}`}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic col-span-2">No photo evidence submitted.</p>
            )}
          </div>
        </div>

        {/* Geospatial Map */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Incident Coordinates ({report.latitude.toFixed(4)}, {report.longitude.toFixed(4)})
          </h3>
          <PollutionMap reports={[report]} height="250px" />
        </div>
      </div>

      {/* Official Actions & Inspection Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Officer Inspection Notes */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4 text-indigo-600" />
              Officer Field Inspection Notes
            </h3>
            {canManage && (
              <button
                onClick={() => setActiveModal('investigate')}
                className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                + Add Note
              </button>
            )}
          </div>

          <div className="space-y-3">
            {report.investigation_notes && report.investigation_notes.length > 0 ? (
              report.investigation_notes.map((note, idx) => (
                <div key={idx} className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900">{note.officer_name} (Field Officer)</span>
                    <span className="text-[10px] text-indigo-400">{new Date(note.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-indigo-950 leading-relaxed">{note.notes}</p>
                  {note.verification_image_url && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-indigo-800 block mb-1">On-Site Verification Image:</span>
                      <img
                        src={note.verification_image_url}
                        alt="Verification"
                        className="w-36 h-24 object-cover rounded-xl border border-indigo-200"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No field inspection notes recorded yet.</p>
            )}
          </div>
        </div>

        {/* Formal Remediation Actions Taken */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Remediation Actions Taken
            </h3>
            {canManage && (
              <button
                onClick={() => setActiveModal('action')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                + Record Action
              </button>
            )}
          </div>

          <div className="space-y-3">
            {report.actions_taken && report.actions_taken.length > 0 ? (
              report.actions_taken.map((act, idx) => (
                <div key={idx} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 text-sm">{act.action_title}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">{new Date(act.action_date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-emerald-950 leading-relaxed">{act.action_details}</p>
                  <div className="text-[10px] text-emerald-700 font-medium pt-1">
                    Officer: <span className="font-bold">{act.officer_name}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No formal remediation actions documented yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Timeline Audit Trail */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-base font-bold text-slate-900">Official Lifecycle Progression & Audit Log</h3>
        <Timeline report={report} />
      </div>

      {/* MODAL 1: CHANGE STATUS */}
      {activeModal === 'status' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Update Report Status</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ReportStatus)}
                  className="w-full text-xs font-semibold px-3 py-2 border rounded-xl"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Under Investigation">Under Investigation</option>
                  <option value="Action Taken">Action Taken</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Audit Remarks</label>
                <textarea
                  rows={3}
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="Reason for status change, laboratory confirmation, etc..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl shadow-md"
                >
                  {submitting ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN OFFICER */}
      {activeModal === 'assign' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Assign Environmental Officer</h3>
            <form onSubmit={handleAssignOfficer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Select Officer</label>
                <select
                  value={assigneeName}
                  onChange={(e) => {
                    setAssigneeName(e.target.value);
                    if (e.target.value === 'Marcus Chen') {
                      setAssigneeId('usr-officer-1');
                      setDepartment('Industrial Waste & Water Quality Division');
                    } else {
                      setAssigneeId('usr-officer-2');
                      setDepartment('Air Pollution Control & Acoustic Health');
                    }
                  }}
                  className="w-full text-xs font-semibold px-3 py-2 border rounded-xl"
                >
                  <option value="Marcus Chen">Marcus Chen (Industrial Waste & Water)</option>
                  <option value="Sarah Jenkins">Sarah Jenkins (Air & Acoustic Health)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Priority Directive / Notes</label>
                <textarea
                  rows={3}
                  value={assignNotes}
                  onChange={(e) => setAssignNotes(e.target.value)}
                  placeholder="e.g. Conduct immediate chemical spectrometry and check outfall drainage pipe..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-purple-700 text-white rounded-xl shadow-md"
                >
                  {submitting ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD INSPECTION NOTES */}
      {activeModal === 'investigate' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Log Field Inspection Evidence</h3>
            <form onSubmit={handleAddInvestigation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Inspection Findings *</label>
                <textarea
                  rows={4}
                  required
                  value={investigationNotes}
                  onChange={(e) => setInvestigationNotes(e.target.value)}
                  placeholder="Detailed on-site findings, instrument readings, samples collected, violations observed..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Verification Image URL
                </label>
                <input
                  type="text"
                  value={verificationImage}
                  onChange={(e) => setVerificationImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-indigo-700 text-white rounded-xl shadow-md"
                >
                  {submitting ? 'Saving...' : 'Save Inspection Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: RECORD ACTION TAKEN */}
      {activeModal === 'action' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Record Remediation Action Taken</h3>
            <form onSubmit={handleRecordAction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Action Title *</label>
                <input
                  type="text"
                  required
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder="e.g. Deployed 300m floating boom & issued Cease Order #99"
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Action Details *</label>
                <textarea
                  rows={4}
                  required
                  value={actionDetails}
                  onChange={(e) => setActionDetails(e.target.value)}
                  placeholder="Comprehensive details on clean-up operations, equipment used, fines issued, or facility closures..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mark-resolved"
                  checked={markResolved}
                  onChange={(e) => setMarkResolved(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="mark-resolved" className="text-xs font-semibold text-slate-800 cursor-pointer">
                  Mark this complaint as officially "Resolved"
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-bold bg-emerald-700 text-white rounded-xl shadow-md"
                >
                  {submitting ? 'Recording...' : 'Commit Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
