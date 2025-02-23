-- Pastikan extension UUID sudah diaktifkan
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabel Users (untuk Admin & Kasir)
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'cashier')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Products (Gabungan Barang dan Jasa)
CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('goods', 'service')) NOT NULL,
    description TEXT,
    stock INTEGER, -- Hanya berlaku untuk 'goods'; bisa dibiarkan NULL untuk 'service'
    buy_price NUMERIC(10,2), -- Harga beli (berlaku untuk barang)
    sell_price NUMERIC(10,2) NOT NULL, -- Harga jual
    avg_buy_price NUMERIC(10,2), -- Rata-rata harga beli; hanya untuk barang
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Customers
CREATE TABLE customers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_info TEXT, -- Misal: nomor telepon atau email
    address TEXT,
    phone_number NUMERIC(15) NOT NULL,
    cash_bon NUMERIC(10,2) DEFAULT 0, -- Jumlah bon yang dimiliki customer
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Transactions (Transaksi Penjualan)
CREATE TABLE transactions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES customers(id),
    cashier_id uuid REFERENCES users(id),
    payment_type TEXT CHECK (payment_type IN ('cash', 'bon')) NOT NULL, -- Metode pembayaran
    total_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Transaction Items (Detail tiap item dalam transaksi)
CREATE TABLE transaction_items (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id uuid REFERENCES transactions(id),
    product_id uuid REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL, -- Biasanya: quantity * unit_price (bisa dikurangi diskon)
    discount NUMERIC(10,2) DEFAULT 0, -- Opsional: nilai diskon per item
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set row-level security for each table
CREATE POLICY select_users ON users FOR SELECT TO authenticated USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY insert_users ON users FOR INSERT WITH CHECK (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_users ON users FOR UPDATE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_users ON users FOR DELETE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_products ON products FOR SELECT TO authenticated;
CREATE POLICY insert_products ON products FOR INSERT WITH CHECK (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_products ON products FOR UPDATE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_products ON products FOR DELETE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_customers ON customers FOR SELECT TO authenticated;
CREATE POLICY insert_customers ON customers FOR INSERT WITH CHECK (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_customers ON customers FOR UPDATE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_customers ON customers FOR DELETE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_transactions ON transactions FOR SELECT TO authenticated;
CREATE POLICY insert_transactions ON transactions FOR INSERT WITH CHECK (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_transactions ON transactions FOR UPDATE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_transactions ON transactions FOR DELETE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));

CREATE POLICY select_transaction_items ON transaction_items FOR SELECT TO authenticated;
CREATE POLICY insert_transaction_items ON transaction_items FOR INSERT WITH CHECK (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY update_transaction_items ON transaction_items FOR UPDATE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));
CREATE POLICY delete_transaction_items ON transaction_items FOR DELETE USING (id = (SELECT user_id FROM auth.users WHERE id = auth.uid()));

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION get_transaction_details()
RETURNS TABLE (
    transaction_id VARCHAR,
    product_name VARCHAR,
    quantity NUMERIC,
    schedule TIMESTAMP,
    payment_method TEXT,
    customer_name VARCHAR,
    customer_phone VARCHAR,
    therapist_name VARCHAR,
    service_name VARCHAR,
    service_price NUMERIC,
    service_duration NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ts.transaction_id,
        t.amount,
        t.paid,
        t.schedule,
        t.payment_method,
        c.customer_name,
        c.phone_number AS customer_phone,
        e.full_name AS therapist_name,
        s.service_name,
        s.service_price,
        s.service_duration
    FROM transaction_service ts
    LEFT JOIN transactions t ON ts.transaction_id = t.transaction_id
    LEFT JOIN customers c ON t.customer_id = c.auth_user_id
    LEFT JOIN employees e ON t.therapist_id = e.employee_id
    LEFT JOIN services s ON ts.service_id = s.service_id;
END;
$$ LANGUAGE plpgsql;