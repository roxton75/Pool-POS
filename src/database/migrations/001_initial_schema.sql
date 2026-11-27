-- Q-Zone Manager Initial Schema Migration
-- Version: 1
-- Description: Creates all 13 tables with proper columns, constraints, and foreign keys

PRAGMA foreign_keys = ON;

-- ============================================================================
-- TABLE: resources
-- ============================================================================
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('american_pool', 'mini_snooker', 'big_snooker', 'ps5')),
    rate_per_hour INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    is_maintenance INTEGER NOT NULL DEFAULT 0 CHECK (is_maintenance IN (0, 1)),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- TABLE: customers
-- ============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);

-- ============================================================================
-- TABLE: sessions
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY NOT NULL,
    booking_number TEXT NOT NULL UNIQUE,
    resource_id TEXT NOT NULL,
    customer_id TEXT,
    customer_name TEXT,
    customer_phone TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    rate_snapshot INTEGER NOT NULL DEFAULT 0,
    grace_period_snapshot INTEGER NOT NULL DEFAULT 12,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    total_paused_seconds INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_resource_id ON sessions(resource_id);
CREATE INDEX IF NOT EXISTS idx_sessions_customer_id ON sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_booking_number ON sessions(booking_number);

-- ============================================================================
-- TABLE: session_pauses
-- ============================================================================
CREATE TABLE IF NOT EXISTS session_pauses (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    paused_at TEXT NOT NULL,
    resumed_at TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_session_pauses_session_id ON session_pauses(session_id);
CREATE INDEX IF NOT EXISTS idx_session_pauses_resumed_at ON session_pauses(resumed_at);

-- ============================================================================
-- TABLE: payments
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY NOT NULL,
    session_id TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    method TEXT NOT NULL,
    note TEXT,
    paid_at TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payments_session_id ON payments(session_id);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);

-- ============================================================================
-- TABLE: waitlist
-- ============================================================================
CREATE TABLE IF NOT EXISTS waitlist (
    id TEXT PRIMARY KEY NOT NULL,
    customer_id TEXT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    resource_type TEXT CHECK (resource_type IN ('american_pool', 'mini_snooker', 'big_snooker', 'ps5')),
    queue_position INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'assigned', 'cancelled', 'removed')),
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_customer_id ON waitlist(customer_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_resource_type ON waitlist(resource_type);
CREATE INDEX IF NOT EXISTS idx_waitlist_queue_position ON waitlist(queue_position);

-- ============================================================================
-- TABLE: settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- TABLE: food_categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS food_categories (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_food_categories_display_order ON food_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_food_categories_is_active ON food_categories(is_active);

-- ============================================================================
-- TABLE: food_items
-- ============================================================================
CREATE TABLE IF NOT EXISTS food_items (
    id TEXT PRIMARY KEY NOT NULL,
    category_id TEXT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    is_available INTEGER NOT NULL DEFAULT 1 CHECK (is_available IN (0, 1)),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (category_id) REFERENCES food_categories(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_food_items_category_id ON food_items(category_id);
CREATE INDEX IF NOT EXISTS idx_food_items_is_available ON food_items(is_available);

-- ============================================================================
-- TABLE: food_orders
-- ============================================================================
CREATE TABLE IF NOT EXISTS food_orders (
    id TEXT PRIMARY KEY NOT NULL,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    subtotal INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_food_orders_order_number ON food_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_food_orders_status ON food_orders(status);
CREATE INDEX IF NOT EXISTS idx_food_orders_created_at ON food_orders(created_at);

-- ============================================================================
-- TABLE: food_order_items
-- ============================================================================
CREATE TABLE IF NOT EXISTS food_order_items (
    id TEXT PRIMARY KEY NOT NULL,
    order_id TEXT NOT NULL,
    food_item_id TEXT,
    item_name_snapshot TEXT NOT NULL,
    price_snapshot INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1,
    line_total INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (order_id) REFERENCES food_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_food_order_items_order_id ON food_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_food_order_items_food_item_id ON food_order_items(food_item_id);

-- ============================================================================
-- Schema version tracking (using PRAGMA user_version)
-- ============================================================================
-- Initial schema version = 1
PRAGMA user_version = 1;