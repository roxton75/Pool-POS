import type { SQLiteDatabase } from "expo-sqlite";
import type { Session, SessionStatus } from "../types/session";

interface SessionRow {
  id: string;
  booking_number: string;
  resource_id: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  status: SessionStatus;
  rate_snapshot: number;
  grace_period_snapshot: number;
  started_at: string;
  ended_at: string | null;
  total_paused_seconds: number;
  total_amount: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionPauseRow {
  id: string;
  session_id: string;
  paused_at: string;
  resumed_at: string | null;
}

function mapSession(row: SessionRow): Session {
  return {
    id: row.id,
    bookingNumber: row.booking_number,
    resourceId: row.resource_id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    status: row.status,
    rateSnapshot: row.rate_snapshot,
    gracePeriodSnapshot: row.grace_period_snapshot,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    totalPausedSeconds: row.total_paused_seconds,
    totalAmount: row.total_amount,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SESSION_SELECT = `SELECT
  id, booking_number, resource_id, customer_id, customer_name,
  customer_phone, status, rate_snapshot, grace_period_snapshot,
  started_at, ended_at, total_paused_seconds, total_amount,
  notes, created_at, updated_at
FROM sessions`;

export const sessionRepository = {
  async create(
    db: SQLiteDatabase,
    input: {
      id: string;
      bookingNumber: string;
      resourceId: string;
      customerId: string | null;
      customerName: string | null;
      customerPhone: string | null;
      rateSnapshot: number;
      gracePeriodSnapshot: number;
      startedAt: string;
      notes: string | null;
    },
  ): Promise<void> {
    await db.runAsync(
      `INSERT INTO sessions (
        id, booking_number, resource_id, customer_id, customer_name,
        customer_phone, status, rate_snapshot, grace_period_snapshot,
        started_at, total_paused_seconds, total_amount, notes
      ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, 0, 0, ?)`,
      input.id,
      input.bookingNumber,
      input.resourceId,
      input.customerId,
      input.customerName,
      input.customerPhone,
      input.rateSnapshot,
      input.gracePeriodSnapshot,
      input.startedAt,
      input.notes,
    );
  },

  async getById(db: SQLiteDatabase, id: string): Promise<Session | null> {
    const row = await db.getFirstAsync<SessionRow>(
      `${SESSION_SELECT} WHERE id = ?`,
      id,
    );
    return row ? mapSession(row) : null;
  },

  async getAll(
    db: SQLiteDatabase,
    statuses?: SessionStatus[],
  ): Promise<Session[]> {
    let query = `${SESSION_SELECT}`;
    const params: (string | number)[] = [];

    if (statuses?.length) {
      query += ` WHERE status IN (${statuses.map(() => "?").join(", ")})`;
      params.push(...statuses);
    }

    query += " ORDER BY started_at DESC";
    const rows = await db.getAllAsync<SessionRow>(query, ...params);
    return rows.map(mapSession);
  },

  async getByResource(
    db: SQLiteDatabase,
    resourceId: string,
  ): Promise<Session | null> {
    const row = await db.getFirstAsync<SessionRow>(
      `${SESSION_SELECT}
       WHERE resource_id = ? AND status IN ('active', 'paused')
       ORDER BY started_at DESC LIMIT 1`,
      resourceId,
    );
    return row ? mapSession(row) : null;
  },

  async getPauses(
    db: SQLiteDatabase,
    sessionId: string,
  ): Promise<SessionPauseRow[]> {
    return db.getAllAsync<SessionPauseRow>(
      `SELECT id, session_id, paused_at, resumed_at
       FROM session_pauses
       WHERE session_id = ?
       ORDER BY paused_at ASC`,
      sessionId,
    );
  },

  async createPause(
    db: SQLiteDatabase,
    pauseId: string,
    sessionId: string,
    pausedAt: string,
  ): Promise<void> {
    await db.runAsync(
      `INSERT INTO session_pauses (id, session_id, paused_at)
       VALUES (?, ?, ?)`,
      pauseId,
      sessionId,
      pausedAt,
    );
  },

  async closeOpenPause(
    db: SQLiteDatabase,
    sessionId: string,
    resumedAt: string,
  ): Promise<void> {
    await db.runAsync(
      `UPDATE session_pauses
       SET resumed_at = ?
       WHERE session_id = ? AND resumed_at IS NULL`,
      resumedAt,
      sessionId,
    );
  },

  async updateStatus(
    db: SQLiteDatabase,
    sessionId: string,
    status: SessionStatus,
    updatedAt: string,
    extra?: { endedAt?: string | null; totalPausedSeconds?: number; totalAmount?: number },
  ): Promise<void> {
    await db.runAsync(
      `UPDATE sessions
       SET status = ?,
           ended_at = COALESCE(?, ended_at),
           total_paused_seconds = COALESCE(?, total_paused_seconds),
           total_amount = COALESCE(?, total_amount),
           updated_at = ?
       WHERE id = ?`,
      status,
      extra?.endedAt ?? null,
      extra?.totalPausedSeconds ?? null,
      extra?.totalAmount ?? null,
      updatedAt,
      sessionId,
    );
  },

  async updateDetails(
    db: SQLiteDatabase,
    sessionId: string,
    input: {
      customerName?: string | null;
      customerPhone?: string | null;
      notes?: string | null;
    },
  ): Promise<void> {
    const current = await this.getById(db, sessionId);
    if (!current) throw new Error("Session not found.");

    await db.runAsync(
      `UPDATE sessions
       SET customer_name = ?, customer_phone = ?, notes = ?, updated_at = ?
       WHERE id = ?`,
      input.customerName === undefined ? current.customerName : input.customerName,
      input.customerPhone === undefined ? current.customerPhone : input.customerPhone,
      input.notes === undefined ? current.notes : input.notes,
      new Date().toISOString(),
      sessionId,
    );
  },
};
