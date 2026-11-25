import { Q, type Database } from "@nozbe/watermelondb";

import CustomerModel from "../database/models/Customer";
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customer";

function mapCustomer(record: CustomerModel): Customer {
  return {
    id: record.id,
    name: record.name,
    phone: record.phone,
    notes: record.notes,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export const customerRepository = {
  async getAll(db: Database): Promise<Customer[]> {
    const records = await db
      .get<CustomerModel>("customers")
      .query(Q.sortBy("name", Q.asc))
      .fetch();

    return records.map(mapCustomer);
  },

  async getById(db: Database, id: string): Promise<Customer | null> {
    try {
      const record = await db.get<CustomerModel>("customers").find(id);
      return mapCustomer(record);
    } catch {
      return null;
    }
  },

  async create(db: Database, input: CreateCustomerInput): Promise<Customer> {
    let created: Customer | null = null;

    await db.write(async () => {
      const record = await db
        .get<CustomerModel>("customers")
        .create((customer) => {
          customer.name = input.name.trim();
          customer.phone = input.phone?.trim() || null;
          customer.notes = input.notes?.trim() || null;

          const now = new Date().toISOString();
          customer.createdAt = now;
          customer.updatedAt = now;
        });

      created = mapCustomer(record);
    });

    if (!created) throw new Error("Unable to create customer.");
    return created;
  },

  async update(
    db: Database,
    id: string,
    input: UpdateCustomerInput,
  ): Promise<Customer> {
    let updated: Customer | null = null;

    await db.write(async () => {
      const record = await db.get<CustomerModel>("customers").find(id);

      await record.update((customer) => {
        if (input.name !== undefined) customer.name = input.name.trim();
        if (input.phone !== undefined) {
          customer.phone = input.phone?.trim() || null;
        }
        if (input.notes !== undefined) {
          customer.notes = input.notes?.trim() || null;
        }

        customer.updatedAt = new Date().toISOString();
      });

      updated = mapCustomer(record);
    });

    if (!updated) throw new Error("Unable to update customer.");
    return updated;
  },

  async delete(db: Database, id: string): Promise<void> {
    await db.write(async () => {
      const record = await db.get<CustomerModel>("customers").find(id);
      await record.destroyPermanently();
    });
  },
};
