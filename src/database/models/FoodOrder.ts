import { Model } from "@nozbe/watermelondb";
import { children, field } from "@nozbe/watermelondb/decorators";
import type { Query } from "@nozbe/watermelondb";
import type FoodOrderItem from "./FoodOrderItem";

export default class FoodOrder extends Model {
  static table = "food_orders";

  static associations = {
    food_order_items: { type: "has_many" as const, foreignKey: "order_id" },
  };

  @field("order_number") orderNumber!: string;
  @field("customer_name") customerName?: string;
  @field("status") status!: string;
  @field("subtotal") subtotal!: number;
  @field("total_amount") totalAmount!: number;
  @field("notes") notes?: string;
  @field("created_at") createdAt!: string;
  @field("updated_at") updatedAt!: string;

  @children("food_order_items") items!: Query<FoodOrderItem>;
}
