import { SQLiteDatabase } from "expo-sqlite";

/**
 * Initialize database and run migrations
 * Returns the initialized database and migration results
 */
import { getDatabase } from "./connection";

/**
 * Migration Runner for Q-Zone Manager
 * Uses PRAGMA user_version for version tracking and executes migrations in transactions.
 */

// Migration definitions embedded as strings (bundled at compile time)
const MIGRATION_1_SCHEMA = `
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
`;

const MIGRATION_2_INDEXES = `
-- Q-Zone Manager Indexes Migration
-- Version: 2
-- Description: Additional indexes for frequently queried columns

PRAGMA foreign_keys = ON;

-- Additional composite indexes for common query patterns

-- Sessions: Find active/paused sessions for a resource (used by resourceRepository.getByResource)
CREATE INDEX IF NOT EXISTS idx_sessions_resource_status
    ON sessions(resource_id, status)
    WHERE status IN ('active', 'paused');

-- Sessions: Find customer's active sessions
CREATE INDEX IF NOT EXISTS idx_sessions_customer_status
    ON sessions(customer_id, status)
    WHERE status IN ('active', 'paused');

-- Waitlist: Find waiting entries by resource type and queue position
CREATE INDEX IF NOT EXISTS idx_waitlist_type_status_position
    ON waitlist(resource_type, status, queue_position)
    WHERE status = 'waiting';

-- Sessions: Find sessions by date range (for reports)
CREATE INDEX IF NOT EXISTS idx_sessions_started_at_status
    ON sessions(started_at, status);

-- Payments: Find payments by session and date
CREATE INDEX IF NOT EXISTS idx_payments_session_paid_at
    ON payments(session_id, paid_at);

-- Food orders: Find orders by status and date
CREATE INDEX IF NOT EXISTS idx_food_orders_status_created
    ON food_orders(status, created_at);

-- Food order items: Find items by food item
CREATE INDEX IF NOT EXISTS idx_food_order_items_food_item
    ON food_order_items(food_item_id);

-- Resources: Active resources ordered by display_order
CREATE INDEX IF NOT EXISTS idx_resources_active_order
    ON resources(is_active, display_order)
    WHERE is_active = 1;

-- Food items: Available items by category
CREATE INDEX IF NOT EXISTS idx_food_items_category_available
    ON food_items(category_id, is_available)
    WHERE is_available = 1;

-- Waitlist: Customer's waitlist entries
CREATE INDEX IF NOT EXISTS idx_waitlist_customer_status
    ON waitlist(customer_id, status)
    WHERE status IN ('waiting', 'assigned');

-- Session pauses: Open pauses (resumed_at is null)
CREATE INDEX IF NOT EXISTS idx_session_pauses_open
    ON session_pauses(session_id, paused_at)
    WHERE resumed_at IS NULL;

PRAGMA user_version = 2;
`;

const MIGRATION_3_SEED_DATA = `
-- Q-Zone Manager Seed Data Migration
-- Version: 3
-- Description: Default Q-Zone resources and settings (idempotent inserts)

PRAGMA foreign_keys = ON;

-- ============================================================================
-- Default Settings
-- ============================================================================

-- Grace period in minutes (12 minutes = 720 seconds)
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('grace_period_minutes', '12', datetime('now'));

-- Club open/close hours (24-hour format)
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('club_open_hour', '10', datetime('now'));

INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('club_close_hour', '2', datetime('now'));

-- Minimum session charge in rupees
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('minimum_charge', '50', datetime('now'));

-- Round up to nearest rupees
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('round_up_to', '10', datetime('now'));

-- Maximum pause duration in minutes
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('max_pause_minutes', '30', datetime('now'));

-- Waitlist claim window in minutes
INSERT OR IGNORE INTO settings (key, value, updated_at)
VALUES ('waitlist_claim_minutes', '5', datetime('now'));

-- ============================================================================
-- Default Resources (Q-Zone Standard Layout)
-- ============================================================================

-- Big Snooker Tables (2 tables)
INSERT OR IGNORE INTO resources (id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at)
VALUES (
    'resource_big_snooker_01',
    'Big Snooker 01',
    'big_snooker',
    30000,  -- 300.00 rupees stored as paise (300 * 100)
    1,
    0,
    1,
    datetime('now'),
    datetime('now')
);

INSERT OR IGNORE INTO resources (id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at)
VALUES (
    'resource_big_snooker_02',
    'Big Snooker 02',
    'big_snooker',
    30000,
    1,
    0,
    2,
    datetime('now'),
    datetime('now')
);

-- Mini Snooker Table (1 table)
INSERT OR IGNORE INTO resources (id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at)
VALUES (
    'resource_mini_snooker_01',
    'Mini Snooker',
    'mini_snooker',
    18000,  -- 180.00 rupees
    1,
    0,
    3,
    datetime('now'),
    datetime('now')
);

-- American Pool Table (1 table)
INSERT OR IGNORE INTO resources (id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at)
VALUES (
    'resource_pool_01',
    'American Pool',
    'american_pool',
    20000,  -- 200.00 rupees
    1,
    0,
    4,
    datetime('now'),
    datetime('now')
);

-- PS5 Console (1 unit)
INSERT OR IGNORE INTO resources (id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at)
VALUES (
    'resource_ps5_01',
    'PS5 Console',
    'ps5',
    15000,  -- 150.00 rupees
    1,
    0,
    5,
    datetime('now'),
    datetime('now')
);

-- ============================================================================
-- Default Food Categories
-- ============================================================================

INSERT OR IGNORE INTO food_categories (id, name, display_order, is_active, created_at)
VALUES ('cat_beverages', 'Beverages', 1, 1, datetime('now'));

INSERT OR IGNORE INTO food_categories (id, name, display_order, is_active, created_at)
VALUES ('cat_snacks', 'Snacks', 2, 1, datetime('now'));

INSERT OR IGNORE INTO food_categories (id, name, display_order, is_active, created_at)
VALUES ('cat_meals', 'Meals', 3, 1, datetime('now'));

-- ============================================================================
-- Default Food Items
-- ============================================================================

-- Beverages
INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_water', 'cat_beverages', 'Water Bottle', 2000, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_soda', 'cat_beverages', 'Soft Drink', 3000, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_tea', 'cat_beverages', 'Tea', 1500, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_coffee', 'cat_beverages', 'Coffee', 2500, 1, datetime('now'), datetime('now'));

-- Snacks
INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_chips', 'cat_snacks', 'Chips', 3000, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_nuts', 'cat_snacks', 'Nuts', 4000, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_samosa', 'cat_snacks', 'Samosa', 2500, 1, datetime('now'), datetime('now'));

-- Meals
INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_sandwich', 'cat_meals', 'Sandwich', 6000, 1, datetime('now'), datetime('now'));

INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at)
VALUES ('item_burger', 'cat_meals', 'Burger', 8000, 1, datetime('now'), datetime('now'));

PRAGMA user_version = 3;
`;

