document.addEventListener("DOMContentLoaded", () => {
    fetch("/Dashboards/html/menu.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("menu-container").innerHTML = data;
        })
        .catch(error => console.error("Error al cargar el menú:", error));

    const params = new URLSearchParams(window.location.search);
    const idProveedor = params.get('id');

    if (idProveedor) {
        // --- SOLO EDICIÓN ---
        fetch(`http://localhost:3001/api/proveedores/${idProveedor}`)
            .then(res => res.json())
            .then(proveedor => {
                document.getElementById('razonSocial').value = proveedor.razon_social || '';
                document.getElementById('telefono').value = proveedor.telefono || '';
                document.getElementById('pais').value = proveedor.pais || '';
                document.getElementById('estado').value = proveedor.estado || '';
                document.getElementById('ciudad').value = proveedor.ciudad || '';
                document.getElementById('codigoPostal').value = proveedor.cp || '';
                document.getElementById('tipoProveedor').value = proveedor.tipo_proveedor || '';
            })
            .catch(error => {
                alert('No se pudo cargar el proveedor');
                console.error(error);
            });

        document.querySelector('.form-editar-proveedor form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                razon_social: document.getElementById('razonSocial').value,
                telefono: document.getElementById('telefono').value,
                pais: document.getElementById('pais').value,
                estado: document.getElementById('estado').value,
                ciudad: document.getElementById('ciudad').value,
                cp: document.getElementById('codigoPostal').value,
                tipo_proveedor: document.getElementById('tipoProveedor').value
            };
            try {
                const response = await fetch(`http://localhost:3001/api/proveedores/${idProveedor}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Cambios guardados correctamente');
                    window.location.href = '/Dashboards/html/proveedores.html';
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
        const formulario = document.getElementById('registroProveedorForm');
        if (formulario) {
            formulario.addEventListener('submit', async (event) => {
                event.preventDefault();

                const datosProveedor = {
                    razon_social: document.getElementById('razon-social').value,
                    telefono: document.getElementById('contacto').value,
                    pais: document.getElementById('pais').value,
                    estado: document.getElementById('estado').value,
                    ciudad: document.getElementById('ciudad').value,
                    cp: document.getElementById('cp').value,
                    tipo_proveedor: document.getElementById('tipo-proveedor').value
                };

                try {
                    const response = await fetch('http://localhost:3001/api/proveedores', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(datosProveedor)
                    });

                    if (response.ok) {
                        alert('Proveedor registrado con éxito');
                        window.location.href = 'proveedores.html';
                    } else {
                        const error = await response.json();
                        alert('Error al registrar el proveedor: ' + error.message);
                    }
                } catch (error) {
                    console.error('Error al conectar con la API:', error);
                    alert('Hubo un problema al conectar con el servidor');
                }
            });
        }
    }
});
