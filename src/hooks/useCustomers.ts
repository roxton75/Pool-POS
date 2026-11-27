import { useCallback, useEffect } from "react";

import { useDatabase } from "../database/DatabaseProvider";
import { customerService } from "../services/customer.service";
import { useCustomerStore } from "../stores/useCustomerStore";

import type {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customer";
import type { SQLiteDatabase } from "expo-sqlite";

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

  const loadCustomers = useCallback(async (database: SQLiteDatabase) => {
    try {
      setLoading(true);
      setError(null);
      const records = await customerService.getAll(database);
      setCustomers(records);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load customers."));
    } finally {
      setLoading(false);
    }
  }, [setCustomers, setLoading, setError]);

  useEffect(() => {
    loadCustomers(db);
  }, [db, loadCustomers]);

  const refresh = useCallback(async () => {
    await loadCustomers(db);
  }, [db, loadCustomers]);

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