const MIGRATION_4_BILLING_SYSTEM = `
-- Q-Zone Manager Billing System Migration
-- Version: 4
-- Description: Adds billing system tables (bills, bill_items) with proper constraints

PRAGMA foreign_keys = ON;

-- ============================================================================
-- TABLE: bills
-- ============================================================================
CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY NOT NULL,
    bill_number TEXT NOT NULL UNIQUE,
    session_id TEXT,
    customer_name TEXT,
    session_amount INTEGER NOT NULL DEFAULT 0,
    food_amount INTEGER NOT NULL DEFAULT 0,
    total_amount INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL
);

-- Unique constraint to prevent duplicate bills for the same session
CREATE UNIQUE INDEX IF NOT EXISTS idx_bills_session_id_unique
    ON bills(session_id)
    WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_bills_session_id ON bills(session_id);
CREATE INDEX IF NOT EXISTS idx_bills_customer_name ON bills(customer_name);
CREATE INDEX IF NOT EXISTS idx_bills_created_at ON bills(created_at);
CREATE INDEX IF NOT EXISTS idx_bills_total_amount ON bills(total_amount);

-- ============================================================================
-- TABLE: bill_items
-- ============================================================================
CREATE TABLE IF NOT EXISTS bill_items (
    id TEXT PRIMARY KEY NOT NULL,
    bill_id TEXT NOT NULL,
    food_item_id TEXT,
    item_name_snapshot TEXT NOT NULL,
    unit_price INTEGER NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    total_price INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
    FOREIGN KEY (food_item_id) REFERENCES food_items(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_bill_items_bill_id ON bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_bill_items_food_item_id ON bill_items(food_item_id);

-- ============================================================================
-- Triggers for business rules
-- ============================================================================

-- Trigger: Auto-calculate line_total for bill_items
CREATE TRIGGER IF NOT EXISTS trg_bill_items_calculate_total
BEFORE INSERT ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bill_items SET total_price = NEW.quantity * NEW.unit_price WHERE id = NEW.id;
END;

-- Trigger: Auto-update bill totals when items are added
CREATE TRIGGER IF NOT EXISTS trg_bill_items_update_bill_total
AFTER INSERT ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills
    SET food_amount = (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    total_amount = session_amount + (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    updated_at = datetime('now')
    WHERE id = NEW.bill_id;
END;

-- Trigger: Update bill totals when items are updated
CREATE TRIGGER IF NOT EXISTS trg_bill_items_update_bill_total_update
AFTER UPDATE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills
    SET food_amount = (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    total_amount = session_amount + (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    updated_at = datetime('now')
    WHERE id = NEW.bill_id;
END;

-- Trigger: Update bill totals when items are deleted
CREATE TRIGGER IF NOT EXISTS trg_bill_items_update_bill_total_delete
AFTER DELETE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills
    SET food_amount = (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = OLD.bill_id
    ),
    total_amount = session_amount + (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = OLD.bill_id
    ),
    updated_at = datetime('now')
    WHERE id = OLD.bill_id;
END;

-- Trigger: Prevent duplicate bills for same session
CREATE TRIGGER IF NOT EXISTS trg_prevent_duplicate_session_bill
BEFORE INSERT ON bills
FOR EACH ROW
WHEN NEW.session_id IS NOT NULL
BEGIN
    SELECT CASE
        WHEN EXISTS (SELECT 1 FROM bills WHERE session_id = NEW.session_id)
        THEN RAISE(ABORT, 'Duplicate bill for session: a bill already exists for this session')
    END;
END;

-- Trigger: Validate session is completed before generating bill
CREATE TRIGGER IF NOT EXISTS trg_validate_session_completed
BEFORE INSERT ON bills
FOR EACH ROW
WHEN NEW.session_id IS NOT NULL
BEGIN
    SELECT CASE
        WHEN (SELECT status FROM sessions WHERE id = NEW.session_id) != 'completed'
        THEN RAISE(ABORT, 'Cannot generate bill: session must be completed first')
    END;
END;

-- Trigger: Auto-calculate line_total on bill_items insert
CREATE TRIGGER IF NOT EXISTS trg_bill_items_line_total_insert
BEFORE INSERT ON bill_items
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN NEW.total_price != (NEW.quantity * NEW.unit_price)
        THEN RAISE(ABORT, 'total_price must equal quantity * unit_price')
    END;
END;

-- Trigger: Auto-calculate line_total on bill_items update
CREATE TRIGGER IF NOT EXISTS trg_bill_items_line_total_update
BEFORE UPDATE ON bill_items
FOR EACH ROW
WHEN NEW.total_price != (NEW.quantity * NEW.unit_price)
BEGIN
    SELECT CASE
        WHEN NEW.total_price != (NEW.quantity * NEW.unit_price)
        THEN RAISE(ABORT, 'total_price must equal quantity * unit_price')
    END;
END;

-- Trigger: Update bill updated_at on bill_items changes
CREATE TRIGGER IF NOT EXISTS trg_bills_updated_at_on_items_change
AFTER INSERT ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills SET updated_at = datetime('now') WHERE id = NEW.bill_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_bills_updated_at_on_items_update
AFTER UPDATE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills SET updated_at = datetime('now') WHERE id = NEW.bill_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_bills_updated_at_on_items_delete
AFTER DELETE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills SET updated_at = datetime('now') WHERE id = OLD.bill_id;
END;

PRAGMA user_version = 4;
`;
const MIGRATION_5_CLEANUP_AND_SEED = `-- Q-Zone Manager Cleanup & Seed Migration
-- Version: 5
-- Description: Remove deprecated tables and populate with realistic Q-Zone sample data

PRAGMA foreign_keys = ON;

-- ============================================================================
-- STEP 1: Remove deprecated tables
-- ============================================================================

-- Drop deprecated tables (no foreign key dependencies from remaining tables)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS food_order_items;
DROP TABLE IF EXISTS food_orders;

-- ============================================================================
-- STEP 2: Comprehensive seed data for all 11 tables
-- ============================================================================

-- ============================================================================
-- Settings (Idempotent)
-- ============================================================================
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('grace_period_minutes', '12', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('club_open_hour', '10', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('club_close_hour', '2', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('minimum_charge', '50', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('round_up_to', '10', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('max_pause_minutes', '30', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('waitlist_claim_minutes', '5', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('club_name', 'Q-Zone Pool & Snooker Club', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('club_phone', '+91-9876543210', datetime('now'));
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES ('gst_rate', '18', datetime('now'));

-- ============================================================================
-- Resources (5 tables with standard Q-Zone rates)
-- Rates stored in paise (₹1 = 100 paise)
-- ============================================================================
INSERT OR IGNORE INTO resources (id, name, type, rate_per_hour, is_active, is_maintenance, display_order, created_at, updated_at)
VALUES
    ('res_big_snooker_01', 'Big Snooker 01', 'big_snooker', 30000, 1, 0, 1, datetime('now'), datetime('now')),
    ('res_big_snooker_02', 'Big Snooker 02', 'big_snooker', 30000, 1, 0, 2, datetime('now'), datetime('now')),
    ('res_mini_snooker_01', 'Mini Snooker 01', 'mini_snooker', 18000, 1, 0, 3, datetime('now'), datetime('now')),
    ('res_pool_01', 'American Pool 01', 'american_pool', 20000, 1, 0, 4, datetime('now'), datetime('now')),
    ('res_ps5_01', 'PS5 Console 01', 'ps5', 15000, 1, 0, 5, datetime('now'), datetime('now'));

-- ============================================================================
-- Customers (8 realistic customers)
-- ============================================================================
INSERT OR IGNORE INTO customers (id, name, phone, notes, created_at, updated_at) VALUES
    ('cust_001', 'Rahul Sharma', '+91-9876543210', 'Regular - prefers Big Snooker', datetime('now', '-60 days'), datetime('now', '-5 days')),
    ('cust_002', 'Priya Patel', '+91-9876543211', 'Pool enthusiast', datetime('now', '-45 days'), datetime('now', '-3 days')),
    ('cust_003', 'Amit Singh', '+91-9876543212', 'Corporate booking - weekday evenings', datetime('now', '-30 days'), datetime('now', '-1 day')),
    ('cust_004', 'Sneha Deshmukh', '+91-9876543213', 'Mini Snooker regular', datetime('now', '-20 days'), datetime('now', '-2 hours')),
    ('cust_005', 'Karan Mehta', '+91-9876543214', 'PS5 gamer, weekend regular', datetime('now', '-15 days'), datetime('now', '-4 days')),
    ('cust_006', 'Neha Gupta', '+91-9876543215', 'New customer - walk-in', datetime('now', '-7 days'), datetime('now', '-1 day')),
    ('cust_007', 'Vikram Joshi', '+91-9876543216', 'Tournament player - Big Snooker', datetime('now', '-3 days'), datetime('now', '-3 hours')),
    ('cust_008', 'Anita Reddy', '+91-9876543217', 'Family booking - weekends', datetime('now', '-1 day'), datetime('now', '-30 minutes'));

-- ============================================================================
-- Sessions (12 sessions: active, completed, paused, cancelled)
-- Rates in paise (30000 = ₹300, 18000 = ₹180, 20000 = ₹200, 15000 = ₹150)
-- ============================================================================

-- Active sessions (currently running)
INSERT OR IGNORE INTO sessions (id, booking_number, resource_id, customer_id, customer_name, customer_phone, status, rate_snapshot, grace_period_snapshot, started_at, ended_at, total_paused_seconds, total_amount, notes, created_at, updated_at) VALUES
    ('sess_001', 'QZ-20241201-001', 'res_big_snooker_01', 'cust_001', 'Rahul Sharma', '+91-9876543210', 'active', 30000, 12, datetime('now', '-2 hours'), NULL, 0, 0, 'Tournament practice', datetime('now', '-2 hours'), datetime('now', '-2 hours')),
    ('sess_002', 'QZ-20241201-002', 'res_pool_01', 'cust_002', 'Priya Patel', '+91-9876543211', 'active', 20000, 12, datetime('now', '-1 hour'), NULL, 0, 0, 'Casual game', datetime('now', '-1 hour'), datetime('now', '-1 hour')),
    ('sess_003', 'QZ-20241201-003', 'res_ps5_01', 'cust_005', 'Karan Mehta', '+91-9876543214', 'active', 15000, 12, datetime('now', '-30 minutes'), NULL, 0, 0, 'Gaming session', datetime('now', '-30 minutes'), datetime('now', '-30 minutes'));

-- Completed sessions (yesterday and today)
INSERT OR IGNORE INTO sessions (id, booking_number, resource_id, customer_id, customer_name, customer_phone, status, rate_snapshot, grace_period_snapshot, started_at, ended_at, total_paused_seconds, total_amount, notes, created_at, updated_at) VALUES
    ('sess_004', 'QZ-20241130-001', 'res_big_snooker_01', 'cust_001', 'Rahul Sharma', '+91-9876543210', 'completed', 30000, 12, datetime('now', '-1 day', '-3 hours'), datetime('now', '-1 day', '-1 hour'), 0, 6000, 'Tournament practice - 2 hours', datetime('now', '-1 day', '-3 hours'), datetime('now', '-1 day', '-1 hour')),
    ('sess_005', 'QZ-20241130-002', 'res_pool_01', 'cust_002', 'Priya Patel', '+91-9876543211', 'completed', 20000, 12, datetime('now', '-1 day', '-4 hours'), datetime('now', '-1 day', '-2 hours'), 300, 4000, 'Pool practice - 2 hours with 5 min pause', datetime('now', '-1 day', '-4 hours'), datetime('now', '-1 day', '-2 hours')),
    ('sess_006', 'QZ-20241130-003', 'res_mini_snooker_01', 'cust_004', 'Sneha Deshmukh', '+91-9876543213', 'completed', 18000, 12, datetime('now', '-1 day', '-5 hours'), datetime('now', '-1 day', '-3.5 hours'), 0, 2700, 'Mini snooker practice - 1.5 hours', datetime('now', '-1 day', '-5 hours'), datetime('now', '-1 day', '-3.5 hours')),
    ('sess_007', 'QZ-20241129-001', 'res_big_snooker_02', 'cust_003', 'Amit Singh', '+91-9876543212', 'completed', 30000, 12, datetime('now', '-2 days', '-3 hours'), datetime('now', '-2 days', '-1 hour'), 0, 6000, 'Corporate booking', datetime('now', '-2 days', '-3 hours'), datetime('now', '-2 days', '-1 hour')),
    ('sess_008', 'QZ-20241129-002', 'res_ps5_01', 'cust_005', 'Karan Mehta', '+91-9876543214', 'completed', 15000, 12, datetime('now', '-2 days', '-5 hours'), datetime('now', '-2 days', '-3 hours'), 0, 3000, 'Gaming - 2 hours', datetime('now', '-2 days', '-5 hours'), datetime('now', '-2 days', '-3 hours')),
    ('sess_009', 'QZ-20241128-001', 'res_big_snooker_01', 'cust_007', 'Vikram Joshi', '+91-9876543216', 'completed', 30000, 12, datetime('now', '-3 days', '-2 hours'), datetime('now', '-3 days', '0 hours'), 600, 9000, 'Tournament prep - 3 hours with 10 min pause', datetime('now', '-3 days', '-2 hours'), datetime('now', '-3 days', '0 hours'));

-- Paused session
INSERT OR IGNORE INTO sessions (id, booking_number, resource_id, customer_id, customer_name, customer_phone, status, rate_snapshot, grace_period_snapshot, started_at, ended_at, total_paused_seconds, total_amount, notes, created_at, updated_at) VALUES
    ('sess_010', 'QZ-20241201-004', 'res_mini_snooker_01', 'cust_004', 'Sneha Deshmukh', '+91-9876543213', 'paused', 18000, 12, datetime('now', '-2 hours'), NULL, 1800, 0, 'Break for food', datetime('now', '-2 hours'), datetime('now', '-30 minutes'));

-- Cancelled session
INSERT OR IGNORE INTO sessions (id, booking_number, resource_id, customer_id, customer_name, customer_phone, status, rate_snapshot, grace_period_snapshot, started_at, ended_at, total_paused_seconds, total_amount, notes, created_at, updated_at) VALUES
    ('sess_011', 'QZ-20241127-001', 'res_big_snooker_01', 'cust_006', 'Neha Gupta', '+91-9876543215', 'cancelled', 30000, 12, datetime('now', '-4 days', '-2 hours'), datetime('now', '-4 days', '-1.5 hours'), 0, 0, 'Customer emergency', datetime('now', '-4 days', '-2 hours'), datetime('now', '-4 days', '-1.5 hours'));

-- Another completed for food bill
INSERT OR IGNORE INTO sessions (id, booking_number, resource_id, customer_id, customer_name, customer_phone, status, rate_snapshot, grace_period_snapshot, started_at, ended_at, total_paused_seconds, total_amount, notes, created_at, updated_at) VALUES
    ('sess_012', 'QZ-20241129-003', 'res_pool_01', 'cust_008', 'Anita Reddy', '+91-9876543217', 'completed', 20000, 12, datetime('now', '-3 days', '-4 hours'), datetime('now', '-3 days', '-2 hours'), 0, 4000, 'Family pool game', datetime('now', '-3 days', '-4 hours'), datetime('now', '-3 days', '-2 hours'));

-- ============================================================================
-- Session Pauses (related to sessions above)
-- ============================================================================
INSERT OR IGNORE INTO session_pauses (id, session_id, paused_at, resumed_at) VALUES
    ('pause_001', 'sess_005', datetime('now', '-1 day', '-2.5 hours'), datetime('now', '-1 day', '-2.45 hours')),  -- 5 min pause
    ('pause_002', 'sess_009', datetime('now', '-3 days', '-1 hour'), datetime('now', '-3 days', '-0.83 hours')), -- 10 min pause
    ('pause_003', 'sess_010', datetime('now', '-30 minutes'), NULL); -- Current pause

-- ============================================================================
-- Waitlist (realistic entries)
-- ============================================================================
INSERT OR IGNORE INTO waitlist (id, customer_id, customer_name, customer_phone, resource_type, queue_position, status, notes, created_at, updated_at) VALUES
    ('wl_001', 'cust_006', 'Neha Gupta', '+91-9876543215', 'big_snooker', 1, 'waiting', 'Wants Big Snooker', datetime('now', '-2 hours'), datetime('now', '-2 hours')),
    ('wl_002', NULL, 'Rohit Kumar', '+91-9876543218', 'american_pool', 1, 'waiting', 'Walk-in', datetime('now', '-1 hour'), datetime('now', '-1 hour')),
    ('wl_003', NULL, 'Pooja Shah', '+91-9876543219', 'big_snooker', 2, 'waiting', 'Wants Big Snooker 02', datetime('now', '-45 minutes'), datetime('now', '-45 minutes')),
    ('wl_004', 'cust_003', 'Amit Singh', '+91-9876543212', 'ps5', 1, 'assigned', 'Corporate booking', datetime('now', '-3 days'), datetime('now', '-3 days')),
    ('wl_005', NULL, 'Deepak Jain', '+91-9876543220', 'mini_snooker', 1, 'cancelled', 'Left before turn', datetime('now', '-2 days'), datetime('now', '-2 days'));

-- ============================================================================
-- Food Categories & Items
-- ============================================================================
INSERT OR IGNORE INTO food_categories (id, name, display_order, is_active, created_at) VALUES
    ('cat_beverages', 'Beverages', 1, 1, datetime('now')),
    ('cat_snacks', 'Snacks', 2, 1, datetime('now')),
    ('cat_meals', 'Meals', 3, 1, datetime('now'));

INSERT OR IGNORE INTO food_items (id, category_id, name, price, is_available, created_at, updated_at) VALUES
    ('item_water', 'cat_beverages', 'Water Bottle (500ml)', 2000, 1, datetime('now'), datetime('now')),
    ('item_soda', 'cat_beverages', 'Soft Drink (300ml)', 3000, 1, datetime('now'), datetime('now')),
    ('item_tea', 'cat_beverages', 'Tea (Hot)', 1500, 1, datetime('now'), datetime('now')),
    ('item_coffee', 'cat_beverages', 'Coffee (Hot)', 2500, 1, datetime('now'), datetime('now')),
    ('item_juice', 'cat_beverages', 'Fresh Juice (200ml)', 4000, 1, datetime('now'), datetime('now')),
    ('item_chips', 'cat_snacks', 'Chips (Lays)', 3000, 1, datetime('now'), datetime('now')),
    ('item_nuts', 'cat_snacks', 'Salted Nuts', 4000, 1, datetime('now'), datetime('now')),
    ('item_samosa', 'cat_snacks', 'Samosa (2 pcs)', 2500, 1, datetime('now'), datetime('now')),
    ('item_sandwich', 'cat_meals', 'Veg Sandwich', 6000, 1, datetime('now'), datetime('now')),
    ('item_burger', 'cat_meals', 'Veg Burger', 8000, 1, datetime('now'), datetime('now')),
    ('item_pizza', 'cat_meals', 'Personal Pizza', 12000, 1, datetime('now'), datetime('now'));

-- ============================================================================
-- Bills (Session bills + Food-only bills)
-- ============================================================================
-- Session bills (for completed sessions)
INSERT OR IGNORE INTO bills (id, bill_number, session_id, customer_name, session_amount, food_amount, total_amount, created_at, updated_at) VALUES
    ('bill_001', 'BILL-20241130-001', 'sess_004', 'Rahul Sharma', 6000, 0, 6000, datetime('now', '-1 day', '-1 hour'), datetime('now', '-1 day', '-1 hour')),
    ('bill_002', 'BILL-20241130-002', 'sess_005', 'Priya Patel', 4000, 3000, 7000, datetime('now', '-1 day', '-2 hours'), datetime('now', '-1 day', '-2 hours')),
    ('bill_003', 'BILL-20241130-003', 'sess_006', 'Sneha Deshmukh', 2700, 0, 2700, datetime('now', '-1 day', '-3.5 hours'), datetime('now', '-1 day', '-3.5 hours')),
    ('bill_004', 'BILL-20241129-001', 'sess_007', 'Amit Singh', 6000, 2500, 8500, datetime('now', '-2 days', '-1 hour'), datetime('now', '-2 days', '-1 hour')),
    ('bill_005', 'BILL-20241129-002', 'sess_008', 'Karan Mehta', 3000, 4000, 7000, datetime('now', '-2 days', '-3 hours'), datetime('now', '-2 days', '-3 hours')),
    ('bill_006', 'BILL-20241128-001', 'sess_009', 'Vikram Joshi', 9000, 0, 9000, datetime('now', '-3 days', '0 hours'), datetime('now', '-3 days', '0 hours')),
    ('bill_007', 'BILL-20241129-003', 'sess_012', 'Anita Reddy', 4000, 6000, 10000, datetime('now', '-3 days', '-2 hours'), datetime('now', '-3 days', '-2 hours'));

-- Food-only bills (walk-in)
INSERT OR IGNORE INTO bills (id, bill_number, session_id, customer_name, session_amount, food_amount, total_amount, created_at, updated_at) VALUES
    ('bill_008', 'BILL-20241201-001', NULL, 'Walk-in Customer', 0, 5500, 5500, datetime('now', '-2 hours'), datetime('now', '-2 hours')),
    ('bill_009', 'BILL-20241201-002', NULL, 'Takeaway Order', 0, 8000, 8000, datetime('now', '-1 hour'), datetime('now', '-1 hour'));

-- ============================================================================
-- Bill Items (with correct price snapshots)
-- ============================================================================
-- Bill 002: Priya Patel - Pool session + food
INSERT OR IGNORE INTO bill_items (id, bill_id, food_item_id, item_name_snapshot, unit_price, quantity, total_price, created_at) VALUES
    ('bi_001', 'bill_002', 'item_soda', 'Soft Drink (300ml)', 3000, 1, 3000, datetime('now', '-1 day', '-2 hours'));

-- Bill 004: Amit Singh - Big Snooker + snack
INSERT OR IGNORE INTO bill_items (id, bill_id, food_item_id, item_name_snapshot, unit_price, quantity, total_price, created_at) VALUES
    ('bi_002', 'bill_004', 'item_samosa', 'Samosa (2 pcs)', 2500, 1, 2500, datetime('now', '-2 days', '-1 hour'));

-- Bill 005: Karan Mehta - PS5 + food
INSERT OR IGNORE INTO bill_items (id, bill_id, food_item_id, item_name_snapshot, unit_price, quantity, total_price, created_at) VALUES
    ('bi_003', 'bill_005', 'item_burger', 'Veg Burger', 8000, 1, 8000, datetime('now', '-2 days', '-3 hours')),
    ('bi_004', 'bill_005', 'item_soda', 'Soft Drink (300ml)', 3000, 1, 3000, datetime('now', '-2 days', '-3 hours')),
    ('bi_005', 'bill_005', 'item_chips', 'Chips (Lays)', 3000, 1, 3000, datetime('now', '-2 days', '-3 hours'));

-- Bill 007: Anita Reddy - Pool + meal
INSERT OR IGNORE INTO bill_items (id, bill_id, food_item_id, item_name_snapshot, unit_price, quantity, total_price, created_at) VALUES
    ('bi_006', 'bill_007', 'item_burger', 'Veg Burger', 8000, 1, 8000, datetime('now', '-3 days', '-2 hours')),
    ('bi_007', 'bill_007', 'item_juice', 'Fresh Juice (200ml)', 4000, 1, 4000, datetime('now', '-3 days', '-2 hours')),
    ('bi_008', 'bill_007', 'item_fries', 'French Fries', 3000, 1, 3000, datetime('now', '-3 days', '-2 hours'));

-- Food-only bill 008: Walk-in
INSERT OR IGNORE INTO bill_items (id, bill_id, food_item_id, item_name_snapshot, unit_price, quantity, total_price, created_at) VALUES
    ('bi_009', 'bill_008', 'item_burger', 'Veg Burger', 8000, 1, 8000, datetime('now', '-2 hours')),
    ('bi_010', 'bill_008', 'item_soda', 'Soft Drink (300ml)', 3000, 1, 3000, datetime('now', '-2 hours'));

-- Food-only bill 009: Takeaway
INSERT OR IGNORE INTO bill_items (id, bill_id, food_item_id, item_name_snapshot, unit_price, quantity, total_price, created_at) VALUES
    ('bi_011', 'bill_009', 'item_pizza', 'Personal Pizza', 12000, 1, 12000, datetime('now', '-1 hour')),
    ('bi_012', 'bill_009', 'item_soda', 'Soft Drink (300ml)', 3000, 2, 6000, datetime('now', '-1 hour')),
    ('bi_013', 'bill_009', 'item_water', 'Water Bottle (500ml)', 2000, 1, 2000, datetime('now', '-1 hour'));

-- ============================================================================
-- Trigger to auto-update bill totals from bill_items
-- ============================================================================

-- Trigger: Update bill totals when items are added
CREATE TRIGGER IF NOT EXISTS trg_bill_items_update_bill_total
AFTER INSERT ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills
    SET food_amount = (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    total_amount = session_amount + (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    updated_at = datetime('now')
    WHERE id = NEW.bill_id;
END;

-- Trigger: Update bill totals when items are updated
CREATE TRIGGER IF NOT EXISTS trg_bill_items_update_bill_total_update
AFTER UPDATE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills
    SET food_amount = (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    total_amount = session_amount + (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = NEW.bill_id
    ),
    updated_at = datetime('now')
    WHERE id = NEW.bill_id;
END;

-- Trigger: Update bill totals when items are deleted
CREATE TRIGGER IF NOT EXISTS trg_bill_items_update_bill_total_delete
AFTER DELETE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills
    SET food_amount = (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = OLD.bill_id
    ),
    total_amount = session_amount + (
        SELECT COALESCE(SUM(total_price), 0) FROM bill_items WHERE bill_id = OLD.bill_id
    ),
    updated_at = datetime('now')
    WHERE id = OLD.bill_id;
END;

-- Trigger: Auto-calculate line_total on bill_items insert
CREATE TRIGGER IF NOT EXISTS trg_bill_items_line_total_insert
BEFORE INSERT ON bill_items
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN NEW.total_price != (NEW.quantity * NEW.unit_price)
        THEN RAISE(ABORT, 'total_price must equal quantity * unit_price')
    END;
END;

-- Trigger: Auto-calculate line_total on bill_items update
CREATE TRIGGER IF NOT EXISTS trg_bill_items_line_total_update
BEFORE UPDATE ON bill_items
FOR EACH ROW
WHEN NEW.total_price != (NEW.quantity * NEW.unit_price)
BEGIN
    SELECT CASE
        WHEN NEW.total_price != (NEW.quantity * NEW.unit_price)
        THEN RAISE(ABORT, 'total_price must equal quantity * unit_price')
    END;
END;

-- Trigger: Update bill updated_at on bill_items changes
CREATE TRIGGER IF NOT EXISTS trg_bills_updated_at_on_items_change
AFTER INSERT ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills SET updated_at = datetime('now') WHERE id = NEW.bill_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_bills_updated_at_on_items_update
AFTER UPDATE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills SET updated_at = datetime('now') WHERE id = NEW.bill_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_bills_updated_at_on_items_delete
AFTER DELETE ON bill_items
FOR EACH ROW
BEGIN
    UPDATE bills SET updated_at = datetime('now') WHERE id = OLD.bill_id;
END;

-- ============================================================================
-- Final version
-- ============================================================================
PRAGMA user_version = 5;`;

