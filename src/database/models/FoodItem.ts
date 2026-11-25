import { Model } from "@nozbe/watermelondb";
import { children, field, relation } from "@nozbe/watermelondb/decorators";
import type { Query, Relation } from "@nozbe/watermelondb";
import type FoodCategory from "./FoodCategory";
import type FoodOrderItem from "./FoodOrderItem";

export default class FoodItem extends Model {
  static table = "food_items";

  static associations = {
    food_categories: { type: "belongs_to" as const, key: "category_id" },
    food_order_items: { type: "has_many" as const, foreignKey: "food_item_id" },
  };

  @field("category_id") categoryId?: string;
  @field("name") name!: string;
  @field("price") price!: number;
  @field("is_available") isAvailable!: boolean;
  @field("created_at") createdAt!: string;
  @field("updated_at") updatedAt!: string;

  @relation("food_categories", "category_id")
  category!: Relation<FoodCategory>;

  @children("food_order_items") orderItems!: Query<FoodOrderItem>;
}
