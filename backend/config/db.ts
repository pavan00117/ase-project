import { db } from '../../src/db/index.ts';
import { users, pollutionReports, notifications, auditLogs } from '../../src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { PollutionReport, User, Notification, ReportStatus, SeverityLevel, PollutionType, AnalyticsData } from '../../src/types.ts';
import { SEED_REPORTS, SEED_USERS, SEED_NOTIFICATIONS } from '../data/seedData.ts';

// In-memory cache synced with database
let inMemoryUsers: (User & { password_hash?: string })[] = JSON.parse(JSON.stringify(SEED_USERS));
let inMemoryReports: PollutionReport[] = JSON.parse(JSON.stringify(SEED_REPORTS));
let inMemoryNotifications: Notification[] = JSON.parse(JSON.stringify(SEED_NOTIFICATIONS));

export async function initDatabase() {
  if (process.env.SQL_HOST) {
    console.log('[Cloud SQL] Initializing with Drizzle and Cloud SQL instance in asia-southeast1...');
    try {
      await seedCloudSqlIfEmpty();
    } catch (err) {
      console.warn('[Cloud SQL] Initial seed note:', err);
    }
  } else {
    console.log('[DB] Running with local data repository.');
  }
}

async function seedCloudSqlIfEmpty() {
  if (!process.env.SQL_HOST) return;
  try {
    const existing = await db.select().from(pollutionReports).limit(1);
    if (existing.length === 0) {
      console.log('[Cloud SQL] Seeding initial reports into Cloud SQL...');
      for (const r of SEED_REPORTS) {
        await db.insert(pollutionReports).values({
          reportNumber: r.report_number,
          userId: r.user_id,
          citizenName: r.citizen_name,
          citizenEmail: r.citizen_email,
          pollutionType: r.pollution_type,
          title: r.title,
          description: r.description,
          severity: r.severity,
          status: r.status,
          source: r.source,
          suspectedEntity: r.suspected_entity,
          latitude: String(r.latitude),
          longitude: String(r.longitude),
          address: r.address,
          city: r.city,
          reportedAt: new Date(r.reported_at),
          updatedAt: new Date(r.updated_at),
          reportData: r,
        }).onConflictDoNothing();
      }
    } else {
      // Load from Cloud SQL
      const rows = await db.select().from(pollutionReports).orderBy(desc(pollutionReports.reportedAt));
      if (rows.length > 0) {
        inMemoryReports = rows.map((r) => r.reportData as PollutionReport).filter(Boolean);
      }
    }

    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length === 0) {
      console.log('[Cloud SQL] Seeding initial users into Cloud SQL...');
      for (const u of SEED_USERS) {
        await db.insert(users).values({
          uid: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          phone: u.phone,
          department: u.department,
          status: u.status,
        }).onConflictDoNothing();
      }
    }
  } catch (err) {
    console.error('[Cloud SQL] Seed check failed:', err);
  }
}

// Data Access Methods
export async function getReports(filters?: {
  pollution_type?: string;
  severity?: string;
  status?: string;
  user_id?: string;
  search?: string;
  city?: string;
}): Promise<PollutionReport[]> {
  try {
    if (process.env.SQL_HOST) {
      const rows = await db.select().from(pollutionReports).orderBy(desc(pollutionReports.reportedAt));
      if (rows.length > 0) {
        inMemoryReports = rows.map((row) => row.reportData as PollutionReport).filter(Boolean);
      }
    }
  } catch (error) {
    console.error('Database query for reports failed:', error);
  }

  let list = [...inMemoryReports];

  if (filters?.pollution_type && filters.pollution_type !== 'all') {
    list = list.filter((r) => r.pollution_type.toLowerCase() === filters.pollution_type!.toLowerCase());
  }
  if (filters?.severity && filters.severity !== 'all') {
    list = list.filter((r) => r.severity.toLowerCase() === filters.severity!.toLowerCase());
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((r) => r.status.toLowerCase() === filters.status!.toLowerCase());
  }
  if (filters?.user_id) {
    list = list.filter((r) => r.user_id === filters.user_id);
  }
  if (filters?.city && filters.city !== 'all') {
    list = list.filter((r) => r.city.toLowerCase().includes(filters.city!.toLowerCase()));
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.report_number.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q) ||
        (r.suspected_entity && r.suspected_entity.toLowerCase().includes(q))
    );
  }

  return list.sort((a, b) => new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime());
}

