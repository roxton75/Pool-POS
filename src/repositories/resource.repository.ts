import type { SQLiteDatabase } from "expo-sqlite";

import type { Resource, UpdateResourceInput } from "../types/resource";

function mapResourceRow(row: {
  id: string;
  name: string;
  type: string;
  rate_per_hour: number;
  is_active: 0 | 1;
  is_maintenance: 0 | 1;
  display_order: number;
  created_at: string;
  updated_at: string;
}): Resource {
  return {
    id: row.id,
    name: row.name,
    type: row.type as Resource["type"],
    ratePerHour: row.rate_per_hour,
    isActive: row.is_active === 1,
    isMaintenance: row.is_maintenance === 1,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const resourceRepository = {
  async getAll(db: SQLiteDatabase): Promise<Resource[]> {
    const rows = await db.getAllAsync<{
      id: string;
      name: string;
      type: string;
      rate_per_hour: number;
      is_active: 0 | 1;
      is_maintenance: 0 | 1;
      display_order: number;
      created_at: string;
      updated_at: string;
    }>("SELECT id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at FROM resources ORDER BY display_order ASC");

    return rows.map(mapResourceRow);
  },

  async getById(db: SQLiteDatabase, id: string): Promise<Resource | null> {
    const row = await db.getFirstAsync<{
      id: string;
      name: string;
      type: string;
      rate_per_hour: number;
      is_active: 0 | 1;
      is_maintenance: 0 | 1;
      display_order: number;
      created_at: string;
      updated_at: string;
    }>("SELECT id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at FROM resources WHERE id = ?", [id]);

    return row ? mapResourceRow(row) : null;
  },

  async update(
    db: SQLiteDatabase,
    id: string,
    input: UpdateResourceInput
  ): Promise<Resource> {
    const existing = await this.getById(db, id);
    if (!existing) throw new Error("Resource not found.");

    if (input.name !== undefined && !input.name.trim()) {
      throw new Error("Resource name cannot be empty.");
    }

    if (
      input.ratePerHour !== undefined &&
      (!Number.isInteger(input.ratePerHour) || input.ratePerHour < 0)
    ) {
      throw new Error("Hourly rate must be a non-negative whole number.");
    }

    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      params.push(input.name.trim());
    }
    if (input.ratePerHour !== undefined) {
      updates.push("rate_per_hour = ?");
      params.push(input.ratePerHour);
    }
    if (input.isActive !== undefined) {
      updates.push("is_active = ?");
      params.push(input.isActive ? 1 : 0);
    }
    if (input.isMaintenance !== undefined) {
      updates.push("is_maintenance = ?");
      params.push(input.isMaintenance ? 1 : 0);
    }

    if (updates.length === 0) {
      const existing = await this.getById(db, id);
      if (!existing) throw new Error("Resource not found.");
      return existing;
    }

    updates.push("updated_at = ?");
    params.push(new Date().toISOString());
    params.push(id);

    await db.runAsync(
      `UPDATE resources SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    const updated = await this.getById(db, id);
    if (!updated) throw new Error("Unable to update resource.");
    return updated;
  },
};