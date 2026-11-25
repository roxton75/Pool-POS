import { Q, type Database } from "@nozbe/watermelondb";

import ResourceModel from "../database/models/Resource";
import type { Resource, UpdateResourceInput } from "../types/resource";

function mapResource(record: ResourceModel): Resource {
  return {
    id: record.id,
    name: record.name,
    type: record.type as Resource["type"],
    ratePerHour: record.ratePerHour,
    isActive: record.isActive,
    isMaintenance: record.isMaintenance,
    displayOrder: record.displayOrder,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const resourceRepository = {
  async getAll(db: Database): Promise<Resource[]> {
    const records = await db
      .get<ResourceModel>("resources")
      .query(Q.sortBy("display_order", Q.asc))
      .fetch();

    return records.map(mapResource);
  },

  async getById(db: Database, id: string): Promise<Resource | null> {
    const records = await db
      .get<ResourceModel>("resources")
      .query(Q.where("id", id))
      .fetch();

    return records.length > 0 ? mapResource(records[0]) : null;
  },

  async update(
    db: Database,
    id: string,
    input: UpdateResourceInput,
  ): Promise<Resource> {
    let updatedResource: Resource | null = null;

    await db.write(async () => {
      const record = await db.get<ResourceModel>("resources").find(id);

      await record.update((resource) => {
        if (input.name !== undefined) {
          resource.name = input.name.trim();
        }

        if (input.ratePerHour !== undefined) {
          resource.ratePerHour = input.ratePerHour;
        }

        if (input.isActive !== undefined) {
          resource.isActive = input.isActive;
        }

        if (input.isMaintenance !== undefined) {
          resource.isMaintenance = input.isMaintenance;
        }

        resource.updatedAt = new Date().toISOString();
      });

      updatedResource = mapResource(record);
    });

    if (!updatedResource) {
      throw new Error("Unable to update resource.");
    }

    return updatedResource;
  },
};
