import { Model } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";
import type { Query } from "@nozbe/watermelondb";

import type { ResourceType } from "../../types/resource";
import type Session from "./Session";

export default class Resource extends Model {
  static table = "resources";

  static associations = {
    sessions: { type: "has_many" as const, foreignKey: "resource_id" },
  };

  @field("name") name!: string;
  @field("type") type!: ResourceType;
  @field("rate_per_hour") ratePerHour!: number;
  @field("is_active") isActive!: boolean;
  @field("is_maintenance") isMaintenance!: boolean;
  @field("display_order") displayOrder!: number;
  @field("created_at") createdAt!: string;
  @field("updated_at") updatedAt!: string;

  @children("sessions") sessions!: Query<Session>;
}