export async function getReportById(id: string): Promise<PollutionReport | undefined> {
  const cached = inMemoryReports.find((r) => r.id === id || r.report_number.toUpperCase() === id.toUpperCase());
  if (cached) return cached;

  if (process.env.SQL_HOST) {
    try {
      const rows = await db.select().from(pollutionReports).where(eq(pollutionReports.reportNumber, id));
      if (rows.length > 0) {
        return rows[0].reportData as PollutionReport;
      }
    } catch (e) {
      console.error('Failed to get report by id:', e);
    }
  }
  return undefined;
}

export async function createReport(data: Omit<PollutionReport, 'id' | 'report_number' | 'reported_at' | 'updated_at' | 'status'> & { status?: ReportStatus }): Promise<PollutionReport> {
  const count = inMemoryReports.length + 101;
  const nextNum = String(count).padStart(6, '0');
  const reportNumber = `ECO-2026-${nextNum}`;
  const now = new Date().toISOString();

  const newReport: PollutionReport = {
    ...data,
    id: `rep-${Date.now()}`,
    report_number: reportNumber,
    status: data.status || 'Submitted',
    reported_at: now,
    updated_at: now,
    images: data.images || [],
    status_history: [
      {
        id: `hist-${Date.now()}-1`,
        report_id: `rep-${Date.now()}`,
        old_status: 'Submitted',
        new_status: 'Submitted',
        changed_by_name: data.citizen_name,
        changed_by_role: 'citizen',
        remarks: 'Pollution incident report filed and registered into system.',
        changed_at: now,
      },
    ],
    assignments: [],
    investigation_notes: [],
    actions_taken: [],
    ai_analysis: data.ai_analysis,
  };

  inMemoryReports.unshift(newReport);

  createNotification({
    user_id: newReport.user_id,
    title: 'Report Received',
    message: `Your pollution incident has been logged as ${newReport.report_number}. Environmental authorities have been notified.`,
    type: 'info',
    report_id: newReport.id,
  });

  if (process.env.SQL_HOST) {
    try {
      await db.insert(pollutionReports).values({
        reportNumber: newReport.report_number,
        userId: newReport.user_id,
        citizenName: newReport.citizen_name,
        citizenEmail: newReport.citizen_email,
        pollutionType: newReport.pollution_type,
        title: newReport.title,
        description: newReport.description,
        severity: newReport.severity,
        status: newReport.status,
        source: newReport.source,
        suspectedEntity: newReport.suspected_entity,
        latitude: String(newReport.latitude),
        longitude: String(newReport.longitude),
        address: newReport.address,
        city: newReport.city,
        reportedAt: new Date(newReport.reported_at),
        updatedAt: new Date(newReport.updated_at),
        reportData: newReport,
      });
    } catch (e) {
      console.error('Failed to insert report into Cloud SQL:', e);
    }
  }

  return newReport;
}

export async function updateReportStatus(
  id: string,
  newStatus: ReportStatus,
  changedByName: string,
  changedByRole: string,
  remarks: string
): Promise<PollutionReport | null> {
  const report = inMemoryReports.find((r) => r.id === id);
  if (!report) return null;

  const oldStatus = report.status;
  report.status = newStatus;
  report.updated_at = new Date().toISOString();

  if (!report.status_history) report.status_history = [];
  report.status_history.push({
    id: `hist-${Date.now()}`,
    report_id: report.id,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by_name: changedByName,
    changed_by_role: changedByRole,
    remarks: remarks || `Status changed from ${oldStatus} to ${newStatus}`,
    changed_at: report.updated_at,
  });

  createNotification({
    user_id: report.user_id,
    title: `Status Update: ${newStatus}`,
    message: `Report ${report.report_number} is now marked as "${newStatus}". Remarks: ${remarks || 'Status updated by environmental official.'}`,
    type: newStatus === 'Resolved' ? 'success' : newStatus === 'Rejected' ? 'error' : 'info',
    report_id: report.id,
  });

  if (process.env.SQL_HOST) {
    try {
      await db
        .update(pollutionReports)
        .set({
          status: report.status,
          updatedAt: new Date(report.updated_at),
          reportData: report,
        })
        .where(eq(pollutionReports.reportNumber, report.report_number));
    } catch (e) {
      console.error('Failed to update report in Cloud SQL:', e);
    }
  }

  return report;
}

