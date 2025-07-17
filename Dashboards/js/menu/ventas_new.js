// ventas_new.js - Lógica para la página de ventas
let productos = [];
let productosDisponibles = [];
let clientes = [];
let modal;

// Cargar menú y datos iniciales
document.addEventListener("DOMContentLoaded", () => {
  fetch("/Dashboards/html/menu.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("menu-container").innerHTML = data;
    })
    .catch(error => console.error("Error al cargar el menú:", error));

  // Cargar productos y clientes
  cargarProductos();
  cargarClientes();

  // Inicializar modal
  modal = new bootstrap.Modal(document.getElementById('modalTicket'));
});

// Cargar productos disponibles
async function cargarProductos() {
  try {
    const response = await fetch('/api/productos');
    const data = await response.json();
    if (data.success) {
      productosDisponibles = data.data;
    }
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }
}

// Cargar clientes
async function cargarClientes() {
  try {
    const response = await fetch('/api/clientes');
    const data = await response.json();
    if (data.success) {
      clientes = data.data;
      const selectCliente = document.getElementById('cliente');
      clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id_cliente;
        option.textContent = `${cliente.nombre} ${cliente.apellido}`;
        selectCliente.appendChild(option);
      });
    }
  } catch (error) {
    console.error('Error al cargar clientes:', error);
  }
}

// Buscar producto
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('buscarProducto').addEventListener('input', function(e) {
    const termino = e.target.value.toLowerCase();
    if (termino.length > 2) {
      const productoEncontrado = productosDisponibles.find(p => 
        p.nombre_producto.toLowerCase().includes(termino) || 
        p.codigo_barra === termino
      );
      
      if (productoEncontrado) {
        document.getElementById('inputProducto').value = productoEncontrado.nombre_producto;
        document.getElementById('inputPrecio').value = productoEncontrado.precio_venta;
        document.getElementById('inputProducto').dataset.idProducto = productoEncontrado.id_producto;
      }
    }
  });

  // Calcular total de fila
  document.getElementById('inputCantidad').addEventListener('input', calcularTotal);

  // Calcular descuento
  document.getElementById('descuento').addEventListener('input', calcularResumen);

  // Guardar venta
  document.getElementById('btnGuardarVenta').addEventListener('click', guardarVenta);

  // Generar PDF
  document.getElementById('btnPDF').addEventListener('click', generarPDF);
});

function calcularTotal() {
  const cantidad = parseFloat(document.getElementById('inputCantidad').value) || 0;
  const precio = parseFloat(document.getElementById('inputPrecio').value) || 0;
  const total = cantidad * precio;
  document.getElementById('inputTotal').value = total.toFixed(2);
  calcularResumen();
}

// Agregar producto
function agregarProducto() {
  const producto = document.getElementById('inputProducto').value;
  const cantidad = document.getElementById('inputCantidad').value;
  const precio = document.getElementById('inputPrecio').value;
  const total = document.getElementById('inputTotal').value;
  const idProducto = document.getElementById('inputProducto').dataset.idProducto;

  if (!producto || !cantidad || !precio || !idProducto) {
    alert('Por favor complete todos los campos del producto');
    return;
  }

  productos.push({
    id_producto: idProducto,
    nombre_producto: producto,
    cantidad: parseInt(cantidad),
    precio_unitario: parseFloat(precio),
    subtotal_producto: parseFloat(total)
  });

  actualizarTabla();
  limpiarFormulario();
  calcularResumen();
}

