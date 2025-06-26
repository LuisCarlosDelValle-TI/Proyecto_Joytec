// Función para cargar los productos desde la API
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:3002/api/productos');
        if (response.ok) {
            const productos = await response.json();
            console.log('Productos recibidos:', productos);
            const tabla = document.getElementById('productosTable').querySelector('tbody');
            tabla.innerHTML = ''; // Limpiar la tabla antes de agregar los datos

            productos.forEach(producto => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td>${producto.nombre || 'Sin nombre'}</td>
                    <td>${producto.nombre_material || 'Sin material'}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.stock_minimo}</td>
                    <td>${producto.existencias}</td>
                    <td>${producto.nombre_categoria || 'Sin categoría'}</td>
                    <td>
                        <div class="operaciones">
                            <a href="editar-producto.html?id=${producto.id_producto}">
                                <button class="btn btn-link p-0 me-2"><i class="fa fa-eye icono-operacion"></i></button>
                            </a>
                            <button class="btn btn-link p-0" onclick="confirmarEliminacion(${producto.id_producto}, '${producto.nombre}')">
                                <i class="fa fa-trash icono-operacion"></i>
                            </button>
                        </div>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        } else {
            console.error('Error al cargar los productos:', await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }
}

// Función para confirmar la eliminación de un producto
function confirmarEliminacion(idProducto, nombreProducto) {
    // Crear un cuadro de diálogo personalizado
    const confirmacion = document.createElement('div');
    confirmacion.classList.add('confirmacion-dialogo');
    confirmacion.innerHTML = `
        <div class="confirmacion-contenido">
            <p>¿Estás seguro de que deseas eliminar el producto <strong>${nombreProducto}</strong>?</p>
            <div class="botones-confirmacion">
                <button class="btn btn-danger" onclick="eliminarProducto(${idProducto})">Sí</button>
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

// Función para eliminar un producto
async function eliminarProducto(idProducto) {
    try {
        const response = await fetch(`http://localhost:3001/api/productos/${idProducto}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Producto eliminado con éxito');
            cerrarConfirmacion(); // Cerrar el cuadro de confirmación
            cargarProductos(); // Recargar la tabla
        } else {
            alert('Error al eliminar el producto');
            console.error(await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }
}

// Cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);

document.addEventListener("DOMContentLoaded", () => {
    const elemento = document.getElementById("productosTable");
    if (elemento) {
        const subElemento = elemento.querySelector('tbody');
        console.log('Elemento encontrado:', subElemento);
    } else {
        console.warn("El elemento con ID 'productosTable' no existe en esta página.");
    }
});

fetch('/api/productos')
    .then(response => response.json())
    .then(data => {
        // Código para renderizar la tabla
    })
    .catch(error => console.error('Error al cargar los productos:', error));