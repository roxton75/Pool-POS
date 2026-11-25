import { useCallback, useEffect } from "react";

import { useDatabase } from "../database/DatabaseProvider";
import CustomerModel from "../database/models/Customer";
import { customerService } from "../services/customer.service";
import { useCustomerStore } from "../stores/useCustomerStore";

import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customer";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useCustomers() {
  const db = useDatabase();

  const customers = useCustomerStore((state) => state.customers);
  const loading = useCustomerStore((state) => state.loading);
  const error = useCustomerStore((state) => state.error);

  const setCustomers = useCustomerStore((state) => state.setCustomers);
  const setLoading = useCustomerStore((state) => state.setLoading);
  const setError = useCustomerStore((state) => state.setError);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const subscription = db
      .get<CustomerModel>("customers")
      .query()
      .observe()
      .subscribe({
        next: (records) => {
          setCustomers(
            records.map((record) => ({
              id: record.id,
              name: record.name,
              phone: record.phone,
              notes: record.notes,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
            })),
          );
          setLoading(false);
        },
        error: (err) => {
          setError(getErrorMessage(err, "Failed to load customers."));
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [db, setCustomers, setLoading, setError]);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const records = await customerService.getAll(db);
      setCustomers(records);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to refresh customers."));
    }
  }, [db, setCustomers, setError]);

  const createCustomer = useCallback(
    (input: CreateCustomerInput) => customerService.create(db, input),
    [db],
  );

  const updateCustomer = useCallback(
    (id: string, input: UpdateCustomerInput) =>
      customerService.update(db, id, input),
    [db],
  );

  const deleteCustomer = useCallback(
    (id: string) => customerService.delete(db, id),
    [db],
  );

  return {
    customers,
    loading,
    error,
    refresh,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
