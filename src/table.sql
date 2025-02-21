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
