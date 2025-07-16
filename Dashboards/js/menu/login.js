document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre_usuario = document.getElementById('ingresar-usuario').value;
        const contraseña = document.getElementById('ingresar-password').value;

        fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_usuario, contraseña })
        })
        .then(response => {
            console.log('Respuesta cruda:', response);
            return response.json();
        })
        .then(data => {
            console.log('Respuesta JSON:', data);
            if (data.token) {
                // Guardar token y datos del usuario en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                
                window.location.href = "/Dashboards/html/index.html";
            } else {
                alert(data.mensaje || "Error al iniciar sesión");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al conectar con el servidor");
        });
    });
});