// =========================================
// LOGIC DASHBOARD & SEWA PS (Local Storage Mode)
// =========================================

let rentalIdAktif = null;

document.addEventListener('DOMContentLoaded', () => {
  // Jalankan fungsi pengaman role jika ada
  if (typeof terapkanTampilanRole === 'function') {
    terapkanTampilanRole();
  }

  muatDaftarConsole();
  isiDropdownConsole();
  setJamMulaiDefault();

  const consoleSelect = document.getElementById('consoleId');
  if (consoleSelect) {
    consoleSelect.addEventListener('change', tampilkanJadwalUnit);
  }

  const jamMulaiInput = document.getElementById('jamMulai');
  if (jamMulaiInput) {
    jamMulaiInput.addEventListener('change', tampilkanJadwalUnit);
  }
});

function getLocalConsoles() {
  return JSON.parse(localStorage.getItem('local_consoles') || '[]');
}

function isiDropdownConsole() {
  const select = document.getElementById('consoleId');
  if (!select) return;

  const consoles = getLocalConsoles();
  select.innerHTML = '';

  if (consoles.length === 0) {
    select.innerHTML = '<option value="">-- Belum ada unit konsol --</option>';
    return;
  }

  consoles.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.nama} (${c.tipe}) - Rp${c.harga_per_jam}/jam`;
    select.appendChild(opt);
  });

  tampilkanJadwalUnit();
}

function setJamMulaiDefault() {
  const jamMulaiInput = document.getElementById('jamMulai');
  if (!jamMulaiInput) return;

  const sekarang = new Date();
  sekarang.setMinutes(sekarang.getMinutes() - sekarang.getTimezoneOffset());
  jamMulaiInput.value = sekarang.toISOString().slice(0, 16);
}

function tampilkanJadwalUnit() {
  const consoleId = document.getElementById('consoleId')?.value;
  const infoDiv = document.getElementById('jadwalUnit');
  if (!infoDiv) return;

  if (!consoleId) {
    infoDiv.innerHTML = '';
    return;
  }

  const consoles = getLocalConsoles();
  const selected = consoles.find(c => c.id == consoleId);
  if (!selected) return;

  const rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  const activeRentals = rentals.filter(r => r.nama_console === selected.nama && r.status !== 'batal');

  if (activeRentals.length === 0) {
    infoDiv.innerHTML = '<span style="color: #10b981;">✔ Unit tersedia untuk dibooking.</span>';
  } else {
    let html = '<span style="color: #f59e0b;">⚠ Jadwal Sewa Terdaftar:</span><ul style="margin: 5px 0 0 20px; padding: 0; font-size: 13px; color: #cbd5e1;">';
    activeRentals.forEach(r => {
      const start = new Date(r.jam_mulai).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const end = new Date(new Date(r.jam_mulai).getTime() + (r.durasi_jam || 1) * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      html += `<li>${start} - ${end} (${r.nama_penyewa})</li>`;
    });
    html += '</ul>';
    infoDiv.innerHTML = html;
  }
}

function muatDaftarConsole() {
  const container = document.getElementById('listConsole');
  if (!container) return;

  const consoles = getLocalConsoles();
  if (consoles.length === 0) {
    container.innerHTML = '<p style="color: #94a3b8; font-size: 14px;">Belum ada data konsol. Silakan tambahkan lewat menu Kelola Unit.</p>';
    return;
  }

  let html = '';
  consoles.forEach(c => {
    const badgeClass = c.status === 'tersedia' ? 'tersedia' : 'maintenance';
    html += `
      <div class="console-card">
        <strong>${c.nama}</strong> (${c.tipe}) - Rp${c.harga_per_jam}/jam<br>
        <span class="badge ${badgeClass}">${c.status}</span>
      </div>
    `;
  });
  container.innerHTML = html;
}

// EVENT SUBMIT SEWA & PEMICU MODAL QRIS
document.getElementById('formSewa')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  if (errorMsg) errorMsg.textContent = '';

  const durasi = parseInt(document.getElementById('durasiJam').value) || 1;
  const jamMulaiVal = document.getElementById('jamMulai').value;
  const consoles = getLocalConsoles();
  const consoleId = document.getElementById('consoleId').value;
  const selectedConsole = consoles.find(c => c.id == consoleId);
  
  const namaConsole = selectedConsole ? selectedConsole.nama : 'Bilik 1';
  const tipeConsole = selectedConsole ? selectedConsole.tipe : 'PS3';
  const hargaPerJam = selectedConsole ? selectedConsole.harga_per_jam : 5000;
  const totalHarga = durasi * hargaPerJam;

  // Validasi bentrok waktu
  const rentals = JSON.parse(localStorage.getItem('local_rentals') || '[]');
  const startInput = new Date(jamMulaiVal).getTime();
  const endInput = startInput + (durasi * 3600 * 1000);

  for (let r of rentals) {
    if (r.nama_console === namaConsole && r.status !== 'batal' && r.jam_mulai) {
      const startExisting = new Date(r.jam_mulai).getTime();
      const endExisting = startExisting + ((r.durasi_jam || 1) * 3600 * 1000);
      if (Math.max(startInput, startExisting) < Math.min(endInput, endExisting)) {
        alert('Gagal! Jadwal pada jam tersebut sudah dibooking orang lain.');
        return;
      }
    }
  }

  const userLogin = typeof getUserLogin === 'function' ? getUserLogin() : null;
  const namaPenyewa = document.getElementById('namaPenyewa').value || (userLogin ? userLogin.username : 'User');
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

  rentals.unshift(newRental);
  localStorage.setItem('local_rentals', JSON.stringify(rentals));

  // Reset form
  document.getElementById('formSewa').reset();
  setJamMulaiDefault();
  tampilkanJadwalUnit();
  
  // MUNCULKAN MODAL QRIS
  tampilkanModalQris(newRental.id, totalHarga);
});

function tampilkanModalQris(rentalId, totalHarga) {
  rentalIdAktif = rentalId;
  const qrisTotal = document.getElementById('qrisTotal');
  const qrisStatus = document.getElementById('qrisStatus');
  const modalQris = document.getElementById('modalQris');

  if (qrisTotal) qrisTotal.textContent = `Total: Rp${totalHarga.toLocaleString('id-ID')}`;
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
  
  setTimeout(() => {
    tutupModalQris();
    alert('Pembayaran dilaporkan! Menunggu konfirmasi admin.');
    window.location.href = 'riwayat.html';
  }, 1200);
}

function tutupModalQris() {
  const modalQris = document.getElementById('modalQris');
  if (modalQris) {
    modalQris.style.display = 'none';
  }
  rentalIdAktif = null;
}