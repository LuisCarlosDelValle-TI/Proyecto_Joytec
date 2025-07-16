const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const VentaController = require('../controllers/ventas/venta.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(cors());

// Validaciones para ventas
const validacionesVenta = [
    body('subtotal').isFloat({ min: 0 }).withMessage('El subtotal debe ser un número positivo'),
    body('descuento').optional().isFloat({ min: 0 }).withMessage('El descuento debe ser un número positivo'),
    body('total').isFloat({ min: 0 }).withMessage('El total debe ser un número positivo'),
    body('id_cliente').optional().isInt({ min: 1 }).withMessage('ID de cliente inválido'),
    body('metodo_pago').isIn(['efectivo', 'tarjeta', 'transferencia']).withMessage('Método de pago inválido'),
    body('productos').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto en la venta'),
    body('productos.*.id_producto').isInt({ min: 1 }).withMessage('ID de producto inválido'),
    body('productos.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
    body('productos.*.precio_unitario').isFloat({ min: 0 }).withMessage('El precio unitario debe ser positivo'),
    body('productos.*.subtotal_producto').isFloat({ min: 0 }).withMessage('El subtotal del producto debe ser positivo')
];

// Middleware para verificar roles autorizados
const esAutorizado = verificarRol(['admin', 'empleado']);

// Rutas CRUD básicas
router.get('/', [verificarToken, esAutorizado], VentaController.listarVentas);
router.get('/:id', [verificarToken, esAutorizado], VentaController.obtenerVenta);
router.post('/', [verificarToken, esAutorizado, ...validacionesVenta, validarCampos], VentaController.crearVenta);
router.put('/:id', [verificarToken, esAutorizado, ...validacionesVenta, validarCampos], VentaController.actualizarVenta);
router.delete('/:id', [verificarToken, verificarRol(['admin'])], VentaController.eliminarVenta);

// Rutas adicionales
router.get('/cliente/:idCliente', [verificarToken, esAutorizado], VentaController.ventasPorCliente);
router.get('/empleado/:idEmpleado', [verificarToken, esAutorizado], VentaController.ventasPorEmpleado);
router.get('/fecha/:inicio/:fin', [verificarToken, esAutorizado], VentaController.ventasPorRangoFecha);
router.get('/estadisticas/mensual', [verificarToken, esAutorizado], VentaController.estadisticasMensuales);
router.get('/producto/:idProducto/historial', [verificarToken, esAutorizado], VentaController.historialVentasProducto);

module.exports = router;
