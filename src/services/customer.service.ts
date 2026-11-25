import type { Database } from "@nozbe/watermelondb";

import { customerRepository } from "../repositories/customer.repository";
import type {
  Customer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../types/customer";

function validateName(name: string) {
  if (!name.trim()) {
    throw new Error("Customer name cannot be empty.");
  }
}

export const customerService = {
  getAll(db: Database): Promise<Customer[]> {
    return customerRepository.getAll(db);
  },

  async create(db: Database, input: CreateCustomerInput): Promise<Customer> {
    validateName(input.name);

    return customerRepository.create(db, input);
  },

  async update(
    db: Database,
    id: string,
    input: UpdateCustomerInput,
  ): Promise<Customer> {
    const existing = await customerRepository.getById(db, id);

    if (!existing) throw new Error("Customer not found.");

    if (input.name !== undefined) validateName(input.name);

    return customerRepository.update(db, id, input);
  },

  delete(db: Database, id: string): Promise<void> {
    return customerRepository.delete(db, id);
  },
};
