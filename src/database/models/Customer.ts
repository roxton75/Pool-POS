import { Model } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";
import type { Query } from "@nozbe/watermelondb";

import type Session from "./Session";
import type Waitlist from "./Waitlist";

export default class Customer extends Model {
  static table = "customers";

  static associations = {
    sessions: { type: "has_many" as const, foreignKey: "customer_id" },
    waitlist: { type: "has_many" as const, foreignKey: "customer_id" },
  };

  @field("name") name!: string;
  @field("phone") phone!: string | null;
  @field("notes") notes!: string | null;
  @field("created_at") createdAt!: string;
  @field("updated_at") updatedAt!: string;

  @children("sessions") sessions!: Query<Session>;
  @children("waitlist") waitlistEntries!: Query<Waitlist>;
}
