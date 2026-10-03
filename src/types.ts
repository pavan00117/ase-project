export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'officer' | 'admin';
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export type PollutionType = 'air' | 'water' | 'noise' | 'waste' | 'industrial' | 'other';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Assigned'
  | 'Under Investigation'
  | 'Action Taken'
  | 'Resolved'
  | 'Closed';

export interface PollutionImage {
  id: string;
  report_id: string;
  image_url: string;
  caption?: string;
  uploaded_at: string;
}

export interface StatusHistory {
  id: string;
  report_id: string;
  old_status: ReportStatus;
  new_status: ReportStatus;
  changed_by_name: string;
  changed_by_role: string;
  remarks: string;
  changed_at: string;
}

export interface ReportAssignment {
  id: string;
  report_id: string;
  officer_id: string;
  officer_name: string;
  assigned_by_name: string;
  department: string;
  notes?: string;
  assigned_at: string;
}

export interface InvestigationNote {
  id: string;
  report_id: string;
  officer_name: string;
  notes: string;
  verification_image_url?: string;
  created_at: string;
}

export interface ActionTaken {
  id: string;
  report_id: string;
  officer_name: string;
  action_title: string;
  action_details: string;
  action_date: string;
  resolved_at?: string;
}

export interface AIAnalysisResult {
  detected_category: string;
  confidence: number;
  suggested_severity: SeverityLevel;
  analysis_text: string;
  warnings?: string[];
  suggested_title?: string;
  improved_description?: string;
}

export interface PollutionReport {
  id: string;
  report_number: string; // e.g. ECO-2026-000123
  user_id: string;
  citizen_name: string;
  citizen_email: string;
  pollution_type: PollutionType;
  title: string;
  description: string;
  severity: SeverityLevel;
  status: ReportStatus;
  source: string;
  suspected_entity?: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  reported_at: string;
  updated_at: string;
  images: PollutionImage[];
  status_history?: StatusHistory[];
  assignments?: ReportAssignment[];
  investigation_notes?: InvestigationNote[];
  actions_taken?: ActionTaken[];
  ai_analysis?: AIAnalysisResult;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  report_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface AnalyticsData {
  total_reports: number;
  pending_reports: number;
  verified_reports: number;
  under_investigation: number;
  resolved_reports: number;
  critical_reports: number;
  resolution_rate: number;
  average_resolution_days: number;
  by_category: { category: string; count: number; percentage: number }[];
  by_severity: { severity: string; count: number; color: string }[];
  by_status: { status: string; count: number }[];
  timeline: { date: string; count: number; resolved: number }[];
  hotspots: {
    city: string;
    area: string;
    latitude: number;
    longitude: number;
    count: number;
    primary_issue: string;
    severity_rank: string;
  }[];
}
