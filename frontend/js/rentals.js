// =========================================
// LOGIC HALAMAN RIWAYAT SEWA
// - user hanya melihat transaksi miliknya (dibatasi otomatis oleh backend)
// - admin/superadmin melihat semua + tombol Selesai
// =========================================
const token = wajibLogin();
terapkanTampilanRole();
const user = getUserLogin();
const bisaSelesaikan = user && (user.role === 'admin' || user.role === 'superadmin');

async function muatRiwayat() {
  const res = await fetch(`${API_BASE_URL}/rentals`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (res.status === 401 || res.status === 403) {
    sessionStorage.clear();
    window.location.href = 'login.html';
    return;
  }

  const data = await res.json();

  document.getElementById('tabelRental').innerHTML = data.map(r => `
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
          : (r.payment_status !== 'menunggu_konfirmasi' ? '-' : '')}
      </td>
    </tr>
  `).join('');
}

function labelPembayaran(status) {
  if (status === 'lunas') return '✅ Lunas';
  if (status === 'menunggu_konfirmasi') return '⏳ Menunggu Konfirmasi';
  return '❌ Belum Bayar';
}

async function konfirmasiBayar(id) {
  await fetch(`${API_BASE_URL}/rentals/${id}/konfirmasi`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  muatRiwayat();
}

async function selesaikanSewa(id) {
  await fetch(`${API_BASE_URL}/rentals/${id}/selesai`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  muatRiwayat();
}

muatRiwayat();
