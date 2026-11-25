import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import type { Relation } from "@nozbe/watermelondb";
import type FoodOrder from "./FoodOrder";
import type FoodItem from "./FoodItem";

export default class FoodOrderItem extends Model {
  static table = "food_order_items";

  static associations = {
    food_orders: { type: "belongs_to" as const, key: "order_id" },
    food_items: { type: "belongs_to" as const, key: "food_item_id" },
  };

  @field("order_id") orderId!: string;
  @field("food_item_id") foodItemId?: string;
  @field("item_name_snapshot") itemNameSnapshot!: string;
  @field("price_snapshot") priceSnapshot!: number;
  @field("quantity") quantity!: number;
  @field("line_total") lineTotal!: number;

  @relation("food_orders", "order_id") order!: Relation<FoodOrder>;

  @relation("food_items", "food_item_id")
  foodItem!: Relation<FoodItem>;
}
