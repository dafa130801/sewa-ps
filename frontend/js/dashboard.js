// =========================================
// LOGIC HALAMAN DASHBOARD (Local Storage Mode)
// =========================================
const token = wajibLogin();
terapkanTampilanRole();

let rentalIdAktif = null;

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
  const consoleId = document.getElementById('consoleId').value;
  const inputJamMulai = document.getElementById('jamMulai')?.value;
  const inputDurasi = parseInt(document.getElementById('durasiJam')?.value) || 1;

  if (!jadwalDiv) return;

  const rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  const consoles = getLocalConsoles();
  const selectedConsole = consoles.find(c => c.id == consoleId);
  
  if (!selectedConsole) {
    jadwalDiv.innerHTML = '✅ Belum ada jadwal booking untuk unit ini.';
    return;
  }

  // Filter rental yang aktif untuk unit ini
  const activeRentals = rentals.filter(r => 
    r.nama_console === selectedConsole.nama && 
    r.payment_status !== 'lunas' && 
    r.status !== 'batal' &&
    r.jam_mulai
  );

  if (activeRentals.length === 0) {
    jadwalDiv.innerHTML = '✅ Unit tersedia pada jam tersebut.';
    return;
  }

  // Cek apakah ada bentrok waktu jika input jam mulai tersedia
  if (inputJamMulai) {
    const startInput = new Date(inputJamMulai).getTime();
    const endInput = startInput + (inputDurasi * 3600 * 1000);

    let bentrok = false;
    let infoBentrok = '';

    for (let r of activeRentals) {
      const startExisting = new Date(r.jam_mulai).getTime();
      const endExisting = startExisting + ((r.durasi_jam || 1) * 3600 * 1000);

      // Rumus deteksi irisan waktu (overlap)
      if (Math.max(startInput, startExisting) < Math.min(endInput, endExisting)) {
        bentrok = true;
        const formatMulai = new Date(r.jam_mulai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '-');
        const formatSelesai = new Date(endExisting).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '-');
        
        infoBentrok = `⚠️ Bilik ini dari ${formatMulai} - ${formatSelesai} sudah dibooking`;
        break;
      }
    }

    if (bentrok) {
      jadwalDiv.innerHTML = `<span style="color:#ef4444; font-weight:bold;">${infoBentrok}</span>`;
      return;
    }
  }

  // Tampilkan daftar seluruh jadwal aktif unit ini sebagai referensi
  let listJadwal = activeRentals.map(r => {
    const startExisting = new Date(r.jam_mulai).getTime();
    const endExisting = startExisting + ((r.durasi_jam || 1) * 3600 * 1000);
    const formatMulai = new Date(r.jam_mulai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '-');
    const formatSelesai = new Date(endExisting).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '-');
    
    return `• Bilik ini dari ${formatMulai} - ${formatSelesai} sudah dibooking (${r.nama_penyewa})`;
  }).join('<br>');

  jadwalDiv.innerHTML = `<span style="color:#f59e0b; font-weight:bold;">Jadwal terisi pada unit ini:</span><br>${listJadwal}`;
}

function setJamMulaiDefault() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const jamMulaiEl = document.getElementById('jamMulai');
  if (jamMulaiEl) jamMulaiEl.value = now.toISOString().slice(0, 16);
  tampilkanJadwalUnit();
}

// Event listener untuk deteksi perubahan waktu/durasi secara real-time
document.getElementById('jamMulai')?.addEventListener('change', tampilkanJadwalUnit);
document.getElementById('durasiJam')?.addEventListener('input', tampilkanJadwalUnit);

setJamMulaiDefault();

document.getElementById('formSewa').addEventListener('submit', (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  if (errorMsg) errorMsg.textContent = '';

  const durasi = parseInt(document.getElementById('durasiJam').value) || 1;
  const jamMulaiVal = document.getElementById('jamMulai').value;
  const consoles = getLocalConsoles();
  const consoleId = document.getElementById('consoleId').value;
  const selectedConsole = consoles.find(c => c.id == consoleId);
  
  const namaConsole = selectedConsole ? selectedConsole.nama : 'Bilik';
  const tipeConsole = selectedConsole ? selectedConsole.tipe : 'PS3';
  const hargaPerJam = selectedConsole ? selectedConsole.harga_per_jam : 5000;
  const totalHarga = durasi * hargaPerJam;

  // Validasi ketat pencegahan bentrok saat tombol submit ditekan
  const rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  const startInput = new Date(jamMulaiVal).getTime();
  const endInput = startInput + (durasi * 3600 * 1000);

  for (let r of rentals) {
    if (r.nama_console === namaConsole && r.payment_status !== 'lunas' && r.status !== 'batal' && r.jam_mulai) {
      const startExisting = new Date(r.jam_mulai).getTime();
      const endExisting = startExisting + ((r.durasi_jam || 1) * 3600 * 1000);
      if (Math.max(startInput, startExisting) < Math.min(endInput, endExisting)) {
        const formatMulai = new Date(r.jam_mulai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '-');
        const formatSelesai = new Date(endExisting).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '-');
        alert(`Gagal! Bilik ini dari ${formatMulai} - ${formatSelesai} sudah dibooking.`);
        return;
      }
    }
  }

  const userLogin = typeof getUserLogin === 'function' ? getUserLogin() : null;
  const namaPenyewa = document.getElementById('namaPenyewa').value || (userLogin ? userLogin.username : 'Admin');
  const noHp = document.getElementById('noHp').value;

  const newRental = {
    id: Date.now(),
    nama_console: namaConsole,
    tipe: tipeConsole,
    nama_penyewa: namaPenyewa,
    no_hp: noHp,
    jam_mulai: jamMulaiVal,
    durasi_jam: durasi,
    total_harga: totalHarga,
    status: 'pending',
    payment_status: 'belum_bayar'
  };

  if (window.tambahRentalBaru) {
    window.tambahRentalBaru(newRental);
  } else {
    const existing = JSON.parse(localStorage.getItem('local_rentals') || '[]');
    existing.unshift(newRental);
    localStorage.setItem('local_rentals', JSON.stringify(existing));
  }

  rentalIdAktif = newRental.id;

  document.getElementById('formSewa').reset();
  setJamMulaiDefault();
  tampilkanJadwalUnit();
  tampilkanModalQris(newRental.id, totalHarga);
});

function tampilkanModalQris(rentalId, totalHarga) {
  rentalIdAktif = rentalId;
  const qrisTotal = document.getElementById('qrisTotal');
  const qrisStatus = document.getElementById('qrisStatus');
  const modalQris = document.getElementById('modalQris');

  if (qrisTotal) qrisTotal.textContent = `Total: Rp${totalHarga}`;
  if (qrisStatus) qrisStatus.textContent = 'Silakan scan & transfer sesuai total di atas.';
  if (modalQris) {
    modalQris.style.display = 'flex';
  }
}

function tandaiSudahBayar() {
  if (!rentalIdAktif) return;
  
  let rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  rentals = rentals.map(r => {
    if (r.id === rentalIdAktif) {
      r.payment_status = 'menunggu_konfirmasi';
    }
    return r;
  });
  localStorage.setItem('local_rentals', JSON.stringify(rentals));

  const qrisStatus = document.getElementById('qrisStatus');
  if (qrisStatus) qrisStatus.textContent = '⏳ Menunggu konfirmasi admin...';
  muatDaftarConsole();
}

function tutupModalQris() {
  const modalQris = document.getElementById('modalQris');
  if (modalQris) modalQris.style.display = 'none';
  rentalIdAktif = null;
  muatDaftarConsole();
}

muatDaftarConsole();