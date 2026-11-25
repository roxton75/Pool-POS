import { Model } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";
import type { Query } from "@nozbe/watermelondb";
import type FoodItem from "./FoodItem";

export default class FoodCategory extends Model {
  static table = "food_categories";

  static associations = {
    food_items: { type: "has_many" as const, foreignKey: "category_id" },
  };

  @field("name") name!: string;
  @field("display_order") displayOrder!: number;
  @field("is_active") isActive!: boolean;
  @field("created_at") createdAt!: string;

  @children("food_items") items!: Query<FoodItem>;
}
