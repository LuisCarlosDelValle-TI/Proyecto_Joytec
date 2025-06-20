const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const ProductosController = require('../controllers/productos/producto.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(cors());

// Validaciones para productos
const validacionesProducto = [
  body('nombre_producto').notEmpty().withMessage('El nombre del producto es obligatorio'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('id_categoria').isInt().withMessage('La categoría es obligatoria')
];

// Middleware para verificar roles autorizados
const esAutorizado = verificarRol(['admin', 'empleado']);

// Rutas públicas
router.get('/', verificarToken, ProductosController.listarProductos);
router.get('/:id', ProductosController.buscarPorId);
router.get('/categoria/:categoriaId', ProductosController.buscarPorCategoria);

// Rutas protegidas
router.post('/', [verificarToken, ...validacionesProducto, validarCampos], ProductosController.crearProducto);
router.put('/:id', [verificarToken, ...validacionesProducto, validarCampos], ProductosController.actualizarProducto);
router.delete('/:id', verificarToken, ProductosController.eliminarProducto);
router.patch('/:id/stock', verificarToken, ProductosController.actualizarStock);

// Rutas adicionales
router.get('/buscar/nombre/:nombre', ProductosController.buscarPorNombre);
router.get('/stock/bajo', [verificarToken, esAutorizado], ProductosController.obtenerProductosStockBajo);
router.post('/:id/ajuste-stock', 
  [verificarToken, esAutorizado,
    body('cantidad').isInt().withMessage('La cantidad debe ser un número entero'),
    body('tipo').isIn(['incremento', 'decremento']).withMessage('El tipo debe ser incremento o decremento'),
    validarCampos
  ], 
  ProductosController.ajustarStock
);

module.exports = router;