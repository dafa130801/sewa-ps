# 📖 Panduan Menjalankan Project "Sewa PS" di VSCode

## 1. Persiapan Software
Pastikan sudah terinstall di komputer:
- **VSCode** — https://code.visualstudio.com/
- **Node.js** (versi 18 ke atas) — https://nodejs.org/
- **MySQL** — bisa lewat **XAMPP** (paling mudah untuk pemula) atau MySQL Server biasa
- Extension VSCode yang membantu: `ES7+ React/Redux/JS Snippets` (opsional), `Live Server` (untuk membuka frontend)

## 2. Buka Project di VSCode
1. Ekstrak file zip `sewa-ps.zip` ke folder pilihan Anda, misalnya `D:\project\sewa-ps`
2. Buka VSCode → **File > Open Folder** → pilih folder `sewa-ps`
3. Buka Terminal di VSCode: **Terminal > New Terminal**

## 3. Siapkan Database
1. Jalankan MySQL (kalau pakai XAMPP, aktifkan module **MySQL** di XAMPP Control Panel)
2. Buka phpMyAdmin (`http://localhost/phpmyadmin`) atau MySQL Workbench
3. Import file `database/schema.sql`:
   - Di phpMyAdmin: klik tab **Import** → pilih file `database/schema.sql` → klik **Go**
   - Ini akan otomatis membuat database `sewa_ps`, tabel-tabelnya, dan beberapa contoh data unit PS

## 4. Setup Backend
Di terminal VSCode, jalankan:
```bash
cd backend
npm install
```
Ini akan menginstall semua library yang dibutuhkan (express, mysql2, dll).

Salin file konfigurasi environment:
```bash
copy .env.example .env      # Windows
cp .env.example .env        # Mac/Linux
```
Buka file `.env` yang baru dibuat, sesuaikan:
```
DB_USER=root
DB_PASSWORD=       # isi sesuai password MySQL Anda (kosong jika default XAMPP)
DB_NAME=sewa_ps
JWT_SECRET=ganti_dengan_teks_rahasia_bebas
```

Buat akun awal (3 role):
```bash
npm run seed
```
Ini akan membuat 3 akun:
| Role | Username | Password |
|---|---|---|
| superadmin | superadmin | super123 |
| admin | admin | admin123 |
| user | user | user123 |

> Kalau database Anda sudah pernah diimport SEBELUM fitur role ini ditambahkan, jalankan dulu migrasi berikut supaya tabel `users` dan `rentals` diperbarui:
> ```bash
> mysql -u root -p sewa_ps < ../database/migration_roles.sql
> ```
> (jalankan dari dalam folder `backend`, atau sesuaikan path-nya)

Jalankan server backend:
```bash
npm start
```
Jika berhasil, akan muncul: `Server berjalan di http://localhost:5000`

> Biarkan terminal ini tetap terbuka selama menggunakan aplikasi.

## 5. Jalankan Frontend
Buka terminal **baru** di VSCode (klik tombol `+` di panel terminal), lalu:
- Cara termudah: klik kanan file `frontend/login.html` di File Explorer VSCode → pilih **"Open with Live Server"**
  (jika extension Live Server belum ada, install dulu lewat tab Extensions)
- Atau cukup buka file `frontend/login.html` langsung lewat browser (double klik dari File Explorer Windows/Mac)

## 6. Login & Gunakan Aplikasi
1. Login dengan salah satu dari 3 akun di atas (atau daftar akun baru lewat halaman **Daftar**, otomatis jadi role `user`)
2. Di **Dashboard**, semua role bisa membuat transaksi sewa baru dari unit yang berstatus "tersedia"
3. Di **Kelola Unit** (khusus admin & superadmin), tambah/hapus unit PS3/PS4/PS5
4. Di **Riwayat Sewa**, role `user` hanya melihat transaksi miliknya sendiri; admin/superadmin melihat semua dan bisa klik "Selesai"
5. Di **Kelola User** (khusus superadmin), ubah role akun lain atau hapus akun

## 7. Alur Kerja Pengembangan Selanjutnya
- Backend berjalan di `http://localhost:5000`, semua endpoint diawali `/api/...`
- Kalau mengubah file backend (`.js`), restart server (Ctrl+C lalu `npm start` lagi) — atau pakai `npm run dev` (butuh nodemon, sudah termasuk di package.json) supaya restart otomatis
- Kalau mengubah file frontend, cukup refresh browser
- Struktur backend mengikuti pola **MVC sederhana**: `routes` → `controllers` → `config/db.js` (database)

## Troubleshooting Umum
| Masalah | Solusi |
|---|---|
| `Error: connect ECONNREFUSED` saat start backend | MySQL belum aktif, aktifkan dulu di XAMPP |
| Login gagal terus | Pastikan sudah menjalankan `npm run seed` |
| Frontend tidak bisa ambil data | Pastikan backend (`npm start`) masih berjalan di terminal lain |
| CORS error di console browser | Pastikan mengakses frontend lewat Live Server/browser biasa, bukan `file://` langsung memakai fetch tanpa server (opsional tapi disarankan pakai Live Server) |
