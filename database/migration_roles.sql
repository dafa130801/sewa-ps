-- =========================================
-- MIGRASI: Tambah dukungan role user/admin/superadmin
-- dan kaitkan rental dengan akun yang membuatnya
-- Jalankan file ini SETELAH schema.sql pernah diimport sebelumnya
-- =========================================
USE sewa_ps;

-- Pastikan kolom role bisa menampung 3 nilai (user/admin/superadmin)
ALTER TABLE users MODIFY role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Tambah kolom user_id di rentals (siapa yang membuat transaksi ini)
ALTER TABLE rentals ADD COLUMN user_id INT NULL AFTER id;
ALTER TABLE rentals
  ADD CONSTRAINT fk_rentals_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
