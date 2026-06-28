# Cakes and Crunches — Database Model Specification

The application uses SQLite as its primary database. The schema consists of 14 key tables.

---

## Tables and Columns Reference

### 1. `users`
* `id`: INTEGER (Primary Key)
* `username`: VARCHAR(50) (Unique, Not Null, Indexed)
* `email`: VARCHAR(120) (Unique, Not Null, Indexed)
* `password_hash`: VARCHAR(256) (Not Null)
* `full_name`: VARCHAR(100) (Not Null)
* `role`: VARCHAR(20) (Not Null, Default: `'staff'`)
* `created_at`: DATETIME (Default: Current UTC)
* `updated_at`: DATETIME (Default: Current UTC)

### 2. `customers`
* `id`: INTEGER (Primary Key)
* `name`: VARCHAR(100) (Not Null, Indexed)
* `email`: VARCHAR(120) (Unique, Nullable, Indexed)
* `phone`: VARCHAR(20) (Not Null, Indexed)
* `address`: TEXT (Nullable)
* `created_at`: DATETIME (Default: Current UTC)

### 3. `orders`
* `id`: INTEGER (Primary Key)
* `order_number`: VARCHAR(50) (Unique, Not Null, Indexed)
* `customer_id`: INTEGER (Foreign Key -> `customers.id`)
* `cake_type`: VARCHAR(50) (Not Null)
* `event_type`: VARCHAR(50) (Not Null)
* `delivery_date`: DATE (Not Null)
* `order_value`: NUMERIC(10, 2) (Not Null)
* `advance_amount`: NUMERIC(10, 2) (Default: 0.00)
* `remaining_balance`: NUMERIC(10, 2) (Default: 0.00)
* `payment_status`: VARCHAR(20) (Default: `'pending'`)
* `order_status`: VARCHAR(20) (Default: `'pending'`)
* `notes`: TEXT (Nullable)
* `created_by`: INTEGER (Foreign Key -> `users.id`)

### 4. `payments`
* `id`: INTEGER (Primary Key)
* `receipt_number`: VARCHAR(50) (Unique, Not Null, Indexed)
* `order_id`: INTEGER (Foreign Key -> `orders.id`)
* `amount`: NUMERIC(10, 2) (Not Null)
* `payment_date`: DATETIME (Default: Current UTC)
* `payment_method`: VARCHAR(20) (Not Null)
* `recorded_by`: INTEGER (Foreign Key -> `users.id`)

### 5. `wallets`
* `id`: INTEGER (Primary Key)
* `customer_id`: INTEGER (Foreign Key -> `customers.id`, Unique)
* `balance`: NUMERIC(10, 2) (Default: 0.00)

### 6. `ledgers`
* `id`: INTEGER (Primary Key)
* `wallet_id`: INTEGER (Foreign Key -> `wallets.id`)
* `transaction_type`: VARCHAR(10) (Not Null) — `'credit'`, `'debit'`
* `amount`: NUMERIC(10, 2) (Not Null)
* `running_balance`: NUMERIC(10, 2) (Not Null)
* `reference_number`: VARCHAR(50) (Not Null)
* `description`: TEXT (Not Null)
* `created_by`: INTEGER (Foreign Key -> `users.id`)
