// =========================================
// LOGIC HALAMAN KELOLA USER (Local Storage Mode)
// =========================================
const token = wajibLogin();
if (typeof terapkanTampilanRole === 'function') {
  terapkanTampilanRole();
}

const currentUser = typeof getUserLogin === 'function' ? getUserLogin() : null;
if (currentUser && currentUser.role !== 'superadmin' && currentUser.role !== 'admin') {
  alert('Halaman ini khusus admin/superadmin.');
  window.location.href = 'dashboard.html';
}

function muatUser() {
  const tbody = document.getElementById('tabelUser');
  if (!tbody) return;

  const users = JSON.parse(localStorage.getItem('local_users') || '[]');

  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #94a3b8;">Belum ada akun terdaftar.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map((u, index) => {
    const isSelf = currentUser && currentUser.username === u.username;
    return `
      <tr>
        <td>${u.username}</td>
        <td><span class="badge ${u.role === 'user' ? 'tersedia' : 'maintenance'}">${u.role}</span></td>
        <td>
          <select onchange="ubahRole('${u.username}', this.value)" ${isSelf ? 'disabled' : ''} style="padding: 4px; background: #0f172a; color: #fff; border: 1px solid #334155; border-radius: 4px;">
            <option value="user" ${u.role === 'user' ? 'selected' : ''}>user</option>
            <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>admin</option>
            <option value="superadmin" ${u.role === 'superadmin' ? 'selected' : ''}>superadmin</option>
          </select>
        </td>
        <td>
          ${isSelf ? '-' : `<button class="btn-small btn-hapus" onclick="hapusUser('${u.username}')" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">Hapus</button>`}
        </td>
      </tr>
    `;
  }).join('');
}

function ubahRole(username, roleBaru) {
  let users = JSON.parse(localStorage.getItem('local_users') || '[]');
  users = users.map(u => {
    if (u.username === username) {
      u.role = roleBaru;
    }
    return u;
  });
  localStorage.setItem('local_users', JSON.stringify(users));
  muatUser();
}

function hapusUser(username) {
  if (!confirm(`Yakin ingin menghapus akun ${username}?`)) return;
  let users = JSON.parse(localStorage.getItem('local_users') || '[]');
  users = users.filter(u => u.username !== username);
  localStorage.setItem('local_users', JSON.stringify(users));
  muatUser();
}

muatUser();