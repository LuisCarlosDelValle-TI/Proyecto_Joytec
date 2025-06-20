const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const CompraController = require('../controllers/compras/compra.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(cors());

// Validaciones para compras
const validacionesCompra = [
    body('total').isFloat({ min: 0 }).withMessage('El total debe ser un número positivo'),
    body('descuento').isFloat({ min: 0 }).withMessage('El descuento debe ser un número positivo'),
    body('subtotal').isFloat({ min: 0 }).withMessage('El subtotal debe ser un número positivo'),
    body('id_proveedor').isInt({ min: 1 }).withMessage('El proveedor es obligatorio'),
    body('id_empleado').isInt({ min: 1 }).withMessage('El empleado es obligatorio'),
    body('id_metodo_pago').isInt({ min: 1 }).withMessage('El método de pago es obligatorio'),
    body('detalles').isArray({ min: 1 }).withMessage('Debe incluir al menos un detalle de compra'),
    body('detalles.*.id_producto').isInt({ min: 1 }).withMessage('ID de producto inválido'),
    body('detalles.*.cantidad').isInt({ min: 1 }).withMessage('La cantidad debe ser mayor a 0'),
    body('detalles.*.costo_unitario').isFloat({ min: 0 }).withMessage('El costo unitario debe ser positivo'),
    body('detalles.*.subtotal_producto').isFloat({ min: 0 }).withMessage('El subtotal del producto debe ser positivo')
];

// Middleware para verificar roles autorizados
const esAutorizado = verificarRol(['admin']);

// Rutas CRUD básicas
router.get('/', [verificarToken, esAutorizado], CompraController.listarCompras);
router.get('/:id', [verificarToken, esAutorizado], CompraController.obtenerCompra);
router.post('/', [verificarToken, esAutorizado, ...validacionesCompra, validarCampos], CompraController.crearCompra);
router.put('/:id', [verificarToken, esAutorizado, ...validacionesCompra, validarCampos], CompraController.actualizarCompra);
router.delete('/:id', [verificarToken, esAutorizado], CompraController.eliminarCompra);

// Rutas adicionales
router.get('/proveedor/:idProveedor', [verificarToken, esAutorizado], CompraController.comprasPorProveedor);
router.get('/empleado/:idEmpleado', [verificarToken, esAutorizado], CompraController.comprasPorEmpleado);
router.get('/fecha/:inicio/:fin', [verificarToken, esAutorizado], CompraController.comprasPorRangoFecha);
router.get('/estadisticas/mensual', [verificarToken, esAutorizado], CompraController.estadisticasMensuales);
router.get('/producto/:idProducto/historial', [verificarToken, esAutorizado], CompraController.historialComprasProducto);

module.exports = router;