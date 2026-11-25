import { useCallback, useEffect } from "react";

import { useDatabase } from "../database/DatabaseProvider";
import { resourceService } from "../services/resource.service";
import { useResourceStore } from "../stores/useResourceStore";
import type { UpdateResourceInput } from "../types/resource";
import ResourceModel from "../database/models/Resource";

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

  useEffect(() => {
    setLoading(true);
    setError(null);

    const subscription = db
      .get<ResourceModel>("resources")
      .query()
      .observe()
      .subscribe({
        next: (records) => {
          setResources(
            records.map((record) => ({
              id: record.id,
              name: record.name,
              type: record.type as
                | "american_pool"
                | "mini_snooker"
                | "big_snooker"
                | "ps5",
              ratePerHour: record.ratePerHour,
              isActive: record.isActive,
              isMaintenance: record.isMaintenance,
              displayOrder: record.displayOrder,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
            })),
          );

          setLoading(false);
          setError(null);
        },
        error: (err) => {
          setError(getErrorMessage(err, "Failed to load resources."));
          setLoading(false);
        },
      });

    return () => subscription.unsubscribe();
  }, [db, setResources, setLoading, setError]);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const records = await resourceService.getAll(db);
      setResources(records);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to refresh resources."));
    }
  }, [db, setResources, setError]);

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
