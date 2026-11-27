import type { ResourceType } from "./resource";

export type WaitlistStatus = "waiting" | "assigned" | "cancelled" | "removed";

export interface WaitlistEntry {
  id: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string | null;
  resourceType: ResourceType | null;
  queuePosition: number;
  status: WaitlistStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWaitlistInput {
  customerId?: string | null;
  customerName: string;
  customerPhone?: string | null;
  resourceType?: ResourceType | null;
  notes?: string | null;
}

export interface UpdateWaitlistInput {
  customerName?: string;
  customerPhone?: string | null;
  resourceType?: ResourceType | null;
  queuePosition?: number;
  status?: WaitlistStatus;
  notes?: string | null;
}