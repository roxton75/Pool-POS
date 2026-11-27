export interface FoodCategory {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateFoodCategoryInput {
  name: string;
  displayOrder?: number;
}

export interface UpdateFoodCategoryInput {
  name?: string;
  displayOrder?: number;
  isActive?: boolean;
}