import React, { useState, useEffect } from 'react';
import { PollutionReport, ReportStatus, SeverityLevel } from '../types.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { StatusBadge } from '../components/StatusBadge.tsx';
import { SeverityBadge } from '../components/SeverityBadge.tsx';
import {
  ShieldAlert,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  UserCheck,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCw,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  reports: PollutionReport[];
  onNavigate: (tab: string, reportId?: string) => void;
  onReportsChanged: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, onNavigate, onReportsChanged }) => {
  const { showToast } = useAuth();

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // AI Risk Summary
  const [aiRiskSummary, setAiRiskSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Quick Action Dialogs
  const [targetReport, setTargetReport] = useState<PollutionReport | null>(null);
  const [actionType, setActionType] = useState<'verify' | 'reject' | 'delete' | null>(null);
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadRiskSummary();
  }, []);

  const loadRiskSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await api.getRiskSummary();
      if (res.success) {
        setAiRiskSummary(res.summary);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Top Metrics
  const total = reports.length;
  const pending = reports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
  const verified = reports.filter((r) => r.status === 'Verified').length;
  const underInvest = reports.filter((r) => r.status === 'Under Investigation' || r.status === 'Assigned').length;
  const resolved = reports.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;
  const critical = reports.filter((r) => r.severity === 'critical').length;

  // Filtered reports
  const filtered = reports.filter((r) => {
    if (filterType !== 'all' && r.pollution_type !== filterType) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.report_number.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        r.citizen_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Quick action confirmation execution
  const executeAction = async () => {
    if (!targetReport || !actionType) return;
    setProcessing(true);
    try {
      if (actionType === 'verify') {
        await api.updateReportStatus(targetReport.id, 'Verified', remarks || 'Verified by Central Environmental Admin.');
        showToast(`Report ${targetReport.report_number} officially verified.`, 'success');
      } else if (actionType === 'reject') {
        await api.updateReportStatus(targetReport.id, 'Rejected', remarks || 'Insufficient evidence or non-jurisdictional.');
        showToast(`Report ${targetReport.report_number} marked as rejected.`, 'info');
      } else if (actionType === 'delete') {
        await api.deleteReport(targetReport.id);
        showToast(`Report ${targetReport.report_number} permanently removed.`, 'info');
      }
      onReportsChanged();
      setTargetReport(null);
      setActionType(null);
      setRemarks('');
    } catch (e: any) {
      showToast(e.message || 'Action failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['ReportNumber,Type,Title,Severity,Status,Citizen,City,Address,ReportedAt'];
    const rows = filtered.map((r) =>
      [
        r.report_number,
        r.pollution_type,
        `"${r.title.replace(/"/g, '""')}"`,
        r.severity,
        r.status,
        `"${r.citizen_name}"`,
        `"${r.city}"`,
        `"${r.address.replace(/"/g, '""')}"`,
        r.reported_at,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ecowatch_reports_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported filtered reports to CSV.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
            Authority Command Center
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Environmental Monitoring & Report Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time complaint adjudication, rapid officer dispatch, and cross-district forensic tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin-users')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-xs cursor-pointer"
          >
            Manage Users & Officers
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            Open Analytics Suite
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Total Reports</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{total}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-amber-600 font-bold uppercase tracking-wider block">Pending Review</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">{pending}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-blue-600 font-bold uppercase tracking-wider block">Verified</span>
          <span className="text-2xl font-black text-blue-700 mt-1 block">{verified}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider block">Under Probe</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{underInvest}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider block">Resolved</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{resolved}</span>
        </div>
        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-[11px] text-rose-700 font-bold uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" /> Critical
          </span>
          <span className="text-2xl font-black text-rose-700 mt-1 block">{critical}</span>
        </div>
      </div>

      {/* AI Regional Pollution Risk Summary Card */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">AI Environmental Intelligence Risk Summary</h3>
              <p className="text-[11px] text-purple-300">Live synthesis grounded in active registry data</p>
            </div>
          </div>
          <button
            onClick={loadRiskSummary}
            disabled={loadingSummary}
            className="px-3.5 py-1.5 rounded-xl bg-purple-700/60 hover:bg-purple-600 text-purple-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loadingSummary ? 'animate-spin' : ''}`} />
            {loadingSummary ? 'Synthesizing...' : 'Refresh AI Analysis'}
          </button>
        </div>

        <div className="bg-purple-950/50 rounded-2xl p-4 border border-purple-800/60 text-xs text-purple-100 leading-relaxed font-sans whitespace-pre-wrap">
          {aiRiskSummary || 'Generating live AI risk briefing based on active database cases...'}
        </div>
      </div>

      {/* Report Management Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, title, citizen, address, or city..."
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="air">Air</option>
              <option value="water">Water</option>
              <option value="waste">Waste</option>
              <option value="industrial">Industrial</option>
              <option value="noise">Noise</option>
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
              <option value="Rejected">Rejected</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No matching reports found with active filters.
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.report_number}</td>
                    <td className="py-3 px-4 uppercase font-bold text-[10px] text-slate-500">{r.pollution_type}</td>
                    <td className="py-3 px-4 max-w-[220px]">
                      <div className="font-bold text-slate-900 truncate">{r.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{r.description}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[150px] truncate text-slate-600">
                      {r.address}
                    </td>
                    <td className="py-3 px-4">
                      <SeverityBadge severity={r.severity} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={r.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-[11px] font-semibold text-slate-800">{r.citizen_name}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigate('report-details', r.id)}
                          title="View Full Case Dossier"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {r.status === 'Submitted' && (
                          <button
                            onClick={() => {
                              setTargetReport(r);
                              setActionType('verify');
                            }}
                            title="Verify Report"
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setTargetReport(r);
                            setActionType('delete');
                          }}
                          title="Delete Report"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of{' '}
            {filtered.length} reports
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {actionType && targetReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              {actionType === 'verify' ? 'Confirm Official Verification' : actionType === 'delete' ? 'Delete Report Record' : 'Reject Report'}
            </h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to perform this action on report{' '}
              <strong className="text-slate-900">{targetReport.report_number}</strong> ({targetReport.title})?
            </p>

            {actionType !== 'delete' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Audit Remarks
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Official rationale entered into legal log..."
                  className="w-full text-xs px-3 py-2 border rounded-xl"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionType(null);
                  setTargetReport(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeAction}
                disabled={processing}
                className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-md ${
                  actionType === 'delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
