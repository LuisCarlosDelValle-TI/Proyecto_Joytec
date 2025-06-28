document.addEventListener("DOMContentLoaded", () => {
    fetch("/Dashboards/html/menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    // Cargar categorías
    cargarCategorias();

    const params = new URLSearchParams(window.location.search);
    const idProducto = params.get('id');

    if (idProducto) {
        // --- SOLO EDICIÓN ---
        fetch(`http://localhost:3001/api/productos/${idProducto}`)
            .then(res => res.json())
            .then(producto => {
                document.getElementById('nombre').value = producto.nombre || '';
                document.getElementById('nombreMaterial').value = producto.nombre_material || '';
                document.getElementById('precio').value = producto.precio || '';
                document.getElementById('stockMinimo').value = producto.stock_minimo || '';
                document.getElementById('existencias').value = producto.existencias || '';
                document.getElementById('categoria').value = producto.id_categoria || '';
            })
            .catch(error => {
                alert('No se pudo cargar el producto');
                console.error(error);
            });

        document.querySelector('.form-editar-producto form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                nombre: document.getElementById('nombre').value,
                nombre_material: document.getElementById('nombreMaterial').value,
                precio: parseFloat(document.getElementById('precio').value),
                stock_minimo: parseInt(document.getElementById('stockMinimo').value),
                existencias: parseInt(document.getElementById('existencias').value),
                id_categoria: parseInt(document.getElementById('categoria').value)
            };
            try {
                const response = await fetch(`http://localhost:3001/api/productos/${idProducto}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Cambios guardados correctamente');
                    window.location.href = '/Dashboards/html/productos.html';
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
        document.getElementById('productoForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(event.target);
            const data = {
                nombre: formData.get('nombre'),
                material: parseInt(formData.get('material')),
                precio: parseFloat(formData.get('precio')),
                stock_minimo: parseInt(formData.get('stock_minimo')),
                existencias: parseInt(formData.get('existencias')),
                id_categoria: parseInt(formData.get('categoria'))
            };

            try {
                const response = await fetch('http://localhost:3001/api/productos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Producto registrado con éxito');
                    console.log(result);
                } else {
                    alert('Error al registrar el producto');
                    console.error(await response.text());
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al conectar con la API');
            }
        });
    }
});

// Función para cargar las categorías desde la API
async function cargarCategorias() {
    try {
        const response = await fetch('http://localhost:3001/api/categorias');
        if (response.ok) {
            const categorias = await response.json();
            const selectCategoria = document.getElementById('categoria');

            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id_categoria;
                option.textContent = categoria.nombre_categoria;
                selectCategoria.appendChild(option);
            });
        } else {
            console.error('Error al cargar las categorías:', await response.text());
        }
    } catch (error) {
        console.error('Error al conectar con la API de categorías:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarCategorias);
