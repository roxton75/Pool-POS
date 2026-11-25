export type ResourceType =
  | "american_pool"
  | "mini_snooker"
  | "big_snooker"
  | "ps5";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  ratePerHour: number;
  isActive: boolean;
  isMaintenance: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateResourceInput {
  name?: string;
  ratePerHour?: number;
  isActive?: boolean;
  isMaintenance?: boolean;
}
