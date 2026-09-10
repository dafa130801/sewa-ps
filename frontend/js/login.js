document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Langsung alihkan ke halaman dashboard
            window.location.href = 'dashboard.html';
        });
    }
});