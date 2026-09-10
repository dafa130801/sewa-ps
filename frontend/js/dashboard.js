// =========================================
// LOGIC HALAMAN DASHBOARD (Local Storage Mode)
// =========================================
const token = wajibLogin();
terapkanTampilanRole();

function getLocalConsoles() {
  const data = localStorage.getItem('local_consoles');
  if (!data) {
    const defaultData = [
      { id: 1, nama: 'Bilik 1', tipe: 'PS3', harga_per_jam: 5000, status: 'tersedia' }
    ];
    localStorage.setItem('local_consoles', JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
}

function muatDaftarConsole() {
  const data = getLocalConsoles();

  const select = document.getElementById('consoleId');
  if (select) {
    select.innerHTML = data
      .filter(c => c.status !== 'maintenance')
      .map(c => `<option value="${c.id}">${c.nama} (${c.tipe}) - Rp${c.harga_per_jam}/jam</option>`)
      .join('');
    select.onchange = tampilkanJadwalUnit;
    tampilkanJadwalUnit();
  }

  const listDiv = document.getElementById('listConsole');
  if (listDiv) {
    listDiv.innerHTML = data.map(c => `
      <div class="console-card ${c.status}">
        <strong>${c.nama}</strong>
        <p>${c.tipe} — Rp${c.harga_per_jam}/jam</p>
        <span class="badge ${c.status}">${c.status}</span>
      </div>
    `).join('');
  }
}

function tampilkanJadwalUnit() {
  const jadwalDiv = document.getElementById('jadwalUnit');
  if (jadwalDiv) {
    jadwalDiv.innerHTML = '✅ Belum ada jadwal booking untuk unit ini.';
  }
}

function setJamMulaiDefault() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const jamMulaiEl = document.getElementById('jamMulai');
  if (jamMulaiEl) jamMulaiEl.value = now.toISOString().slice(0, 16);
}
setJamMulaiDefault();

document.getElementById('formSewa').addEventListener('submit', (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  if (errorMsg) errorMsg.textContent = '';

  const durasi = parseInt(document.getElementById('durasiJam').value) || 1;
  const consoles = getLocalConsoles();
  const consoleId = document.getElementById('consoleId').value;
  const selectedConsole = consoles.find(c => c.id == consoleId);
  const hargaPerJam = selectedConsole ? selectedConsole.harga_per_jam : 5000;
  
  const totalHarga = durasi * hargaPerJam;
  
  document.getElementById('formSewa').reset();
  setJamMulaiDefault();
  tampilkanModalQris(Date.now(), totalHarga);
});

let rentalIdAktif = null;

function tampilkanModalQris(rentalId, totalHarga) {
  rentalIdAktif = rentalId;
  document.getElementById('qrisTotal').textContent = `Total: Rp${totalHarga}`;
  document.getElementById('qrisStatus').textContent = 'Silakan scan & transfer sesuai total di atas.';
  document.getElementById('modalQris').style.display = 'flex';
}

function tandaiSudahBayar() {
  if (!rentalIdAktif) return;
  document.getElementById('qrisStatus').textContent = '⏳ Menunggu konfirmasi admin...';
}

function tutupModalQris() {
  document.getElementById('modalQris').style.display = 'none';
  rentalIdAktif = null;
}

muatDaftarConsole();