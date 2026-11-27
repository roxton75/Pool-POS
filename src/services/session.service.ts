import type { SQLiteDatabase } from "expo-sqlite";
import { billRepository, type Bill, type BillItemInput } from "../repositories/bill.repository";
import { sessionRepository } from "../repositories/session.repository";
import type {
  CreateSessionInput,
  Session,
  SessionBilling,
  SessionStatus,
  UpdateSessionInput,
} from "../types/session";
import { calculateSessionAmount } from "../utils/billing";

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function createBookingNumber(): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `QZ-${date}-${suffix}`;
}

function secondsBetween(start: string, end: string): number {
  return Math.max(0, Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000));
}

function validateMoney(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative whole-rupee amount.`);
  }
}

async function getGracePeriod(db: SQLiteDatabase): Promise<number> {
  const setting = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'grace_period_minutes'",
  );
  const value = Number(setting?.value ?? 12);
  return Number.isInteger(value) && value >= 0 ? value : 12;
}

async function getPauseTotals(
  db: SQLiteDatabase,
  sessionId: string,
  now: string,
): Promise<{ pausedSeconds: number; hasOpenPause: boolean }> {
  const pauses = await sessionRepository.getPauses(db, sessionId);
  let pausedSeconds = 0;
  let hasOpenPause = false;

  for (const pause of pauses) {
    if (!pause.resumed_at) hasOpenPause = true;
    pausedSeconds += secondsBetween(pause.paused_at, pause.resumed_at ?? now);
  }

  return { pausedSeconds, hasOpenPause };
}

async function calculateBilling(
  db: SQLiteDatabase,
  session: Session,
  now: string,
): Promise<SessionBilling> {
  const end = session.endedAt ?? now;
  const elapsedSeconds = secondsBetween(session.startedAt, end);
  const { pausedSeconds } = await getPauseTotals(db, session.id, now);
  const billableSeconds = Math.max(
    0,
    elapsedSeconds - pausedSeconds - session.gracePeriodSnapshot * 60,
  );

  const totalAmount = calculateSessionAmount(
    session.rateSnapshot,
    elapsedSeconds,
    pausedSeconds,
    session.gracePeriodSnapshot,
  );

  return { elapsedSeconds, pausedSeconds, billableSeconds, totalAmount };
}

export const sessionService = {
  async start(db: SQLiteDatabase, input: CreateSessionInput): Promise<Session> {
    if (!input.resourceId?.trim()) throw new Error("Select a resource.");

    const sessionId = createId("sess");
    const startedAt = new Date().toISOString();
    const gracePeriodSnapshot = await getGracePeriod(db);

    await db.withTransactionAsync(async () => {
      const resource = await db.getFirstAsync<{
        id: string;
        rate_per_hour: number;
        is_active: number;
        is_maintenance: number;
      }>(
        `SELECT id, rate_per_hour, is_active, is_maintenance
         FROM resources WHERE id = ?`,
        input.resourceId,
      );

      if (!resource) throw new Error("Resource not found.");
      if (resource.is_active !== 1) throw new Error("This resource is inactive.");
      if (resource.is_maintenance === 1) throw new Error("This resource is under maintenance.");

      validateMoney(resource.rate_per_hour, "Hourly rate");

      const currentSession = await sessionRepository.getByResource(db, input.resourceId);
      if (currentSession) {
        throw new Error("This resource already has an active or paused session.");
      }

      await sessionRepository.create(db, {
        id: sessionId,
        bookingNumber: createBookingNumber(),
        resourceId: resource.id,
        customerId: input.customerId?.trim() || null,
        customerName: input.customerName?.trim() || null,
        customerPhone: input.customerPhone?.trim() || null,
        rateSnapshot: resource.rate_per_hour,
        gracePeriodSnapshot,
        startedAt,
        notes: input.notes?.trim() || null,
      });
    });

    const created = await sessionRepository.getById(db, sessionId);
    if (!created) throw new Error("Session was created but could not be loaded.");
    return created;
  },

  async pause(db: SQLiteDatabase, sessionId: string): Promise<Session> {
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      const session = await sessionRepository.getById(db, sessionId);
      if (!session) throw new Error("Session not found.");
      if (session.status !== "active") throw new Error("Only active sessions can be paused.");

      await sessionRepository.createPause(db, createId("pause"), sessionId, now);
      await sessionRepository.updateStatus(db, sessionId, "paused", now);
    });

    const updated = await sessionRepository.getById(db, sessionId);
    if (!updated) throw new Error("Session could not be loaded.");
    return updated;
  },

  async resume(db: SQLiteDatabase, sessionId: string): Promise<Session> {
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      const session = await sessionRepository.getById(db, sessionId);
      if (!session) throw new Error("Session not found.");
      if (session.status !== "paused") throw new Error("Only paused sessions can be resumed.");

      const totals = await getPauseTotals(db, sessionId, now);
      if (!totals.hasOpenPause) throw new Error("No open pause was found for this session.");

      await sessionRepository.closeOpenPause(db, sessionId, now);
      await sessionRepository.updateStatus(
        db,
        sessionId,
        "active",
        now,
        { totalPausedSeconds: totals.pausedSeconds },
      );
    });

    const updated = await sessionRepository.getById(db, sessionId);
    if (!updated) throw new Error("Session could not be loaded.");
    return updated;
  },

  async complete(
    db: SQLiteDatabase,
    sessionId: string,
    foodItems: BillItemInput[] = [],
  ): Promise<{ session: Session; bill: Bill }> {
    const endedAt = new Date().toISOString();
    let billId = "";

    await db.withTransactionAsync(async () => {
      const session = await sessionRepository.getById(db, sessionId);
      if (!session) throw new Error("Session not found.");
      if (session.status !== "active" && session.status !== "paused") {
        throw new Error("Only active or paused sessions can be completed.");
      }

      for (const item of foodItems) {
        if (!item.foodItemId?.trim()) throw new Error("Invalid food item.");
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error("Food quantity must be a positive whole number.");
        }
      }

      const totals = await getPauseTotals(db, sessionId, endedAt);
      if (session.status === "paused" && !totals.hasOpenPause) {
        throw new Error("Paused session has no open pause record.");
      }

      if (totals.hasOpenPause) {
        await sessionRepository.closeOpenPause(db, sessionId, endedAt);
      }

      const billing = await calculateBilling(db, session, endedAt);

      await sessionRepository.updateStatus(
        db,
        sessionId,
        "completed",
        endedAt,
        {
          endedAt,
          totalPausedSeconds: billing.pausedSeconds,
          totalAmount: billing.totalAmount,
        },
      );

      const existing = await billRepository.getBySessionId(db, sessionId);
      if (existing) throw new Error("A bill already exists for this session.");

      billId = createId("bill");
      const billDate = new Date();
      const date = [
        billDate.getFullYear(),
        String(billDate.getMonth() + 1).padStart(2, "0"),
        String(billDate.getDate()).padStart(2, "0"),
      ].join("");
      const billNumber = `QZ-${date}-${Math.floor(100000 + Math.random() * 900000)}`;

      await billRepository.create(db, {
        id: billId,
        billNumber,
        sessionId,
        customerName: session.customerName,
        sessionAmount: billing.totalAmount,
      });

      if (foodItems.length > 0) {
        await billRepository.addItems(db, billId, foodItems);
      }
    });

    const completedSession = await sessionRepository.getById(db, sessionId);
    const bill = await billRepository.getById(db, billId);

    if (!completedSession || !bill) {
      throw new Error("Session completed, but its final bill could not be loaded.");
    }

    return { session: completedSession, bill };
  },

  async cancel(db: SQLiteDatabase, sessionId: string): Promise<Session> {
    const now = new Date().toISOString();

    await db.withTransactionAsync(async () => {
      const session = await sessionRepository.getById(db, sessionId);
      if (!session) throw new Error("Session not found.");
      if (session.status === "completed" || session.status === "cancelled") {
        throw new Error("This session can no longer be cancelled.");
      }

      const totals = await getPauseTotals(db, sessionId, now);
      if (totals.hasOpenPause) {
        await sessionRepository.closeOpenPause(db, sessionId, now);
      }

      await sessionRepository.updateStatus(
        db,
        sessionId,
        "cancelled",
        now,
        { endedAt: now, totalPausedSeconds: totals.pausedSeconds },
      );
    });

    const cancelled = await sessionRepository.getById(db, sessionId);
    if (!cancelled) throw new Error("Session could not be loaded.");
    return cancelled;
  },

  async getBilling(db: SQLiteDatabase, sessionId: string): Promise<SessionBilling> {
    const session = await sessionRepository.getById(db, sessionId);
    if (!session) throw new Error("Session not found.");
    return calculateBilling(db, session, new Date().toISOString());
  },

  getById(db: SQLiteDatabase, sessionId: string): Promise<Session | null> {
    return sessionRepository.getById(db, sessionId);
  },

  getAll(
    db: SQLiteDatabase,
    statuses?: SessionStatus[],
  ): Promise<Session[]> {
    return sessionRepository.getAll(db, statuses);
  },

  getActive(db: SQLiteDatabase): Promise<Session[]> {
    return sessionRepository.getAll(db, ["active", "paused"]);
  },

  async updateDetails(
    db: SQLiteDatabase,
    sessionId: string,
    input: UpdateSessionInput,
  ): Promise<Session> {
    const session = await sessionRepository.getById(db, sessionId);
    if (!session) throw new Error("Session not found.");
    if (session.status === "completed" || session.status === "cancelled") {
      throw new Error("Completed or cancelled sessions cannot be edited.");
    }

    await sessionRepository.updateDetails(db, sessionId, input);
    const updated = await sessionRepository.getById(db, sessionId);
    if (!updated) throw new Error("Session could not be loaded.");
    return updated;
  },
};
