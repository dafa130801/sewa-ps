document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Di sini tempat proses login / validasi kamu ke backend
            // Kalau sukses, baru arahkan ke dashboard:
            window.location.href = 'dashboard.html';
        });
    }
});