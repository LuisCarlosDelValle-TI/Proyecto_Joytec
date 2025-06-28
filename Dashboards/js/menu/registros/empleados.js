document.addEventListener("DOMContentLoaded", () => {
    fetch("/Dashboards/html/menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    const params = new URLSearchParams(window.location.search);
    const idEmpleado = params.get('id');

    if (idEmpleado) {
        // --- SOLO EDICIÓN ---
        fetch(`http://localhost:3001/api/empleados/${idEmpleado}`)
            .then(res => res.json())
            .then(empleado => {
                document.getElementById('nombre').value = empleado.nombre || '';
                document.getElementById('apellidoPaterno').value = empleado.apellido_paterno || '';
                document.getElementById('apellidoMaterno').value = empleado.apellido_materno || '';
                document.getElementById('telefono').value = empleado.telefono || '';
                document.getElementById('salario').value = empleado.salario || '';
            })
            .catch(error => {
                alert('No se pudo cargar el empleado');
                console.error(error);
            });

        document.querySelector('.form-editar-empleado form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                nombre: document.getElementById('nombre').value,
                apellido_paterno: document.getElementById('apellidoPaterno').value,
                apellido_materno: document.getElementById('apellidoMaterno').value,
                telefono: document.getElementById('telefono').value,
                salario: parseFloat(document.getElementById('salario').value)
            };
            try {
                const response = await fetch(`http://localhost:3001/api/empleados/${idEmpleado}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Cambios guardados correctamente');
                    window.location.href = '/Dashboards/html/empleado.html';
                } else {
                    const error = await response.json();
                    alert('Error al guardar cambios: ' + (error.message || 'Error desconocido'));
                }
            } catch (error) {
                alert('Error al conectar con el servidor');
                console.error(error);
            }
        });
    } else {
        // --- SOLO REGISTRO ---
        document.getElementById('guardar').addEventListener('click', async (event) => {
            event.preventDefault();

            const nombre = document.getElementById('nombre-empleado').value;
            const apellidoPaterno = document.getElementById('apellido-paterno').value;
            const apellidoMaterno = document.getElementById('apellido-materno').value;
            const telefono = document.getElementById('telefono').value;
            const salario = document.getElementById('Salario').value;

            if (!nombre.trim() || !apellidoPaterno.trim() || !telefono.trim() || !salario.trim()) {
                alert('Todos los campos obligatorios deben ser completados.');
                return;
            }

            try {
                const response = await fetch('http://localhost:3001/api/empleados', {
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
    }
});
