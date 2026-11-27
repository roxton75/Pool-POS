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