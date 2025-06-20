<<<<<<< HEAD
$(document).ready(function () {
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });
});
</script>

<script>
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); // Evitar recargar la página

    // Obtener los datos del formulario
    let clienteData = {
        nombre: document.querySelector('input[placeholder="Ingrese su nombre"]').value,
        apellido_paterno: document.querySelector('input[placeholder="Apellido paterno"]').value,
        apellido_materno: document.querySelector('input[placeholder="Apellido materno"]').value,
        telefono: document.querySelector('input[placeholder="10 dígitos"]').value,
        correo: document.querySelector('input[placeholder="Correo electrónico"]').value,
        pais: document.querySelector('input[placeholder="País"]').value,
        estado: document.querySelector('input[placeholder="Estado"]').value,
        ciudad: document.querySelector('input[placeholder="Ciudad"]').value,
        cp: document.querySelector('input[placeholder="Código Postal"]').value,
        fecha_nacimiento: document.querySelector('input[type="date"]').value
    };

    if (!clienteData.nombre || !clienteData.correo) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    console.log("Datos enviados:", clienteData);

    // Realizar la solicitud POST a la API de clientes
    fetch('http://localhost:3001/api/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 12345' // Si es necesario
        },
        body: JSON.stringify(clienteData)
    })
        .then(response => {
            // Intentar parsear la respuesta JSON incluso si el código HTTP no es exitoso
            return response.json().then(data => {
                // Si el código HTTP no es exitoso, pero el backend indica éxito, no lanzar error
                if (!response.ok && data.status !== 'success') {
                    throw new Error(data.message || 'Error desconocido en el servidor');
                }
                return data; // Retorna los datos si la respuesta es exitosa
            });
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Cliente agregado con éxito!' );
                console.log(data);
                // Opcional: limpiar el formulario o redirigir
                document.querySelector('form').reset();
            } else {
                alert('Ok: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
            alert('Error al realizar la solicitud: ' + error.message);
        });
=======
document.addEventListener("DOMContentLoaded", () => {
    fetch("/Dashboards/html/menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    const params = new URLSearchParams(window.location.search);
    const idCliente = params.get('id');

    if (idCliente) {
        // --- SOLO EDICIÓN ---
        fetch(`http://localhost:3001/api/clientes/${idCliente}`)
            .then(res => res.json())
            .then(cliente => {
                document.getElementById('nombre').value = cliente.nombre || '';
                document.getElementById('apellidoPaterno').value = cliente.apellido_paterno || '';
                document.getElementById('apellidoMaterno').value = cliente.apellido_materno || '';
                document.getElementById('telefono').value = cliente.telefono || '';
                document.getElementById('correo').value = cliente.correo || '';
                document.getElementById('pais').value = cliente.pais || '';
                document.getElementById('estado').value = cliente.estado || '';
                document.getElementById('ciudad').value = cliente.ciudad || '';
                document.getElementById('codigoPostal').value = cliente.cp || '';
                document.getElementById('fechaNacimiento').value = cliente.fecha_nacimiento ? cliente.fecha_nacimiento.split('T')[0] : '';
            })
            .catch(error => {
                alert('No se pudo cargar el cliente');
                console.error(error);
            });

        document.querySelector('.form-editar-cliente form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                nombre: document.getElementById('nombre').value,
                apellido_paterno: document.getElementById('apellidoPaterno').value,
                apellido_materno: document.getElementById('apellidoMaterno').value,
                telefono: document.getElementById('telefono').value,
                correo: document.getElementById('correo').value,
                pais: document.getElementById('pais').value,
                estado: document.getElementById('estado').value,
                ciudad: document.getElementById('ciudad').value,
                cp: document.getElementById('codigoPostal').value,
                fecha_nacimiento: document.getElementById('fechaNacimiento').value
            };
            try {
                const response = await fetch(`http://localhost:3001/api/clientes/${idCliente}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Cambios guardados correctamente');
                    window.location.href = '/Dashboards/html/clientes.html'; // Redirige a la tabla de clientes
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
        document.querySelector('form').addEventListener('submit', function (e) {
            e.preventDefault(); // Evitar recargar la página

            // Obtener los datos del formulario
            let clienteData = {
                nombre: document.getElementById('nombre').value,
                apellido_paterno: document.getElementById('apellidoPaterno').value,
                apellido_materno: document.getElementById('apellidoMaterno').value,
                telefono: document.getElementById('telefono').value,
                correo: document.getElementById('correo').value,
                pais: document.getElementById('pais').value,
                estado: document.getElementById('estado').value,
                ciudad: document.getElementById('ciudad').value,
                cp: document.getElementById('codigoPostal').value,
                fecha_nacimiento: document.getElementById('fechaNacimiento').value
            };

            if (!clienteData.nombre || !clienteData.correo) {
                alert('Por favor, completa todos los campos obligatorios.');
                return;
            }

            console.log("Datos enviados:", clienteData);

            // Realizar la solicitud POST a la API de clientes
            fetch('http://localhost:3001/api/clientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 12345' 
                },
                body: JSON.stringify(clienteData)
            })
                .then(response => {
                    // Intentar parsear la respuesta JSON incluso si el código HTTP no es exitoso
                    return response.json().then(data => {
                        // Si el código HTTP no es exitoso, pero el backend indica éxito, no lanzar error
                        if (!response.ok && data.status !== 'success') {
                            throw new Error(data.message || 'Error desconocido en el servidor');
                        }
                        return data; // Retorna los datos si la respuesta es exitosa
                    });
                })
                .then(data => {
                     alert('Cliente agregado con éxito!');
                    window.location.href = '/Dashboards/html/clientes.html';
                })
                .catch(error => {
                    console.error('Error al realizar la solicitud:', error);
                    alert('Error al realizar la solicitud: ' + error.message);
                });
        });
    }
>>>>>>> 556a526 (Primer commit)
});
