// =========================================
// LOGIC HALAMAN REGISTRASI (Local Storage Mode)
// Akun baru selalu dibuat dengan role "user"
// =========================================
document.getElementById('formRegister').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');
  
  if (errorMsg) errorMsg.textContent = '';
  if (successMsg) successMsg.textContent = '';

  if (!username || !password) {
    if (errorMsg) errorMsg.textContent = 'Username dan password wajib diisi.';
    return;
  }

  // Ambil daftar user yang sudah ada di localStorage
  const users = JSON.parse(localStorage.getItem('local_users') || '[]');

  // Cek apakah username sudah digunakan
  const userExist = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (userExist) {
    if (errorMsg) errorMsg.textContent = 'Username sudah terdaftar. Gunakan username lain.';
    return;
  }

  // Buat data user baru (default role: user)
  const newUser = {
    id: Date.now(),
    username: username,
    password: password,
    role: 'user'
  };

  users.push(newUser);
  localStorage.setItem('local_users', JSON.stringify(users));

  if (successMsg) successMsg.textContent = 'Akun berhasil dibuat! Mengalihkan ke halaman login...';
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
});