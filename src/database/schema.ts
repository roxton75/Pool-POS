import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const resources = sqliteTable("resources", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  ratePerHour: integer("rate_per_hour").notNull().default(0),
  isActive: integer("is_active").notNull().default(1),
  isMaintenance: integer("is_maintenance").notNull().default(0),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().notNull(),
  bookingNumber: text("booking_number").notNull(),
  resourceId: text("resource_id").notNull(),
  customerId: text("customer_id"),
  customerName: text("customer_name"),
  customerPhone: text("customer_phone"),
  status: text("status").notNull().default("active"),
  rateSnapshot: integer("rate_snapshot").notNull().default(0),
  gracePeriodSnapshot: integer("grace_period_snapshot").notNull().default(12),
  startedAt: text("started_at").notNull(),
  endedAt: text("ended_at"),
  totalPausedSeconds: integer("total_paused_seconds").notNull().default(0),
  totalAmount: integer("total_amount").notNull().default(0),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const sessionPauses = sqliteTable("session_pauses", {
  id: text("id").primaryKey().notNull(),
  sessionId: text("session_id").notNull(),
  pausedAt: text("paused_at").notNull(),
  resumedAt: text("resumed_at"),
});

export type ResourceRow = typeof resources.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type SessionPauseRow = typeof sessionPauses.$inferSelect;
