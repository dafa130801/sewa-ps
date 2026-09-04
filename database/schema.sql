-- =========================================
-- DATABASE: sewa_ps
-- Sistem Sewa PlayStation
-- =========================================

CREATE DATABASE IF NOT EXISTS sewa_ps;
USE sewa_ps;

-- Tabel admin/pengguna
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel unit konsol PS yang disewakan
CREATE TABLE IF NOT EXISTS consoles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,        -- contoh: "PS4 Bilik 1"
  tipe VARCHAR(20) NOT NULL,         -- PS3 / PS4 / PS5
  harga_per_jam INT NOT NULL,        -- dalam rupiah
  status ENUM('tersedia','disewa','maintenance') DEFAULT 'tersedia',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel transaksi sewa
CREATE TABLE IF NOT EXISTS rentals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  console_id INT NOT NULL,
  nama_penyewa VARCHAR(100) NOT NULL,
  no_hp VARCHAR(20),
  jam_mulai DATETIME NOT NULL,
  durasi_jam INT NOT NULL,
  total_harga INT NOT NULL,
  status ENUM('berjalan','selesai','batal') DEFAULT 'berjalan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (console_id) REFERENCES consoles(id) ON DELETE CASCADE
);

-- Data awal admin (username: admin, password: admin123)
-- Password sudah di-hash dengan bcrypt, akan otomatis dibuat lewat seed script (lihat backend/config/seed.js)

-- Contoh data unit konsol
INSERT INTO consoles (nama, tipe, harga_per_jam, status) VALUES
('Bilik 1', 'PS3', 5000, 'tersedia'),
('Bilik 2', 'PS4', 10000, 'tersedia'),
('Bilik 3', 'PS5', 25000, 'tersedia');
