document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('button[type="submit"]');
    
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Langsung alihkan ke halaman dashboard
            window.location.href = 'dashboard.html';
        });
    }
});