const MIGRATION_6_RUPEE_STORAGE = `
-- Q-Zone Manager: Store all monetary values as whole rupees
-- Version: 6

PRAGMA foreign_keys = ON;

-- Convert resource hourly rates: paise -> rupees
UPDATE resources
SET rate_per_hour = CAST(ROUND(rate_per_hour / 100.0) AS INTEGER),
    updated_at = datetime('now');

-- Convert food item prices
UPDATE food_items
SET price = CAST(ROUND(price / 100.0) AS INTEGER),
    updated_at = datetime('now');

-- Convert session rate snapshots and stored totals
UPDATE sessions
SET rate_snapshot = CAST(ROUND(rate_snapshot / 100.0) AS INTEGER),
    total_amount = CAST(ROUND(total_amount / 100.0) AS INTEGER),
    updated_at = datetime('now');

-- Convert bill item price snapshots
UPDATE bill_items
SET unit_price = CAST(ROUND(unit_price / 100.0) AS INTEGER),
    total_price = CAST(ROUND(total_price / 100.0) AS INTEGER);

-- Convert bill amounts and recalculate final totals
UPDATE bills
SET session_amount = CAST(ROUND(session_amount / 100.0) AS INTEGER),
    food_amount = CASE
      WHEN EXISTS (
        SELECT 1 FROM bill_items WHERE bill_items.bill_id = bills.id
      )
      THEN (
        SELECT COALESCE(SUM(total_price), 0)
        FROM bill_items
        WHERE bill_items.bill_id = bills.id
      )
      ELSE CAST(ROUND(food_amount / 100.0) AS INTEGER)
    END,
    updated_at = datetime('now');

UPDATE bills
SET total_amount = session_amount + food_amount,
    updated_at = datetime('now');

-- Apply the agreed Q-Zone resource rates (whole rupees per hour)
UPDATE resources SET rate_per_hour = 350
WHERE id IN ('res_big_snooker_01', 'res_big_snooker_02');

UPDATE resources SET rate_per_hour = 250
WHERE id IN ('res_mini_snooker_01', 'res_pool_01');

UPDATE resources SET rate_per_hour = 0
WHERE id = 'res_ps5_01';

-- Remove configurable rounding increment.
-- Billing will always round up to the next whole rupee.
DELETE FROM settings WHERE key = 'round_up_to';

PRAGMA user_version = 6;
`;

