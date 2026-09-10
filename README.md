# 🎮 Sistem Sewa PlayStation (Sewa PS)

Aplikasi web sederhana untuk mengelola penyewaan unit PlayStation (PS3/PS4/PS5),
dengan struktur **frontend**, **backend**, dan **database** yang terpisah dan rapi.

## Struktur Folder

```
sewa-ps/
├── backend/              # Server API (Node.js + Express + MySQL)
│   ├── config/
│   │   ├── db.js         # Koneksi database
│   │   └── seed.js       # Script membuat akun admin awal
│   ├── controllers/      # Logika bisnis tiap fitur
│   ├── middleware/       # Middleware autentikasi JWT
│   ├── routes/           # Routing endpoint API
│   ├── server.js         # Entry point server
│   ├── package.json
│   └── .env.example
├── frontend/             # Tampilan (HTML, CSS, JS murni)
│   ├── css/style.css
│   ├── js/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── consoles.html
│   └── rentals.html
└── database/
    └── schema.sql        # Struktur tabel database MySQL
```

Lihat file **PANDUAN.md** untuk langkah-langkah instalasi & menjalankan project di VSCode.
