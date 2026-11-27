import type { Session } from "../../types/session";

export type BookingResource = {
  id: string;
  name: string;
  type: string;
  ratePerHour: number;
  isActive: boolean;
  isMaintenance: boolean;
};

export type BillingSnapshot = {
  elapsedSeconds: number;
  pausedSeconds: number;
  billableSeconds: number;
  totalAmount: number;
};

export type SessionAction = "pause" | "resume" | "complete" | "cancel";

export type { Session };
