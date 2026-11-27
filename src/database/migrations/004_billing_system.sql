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