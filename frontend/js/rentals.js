// =========================================
// LOGIC HALAMAN RIWAYAT SEWA (Local Storage Mode)
// =========================================
const token = wajibLogin();
terapkanTampilanRole();

function muatDaftarRentals() {
  const container = document.getElementById('listRentals') || document.querySelector('tbody');
  const rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  const userLogin = typeof getUserLogin === 'function' ? getUserLogin() : { role: 'admin' };
  const isAdmin = userLogin && (userLogin.role === 'admin' || userLogin.role === 'superadmin');

  if (!container) return;

  if (rentals.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#94a3b8;">Belum ada riwayat transaksi.</td></tr>`;
    return;
  }

  container.innerHTML = rentals.map((r, index) => {
    let badgeClass = 'badge-pending';
    let statusText = r.status || 'pending';

    let payBadge = 'badge-danger';
    let payText = 'Belum Bayar';
    if (r.payment_status === 'menunggu_konfirmasi') {
      payBadge = 'badge-warning';
      payText = '⏳ Menunggu Konfirmasi';
    } else if (r.payment_status === 'lunas') {
      payBadge = 'badge-success';
      payText = '✅ Lunas';
    }

    // Tombol aksi khusus admin jika status pembayaran menunggu konfirmasi
    let aksiBtn = '-';
    if (isAdmin && r.payment_status === 'menunggu_konfirmasi') {
      aksiBtn = `<button class="btn-small" onclick="konfirmasiPembayaran(${r.id})" style="background:#10b981; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Konfirmasi</button>`;
    } else if (isAdmin) {
      aksiBtn = `<button class="btn-small" onclick="hapusRental(${r.id})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Hapus</button>`;
    }

    return `
      <tr>
        <td>${r.nama_console || 'Bilik'} (${r.tipe || 'PS3'})</td>
        <td>${r.nama_penyewa || 'User'}</td>
        <td>${r.no_hp || '-'}</td>
        <td>${r.durasi_jam || 1} jam</td>
        <td>Rp${r.total_harga || 0}</td>
        <td><span class="badge ${badgeClass}">${statusText}</span></td>
        <td><span class="badge ${payBadge}">${payText}</span></td>
        <td>${aksiBtn}</td>
      </tr>
    `;
  }).join('');
}

function konfirmasiPembayaran(id) {
  let rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  rentals = rentals.map(r => {
    if (r.id === id) {
      r.payment_status = 'lunas';
      r.status = 'selesai';
    }
    return r;
  });
  localStorage.setItem('local_rentals', JSON.stringify(rentals));
  muatDaftarRentals();
}

function hapusRental(id) {
  if (!confirm('Yakin ingin menghapus riwayat ini?')) return;
  let rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  rentals = rentals.filter(r => r.id !== id);
  localStorage.setItem('local_rentals', JSON.stringify(rentals));
  muatDaftarRentals();
}

muatDaftarRentals();