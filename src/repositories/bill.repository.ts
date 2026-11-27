import type { SQLiteDatabase } from "expo-sqlite";

export interface BillItemInput {
  foodItemId: string;
  quantity: number;
}

export interface BillItem {
  id: string;
  billId: string;
  foodItemId: string | null;
  itemName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  sessionId: string | null;
  customerName: string | null;
  sessionAmount: number;
  foodAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items: BillItem[];
}

interface BillRow {
  id: string;
  bill_number: string;
  session_id: string | null;
  customer_name: string | null;
  session_amount: number;
  food_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

interface BillItemRow {
  id: string;
  bill_id: string;
  food_item_id: string | null;
  item_name_snapshot: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  created_at: string;
}

export const billRepository = {
  async create(
    db: SQLiteDatabase,
    input: {
      id: string;
      billNumber: string;
      sessionId: string | null;
      customerName: string | null;
      sessionAmount: number;
    },
  ): Promise<void> {
    await db.runAsync(
      `INSERT INTO bills (
        id, bill_number, session_id, customer_name,
        session_amount, food_amount, total_amount
      ) VALUES (?, ?, ?, ?, ?, 0, ?)`,
      input.id,
      input.billNumber,
      input.sessionId,
      input.customerName,
      input.sessionAmount,
      input.sessionAmount,
    );
  },

  async addItems(
    db: SQLiteDatabase,
    billId: string,
    items: BillItemInput[],
  ): Promise<void> {
    for (const item of items) {
      const foodItem = await db.getFirstAsync<{
        id: string;
        name: string;
        price: number;
        is_available: number;
      }>(
        `SELECT id, name, price, is_available
         FROM food_items
         WHERE id = ?`,
        item.foodItemId,
      );

      if (!foodItem) {
        throw new Error(`Food item not found: ${item.foodItemId}`);
      }

      if (foodItem.is_available !== 1) {
        throw new Error(`${foodItem.name} is currently unavailable.`);
      }

      const id = `bi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const totalPrice = foodItem.price * item.quantity;

      await db.runAsync(
        `INSERT INTO bill_items (
          id, bill_id, food_item_id, item_name_snapshot,
          unit_price, quantity, total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        id,
        billId,
        foodItem.id,
        foodItem.name,
        foodItem.price,
        item.quantity,
        totalPrice,
      );
    }
  },

  async getItems(db: SQLiteDatabase, billId: string): Promise<BillItem[]> {
    const rows = await db.getAllAsync<BillItemRow>(
      `SELECT * FROM bill_items
       WHERE bill_id = ?
       ORDER BY created_at ASC`,
      billId,
    );

    return rows.map((row) => ({
      id: row.id,
      billId: row.bill_id,
      foodItemId: row.food_item_id,
      itemName: row.item_name_snapshot,
      unitPrice: row.unit_price,
      quantity: row.quantity,
      totalPrice: row.total_price,
      createdAt: row.created_at,
    }));
  },

  async getById(db: SQLiteDatabase, id: string): Promise<Bill | null> {
    const row = await db.getFirstAsync<BillRow>(
      `SELECT * FROM bills WHERE id = ?`,
      id,
    );

    if (!row) return null;

    return {
      id: row.id,
      billNumber: row.bill_number,
      sessionId: row.session_id,
      customerName: row.customer_name,
      sessionAmount: row.session_amount,
      foodAmount: row.food_amount,
      totalAmount: row.total_amount,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      items: await this.getItems(db, row.id),
    };
  },

  async getBySessionId(
    db: SQLiteDatabase,
    sessionId: string,
  ): Promise<Bill | null> {
    const row = await db.getFirstAsync<{ id: string }>(
      `SELECT id FROM bills WHERE session_id = ?`,
      sessionId,
    );

    return row ? this.getById(db, row.id) : null;
  },

  async getAll(db: SQLiteDatabase): Promise<Bill[]> {
    const rows = await db.getAllAsync<BillRow>(
      `SELECT * FROM bills ORDER BY created_at DESC`,
    );

    const bills: Bill[] = [];

    for (const row of rows) {
      const bill = await this.getById(db, row.id);
      if (bill) bills.push(bill);
    }

    return bills;
  },
};
