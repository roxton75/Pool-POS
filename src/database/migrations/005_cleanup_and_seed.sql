-- Q-Zone Manager Cleanup & Seed Migration
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
PRAGMA user_version = 5;