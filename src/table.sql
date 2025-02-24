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
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('goods', 'service')) NOT NULL,
    description TEXT,
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
    phone_number TEXT NOT NULL,
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
CREATE POLICY select_users ON users FOR SELECT TO authenticated USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY insert_users ON users FOR INSERT WITH CHECK (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_users ON users FOR UPDATE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_users ON users FOR DELETE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_products ON products FOR SELECT TO authenticated;
CREATE POLICY insert_products ON products FOR INSERT WITH CHECK (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_products ON products FOR UPDATE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_products ON products FOR DELETE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_customers ON customers FOR SELECT TO authenticated;
CREATE POLICY insert_customers ON customers FOR INSERT WITH CHECK (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_customers ON customers FOR UPDATE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_customers ON customers FOR DELETE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_transactions ON transactions FOR SELECT TO authenticated;
CREATE POLICY insert_transactions ON transactions FOR INSERT WITH CHECK (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_transactions ON transactions FOR UPDATE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_transactions ON transactions FOR DELETE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_transaction_items ON transaction_items FOR SELECT TO authenticated;
CREATE POLICY insert_transaction_items ON transaction_items FOR INSERT WITH CHECK (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_transaction_items ON transaction_items FOR UPDATE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_transaction_items ON transaction_items FOR DELETE USING (id = (SELECT id FROM auth.users WHERE id = auth.uid()));



ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_purchases ENABLE ROW LEVEL SECURITY;


CREATE OR REPLACE FUNCTION get_transaction_details()
RETURNS TABLE (
    transaction_id VARCHAR,
    transaction_grand_total NUMERIC,
    transaction_cashier VARCHAR,
    transaction_payment_type VARCHAR,

    product_name VARCHAR,
    product_quantity NUMERIC,
    product_price NUMERIC,
    product_discount NUMERIC,

    customer_name VARCHAR,
    customer_phone VARCHAR,
    customer_hutang NUMERIC,

    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ts.transaction_id,
        t.grand_total,
        t.cashier_id,
        t.payment_type,

        ti.product_id,
        ti.quantity,
        ti.unit_price,
        ti.discount,

        c.name,
        c.phone_number,
        c.hutang,

        t.created_at
    FROM transaction_items ti
    LEFT JOIN transactions t ON ts.transaction_id = t.id
    LEFT JOIN customers c ON t.customer_id = c.id
    LEFT JOIN users u ON t.cashier_id = u.id
    LEFT JOIN products p ON ti.product_id = p.id;
END;
$$ LANGUAGE plpgsql;