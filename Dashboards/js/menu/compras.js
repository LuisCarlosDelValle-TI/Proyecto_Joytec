document.querySelector('.btn-success').addEventListener('click', async () => {
    // Obtener los datos del formulario
    const idProveedor = 1; // Cambia esto según el proveedor seleccionado
    const idEmpleado = 1; // Cambia esto según el empleado actual
    const idMetodoPago = document.getElementById('metodo-pago').value;
    const subtotal = parseFloat(document.getElementById('subtotal').value) || 0;
    const descuento = parseFloat(document.getElementById('descuento').value) || 0;
    const total = parseFloat(document.getElementById('total').value) || 0;

    // Obtener los detalles de la compra de la tabla
    const detalles = [];
    document.querySelectorAll('table tbody tr').forEach(row => {
        const idProducto = row.querySelector('input[type="text"]').value;
        const cantidad = parseInt(row.querySelector('input[type="number"]').value) || 0;
        const costoUnitario = parseFloat(row.querySelector('input[type="text"]').value) || 0;
        const subtotalProducto = cantidad * costoUnitario;

        if (idProducto && cantidad > 0 && costoUnitario > 0) {
            detalles.push({ id_producto: idProducto, cantidad, costo_unitario: costoUnitario, subtotal_producto: subtotalProducto });
        }
    });

    // Validar que los datos sean correctos
    if (!idMetodoPago || detalles.length === 0) {
        alert('Por favor, completa todos los campos y agrega al menos un producto.');
        return;
    }

    try {
        // Enviar los datos al backend
        const response = await fetch('http://localhost:3001/api/compras', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ total, descuento, subtotal, id_proveedor: idProveedor, id_empleado: idEmpleado, id_metodo_pago: idMetodoPago, detalles })
        });

        if (response.ok) {
            const data = await response.json();
            mostrarNota(data.id_compra, detalles); // Mostrar la nota con los detalles de la compra
        } else {
            const error = await response.json();
            alert('Error al registrar la compra: ' + error.message);
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
});

// Función para mostrar la nota con los detalles de la compra
function mostrarNota(idCompra, detalles) {
    const nota = document.createElement('div');
    nota.classList.add('nota-compra');
    nota.innerHTML = `
        <div class="nota-contenido">
            <h4>Compra registrada exitosamente</h4>
            <p>ID de la compra: ${idCompra}</p>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Costo Unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${detalles.map(detalle => `
                        <tr>
                            <td>${detalle.id_producto}</td>
                            <td>${detalle.cantidad}</td>
                            <td>${detalle.costo_unitario}</td>
                            <td>${detalle.subtotal_producto}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <button class="btn btn-secondary" onclick="cerrarNota()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(nota);
}

// Función para cerrar la nota
function cerrarNota() {
    const nota = document.querySelector('.nota-compra');
    if (nota) {
        nota.remove();
    }
}
