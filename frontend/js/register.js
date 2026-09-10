// =========================================
// LOGIC HALAMAN REGISTRASI
// Akun baru selalu dibuat dengan role "user"
// =========================================
document.getElementById('formRegister').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');
  const successMsg = document.getElementById('successMsg');
  errorMsg.textContent = '';
  successMsg.textContent = '';

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.message || 'Gagal mendaftar.';
      return;
    }

    successMsg.textContent = 'Akun berhasil dibuat! Mengalihkan ke halaman login...';
    setTimeout(() => window.location.href = 'login.html', 1500);
  } catch (err) {
    errorMsg.textContent = 'Tidak dapat terhubung ke server backend.';
  }
});
