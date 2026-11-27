export interface FoodOrderItem {
  id: string;
  orderId: string;
  foodItemId: string | null;
  itemNameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
}