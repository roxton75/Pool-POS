import { Model } from "@nozbe/watermelondb";
import { children, field, relation } from "@nozbe/watermelondb/decorators";
import type { Query, Relation } from "@nozbe/watermelondb";
import type Resource from "./Resource";
import type Customer from "./Customer";
import type SessionPause from "./SessionPause";
import type Payment from "./Payment";

export default class Session extends Model {
  static table = "sessions";

  static associations = {
    resources: { type: "belongs_to" as const, key: "resource_id" },
    customers: { type: "belongs_to" as const, key: "customer_id" },
    session_pauses: { type: "has_many" as const, foreignKey: "session_id" },
    payments: { type: "has_many" as const, foreignKey: "session_id" },
  };

  @field("booking_number") bookingNumber!: string;
  @field("resource_id") resourceId!: string;
  @field("customer_id") customerId?: string;
  @field("customer_name") customerName?: string;
  @field("customer_phone") customerPhone?: string;
  @field("status") status!: string;
  @field("rate_snapshot") rateSnapshot!: number;
  @field("grace_period_snapshot") gracePeriodSnapshot!: number;
  @field("started_at") startedAt!: string;
  @field("ended_at") endedAt?: string;
  @field("total_paused_seconds") totalPausedSeconds!: number;
  @field("total_amount") totalAmount!: number;
  @field("notes") notes?: string;
  @field("created_at") createdAt!: string;
  @field("updated_at") updatedAt!: string;

  @relation("resources", "resource_id") resource!: Relation<Resource>;
  @relation("customers", "customer_id")
  customer!: Relation<Customer>;

  @children("session_pauses") pauses!: Query<SessionPause>;
  @children("payments") payments!: Query<Payment>;
}
