// =========================================
// LOGIC HALAMAN RIWAYAT SEWA (Local Storage Mode)
// =========================================
const token = wajibLogin();
terapkanTampilanRole();
const user = getUserLogin();
const bisaSelesaikan = user && (user.role === 'admin' || user.role === 'superadmin');

function getLocalRentals() {
  const data = localStorage.getItem('local_rentals');
  if (!data) {
    return [];
  }
  return JSON.parse(data);
}

function saveLocalRentals(rentals) {
  localStorage.setItem('local_rentals', JSON.stringify(rentals));
}

// Fungsi bantu untuk menangkap transaksi baru dari dashboard
window.tambahRentalBaru = function(newItem) {
  const rentals = getLocalRentals();
  rentals.unshift(newItem);
  saveLocalRentals(rentals);
};

function muatRiwayat() {
  const data = getLocalRentals();
  const tabelRental = document.getElementById('tabelRental');
  if (!tabelRental) return;

  if (data.length === 0) {
    tabelRental.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#94a3b8;">Belum ada riwayat transaksi.</td></tr>`;
    return;
  }

  tabelRental.innerHTML = data.map(r => `
    <tr>
      <td>${r.nama_console} (${r.tipe})</td>
      <td>${r.nama_penyewa}</td>
      <td>${r.no_hp || '-'}</td>
      <td>${r.durasi_jam} jam</td>
      <td>Rp${r.total_harga}</td>
      <td><span class="badge ${r.status === 'berjalan' ? 'disewa' : 'tersedia'}">${r.status}</span></td>
      <td>${labelPembayaran(r.payment_status)}</td>
      <td>
        ${r.payment_status === 'menunggu_konfirmasi' && bisaSelesaikan
          ? `<button class="btn-small btn-selesai" onclick="konfirmasiBayar(${r.id})">Konfirmasi Lunas</button>`
          : ''}
        ${r.status === 'berjalan' && bisaSelesaikan
          ? `<button class="btn-small btn-selesai" onclick="selesaikanSewa(${r.id})">Selesai</button>`
          : (r.payment_status !== 'menunggu_konfirmasi' && r.status !== 'berjalan' ? '-' : '')}
      </td>
    </tr>
  `).join('');
}

function labelPembayaran(status) {
  if (status === 'lunas') return '✅ Lunas';
  if (status === 'menunggu_konfirmasi') return '⏳ Menunggu Konfirmasi';
  return '❌ Belum Bayar';
}

function konfirmasiBayar(id) {
  let rentals = getLocalRentals();
  rentals = rentals.map(r => {
    if (r.id === id) {
      r.payment_status = 'lunas';
      r.status = 'berjalan';
    }
    return r;
  });
  saveLocalRentals(rentals);
  muatRiwayat();
}

function selesaikanSewa(id) {
  let rentals = getLocalRentals();
  rentals = rentals.map(r => {
    if (r.id === id) {
      r.status = 'selesai';
    }
    return r;
  });
  saveLocalRentals(rentals);
  muatRiwayat();
}

muatRiwayat();