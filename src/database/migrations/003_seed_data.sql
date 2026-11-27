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