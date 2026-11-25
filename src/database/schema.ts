import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const databaseSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: "resources",
      columns: [
        { name: "name", type: "string" },
        { name: "type", type: "string", isIndexed: true },
        { name: "rate_per_hour", type: "number" },
        { name: "is_active", type: "boolean" },
        { name: "is_maintenance", type: "boolean" },
        { name: "display_order", type: "number" },
        { name: "created_at", type: "string" },
        { name: "updated_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "customers",
      columns: [
        { name: "name", type: "string" },
        { name: "phone", type: "string", isOptional: true, isIndexed: true },
        { name: "notes", type: "string", isOptional: true },
        { name: "created_at", type: "string" },
        { name: "updated_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "sessions",
      columns: [
        { name: "booking_number", type: "string", isIndexed: true },
        { name: "resource_id", type: "string", isIndexed: true },
        {
          name: "customer_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        },
        { name: "customer_name", type: "string", isOptional: true },
        { name: "customer_phone", type: "string", isOptional: true },
        { name: "status", type: "string", isIndexed: true },
        { name: "rate_snapshot", type: "number" },
        { name: "grace_period_snapshot", type: "number" },
        { name: "started_at", type: "string" },
        { name: "ended_at", type: "string", isOptional: true },
        { name: "total_paused_seconds", type: "number" },
        { name: "total_amount", type: "number" },
        { name: "notes", type: "string", isOptional: true },
        { name: "created_at", type: "string" },
        { name: "updated_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "session_pauses",
      columns: [
        { name: "session_id", type: "string", isIndexed: true },
        { name: "paused_at", type: "string" },
        { name: "resumed_at", type: "string", isOptional: true },
      ],
    }),
    tableSchema({
      name: "payments",
      columns: [
        { name: "session_id", type: "string", isIndexed: true },
        { name: "amount", type: "number" },
        { name: "method", type: "string" },
        { name: "note", type: "string", isOptional: true },
        { name: "paid_at", type: "string", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "waitlist",
      columns: [
        {
          name: "customer_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        },
        { name: "customer_name", type: "string" },
        { name: "customer_phone", type: "string", isOptional: true },
        { name: "resource_type", type: "string", isOptional: true },
        { name: "queue_position", type: "number" },
        { name: "status", type: "string", isIndexed: true },
        { name: "notes", type: "string", isOptional: true },
        { name: "created_at", type: "string" },
        { name: "updated_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "settings",
      columns: [
        { name: "key", type: "string", isIndexed: true },
        { name: "value", type: "string" },
        { name: "updated_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "food_categories",
      columns: [
        { name: "name", type: "string" },
        { name: "display_order", type: "number" },
        { name: "is_active", type: "boolean" },
        { name: "created_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "food_items",
      columns: [
        {
          name: "category_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        },
        { name: "name", type: "string" },
        { name: "price", type: "number" },
        { name: "is_available", type: "boolean" },
        { name: "created_at", type: "string" },
        { name: "updated_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "food_orders",
      columns: [
        { name: "order_number", type: "string", isIndexed: true },
        { name: "customer_name", type: "string", isOptional: true },
        { name: "status", type: "string", isIndexed: true },
        { name: "subtotal", type: "number" },
        { name: "total_amount", type: "number" },
        { name: "notes", type: "string", isOptional: true },
        { name: "created_at", type: "string", isIndexed: true },
        { name: "updated_at", type: "string" },
      ],
    }),
    tableSchema({
      name: "food_order_items",
      columns: [
        { name: "order_id", type: "string", isIndexed: true },
        {
          name: "food_item_id",
          type: "string",
          isOptional: true,
          isIndexed: true,
        },
        { name: "item_name_snapshot", type: "string" },
        { name: "price_snapshot", type: "number" },
        { name: "quantity", type: "number" },
        { name: "line_total", type: "number" },
      ],
    }),
  ],
});
