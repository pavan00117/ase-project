import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { PollutionReport } from './types.ts';
import { api } from './services/api.ts';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { CitizenDashboard } from './pages/CitizenDashboard.tsx';
import { ReportForm } from './pages/ReportForm.tsx';
import { ReportDetailsPage } from './pages/ReportDetailsPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';
import { OfficerDashboard } from './pages/OfficerDashboard.tsx';
import { PollutionMapPage } from './pages/PollutionMapPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { UserManagementPage } from './pages/UserManagementPage.tsx';
import { PublicReportsPage } from './pages/PublicReportsPage.tsx';
import { AwarenessPage } from './pages/AwarenessPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { RefreshCw } from 'lucide-react';

function MainApp() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reports, setReports] = useState<PollutionReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.getReports();
      if (res.success && res.data) {
        setReports(res.data);
      }
    } catch (e) {
      console.warn('Failed to load initial reports:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (tab: string, reportId?: string) => {
    if (reportId) {
      setSelectedReportId(reportId);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedReport = reports.find((r) => r.id === selectedReportId || r.report_number === selectedReportId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      <main className="flex-1">
        {loading && reports.length === 0 ? (
          <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="font-semibold text-slate-700">Connecting to EcoWatch Environmental Registry...</span>
          </div>
        ) : (
          <>
            {currentTab === 'landing' && <LandingPage reports={reports} onNavigate={handleNavigate} />}

            {currentTab === 'citizen-dashboard' && (
              <CitizenDashboard reports={reports} onNavigate={handleNavigate} />
            )}

            {currentTab === 'report-form' && (
              <ReportForm
                onNavigate={handleNavigate}
                onReportCreated={(newRep) => {
                  setReports((prev) => [newRep, ...prev]);
                }}
              />
            )}

            {currentTab === 'report-details' && selectedReport && (
              <ReportDetailsPage
                report={selectedReport}
                onBack={() => handleNavigate('reports')}
                onReportUpdated={(updated) => {
                  setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                }}
              />
            )}

            {currentTab === 'reports' && (
              <PublicReportsPage reports={reports} onNavigate={handleNavigate} />
            )}

            {currentTab === 'map' && (
              <PollutionMapPage reports={reports} onNavigate={handleNavigate} />
            )}

            {currentTab === 'analytics' && <AnalyticsPage />}

            {currentTab === 'admin-dashboard' && (
              <AdminDashboard reports={reports} onNavigate={handleNavigate} onReportsChanged={loadReports} />
            )}

            {currentTab === 'officer-dashboard' && (
              <OfficerDashboard reports={reports} onNavigate={handleNavigate} onReportsChanged={loadReports} />
            )}

            {currentTab === 'admin-users' && <UserManagementPage />}

            {currentTab === 'awareness' && <AwarenessPage />}

            {currentTab === 'login' && <LoginPage onNavigate={handleNavigate} />}

            {currentTab === 'register' && <RegisterPage onNavigate={handleNavigate} />}
          </>
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