type Migration = {
  version: number;
  name: string;
  sql: string;
};

const MIGRATIONS: Migration[] = [
  { version: 1, name: "001_initial_schema", sql: MIGRATION_1_SCHEMA },
  { version: 2, name: "002_indexes", sql: MIGRATION_2_INDEXES },
  { version: 3, name: "003_seed_data", sql: MIGRATION_3_SEED_DATA },
  { version: 4, name: "004_billing_system", sql: MIGRATION_4_BILLING_SYSTEM },
  {
    version: 5,
    name: "005_cleanup_and_seed",
    sql: MIGRATION_5_CLEANUP_AND_SEED,
  },
  {
    version: 6,
    name: "006_rupee_storage",
    sql: MIGRATION_6_RUPEE_STORAGE,
  },
];

export interface MigrationResult {
  success: boolean;
  version: number;
  name: string;
  error?: string;
}

/**
 * Get the current database schema version from PRAGMA user_version
 */
export async function getCurrentVersion(db: SQLiteDatabase): Promise<number> {
  const result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  return result?.user_version ?? 0;
}

/**
 * Set the database schema version
 */
export async function setSchemaVersion(
  db: SQLiteDatabase,
  version: number,
): Promise<void> {
  await db.execAsync(`PRAGMA user_version = ${version}`);
}

