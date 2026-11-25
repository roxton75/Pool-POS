import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import type { Relation } from "@nozbe/watermelondb";
import type Customer from "./Customer";

export default class Waitlist extends Model {
  static table = "waitlist";

  static associations = {
    customers: { type: "belongs_to" as const, key: "customer_id" },
  };

  @field("customer_id") customerId?: string;
  @field("customer_name") customerName!: string;
  @field("customer_phone") customerPhone?: string;
  @field("resource_type") resourceType?: string;
  @field("queue_position") queuePosition!: number;
  @field("status") status!: string;
  @field("notes") notes?: string;
  @field("created_at") createdAt!: string;
  @field("updated_at") updatedAt!: string;

  @relation("customers", "customer_id")
  customer!: Relation<Customer>;
}
