import { boolean, jsonb, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('citizen'), // citizen | officer | admin
  phone: text('phone'),
  department: text('department'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const pollutionReports = pgTable('pollution_reports', {
  id: serial('id').primaryKey(),
  reportNumber: text('report_number').notNull().unique(), // ECO-2026-000101
  userId: text('user_id'),
  citizenName: text('citizen_name').notNull(),
  citizenEmail: text('citizen_email').notNull(),
  pollutionType: text('pollution_type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  severity: text('severity').notNull(),
  status: text('status').notNull().default('Submitted'),
  source: text('source'),
  suspectedEntity: text('suspected_entity'),
  latitude: numeric('latitude').notNull(),
  longitude: numeric('longitude').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  reportedAt: timestamp('reported_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  reportData: jsonb('report_data'),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull().default('info'),
  reportId: text('report_id'),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: text('user_id'),
  userName: text('user_name'),
  action: text('action').notNull(),
  details: text('details'),
  timestamp: timestamp('timestamp').defaultNow(),
});
