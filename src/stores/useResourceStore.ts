import { create } from "zustand";
import type { Resource } from "../types/resource";

interface ResourceState {
  resources: Resource[];
  loading: boolean;
  error: string | null;

  setResources: (resources: Resource[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  resources: [],
  loading: true,
  error: null,

  setResources: (resources) => set({ resources }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
