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
    .filter(c => c.status !== 'maintenance')
    .map(c => `<option value="${c.id}">${c.nama} (${c.tipe}) - Rp${c.harga_per_jam}/jam</option>`)
    .join('');

  select.onchange = tampilkanJadwalUnit;
  tampilkanJadwalUnit();

  const listDiv = document.getElementById('listConsole');
  listDiv.innerHTML = data.map(c => `
    <div class="console-card ${c.status}">
      <strong>${c.nama}</strong>
      <p>${c.tipe} — Rp${c.harga_per_jam}/jam</p>
      <span class="badge ${c.status}">${c.status}</span>
    </div>
  `).join('');
}

// Tampilkan daftar jam yang sudah dibooking untuk unit yang sedang dipilih
async function tampilkanJadwalUnit() {
  const consoleId = document.getElementById('consoleId').value;
  const jadwalDiv = document.getElementById('jadwalUnit');
  if (!consoleId) { jadwalDiv.innerHTML = ''; return; }

  try {
    const res = await fetch(`${API_BASE_URL}/rentals/jadwal/${consoleId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      jadwalDiv.innerHTML = '✅ Belum ada jadwal booking untuk unit ini.';
      return;
    }

    const formatJamAman = (iso) => {
    if (!iso) return '';
    const parts = iso.includes('T') ? iso.split('T') : iso.split(' ');
    const tgl = parts[0]; // YYYY-MM-DD
    const jam = parts[1].substring(0, 5); // HH:mm
    return `${tgl} ${jam}`;
  };

  jadwalDiv.innerHTML = '⏰ Jam yang sudah dibooking:<br>' + data.map(j => {
    // Ambil jam & menit awal
    const timePart = j.jam_mulai.includes('T') ? j.jam_mulai.split('T')[1] : j.jam_mulai.split(' ')[1];
    const [h, m] = timePart.substring(0, 5).split(':').map(Number);
    
    // Hitung jam selesai secara manual tanpa new Date()
    const jamMulaiStr = `${timePart.substring(0, 5)}`;
    const endHour = (h + Number(j.durasi_jam)) % 24;
    const jamSelesaiStr = `${String(endHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    return `• ${jamMulaiStr} - ${jamSelesaiStr}`;
  }).join('<br>');
  } catch (err) {
    jadwalDiv.innerHTML = '';
  }
}

// Set default jam mulai = waktu sekarang saat halaman dibuka
function setJamMulaiDefault() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // koreksi ke waktu lokal
  document.getElementById('jamMulai').value = now.toISOString().slice(0, 16);
}
setJamMulaiDefault();

document.getElementById('formSewa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';

  const jamMulaiInput = document.getElementById('jamMulai').value; // format: YYYY-MM-DDTHH:MM
  const body = {
    console_id: document.getElementById('consoleId').value,
    nama_penyewa: document.getElementById('namaPenyewa').value,
    no_hp: document.getElementById('noHp').value,
    jam_mulai: jamMulaiInput.replace('T', ' ') + ':00',
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
