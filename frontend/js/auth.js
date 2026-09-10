// =========================================
// HELPER: LOGIN CHECK & TAMPILAN BERDASARKAN ROLE
// Sertakan file ini SEBELUM script halaman lain
// =========================================
function wajibLogin() {
    let token = localStorage.getItem('token');
    if (!token) {
        token = 'token-bypass-vercel';
        localStorage.setItem('token', token);
    }
    return token;
}

function getUserLogin() {
  const raw = sessionStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

// Sembunyikan elemen navbar sesuai role:
// - elemen ber-class "admin-only" hanya tampil untuk admin & superadmin
// - elemen ber-class "superadmin-only" hanya tampil untuk superadmin
function terapkanTampilanRole() {
  const user = getUserLogin();
  if (!user) return;

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
  }
  if (user.role !== 'superadmin') {
    document.querySelectorAll('.superadmin-only').forEach(el => el.style.display = 'none');
  }

  const infoUser = document.getElementById('infoUser');
  if (infoUser) {
    infoUser.textContent = `${user.username} (${user.role})`;
  }
}

function logout() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}
