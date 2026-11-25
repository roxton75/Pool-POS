import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import type { Relation } from "@nozbe/watermelondb";
import type Session from "./Session";

export default class Payment extends Model {
  static table = "payments";

  static associations = {
    sessions: { type: "belongs_to" as const, key: "session_id" },
  };

  @field("session_id") sessionId!: string;
  @field("amount") amount!: number;
  @field("method") method!: string;
  @field("note") note?: string;
  @field("paid_at") paidAt!: string;

  @relation("sessions", "session_id") session!: Relation<Session>;
}
