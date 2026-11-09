import { sqliteTable, text, integer, real, index, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const intakeRequests = sqliteTable(
  'intake_requests',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    handle: text('handle').notNull(), // stored lowercase
    email: text('email').notNull(),
    discipline: text('discipline').notNull(),
    corridor: text('corridor').notNull(),
    country: text('country'),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).notNull().default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [uniqueIndex('intake_handle_uq').on(t.handle), index('intake_status_idx').on(t.status, t.createdAt)],
);

// Public spotlight cards. Rows are curated manually (wrangler d1 execute) — nothing renders until a real member is approved.
export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  handle: text('handle').notNull().unique(),
  displayName: text('display_name').notNull(),
  location: text('location').notNull(),
  hub: text('hub', { enum: ['MENA', 'NORTH_AMERICA'] }).notNull(),
  discipline: text('discipline').notNull(),
  project: text('project').notNull(),
  projectUrl: text('project_url'),
  visible: integer('visible', { mode: 'boolean' }).notNull().default(true),
  approvedAt: integer('approved_at', { mode: 'timestamp_ms' }).notNull(),
});

export const webVitals = sqliteTable(
  'web_vitals',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    metric: text('metric', { enum: ['LCP', 'INP', 'CLS', 'TTFB', 'FCP'] }).notNull(),
    value: real('value').notNull(),
    rating: text('rating', { enum: ['good', 'needs-improvement', 'poor'] }).notNull(),
    path: text('path').notNull(),
    country: text('country'),
    colo: text('colo'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (t) => [index('vitals_metric_time_idx').on(t.metric, t.createdAt), index('vitals_time_idx').on(t.createdAt)],
);

export type IntakeRequest = typeof intakeRequests.$inferSelect;
export type Member = typeof members.$inferSelect;
