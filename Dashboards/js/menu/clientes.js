document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3001/api/clientes';
    console.log('URL usada para clientes:', apiUrl);
    const tabla = document.querySelector('.table tbody');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los clientes');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            data.forEach((cliente, index) => {
                const fila = document.createElement('tr');

                const fechaNacimiento = new Date(cliente.fecha_nacimiento);
                const fechaFormateada = fechaNacimiento.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                fila.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${cliente.nombre}</td>
                    <td>${cliente.apellido_paterno}</td>
                    <td>${cliente.apellido_materno}</td>
                    <td>${cliente.telefono}</td>
                    <td>${cliente.correo}</td>
                    <td>${cliente.pais}</td>
                    <td>${cliente.estado}</td>
                    <td>${cliente.ciudad}</td>
                    <td>${cliente.cp}</td>
                    <td>${fechaFormateada}</td>
                    <td>
                        <div class="d-flex justify-content-center">
                            <button class="btn btn-link p-0 me-2" onclick="verCliente(${cliente.id_cliente})">
                                <i class="fas fa-eye"></i> <!-- Ícono de "ver" -->
                            </button>
                            <button class="btn btn-link p-0" onclick="eliminarCliente(${cliente.id_cliente})">
                                <i class="fas fa-trash"></i> <!-- Ícono de "eliminar" -->
                            </button>
                        </div>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar los clientes:', error);
            alert('No se pudieron cargar los clientes: ' + error.message);
        });
});

function verCliente(idCliente) {
    // Redirigir a la página de edición del cliente

    window.location.href = `/Dashboards/html/ediciones/clientes.html?id=${idCliente}`;
}

function eliminarCliente(idCliente) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        const apiUrl = 'http://localhost:3001/api/clientes';
        fetch(`${apiUrl}/${idCliente}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el cliente');
                }
                return response.json();
            })
            .then(data => {
                alert('Cliente eliminado exitosamente');
                location.reload(); // Recargar la página para actualizar la tabla
            })
            .catch(error => {
                console.error('Error al eliminar el cliente:', error);
                alert('No se pudo eliminar el cliente: ' + error.message);
            });
    }
}