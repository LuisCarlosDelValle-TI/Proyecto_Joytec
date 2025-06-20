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
        const response = await fetch('http://localhost:3001/api/categorias', { // Cambia la URL si es necesario
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
