// =========================================
// LOGIC HALAMAN RIWAYAT SEWA (Local Storage Mode)
// =========================================
const token = typeof wajibLogin === 'function' ? wajibLogin() : 'bypass';
if (typeof terapkanTampilanRole === 'function') {
  terapkanTampilanRole();
}

const currentUser = typeof getUserLogin === 'function' ? getUserLogin() : null;

function muatDaftarRentals() {
  const container = document.getElementById('listRentals') || document.querySelector('tbody');
  const allRentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');

  if (!container) return;

  // Filter data: Jika user biasa, hanya tampilkan miliknya sendiri. Jika admin, tampilkan semua.
  let rentals = allRentals;
  const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'superadmin');

  if (!isAdmin && currentUser) {
    rentals = allRentals.filter(r => r.nama_penyewa === currentUser.username);
  }

  if (rentals.length === 0) {
    container.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:20px; color:#94a3b8;">Belum ada riwayat transaksi.</td></tr>`;
    return;
  }

  container.innerHTML = rentals.map((r) => {
    let statusText = r.status || 'pending';
    let payText = 'Belum Bayar';
    let payBadge = 'badge-danger';

    if (r.payment_status === 'menunggu_konfirmasi') {
      payText = '⏳ Menunggu Konfirmasi';
      payBadge = 'badge-warning';
    } else if (r.payment_status === 'lunas') {
      payText = '✅ Lunas';
      payBadge = 'badge-success';
    }

    // Hak akses tombol aksi berdasarkan role
    let aksiBtn = `-`;
    if (isAdmin) {
      if (r.payment_status === 'menunggu_konfirmasi') {
        aksiBtn = `<button class="btn-small" onclick="konfirmasiPembayaran(${r.id})" style="background:#10b981; color:#fff; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">Konfirmasi</button>`;
      } else {
        aksiBtn = `<button class="btn-small" onclick="hapusRental(${r.id})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Hapus</button>`;
      }
    } else {
      // User biasa hanya bisa membatalkan jika statusnya masih belum bayar
      if (r.payment_status === 'belum_bayar') {
        aksiBtn = `<button class="btn-small" onclick="hapusRental(${r.id})" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;">Batalkan</button>`;
      } else {
        aksiBtn = `<span style="color: #94a3b8; font-size: 12px;">Selesai</span>`;
      }
    }

    return `
      <tr>
        <td>${r.nama_console || 'Bilik'} (${r.tipe || 'PS3'})</td>
        <td>${r.nama_penyewa || 'User'}</td>
        <td>${r.no_hp || '-'}</td>
        <td>${r.durasi_jam || 1} jam</td>
        <td>Rp${(r.total_harga || 0).toLocaleString('id-ID')}</td>
        <td><span class="badge badge-pending">${statusText}</span></td>
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
  if (!confirm('Yakin ingin menghapus/membatalkan riwayat ini?')) return;
  let rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  rentals = rentals.filter(r => r.id !== id);
  localStorage.setItem('local_rentals', JSON.stringify(rentals));
  muatDaftarRentals();
}

muatDaftarRentals();