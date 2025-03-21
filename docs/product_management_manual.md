# Panduan Pengguna Sumber Selang Mandiri

## 1. Akses Sistem
- Akses melalui browser web di [URL aplikasi]
- Dua jenis pengguna:
  - **Admin**: Akses penuh sistem
  - **Kasir**: Hanya untuk transaksi penjualan

## 2. Navigasi
### Desktop:
- Menu kiri selalu terlihat
- Klik item menu untuk navigasi

### Mobile:
- Ketuk ikon ☰ (kiri atas) untuk membuka/menutup menu
- Ketuk di luar area menu untuk menutup

## 3. Fungsi Menu Utama (Admin)

### 3.1 Manajemen Produk
#### Tambah Produk (AddInventory.tsx)
1. Masuk ke menu "Tambah Produk"
2. Isi formulir:
   - **Nama Barang**: Nama produk (harus unik)
   - **Tipe**: Pilih Barang/Jasa
   - **Satuan**: Pcs/Meter/Box
   - **Harga Jual**: Harga jual ke pelanggan
   - **Keterangan**: Deskripsi tambahan
3. Klik "Submit" setelah konfirmasi data

#### Pembelian Produk (ProductPurchase.tsx)
1. Masuk ke menu "Pembelian Produk"
2. Tambah produk dengan tombol "+ Add Product"
3. Untuk setiap produk:
   - Pilih nama dari dropdown
   - Masukkan jumlah pembelian
   - Masukkan harga beli per unit
4. Total otomatis terhitung
5. Klik "Submit" untuk menyimpan pembelian
*Catatan: Pembelian akan update stok dan harga rata-rata pembelian*

#### List Produk & Stock (ProductListnStock.tsx)
- Tabel menampilkan semua produk dengan:
  - Stok terkini
  - Harga jual
  - Tanggal update terakhir
- Fitur:
  - **Edit**: Klik tombol edit untuk ubah detail produk
  - **Hapus**: Hapus produk dengan konfirmasi

#### History Pembelian (PurchaseHistory.tsx)
- Tampilkan riwayat pembelian dengan filter:
  - Tanggal spesifik
  - Bulan/tahun tertentu
  - Pencarian berdasarkan nama produk
- Kolom informasi:
  - Tanggal pembelian
  - Jumlah pembelian
  - Harga beli
  - Subtotal

### 3.2 Manajemen Penjualan
- **Transaksi Penjualan**:
  - Proses pembayaran cash/bon (jika jumlah pembayaran lebih kecil dari grandtotal maka akan jadi bon sisanya)
  - Input data pelanggan (nomor hp tidak boleh sama, jika nomor hp sama maka akan update data pelanggan tersebut)
- **Laporan Penjualan**:
  - seluruh transaksi penjualan dan difilter berdasarkan tanggal

### 3.3 Manajemen Pelanggan
- **Daftar Pelanggan**:
  - Cari/edit informasi pelanggan
  - Pantau hutang pelanggan
  - Tambah pelanggan baru

### 3.4 Manajemen Karyawan (Khusus Admin)
- **Tambah Pegawai**:
  - Registrasi user baru
  - Atur role (Admin/Kasir)
  - Set password awal

## 4. Proses Transaksi
1. Pilih menu "Penjualan"
2. Pindai/pilih produk
3. Pilih metode pembayaran:
   - Tunai: Masukkan jumlah uang diterima
   - Kredit: Verifikasi akun pelanggan

## 5. Keamanan
- Pembatasan akses berdasarkan role
- Pencatatan audit semua transaksi
