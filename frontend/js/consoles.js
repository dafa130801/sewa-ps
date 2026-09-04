// =========================================
// LOGIC HALAMAN KELOLA UNIT KONSOL (admin & superadmin)
// =========================================
const token = wajibLogin();
terapkanTampilanRole();

const user = getUserLogin();
if (user && user.role === 'user') {
  alert('Anda tidak memiliki izin untuk mengakses halaman ini.');
  window.location.href = 'dashboard.html';
}

async function muatTabel() {
  const res = await fetch(`${API_BASE_URL}/consoles`);
  const data = await res.json();

  document.getElementById('tabelConsole').innerHTML = data.map(c => `
    <tr>
      <td>${c.nama}</td>
      <td>${c.tipe}</td>
      <td>Rp${c.harga_per_jam}</td>
      <td><span class="badge ${c.status}">${c.status}</span></td>
      <td><button class="btn-small btn-hapus" onclick="hapusUnit(${c.id})">Hapus</button></td>
    </tr>
  `).join('');
}

document.getElementById('formConsole').addEventListener('submit', async (e) => {
  e.preventDefault();
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = '';

  const body = {
    nama: document.getElementById('nama').value,
    tipe: document.getElementById('tipe').value,
    harga_per_jam: parseInt(document.getElementById('harga').value)
  };

  try {
    const res = await fetch(`${API_BASE_URL}/consoles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Gagal menambahkan unit.';
      return;
    }

    document.getElementById('formConsole').reset();
    muatTabel();
  } catch (err) {
    errorMsg.textContent = 'Tidak dapat terhubung ke server backend.';
  }
});

async function hapusUnit(id) {
  if (!confirm('Yakin ingin menghapus unit ini?')) return;
  await fetch(`${API_BASE_URL}/consoles/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  muatTabel();
}

muatTabel();