export async function assignReport(
  id: string,
  officerId: string,
  officerName: string,
  assignedByName: string,
  department: string,
  notes?: string
): Promise<PollutionReport | null> {
  const report = inMemoryReports.find((r) => r.id === id);
  if (!report) return null;

  const now = new Date().toISOString();
  if (!report.assignments) report.assignments = [];

  report.assignments.push({
    id: `asg-${Date.now()}`,
    report_id: report.id,
    officer_id: officerId,
    officer_name: officerName,
    assigned_by_name: assignedByName,
    department: department || 'General Environmental Inspection',
    notes,
    assigned_at: now,
  });

  const oldStatus = report.status;
  report.status = 'Assigned';
  report.updated_at = now;

  if (!report.status_history) report.status_history = [];
  report.status_history.push({
    id: `hist-${Date.now()}`,
    report_id: report.id,
    old_status: oldStatus,
    new_status: 'Assigned',
    changed_by_name: assignedByName,
    changed_by_role: 'admin',
    remarks: `Assigned to Officer ${officerName} (${department}). Note: ${notes || 'Action required.'}`,
    changed_at: now,
  });

  createNotification({
    user_id: officerId,
    title: 'New Case Assigned',
    message: `You were assigned to investigate report ${report.report_number} (${report.title}).`,
    type: 'warning',
    report_id: report.id,
  });

  createNotification({
    user_id: report.user_id,
    title: 'Officer Assigned',
    message: `Environmental Officer ${officerName} (${department}) has been assigned to your complaint.`,
    type: 'info',
    report_id: report.id,
  });

  if (process.env.SQL_HOST) {
    try {
      await db
        .update(pollutionReports)
        .set({
          status: report.status,
          updatedAt: new Date(report.updated_at),
          reportData: report,
        })
        .where(eq(pollutionReports.reportNumber, report.report_number));
    } catch (e) {
      console.error('Failed to update assignment in Cloud SQL:', e);
    }
  }

  return report;
}

export async function addInvestigationNote(
  id: string,
  officerName: string,
  notes: string,
  verificationImageUrl?: string
): Promise<PollutionReport | null> {
  const report = inMemoryReports.find((r) => r.id === id);
  if (!report) return null;

  const now = new Date().toISOString();
  if (!report.investigation_notes) report.investigation_notes = [];

  report.investigation_notes.push({
    id: `note-${Date.now()}`,
    report_id: report.id,
    officer_name: officerName,
    notes,
    verification_image_url: verificationImageUrl,
    created_at: now,
  });

  if (report.status === 'Assigned' || report.status === 'Verified') {
    const oldStatus = report.status;
    report.status = 'Under Investigation';
    report.updated_at = now;
    if (!report.status_history) report.status_history = [];
    report.status_history.push({
      id: `hist-${Date.now()}`,
      report_id: report.id,
      old_status: oldStatus,
      new_status: 'Under Investigation',
      changed_by_name: officerName,
      changed_by_role: 'officer',
      remarks: 'Field inspection and evidence gathering initiated.',
      changed_at: now,
    });
  }

  if (process.env.SQL_HOST) {
    try {
      await db
        .update(pollutionReports)
        .set({
          status: report.status,
          updatedAt: new Date(report.updated_at),
          reportData: report,
        })
        .where(eq(pollutionReports.reportNumber, report.report_number));
    } catch (e) {
      console.error('Failed to update notes in Cloud SQL:', e);
    }
  }

  return report;
}

