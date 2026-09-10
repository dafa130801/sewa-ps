document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }
});