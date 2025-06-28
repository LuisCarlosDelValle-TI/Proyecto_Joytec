document.addEventListener("DOMContentLoaded", () => {
    fetch("/Dashboards/html/menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    const params = new URLSearchParams(window.location.search);
    const idCategoria = params.get('id');

    if (idCategoria) {
        // --- SOLO EDICIÓN ---
        fetch(`http://localhost:3001/api/categorias/${idCategoria}`)
            .then(res => res.json())
            .then(categoria => {
                document.getElementById('nombreCategoria').value = categoria.nombre_categoria || '';
            })
            .catch(error => {
                alert('No se pudo cargar la categoría');
                console.error(error);
            });

        document.querySelector('.form-editar-categoria form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                nombre_categoria: document.getElementById('nombreCategoria').value
            };
            try {
                const response = await fetch(`http://localhost:3001/api/categorias/${idCategoria}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Cambios guardados correctamente');
                    window.location.href = '/Dashboards/html/categorias.html';
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
            event.preventDefault(); // Evitar que el formulario recargue la página

            // Capturar el valor del campo de la categoría
            const nombreCategoria = document.getElementById('nombre-categoria').value;

            // Validar que el campo no esté vacío
            if (!nombreCategoria.trim()) {
                alert('El nombre de la categoría es obligatorio.');
                return;
            }

            try {
                // Enviar los datos a la API
                const response = await fetch('http://localhost:3001/api/categorias', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre_categoria: nombreCategoria })
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Categoría registrada exitosamente');
                    console.log('Categoría registrada:', data);
                    document.getElementById('nombre-categoria').value = ''; // Limpiar el campo
                } else {
                    const error = await response.json();
                    if (error.message === 'La categoría ya existe') {
                        alert('Error: La categoría ya existe.');
                    } else {
                        alert('Error al registrar la categoría: ' + error.message);
                    }
                }
            } catch (error) {
                console.error('Error al conectar con la API:', error);
                alert('Hubo un problema al conectar con el servidor.');
            }
        });
    }
});
