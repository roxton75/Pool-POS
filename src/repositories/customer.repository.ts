import type { SQLiteDatabase } from "expo-sqlite";

import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customer";

function mapCustomerRow(row: {
  id: string;
  name: string;
  phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}): Customer {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const customerRepository = {
  async getAll(db: SQLiteDatabase): Promise<Customer[]> {
    const rows = await db.getAllAsync<{
      id: string;
      name: string;
      phone: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>("SELECT id, name, phone, notes, created_at, updated_at FROM customers ORDER BY name ASC");

    return rows.map(mapCustomerRow);
  },

  async getById(db: SQLiteDatabase, id: string): Promise<Customer | null> {
    const row = await db.getFirstAsync<{
      id: string;
      name: string;
      phone: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>("SELECT id, name, phone, notes, created_at, updated_at FROM customers WHERE id = ?", [id]);

    return row ? mapCustomerRow(row) : null;
  },

  async create(db: SQLiteDatabase, input: CreateCustomerInput): Promise<Customer> {
    const now = new Date().toISOString();

    const result = await db.runAsync(
      "INSERT INTO customers (name, phone, notes, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
      [input.name.trim(), input.phone?.trim() || null, input.notes?.trim() || null, now, now]
    );

    const created = await db.getFirstAsync<{
      id: string;
      name: string;
      phone: string | null;
      notes: string | null;
      created_at: string;
      updated_at: string;
    }>("SELECT id, name, phone, notes, created_at, updated_at FROM customers WHERE id = ?", [result.lastInsertRowId.toString()]);

    if (!created) throw new Error("Unable to create customer.");
    return mapCustomerRow(created);
  },

  async update(
    db: SQLiteDatabase,
    id: string,
    input: UpdateCustomerInput
  ): Promise<Customer> {
    const existing = await this.getById(db, id);
    if (!existing) throw new Error("Customer not found.");

    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    if (input.name !== undefined) {
      updates.push("name = ?");
      params.push(input.name.trim());
    }
    if (input.phone !== undefined) {
      updates.push("phone = ?");
      params.push(input.phone?.trim() || null);
    }
    if (input.notes !== undefined) {
      updates.push("notes = ?");
      params.push(input.notes?.trim() || null);
    }

    if (updates.length === 0) return existing;

    updates.push("updated_at = ?");
    params.push(new Date().toISOString());
    params.push(id);

    await db.runAsync(
      `UPDATE customers SET ${updates.join(", ")} WHERE id = ?`,
      params
    );

    const updated = await this.getById(db, id);
    if (!updated) throw new Error("Unable to update customer.");
    return updated;
  },

  async delete(db: SQLiteDatabase, id: string): Promise<void> {
    await db.runAsync("DELETE FROM customers WHERE id = ?", [id]);
  },
};