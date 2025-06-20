document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('ingresar-usuario').value;
        const password = document.getElementById('ingresar-password').value;

        fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            console.log('Respuesta cruda:', response);
            return response.json();
        })
        .then(data => {
            console.log('Respuesta JSON:', data);
            if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = "/Dashboards/html/index.html";
            } else if (data.success && !data.token) {
                alert("El backend no está enviando el token. Contacta al administrador.");
            } else {
                alert("Correo o contraseña incorrectos");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al conectar con el servidor");
        });
    });
});