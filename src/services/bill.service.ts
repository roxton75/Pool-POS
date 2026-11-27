import type { SQLiteDatabase } from "expo-sqlite";

import {
  billRepository,
  type Bill,
  type BillItemInput,
} from "../repositories/bill.repository";

interface CreateSessionBillInput {
  sessionId: string;
  foodItems?: BillItemInput[];
}

interface CreateFoodOnlyBillInput {
  customerName?: string | null;
  foodItems: BillItemInput[];
}

function createId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createBillNumber(): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");

  const suffix = Math.floor(1000 + Math.random() * 9000);

  return `QZ-${date}-${suffix}`;
}

function validateFoodItems(items: BillItemInput[]): void {
  for (const item of items) {
    if (!item.foodItemId?.trim()) {
      throw new Error("Invalid food item.");
    }

    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Food quantity must be a positive whole number.");
    }
  }
}

async function createBill(
  db: SQLiteDatabase,
  input: {
    sessionId: string | null;
    customerName: string | null;
    sessionAmount: number;
    foodItems: BillItemInput[];
  },
): Promise<Bill> {
  validateFoodItems(input.foodItems);

  if (!Number.isInteger(input.sessionAmount) || input.sessionAmount < 0) {
    throw new Error("Invalid session amount.");
  }

  const billId = createId("bill");

  await db.withTransactionAsync(async () => {
    await billRepository.create(db, {
      id: billId,
      billNumber: createBillNumber(),
      sessionId: input.sessionId,
      customerName: input.customerName,
      sessionAmount: input.sessionAmount,
    });

    if (input.foodItems.length > 0) {
      await billRepository.addItems(db, billId, input.foodItems);
    }
  });

  const bill = await billRepository.getById(db, billId);

  if (!bill) {
    throw new Error("Bill was created but could not be loaded.");
  }

  return bill;
}

export const billService = {
  async createSessionBill(
    db: SQLiteDatabase,
    input: CreateSessionBillInput,
  ): Promise<Bill> {
    const session = await db.getFirstAsync<{
      id: string;
      status: string;
      customer_name: string | null;
      total_amount: number;
    }>(
      `SELECT id, status, customer_name, total_amount
       FROM sessions
       WHERE id = ?`,
      input.sessionId,
    );

    if (!session) {
      throw new Error("Session not found.");
    }

    if (session.status !== "completed") {
      throw new Error("Only completed sessions can be billed.");
    }

    const existing = await billRepository.getBySessionId(db, input.sessionId);

    if (existing) {
      throw new Error("A bill already exists for this session.");
    }

    return createBill(db, {
      sessionId: session.id,
      customerName: session.customer_name,
      sessionAmount: session.total_amount,
      foodItems: input.foodItems ?? [],
    });
  },

  async createFoodOnlyBill(
    db: SQLiteDatabase,
    input: CreateFoodOnlyBillInput,
  ): Promise<Bill> {
    if (input.foodItems.length === 0) {
      throw new Error("Add at least one food item to create a bill.");
    }

    return createBill(db, {
      sessionId: null,
      customerName: input.customerName?.trim() || null,
      sessionAmount: 0,
      foodItems: input.foodItems,
    });
  },

  getById(db: SQLiteDatabase, billId: string): Promise<Bill | null> {
    return billRepository.getById(db, billId);
  },

  getBySessionId(db: SQLiteDatabase, sessionId: string): Promise<Bill | null> {
    return billRepository.getBySessionId(db, sessionId);
  },

  getAll(db: SQLiteDatabase): Promise<Bill[]> {
    return billRepository.getAll(db);
  },
};