export async function addActionTaken(
  id: string,
  officerName: string,
  actionTitle: string,
  actionDetails: string,
  actionDate: string,
  markResolved = true
): Promise<PollutionReport | null> {
  const report = inMemoryReports.find((r) => r.id === id);
  if (!report) return null;

  const now = new Date().toISOString();
  if (!report.actions_taken) report.actions_taken = [];

  report.actions_taken.push({
    id: `act-${Date.now()}`,
    report_id: report.id,
    officer_name: officerName,
    action_title: actionTitle,
    action_details: actionDetails,
    action_date: actionDate || now,
    resolved_at: markResolved ? now : undefined,
  });

  const oldStatus = report.status;
  const newStatus: ReportStatus = markResolved ? 'Resolved' : 'Action Taken';
  report.status = newStatus;
  report.updated_at = now;

  if (!report.status_history) report.status_history = [];
  report.status_history.push({
    id: `hist-${Date.now()}`,
    report_id: report.id,
    old_status: oldStatus,
    new_status: newStatus,
    changed_by_name: officerName,
    changed_by_role: 'officer',
    remarks: `Action taken: "${actionTitle}". ${markResolved ? 'Case marked as Resolved.' : ''}`,
    changed_at: now,
  });

  createNotification({
    user_id: report.user_id,
    title: markResolved ? 'Complaint Resolved!' : 'Action Taken on Your Report',
    message: `${actionTitle}: ${actionDetails}`,
    type: 'success',
    report_id: report.id,
  });

  if (process.env.SQL_HOST) {
    try {
      await db
        .update(pollutionReports)
        .set({
          status: report.status,
          updatedAt: new Date(report.updated_at),
          reportData: report,
        })
        .where(eq(pollutionReports.reportNumber, report.report_number));
    } catch (e) {
      console.error('Failed to update action in Cloud SQL:', e);
    }
  }

  return report;
}

