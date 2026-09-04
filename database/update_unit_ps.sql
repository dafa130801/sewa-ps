-- =========================================
-- UPDATE DATA UNIT PS SESUAI KEBUTUHAN
-- Jalankan file ini jika database "sewa_ps" SUDAH pernah diimport sebelumnya
-- (tidak perlu import ulang schema.sql dari nol)
-- =========================================
USE sewa_ps;

-- Hapus semua unit lama (aman selama tidak ada transaksi "berjalan" yang memakainya)
DELETE FROM consoles;

-- Reset auto increment supaya id mulai dari 1 lagi (opsional, biar rapi)
ALTER TABLE consoles AUTO_INCREMENT = 1;

-- Masukkan unit sesuai kebutuhan
INSERT INTO consoles (nama, tipe, harga_per_jam, status) VALUES
('Bilik 1', 'PS3', 5000, 'tersedia'),
('Bilik 2', 'PS4', 10000, 'tersedia'),
('Bilik 3', 'PS5', 25000, 'tersedia');
