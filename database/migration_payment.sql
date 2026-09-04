-- =========================================
-- MIGRASI: Tambah status pembayaran (QRIS statis + konfirmasi manual admin)
-- Jalankan file ini di phpMyAdmin (tab SQL), sekali saja
-- =========================================
ALTER TABLE rentals ADD COLUMN payment_status VARCHAR(30) NOT NULL DEFAULT 'menunggu_pembayaran' AFTER status;
-- Nilai yang dipakai: 'menunggu_pembayaran', 'menunggu_konfirmasi', 'lunas'