/**
 * Execute a single migration within a transaction
 */
async function executeMigration(
  db: SQLiteDatabase,
  migration: Migration,
): Promise<MigrationResult> {
  try {
    // Execute the entire migration SQL in a single transaction
    // Note: SQLite doesn't support nested transactions, but execAsync runs in its own transaction
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration.sql);
    });
    return { success: true, version: migration.version, name: migration.name };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      version: migration.version,
      name: migration.name,
      error: message,
    };
  }
}

/**
 * Run all pending migrations
 * Returns array of migration results
 */
export async function runMigrations(
  db: SQLiteDatabase,
): Promise<MigrationResult[]> {
  const currentVersion = await getCurrentVersion(db);
  const results: MigrationResult[] = [];

  console.log(`[MigrationRunner] Current schema version: ${currentVersion}`);

  const pendingMigrations = MIGRATIONS.filter(
    (m) => m.version > currentVersion,
  );

  if (pendingMigrations.length === 0) {
    console.log("[MigrationRunner] No pending migrations");
    return [];
  }

  console.log(
    `[MigrationRunner] Running ${pendingMigrations.length} migration(s)...`,
  );

  for (const migration of pendingMigrations) {
    console.log(
      `[MigrationRunner] Applying migration ${migration.version}: ${migration.name}`,
    );

    const result = await executeMigration(db, migration);

    if (result.success) {
      await setSchemaVersion(db, migration.version);
      console.log(
        `[MigrationRunner] Migration ${migration.version} applied successfully`,
      );
      results.push(result);
    } else {
      console.error(
        `[MigrationRunner] Migration ${migration.version} failed:`,
        result.error,
      );
      results.push(result);
      // Stop on first failure
      break;
    }
  }

  const finalVersion = await getCurrentVersion(db);
  console.log(`[MigrationRunner] Final schema version: ${finalVersion}`);

  return results;
}

// export async function initializeDatabase(): Promise<{
//   db: SQLiteDatabase;
//   migrations: MigrationResult[];
// }> {
//   const db = await openDatabaseAsync("qzone.db");
//   const migrations = await runMigrations(db);
//   return { db, migrations };
// }
export async function initializeDatabase() {
  const db = await getDatabase();
  const migrations = await runMigrations(db);
  return { db, migrations };
}

/**
 * Get list of all tables in the database
 */
export async function getTableList(db: SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ name: string }>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name",
  );
  return rows.map((r) => r.name);
}

/**
 * Check if database is initialized (has expected tables)
 */

export async function isDatabaseInitialized(
  db: SQLiteDatabase,
): Promise<boolean> {
  const tables = await getTableList(db);

  const requiredTables = [
    "resources",
    "customers",
    "sessions",
    "session_pauses",
    "waitlist",
    "settings",
    "food_categories",
    "food_items",
    "bills",
    "bill_items",
  ];

  return requiredTables.every((table) => tables.includes(table));
}
