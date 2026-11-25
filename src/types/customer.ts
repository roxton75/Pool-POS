export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  name: string;
  phone?: string | null;
  notes?: string | null;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string | null;
  notes?: string | null;
}
