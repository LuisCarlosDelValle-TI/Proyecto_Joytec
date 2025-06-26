async function cargarProveedores() {
    try {
        const response = await fetch('http://localhost:3002/api/proveedores'); // Cambia la URL si es necesario
        if (response.ok) {
            const proveedores = await response.json();
            console.log('Proveedores recibidos:', proveedores); // Verificar los datos recibidos
            const tabla = document.querySelector('table tbody');
            tabla.innerHTML = ''; // Limpiar la tabla antes de agregar los datos

            proveedores.forEach(proveedor => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${proveedor.id_proveedor}</td>
                    <td>${proveedor.razon_social}</td>
                    <td>${proveedor.telefono}</td>
                    <td>${proveedor.pais}</td>
                    <td>${proveedor.estado}</td>
                    <td>${proveedor.ciudad}</td>
                    <td>${proveedor.cp}</td>
                    <td>${proveedor.tipo_proveedor}</td>
                    <td>
                        <div class="operaciones">
                            <a href="editar-proveedor.html?id=${proveedor.id_proveedor}">
                                <button class="btn btn-link p-0 me-2">
                                    <i class="fa fa-eye icono-operacion"></i>
                                </button>
                            </a>
                            <button class="btn btn-link p-0" onclick="confirmarEliminacion(${proveedor.id_proveedor})">
                                <i class="fa fa-trash icono-operacion"></i>
                            </button>
                        </div>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        } else {
            console.error('Error al cargar los proveedores:', await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }
}

// Función para confirmar la eliminación de un proveedor
function confirmarEliminacion(idProveedor) {
    // Crear un cuadro de diálogo personalizado
    const confirmacion = document.createElement('div');
    confirmacion.classList.add('confirmacion-dialogo');
    confirmacion.innerHTML = `
        <div class="confirmacion-contenido">
            <p>¿Estás seguro de que deseas eliminar el proveedor con ID <strong>${idProveedor}</strong>?</p>
            <div class="botones-confirmacion">
                <button class="btn btn-danger" onclick="eliminarProveedor(${idProveedor})">Sí</button>
                <button class="btn btn-secondary" onclick="cerrarConfirmacion()">No</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmacion);
}

// Función para cerrar el cuadro de confirmación
function cerrarConfirmacion() {
    const confirmacion = document.querySelector('.confirmacion-dialogo');
    if (confirmacion) {
        confirmacion.remove();
    }
}

// Función para eliminar un proveedor
async function eliminarProveedor(idProveedor) {
    try {
        const response = await fetch(`http://localhost:3001/api/proveedores/${idProveedor}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Proveedor eliminado con éxito');
            cerrarConfirmacion(); // Cerrar el cuadro de confirmación
            cargarProveedores(); // Recargar la tabla
        } else {
            const error = await response.json();
            alert('Error al eliminar el proveedor: ' + error.message);
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('Hubo un problema al conectar con el servidor');
    }
}

// Cargar los proveedores al cargar la página
document.addEventListener('DOMContentLoaded', cargarProveedores);
