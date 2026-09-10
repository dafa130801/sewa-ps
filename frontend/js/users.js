// =========================================
// LOGIC HALAMAN KELOLA USER (khusus superadmin)
// =========================================
const token = wajibLogin();
terapkanTampilanRole();

const currentUser = getUserLogin();
if (currentUser && currentUser.role !== 'superadmin') {
  alert('Halaman ini khusus superadmin.');
  window.location.href = 'dashboard.html';
}

async function muatUser() {
  const res = await fetch(`${API_BASE_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (res.status === 401 || res.status === 403) {
    alert('Anda tidak memiliki izin untuk mengakses halaman ini.');
    window.location.href = 'dashboard.html';
    return;
  }

  const data = await res.json();

  document.getElementById('tabelUser').innerHTML = data.map(u => `
    <tr>
      <td>${u.username}</td>
      <td><span class="badge ${u.role === 'user' ? 'tersedia' : u.role === 'admin' ? 'disewa' : 'maintenance'}">${u.role}</span></td>
      <td>
        <select onchange="ubahRole(${u.id}, this.value)" ${u.id === currentUser.id ? 'disabled' : ''}>
          <option value="user" ${u.role === 'user' ? 'selected' : ''}>user</option>
          <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
          <option value="superadmin" ${u.role === 'superadmin' ? 'selected' : ''}>superadmin</option>
        </select>
      </td>
      <td>
        ${u.id === currentUser.id
          ? '-'
          : `<button class="btn-small btn-hapus" onclick="hapusUser(${u.id})">Hapus</button>`}
      </td>
    </tr>
  `).join('');
}

async function ubahRole(id, role) {
  const res = await fetch(`${API_BASE_URL}/users/${id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ role })
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.message || 'Gagal mengubah role.');
  }
  muatUser();
}

async function hapusUser(id) {
  if (!confirm('Yakin ingin menghapus akun ini?')) return;
  await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  muatUser();
}

muatUser();
