-- Pastikan extension UUID sudah diaktifkan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Users (untuk Admin & Kasir)
-- 1. Drop existing tables if they exist
DROP TABLE IF EXISTS transaction_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS product_purchases;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

-- 2. Create Users Table
CREATE TABLE users (
    id uuid PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    role TEXT CHECK (role IN ('admin', 'cashier')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Products Table (Updated)
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT CHECK (type IN ('goods', 'service')) NOT NULL,
    description TEXT,
    unit TEXT, --satuan
    stock INTEGER, -- Only applies to 'goods'; NULL for 'service'
    avg_buy_price NUMERIC, -- Average buying price (for reporting)
    sell_price NUMERIC NOT NULL, -- Current selling price
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Product Purchases Table (Tracks Buying Prices & Stock Updates)
CREATE TABLE product_purchases (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid REFERENCES products(id),
    purchase_date TIMESTAMPTZ DEFAULT NOW(),
    buying_price NUMERIC NOT NULL,
    quantity_purchased INTEGER NOT NULL
);

-- 5. Create Customers Table
CREATE TABLE customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    phone_number TEXT NOT NULL UNIQUE,
    cash_bon NUMERIC DEFAULT 0, -- Customer credit balance
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create Transactions Table (Sales Records)
CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES customers(id),
    cashier_id uuid REFERENCES users(id),
    payment_type TEXT CHECK (payment_type IN ('cash', 'bon')) NOT NULL, -- Payment method
    grand_total NUMERIC NOT NULL,
    sale_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create Transaction Items Table (Details of Each Sale)
CREATE TABLE transaction_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id uuid REFERENCES transactions(id),
    product_id uuid REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    total_price NUMERIC NOT NULL, -- Usually: quantity * unit_price (discount applied if any)
    discount NUMERIC DEFAULT 0, -- Optional: discount per item
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Set row-level security for each table
-- ✅ Allow only authenticated users to read their own data
CREATE POLICY select_users ON users
FOR SELECT TO authenticated
USING (id = auth.uid());

-- ✅ Allow only admins to see all users
CREATE POLICY select_all_users ON users
FOR SELECT TO authenticated
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to insert users
CREATE POLICY insert_users ON users
FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to update users
CREATE POLICY update_users ON users
FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to delete users
CREATE POLICY delete_users ON users
FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to access the products table
CREATE POLICY select_products ON products
FOR SELECT TO authenticated
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY insert_products ON products
FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY update_products ON products
FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY delete_products ON products
FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to access the customers table
CREATE POLICY select_customers ON customers
FOR SELECT TO authenticated
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY insert_customers ON customers
FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY update_customers ON customers
FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY delete_customers ON customers
FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to access transactions
CREATE POLICY select_transactions ON transactions
FOR SELECT TO authenticated
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY insert_transactions ON transactions
FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY update_transactions ON transactions
FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY delete_transactions ON transactions
FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to access transaction items
CREATE POLICY select_transaction_items ON transaction_items
FOR SELECT TO authenticated
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY insert_transaction_items ON transaction_items
FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY update_transaction_items ON transaction_items
FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY delete_transaction_items ON transaction_items
FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ✅ Allow only admins to access product purchases
CREATE POLICY select_product_purchases ON product_purchases
FOR SELECT TO authenticated
USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY insert_product_purchases ON product_purchases
FOR INSERT WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY update_product_purchases ON product_purchases
FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY delete_product_purchases ON product_purchases
FOR DELETE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');




ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_purchases ENABLE ROW LEVEL SECURITY;

DROP FUNCTION IF EXISTS get_transaction_details();

CREATE OR REPLACE FUNCTION get_transaction_details()
RETURNS TABLE (
    transaction_id UUID,
    transaction_grand_total NUMERIC,
    transaction_cashier TEXT,
    transaction_payment_type TEXT,

    product_name TEXT,
    product_quantity INTEGER,
    product_price NUMERIC,
    product_discount NUMERIC,

    customer_name TEXT,
    customer_phone TEXT,
    customer_hutang NUMERIC,

    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ti.transaction_id,  -- Fixed incorrect alias usage
        t.grand_total,
        u.username AS transaction_cashier,  -- Use u.name instead of t.cashier_id
        t.payment_type,

        p.name AS product_name,  -- Use p.name instead of ti.product_id
        ti.quantity,
        ti.unit_price AS product_price,
        ti.discount,

        c.name AS customer_name,
        c.phone_number AS customer_phone,
        c.cash_bon AS customer_hutang,

        t.created_at
    FROM transaction_items ti
    LEFT JOIN transactions t ON ti.transaction_id = t.id  -- Fixed alias issue
    LEFT JOIN customers c ON t.customer_id = c.id
    LEFT JOIN users u ON t.cashier_id = u.id
    LEFT JOIN products p ON ti.product_id = p.id;
END;
$$ LANGUAGE plpgsql;



DROP FUNCTION IF exists get_purchase_details();

CREATE OR REPLACE FUNCTION get_purchase_details()
RETURNS TABLE (
    purchase_id UUID, -- Changed from VARCHAR to UUID
    purchase_quantity INTEGER,
    buying_price NUMERIC,
    purchase_date TIMESTAMPTZ,
    product_name TEXT, -- Changed from VARCHAR to TEXT (matches `name` column type)
    product_type TEXT -- Changed from VARCHAR to TEXT (matches `type` column type)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pp.id,
        pp.quantity_purchased,
        pp.buying_price,
        pp.purchase_date,
        p.name,
        p.type
    FROM product_purchases pp
    LEFT JOIN products p ON pp.product_id = p.id;
END;
$$ LANGUAGE plpgsql;
