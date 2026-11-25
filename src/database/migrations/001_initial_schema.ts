import type { SQLiteDatabase } from "expo-sqlite";

export const version = 1;

export async function up(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (
        type IN ('american_pool', 'mini_snooker', 'big_snooker', 'ps5')
      ),
      rate_per_hour INTEGER NOT NULL DEFAULT 0 CHECK (rate_per_hour >= 0),
      is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
      is_maintenance INTEGER NOT NULL DEFAULT 0 CHECK (is_maintenance IN (0, 1)),
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      phone TEXT,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone
      ON customers(phone)
      WHERE phone IS NOT NULL AND phone != '';

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      booking_number TEXT NOT NULL UNIQUE,
      resource_id TEXT NOT NULL,
      customer_id TEXT,
      customer_name TEXT,
      customer_phone TEXT,

      status TEXT NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'paused', 'completed', 'cancelled')
      ),

      rate_snapshot INTEGER NOT NULL CHECK (rate_snapshot >= 0),
      grace_period_snapshot INTEGER NOT NULL DEFAULT 12,

      started_at TEXT NOT NULL,
      ended_at TEXT,
      total_paused_seconds INTEGER NOT NULL DEFAULT 0,
      total_amount INTEGER NOT NULL DEFAULT 0,
      notes TEXT,

      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (resource_id) REFERENCES resources(id),
      FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_resource
      ON sessions(resource_id);

    CREATE INDEX IF NOT EXISTS idx_sessions_status
      ON sessions(status);

    CREATE INDEX IF NOT EXISTS idx_sessions_started_at
      ON sessions(started_at);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_one_open_per_resource
      ON sessions(resource_id)
      WHERE status IN ('active', 'paused');

    CREATE TABLE IF NOT EXISTS session_pauses (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      paused_at TEXT NOT NULL,
      resumed_at TEXT,

      FOREIGN KEY (session_id) REFERENCES sessions(id)
        ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_session_pauses_session
      ON session_pauses(session_id);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_session_one_open_pause
      ON session_pauses(session_id)
      WHERE resumed_at IS NULL;

    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY NOT NULL,
      session_id TEXT NOT NULL,
      amount INTEGER NOT NULL CHECK (amount > 0),
      method TEXT NOT NULL CHECK (method IN ('cash', 'upi')),
      note TEXT,
      paid_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (session_id) REFERENCES sessions(id)
        ON DELETE RESTRICT
    );

    CREATE INDEX IF NOT EXISTS idx_payments_session
      ON payments(session_id);

    CREATE INDEX IF NOT EXISTS idx_payments_paid_at
      ON payments(paid_at);

    CREATE TABLE IF NOT EXISTS waitlist (
      id TEXT PRIMARY KEY NOT NULL,
      customer_id TEXT,
      customer_name TEXT NOT NULL,
      customer_phone TEXT,
      resource_type TEXT,
      queue_position INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'waiting' CHECK (
        status IN ('waiting', 'assigned', 'cancelled', 'removed')
      ),
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (customer_id) REFERENCES customers(id)
        ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_waitlist_status_position
      ON waitlist(status, queue_position);

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_items (
      id TEXT PRIMARY KEY NOT NULL,
      category_id TEXT,
      name TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0),
      is_available INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (category_id) REFERENCES food_categories(id)
        ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS food_orders (
      id TEXT PRIMARY KEY NOT NULL,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT,
      status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'preparing', 'ready', 'served', 'cancelled')
      ),
      subtotal INTEGER NOT NULL DEFAULT 0,
      total_amount INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS food_order_items (
      id TEXT PRIMARY KEY NOT NULL,
      order_id TEXT NOT NULL,
      food_item_id TEXT,
      item_name_snapshot TEXT NOT NULL,
      price_snapshot INTEGER NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      line_total INTEGER NOT NULL,

      FOREIGN KEY (order_id) REFERENCES food_orders(id)
        ON DELETE CASCADE,
      FOREIGN KEY (food_item_id) REFERENCES food_items(id)
        ON DELETE SET NULL
    );

    CREATE INDEX IF NOT EXISTS idx_food_orders_created_at
      ON food_orders(created_at);

    CREATE INDEX IF NOT EXISTS idx_food_orders_status
      ON food_orders(status);

    CREATE INDEX IF NOT EXISTS idx_food_order_items_order
      ON food_order_items(order_id);
  `);

  // Seed default Q-Zone resources. INSERT OR IGNORE prevents duplicates.
  await db.execAsync(`
    INSERT OR IGNORE INTO resources
      (id, name, type, rate_per_hour, display_order)
    VALUES
      ('resource_pool_01', 'American Pool', 'american_pool', 250, 1),
      ('resource_mini_snooker_01', 'Mini Snooker', 'mini_snooker', 250, 2),
      ('resource_big_snooker_01', 'Big Snooker 01', 'big_snooker', 400, 3),
      ('resource_big_snooker_02', 'Big Snooker 02', 'big_snooker', 400, 4),
      ('resource_ps5_01', 'PS5 Console 01', 'ps5', 150, 5);

    INSERT OR IGNORE INTO settings (key, value)
    VALUES
      ('grace_period_minutes', '12'),
      ('currency', 'INR'),
      ('rounding_mode', 'ceil'),
      ('business_name', 'Q-Zone');
  `);
}
