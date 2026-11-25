import type { Database } from "@nozbe/watermelondb";

import { resourceRepository } from "../repositories/resource.repository";
import type { Resource, UpdateResourceInput } from "../types/resource";

export const resourceService = {
  getAll(db: Database): Promise<Resource[]> {
    return resourceRepository.getAll(db);
  },

  async update(
    db: Database,
    id: string,
    input: UpdateResourceInput,
  ): Promise<Resource> {
    const existing = await resourceRepository.getById(db, id);

    if (!existing) {
      throw new Error("Resource not found.");
    }

    if (input.name !== undefined && !input.name.trim()) {
      throw new Error("Resource name cannot be empty.");
    }

    if (
      input.ratePerHour !== undefined &&
      (!Number.isInteger(input.ratePerHour) || input.ratePerHour < 0)
    ) {
      throw new Error("Hourly rate must be a non-negative whole number.");
    }

    return resourceRepository.update(db, id, input);
  },
};
