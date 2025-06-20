const formulario = document.getElementById('registroProveedorForm');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Capturar los datos del formulario
    const datosProveedor = {
        razon_social: document.getElementById('razon-social').value,
        telefono: document.getElementById('contacto').value,
        pais: document.getElementById('pais').value,
        estado: document.getElementById('estado').value,
        ciudad: document.getElementById('ciudad').value,
        cp: document.getElementById('cp').value,
        tipo_proveedor: document.getElementById('tipo-proveedor').value
    };

    try {
        // Enviar los datos a la API
        const response = await fetch('http://localhost:3001/api/proveedores', { // Cambia la URL si es necesario
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosProveedor)
        });

        if (response.ok) {
            alert('Proveedor registrado con éxito');
            window.location.href = 'proveedores.html'; // Redirigir a la lista de proveedores
        } else {
            const error = await response.json();
            alert('Error al registrar el proveedor: ' + error.message);
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('Hubo un problema al conectar con el servidor');
    }
});
