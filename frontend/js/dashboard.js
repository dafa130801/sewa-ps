// =========================================
// LOGIC HALAMAN DASHBOARD
// =========================================
const token = wajibLogin();
terapkanTampilanRole();

async function muatDaftarConsole() {
  const res = await fetch(`${API_BASE_URL}/consoles`);
  const data = await res.json();

  const select = document.getElementById('consoleId');
  select.innerHTML = data
    .filter(c => c.status === 'tersedia')
    .map(c => `<option value="${c.id}">${c.nama} (${c.tipe}) - Rp${c.harga_per_jam}/jam</option>`)
    .join('');

  const listDiv = document.getElementById('listConsole');
  listDiv.innerHTML = data.map(c => `
    <div class="console-card ${c.status}">
      <strong>${c.nama}</strong>
      <p>${c.tipe} — Rp${c.harga_per_jam}/jam</p>
      <span class="badge ${c.status}">${c.status}</span>
    </div>
  `).join('');
}

document.getElementById('formSewa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';

  const body = {
    console_id: document.getElementById('consoleId').value,
    nama_penyewa: document.getElementById('namaPenyewa').value,
    no_hp: document.getElementById('noHp').value,
    durasi_jam: parseInt(document.getElementById('durasiJam').value)
  };

  try {
    const res = await fetch(`${API_BASE_URL}/rentals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Gagal membuat transaksi.';
      return;
    }

    document.getElementById('formSewa').reset();
    muatDaftarConsole();
    tampilkanModalQris(data.id, data.total_harga);
  } catch (err) {
    errorMsg.textContent = 'Tidak dapat terhubung ke server backend.';
  }
});

let rentalIdAktif = null;

function tampilkanModalQris(rentalId, totalHarga) {
  rentalIdAktif = rentalId;
  document.getElementById('qrisTotal').textContent = `Total: Rp${totalHarga}`;
  document.getElementById('qrisStatus').textContent = 'Silakan scan & transfer sesuai total di atas.';
  document.getElementById('modalQris').style.display = 'flex';
}

async function tandaiSudahBayar() {
  if (!rentalIdAktif) return;
  try {
    const res = await fetch(`${API_BASE_URL}/rentals/${rentalIdAktif}/bayar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Gagal menandai pembayaran.');
      return;
    }

    document.getElementById('qrisStatus').textContent = '⏳ Menunggu konfirmasi admin...';
  } catch (err) {
    alert('Tidak dapat terhubung ke server backend.');
  }
}

function tutupModalQris() {
  document.getElementById('modalQris').style.display = 'none';
  rentalIdAktif = null;
}

muatDaftarConsole();