export async function deleteReport(id: string, adminName: string): Promise<boolean> {
  const idx = inMemoryReports.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  const deleted = inMemoryReports.splice(idx, 1)[0];

  if (process.env.SQL_HOST) {
    try {
      await db.delete(pollutionReports).where(eq(pollutionReports.reportNumber, deleted.report_number));
      await db.insert(auditLogs).values({
        userName: adminName,
        action: 'DELETE_REPORT',
        details: `Deleted report ${deleted.report_number} (${deleted.title})`,
      });
    } catch (e) {
      console.error('Failed to delete report in Cloud SQL:', e);
    }
  }

  return true;
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const total = inMemoryReports.length;
  const pending = inMemoryReports.filter((r) => r.status === 'Submitted' || r.status === 'Under Review').length;
  const verified = inMemoryReports.filter((r) => r.status === 'Verified').length;
  const underInvest = inMemoryReports.filter((r) => r.status === 'Under Investigation' || r.status === 'Assigned').length;
  const resolved = inMemoryReports.filter((r) => r.status === 'Resolved' || r.status === 'Closed').length;
  const critical = inMemoryReports.filter((r) => r.severity === 'critical').length;

  const categories: Record<string, number> = {};
  const severities: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };
  const statuses: Record<string, number> = {};
  const locations: Record<string, { count: number; primary: string; lat: number; lng: number; sev: string }> = {};

  inMemoryReports.forEach((r) => {
    categories[r.pollution_type] = (categories[r.pollution_type] || 0) + 1;
    severities[r.severity] = (severities[r.severity] || 0) + 1;
    statuses[r.status] = (statuses[r.status] || 0) + 1;

    const key = `${r.city} - ${r.address.split(',')[0]}`;
    if (!locations[key]) {
      locations[key] = {
        count: 0,
        primary: r.pollution_type,
        lat: r.latitude,
        lng: r.longitude,
        sev: r.severity,
      };
    }
    locations[key].count += 1;
  });

  const byCategory = Object.entries(categories).map(([category, count]) => ({
    category: category.toUpperCase(),
    count,
    percentage: Math.round((count / (total || 1)) * 100),
  }));

  const severityColors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#f97316',
    critical: '#ef4444',
  };

  const bySeverity = Object.entries(severities).map(([sev, count]) => ({
    severity: sev.charAt(0).toUpperCase() + sev.slice(1),
    count,
    color: severityColors[sev] || '#64748b',
  }));

  const byStatus = Object.entries(statuses).map(([st, count]) => ({
    status: st,
    count,
  }));

  const hotspots = Object.entries(locations)
    .map(([key, data]) => ({
      city: key.split(' - ')[0],
      area: key.split(' - ')[1] || key,
      latitude: data.lat,
      longitude: data.lng,
      count: data.count,
      primary_issue: data.primary.toUpperCase(),
      severity_rank: data.sev.toUpperCase(),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const timelineDays: Record<string, { count: number; resolved: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    timelineDays[dateStr] = { count: 0, resolved: 0 };
  }

  inMemoryReports.forEach((r) => {
    const d = r.reported_at.split('T')[0];
    if (timelineDays[d]) {
      timelineDays[d].count += 1;
      if (r.status === 'Resolved' || r.status === 'Closed' || r.status === 'Action Taken') {
        timelineDays[d].resolved += 1;
      }
    }
  });

  const timeline = Object.entries(timelineDays).map(([date, val]) => ({
    date,
    count: val.count,
    resolved: val.resolved,
  }));

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return {
    total_reports: total,
    pending_reports: pending,
    verified_reports: verified,
    under_investigation: underInvest,
    resolved_reports: resolved,
    critical_reports: critical,
    resolution_rate: resolutionRate,
    average_resolution_days: 2.8,
    by_category: byCategory,
    by_severity: bySeverity,
    by_status: byStatus,
    timeline,
    hotspots,
  };
}

export async function getUsers() {
  if (process.env.SQL_HOST) {
    try {
      const rows = await db.select().from(users);
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.uid,
          name: r.name,
          email: r.email,
          role: r.role as any,
          phone: r.phone || undefined,
          department: r.department || undefined,
          status: r.status as any,
          created_at: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.error('Failed to get users from Cloud SQL:', e);
    }
  }
  return inMemoryUsers.map(({ password_hash, ...u }) => u);
}

export async function updateUser(id: string, updates: Partial<User>) {
  const user = inMemoryUsers.find((u) => u.id === id);
  if (user) {
    Object.assign(user, updates);
  }
  if (process.env.SQL_HOST) {
    try {
      await db
        .update(users)
        .set({
          role: updates.role,
          status: updates.status,
          department: updates.department,
          phone: updates.phone,
        })
        .where(eq(users.uid, id));
    } catch (e) {
      console.error('Failed to update user in Cloud SQL:', e);
    }
  }
  return user || null;
}

export async function findUserByEmail(email: string) {
  return inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function createUser(data: Omit<User, 'id' | 'created_at'> & { password_hash?: string }) {
  const newUser = {
    ...data,
    id: `usr-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  inMemoryUsers.push(newUser);
  if (process.env.SQL_HOST) {
    try {
      await db.insert(users).values({
        uid: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        department: newUser.department,
        status: newUser.status,
      });
    } catch (e) {
      console.error('Failed to insert user in Cloud SQL:', e);
    }
  }
  return newUser;
}

export async function getNotifications(userId?: string) {
  if (!userId) return inMemoryNotifications;
  return inMemoryNotifications.filter((n) => n.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createNotification(data: Omit<Notification, 'id' | 'created_at' | 'is_read'>) {
  const notif: Notification = {
    ...data,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  inMemoryNotifications.unshift(notif);
  if (process.env.SQL_HOST) {
    try {
      await db.insert(notifications).values({
        userId: notif.user_id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        reportId: notif.report_id,
        isRead: false,
      });
    } catch (e) {
      console.error('Failed to insert notification in Cloud SQL:', e);
    }
  }
  return notif;
}

export async function markNotificationRead(id: string) {
  const n = inMemoryNotifications.find((item) => item.id === id);
  if (n) n.is_read = true;
  return n;
}

export async function markAllNotificationsRead(userId: string) {
  inMemoryNotifications.forEach((n) => {
    if (n.user_id === userId) n.is_read = true;
  });
  return true;
}
