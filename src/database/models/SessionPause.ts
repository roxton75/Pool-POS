import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import type { Relation } from "@nozbe/watermelondb";
import type Session from "./Session";

export default class SessionPause extends Model {
  static table = "session_pauses";

  static associations = {
    sessions: { type: "belongs_to" as const, key: "session_id" },
  };

  @field("session_id") sessionId!: string;
  @field("paused_at") pausedAt!: string;
  @field("resumed_at") resumedAt?: string;

  @relation("sessions", "session_id") session!: Relation<Session>;
}
