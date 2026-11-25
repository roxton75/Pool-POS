import { create } from "zustand";
import type { Customer } from "../types/customer";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;

  setCustomers: (customers: Customer[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  loading: true,
  error: null,

  setCustomers: (customers) => set({ customers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