// Actualizar tabla
function actualizarTabla() {
  const tbody = document.getElementById('tablaProductos');
  tbody.innerHTML = '';

  productos.forEach((producto, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${producto.nombre_producto}</td>
      <td>${producto.cantidad}</td>
      <td>${producto.precio_unitario.toFixed(2)}</td>
      <td>${producto.subtotal_producto.toFixed(2)}</td>
      <td>
        <button class="btn btn-danger" onclick="eliminarProducto(${index})">
          <i class="fas fa-trash-alt"></i> Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  // Agregar fila vacía para nuevo producto
  const filaVacia = document.createElement('tr');
  filaVacia.innerHTML = `
    <td><input type="text" class="form-control" id="inputProducto" readonly></td>
    <td><input type="number" class="form-control" id="inputCantidad" min="1"></td>
    <td><input type="text" class="form-control" id="inputPrecio" readonly></td>
    <td><input type="text" class="form-control" id="inputTotal" readonly></td>
    <td>
      <button class="btn btn-danger">
        <i class="fas fa-trash-alt"></i> Eliminar
      </button>
    </td>
  `;
  tbody.appendChild(filaVacia);

  // Reactivar eventos
  document.getElementById('inputCantidad').addEventListener('input', calcularTotal);
}

// Eliminar producto
function eliminarProducto(index) {
  productos.splice(index, 1);
  actualizarTabla();
  calcularResumen();
}

// Limpiar formulario
function limpiarFormulario() {
  document.getElementById('inputProducto').value = '';
  document.getElementById('inputCantidad').value = '';
  document.getElementById('inputPrecio').value = '';
  document.getElementById('inputTotal').value = '';
  document.getElementById('inputProducto').dataset.idProducto = '';
}

// Calcular resumen
function calcularResumen() {
  const subtotal = productos.reduce((sum, p) => sum + p.subtotal_producto, 0);
  const descuento = parseFloat(document.getElementById('descuento').value) || 0;
  const total = subtotal - descuento;

  document.getElementById('subtotal').value = subtotal.toFixed(2);
  document.getElementById('total').value = total.toFixed(2);
}

// Guardar venta
async function guardarVenta() {
  if (productos.length === 0) {
    alert('Debe agregar al menos un producto');
    return;
  }

  const ventaData = {
    id_cliente: document.getElementById('cliente').value || null,
    subtotal: parseFloat(document.getElementById('subtotal').value),
    descuento: parseFloat(document.getElementById('descuento').value) || 0,
    total: parseFloat(document.getElementById('total').value),
    metodo_pago: document.getElementById('metodo-pago').value,
    nota: document.getElementById('nota').value,
    productos: productos
  };

  try {
    const response = await fetch('/api/ventas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(ventaData)
    });

    const result = await response.json();
    
    if (result.success) {
      mostrarTicket(ventaData);
      // Limpiar formulario después de guardar
      productos = [];
      actualizarTabla();
      document.getElementById('cliente').value = '';
      document.getElementById('descuento').value = '';
      document.getElementById('nota').value = '';
      calcularResumen();
    } else {
      alert('Error al guardar la venta: ' + result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    // Para pruebas, mostrar el ticket sin guardar
    mostrarTicket(ventaData);
  }
}

// Mostrar ticket
function mostrarTicket(ventaData) {
  const clienteSeleccionado = clientes.find(c => c.id_cliente == ventaData.id_cliente);
  const fecha = new Date().toLocaleDateString();

  // Llenar datos del ticket
  document.getElementById('ticketCliente').textContent = 
    clienteSeleccionado ? `${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}` : 'Cliente general';
  document.getElementById('ticketFecha').textContent = fecha;
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const nombreEmpleado = usuario ? usuario.nombre_usuario : 'Empleado';
  document.getElementById('ticketEmpleado').textContent = nombreEmpleado;

  // Productos
  const productosHtml = productos.map(p => 
    `<div>${p.nombre_producto} - Cant: ${p.cantidad} - ${p.precio_unitario.toFixed(2)} = ${p.subtotal_producto.toFixed(2)}</div>`
  ).join('');
  document.getElementById('ticketProductos').innerHTML = productosHtml;

  document.getElementById('ticketSubtotal').textContent = `${ventaData.subtotal.toFixed(2)}`;
  document.getElementById('ticketDescuento').textContent = `${ventaData.descuento.toFixed(2)}`;
  document.getElementById('ticketPago').textContent = ventaData.metodo_pago;
  document.getElementById('ticketNota').textContent = ventaData.nota || 'Sin nota';
  document.getElementById('ticketTotal').textContent = `${ventaData.total.toFixed(2)}`;

  modal.show();
}

// Generar PDF
function generarPDF() {
  const element = document.getElementById('ticketContent');
  const opt = {
    margin: 0.3,
    filename: 'ticket_venta.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save();
}
