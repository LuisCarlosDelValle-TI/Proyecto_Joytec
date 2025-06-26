// Función para cargar las categorías desde la API
async function cargarCategorias() {
    try {
        const response = await fetch('http://localhost:3002/api/categorias'); // Cambia la URL si es necesario
        if (response.ok) {
            const categorias = await response.json();
            console.log('Categorías recibidas:', categorias); // Depuración

            const tabla = document.querySelector('table tbody');
            tabla.innerHTML = ''; // Limpiar la tabla antes de agregar los datos

            categorias.forEach(categoria => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${categoria.id_categoria}</td>
                    <td>${categoria.nombre_categoria}</td>
                    <td>
                        <div class="operaciones">
                            <a href="editar-categoria.html?id=${categoria.id_categoria}">
                                <button class="btn btn-link p-0 me-2">
                                    <i class="fa fa-eye icono-operacion"></i>
                                </button>
                            </a>
                            <button class="btn btn-link p-0" onclick="confirmarEliminacionCategoria(${categoria.id_categoria}, '${categoria.nombre_categoria}')">
                                <i class="fa fa-trash icono-operacion"></i>
                            </button>
                        </div>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        } else {
            console.error('Error al cargar las categorías:', await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }
}

// Función para confirmar la eliminación de una categoría
function confirmarEliminacionCategoria(idCategoria, nombreCategoria) {
    // Crear un cuadro de diálogo personalizado
    const confirmacion = document.createElement('div');
    confirmacion.classList.add('confirmacion-dialogo');
    confirmacion.innerHTML = `
        <div class="confirmacion-contenido">
            <p>¿Estás seguro de que deseas eliminar la categoría <strong>${nombreCategoria}</strong>?</p>
            <div class="botones-confirmacion">
                <button class="btn btn-danger" onclick="eliminarCategoria(${idCategoria})">Sí</button>
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

// Función para eliminar una categoría
async function eliminarCategoria(idCategoria) {
    try {
        const response = await fetch(`http://localhost:3001/api/categorias/${idCategoria}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Categoría eliminada con éxito');
            cerrarConfirmacion(); // Cerrar el cuadro de confirmación
            cargarCategorias(); // Recargar la tabla
        } else {
            alert('Error al eliminar la categoría');
            console.error(await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }
}

// Cargar las categorías al cargar la página
document.addEventListener('DOMContentLoaded', cargarCategorias);