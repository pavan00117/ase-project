import { User, PollutionReport, AnalyticsData, Notification, ReportStatus } from '../types.ts';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('ecowatch_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Authentication
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async register(data: { name: string; email: string; password: string; role?: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async demoLogin(role: 'citizen' | 'officer' | 'admin') {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // Reports
  async getReports(params?: {
    pollution_type?: string;
    severity?: string;
    status?: string;
    user_id?: string;
    search?: string;
    city?: string;
  }): Promise<{ success: boolean; data: PollutionReport[]; count: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v && v !== 'all') query.append(k, v);
      });
    }
    const res = await fetch(`${API_BASE}/reports?${query.toString()}`);
    return res.json();
  },

  async getReportById(id: string): Promise<{ success: boolean; data: PollutionReport }> {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    return res.json();
  },

  async createReport(data: any) {
    const res = await fetch(`${API_BASE}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateReportStatus(id: string, status: ReportStatus, remarks: string) {
    const res = await fetch(`${API_BASE}/reports/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ status, remarks }),
    });
    return res.json();
  },

  async assignOfficer(id: string, data: { officer_id: string; officer_name: string; department: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/reports/${id}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async addInvestigationNote(id: string, data: { notes: string; verification_image_url?: string }) {
    const res = await fetch(`${API_BASE}/reports/${id}/investigate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async addActionTaken(id: string, data: { action_title: string; action_details: string; action_date: string; mark_resolved?: boolean }) {
    const res = await fetch(`${API_BASE}/reports/${id}/action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteReport(id: string) {
    const res = await fetch(`${API_BASE}/reports/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  // AI
  async analyzeImage(image: string, mimeType?: string) {
    const res = await fetch(`${API_BASE}/ai/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, mimeType }),
    });
    return res.json();
  },

  async analyzeReport(description: string, category?: string) {
    const res = await fetch(`${API_BASE}/ai/analyze-report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description, category }),
    });
    return res.json();
  },

  async checkDuplicate(params: { latitude: number; longitude: number; pollution_type: string; title?: string; description?: string }) {
    const res = await fetch(`${API_BASE}/ai/check-duplicate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async getRiskSummary() {
    const res = await fetch(`${API_BASE}/ai/risk-summary`);
    return res.json();
  },

  // Admin & Analytics
  async getAnalytics(): Promise<{ success: boolean; data: AnalyticsData }> {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    return res.json();
  },

  async getUsers(): Promise<{ success: boolean; data: User[] }> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async updateUser(id: string, data: Partial<User>) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<{ success: boolean; data: Notification[] }> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return res.json();
  },
};
