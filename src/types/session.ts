export type SessionStatus = "active" | "paused" | "completed" | "cancelled";

export interface Session {
  id: string;
  bookingNumber: string;
  resourceId: string;
  customerId: string | null;
  customerName: string | null;
  customerPhone: string | null;
  status: SessionStatus;
  rateSnapshot: number;
  gracePeriodSnapshot: number;
  startedAt: string;
  endedAt: string | null;
  totalPausedSeconds: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionInput {
  resourceId: string;
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  notes?: string | null;
}

export interface UpdateSessionInput {
  customerName?: string | null;
  customerPhone?: string | null;
  notes?: string | null;
}

export interface SessionBilling {
  elapsedSeconds: number;
  pausedSeconds: number;
  billableSeconds: number;
  totalAmount: number;
}
