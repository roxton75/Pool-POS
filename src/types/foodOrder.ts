export interface FoodOrder {
  id: string;
  orderNumber: string;
  customerName: string | null;
  status: string;
  subtotal: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodOrderInput {
  customerName?: string | null;
  status?: string;
  notes?: string | null;
  items: CreateFoodOrderItemInput[];
}

export interface CreateFoodOrderItemInput {
  foodItemId: string;
  quantity: number;
}

export interface UpdateFoodOrderInput {
  status?: string;
  notes?: string | null;
}