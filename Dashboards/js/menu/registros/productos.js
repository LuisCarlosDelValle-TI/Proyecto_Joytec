document.getElementById('productoForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita que el formulario recargue la página

    // Capturar los datos del formulario
    const formData = new FormData(event.target);
    const data = {
        nombre: formData.get('nombre'),
        material: parseInt(formData.get('material')), // Ahora envía el ID del material
        precio: parseFloat(formData.get('precio')),
        stock_minimo: parseInt(formData.get('stock_minimo')),
        existencias: parseInt(formData.get('existencias')),
        id_categoria: parseInt(formData.get('categoria'))
    };

    try {
        // Enviar los datos a la API
        const response = await fetch('http://localhost:3001/api/productos', { // Cambia la URL si tu API está en otro puerto o dominio
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

// Función para cargar las categorías desde la API
async function cargarCategorias() {
    try {
        const response = await fetch('http://localhost:3001/api/categorias'); // Cambia la URL si es necesario
        if (response.ok) {
            const categorias = await response.json();
            const selectCategoria = document.getElementById('categoria');

            // Agregar las categorías al select
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
        console.error('Error al conectar con la API:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarCategorias);
