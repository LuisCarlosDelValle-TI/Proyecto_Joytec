document.getElementById('guardar').addEventListener('click', async (event) => {
    event.preventDefault(); // Evitar que el formulario recargue la página

    // Capturar los valores de los campos del formulario
    const nombre = document.getElementById('nombre-empleado').value;
    const apellidoPaterno = document.getElementById('apellido-paterno').value;
    const apellidoMaterno = document.getElementById('apellido-materno').value;
    const telefono = document.getElementById('telefono').value;
    const salario = document.getElementById('Salario').value;

    // Validar que los campos no estén vacíos
    if (!nombre.trim() || !apellidoPaterno.trim() || !telefono.trim() || !salario.trim()) {
        alert('Todos los campos obligatorios deben ser completados.');
        return;
    }

    try {
        // Enviar los datos a la API
        const response = await fetch('http://localhost:3001/api/empleados', { // Cambia la URL si es necesario
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                apellido_paterno: apellidoPaterno,
                apellido_materno: apellidoMaterno,
                telefono,
                salario
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Empleado registrado exitosamente');
            console.log('Empleado registrado:', data);
            // Limpiar los campos del formulario
            document.getElementById('nombre-empleado').value = '';
            document.getElementById('apellido-paterno').value = '';
            document.getElementById('apellido-materno').value = '';
            document.getElementById('telefono').value = '';
            document.getElementById('Salario').value = '';
        } else {
            const error = await response.json();
            alert('Error al registrar el empleado: ' + error.message);
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
});
