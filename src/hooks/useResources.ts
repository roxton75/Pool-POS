import { useCallback, useEffect } from "react";

import { useDatabase } from "../database/DatabaseProvider";
import { resourceService } from "../services/resource.service";
import { useResourceStore } from "../stores/useResourceStore";
import type { UpdateResourceInput } from "../types/resource";
import type { SQLiteDatabase } from "expo-sqlite";

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function useResources() {
  const db = useDatabase();

  const resources = useResourceStore((state) => state.resources);
  const loading = useResourceStore((state) => state.loading);
  const error = useResourceStore((state) => state.error);

  const setResources = useResourceStore((state) => state.setResources);
  const setLoading = useResourceStore((state) => state.setLoading);
  const setError = useResourceStore((state) => state.setError);

  const loadResources = useCallback(async (database: SQLiteDatabase) => {
    try {
      setLoading(true);
      setError(null);
      const records = await resourceService.getAll(database);
      setResources(records);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load resources."));
    } finally {
      setLoading(false);
    }
  }, [setResources, setLoading, setError]);

  useEffect(() => {
    loadResources(db);
  }, [db, loadResources]);

  const refresh = useCallback(async () => {
    await loadResources(db);
  }, [db, loadResources]);

  const updateResource = useCallback(
    async (id: string, input: UpdateResourceInput) => {
      try {
        setError(null);
        return await resourceService.update(db, id, input);
      } catch (err) {
        const message = getErrorMessage(err, "Failed to update resource.");
        setError(message);
        throw err;
      }
    },
    [db, setError],
  );

  return {
    resources,
    loading,
    error,
    refresh,
    updateResource,
  };
}