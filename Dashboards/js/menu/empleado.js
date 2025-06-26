// Función para cargar los empleados desde la API
async function cargarEmpleados() {
    try {
        const response = await fetch('http://localhost:3002/api/empleados'); // Cambia la URL si es necesario
        if (response.ok) {
            const empleados = await response.json();
            console.log('Empleados recibidos:', empleados); // Depuración

            const tabla = document.querySelector('table tbody');
            tabla.innerHTML = ''; // Limpiar la tabla antes de agregar los datos

            empleados.forEach(empleado => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${empleado.nombre}</td>
                    <td>${empleado.apellido_paterno}</td>
                    <td>${empleado.apellido_materno}</td>
                    <td>${empleado.telefono}</td>
                    <td>${empleado.salario}</td>
                    <td>
                        <div class="operaciones">
                            <a href="editar-empleado.html?id=${empleado.id_empleado}">
                                    <button class="btn btn-link p-0 me-2"><i class="fa fa-eye icono-operacion"></i></button>
                            </a>
                            <button class="btn btn-link p-0" onclick="confirmarEliminacionEmpleado(${empleado.id_empleado}, '${empleado.nombre}')">
                                <i class="fa fa-trash icono-operacion"></i>
                            </button>
                        </div>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        } else {
            console.error('Error al cargar los empleados:', await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }
}

// Función para confirmar la eliminación de un empleado
function confirmarEliminacionEmpleado(idEmpleado, nombreEmpleado) {
    // Crear un cuadro de diálogo personalizado
    const confirmacion = document.createElement('div');
    confirmacion.classList.add('confirmacion-dialogo');
    confirmacion.innerHTML = `
        <div class="confirmacion-contenido">
            <p>¿Estás seguro de que deseas eliminar al empleado <strong>${nombreEmpleado}</strong>?</p>
            <div class="botones-confirmacion">
                <button class="btn btn-danger" onclick="eliminarEmpleado(${idEmpleado})">Sí</button>
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

// Función para eliminar un empleado
async function eliminarEmpleado(idEmpleado) {
    try {
        const response = await fetch(`http://localhost:3001/api/empleados/${idEmpleado}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Empleado eliminado con éxito');
            cerrarConfirmacion(); // Cerrar el cuadro de confirmación
            cargarEmpleados(); // Recargar la tabla
        } else {
            alert('Error al eliminar el empleado');
            console.error(await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }
}

// Cargar los empleados al cargar la página
document.addEventListener('DOMContentLoaded', cargarEmpleados);