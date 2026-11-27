export interface FoodItem {
  id: string;
  categoryId: string | null;
  name: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodItemInput {
  categoryId?: string | null;
  name: string;
  price: number;
}

export interface UpdateFoodItemInput {
  categoryId?: string | null;
  name?: string;
  price?: number;
  isAvailable?: boolean;
}