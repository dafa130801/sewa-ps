// =========================================
// LOGIC HALAMAN KELOLA UNIT KONSOL (Local Storage Mode)
// =========================================
const token = wajibLogin();
terapkanTampilanRole();

const user = getUserLogin();
if (user && user.role === 'user') {
  alert('Anda tidak memiliki izin untuk mengakses halaman ini.');
  window.location.href = 'dashboard.html';
}

// Ambil data unit dari localStorage atau gunakan data awal jika kosong
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

function saveLocalConsoles(consoles) {
  localStorage.setItem('local_consoles', JSON.stringify(consoles));
}

function muatTabel() {
  const data = getLocalConsoles();
  const tabelElement = document.getElementById('tabelConsole');
  if (!tabelElement) return;

  tabelElement.innerHTML = data.map(c => `
    <tr>
      <td>${c.nama}</td>
      <td>${c.tipe}</td>
      <td>Rp${c.harga_per_jam}</td>
      <td><span class="badge ${c.status}">${c.status}</span></td>
      <td><button class="btn-small btn-hapus" onclick="hapusUnit(${c.id})">Hapus</button></td>
    </tr>
  `).join('');
}

document.getElementById('formConsole').addEventListener('submit', (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';

  const nama = document.getElementById('nama').value;
  const tipe = document.getElementById('tipe').value;
  const harga_per_jam = parseInt(document.getElementById('harga').value);

  const consoles = getLocalConsoles();
  
  // Buat unit baru dengan ID unik berdasarkan waktu
  const newUnit = {
    id: Date.now(),
    nama: nama,
    tipe: tipe,
    harga_per_jam: harga_per_jam,
    status: 'tersedia'
  };

  consoles.push(newUnit);
  saveLocalConsoles(consoles);

  document.getElementById('formConsole').reset();
  muatTabel();
});

function hapusUnit(id) {
  if (!confirm('Yakin ingin menghapus unit ini?')) return;
  let consoles = getLocalConsoles();
  consoles = consoles.filter(c => c.id !== id);
  saveLocalConsoles(consoles);
  muatTabel();
}

muatTabel();