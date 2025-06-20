const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const ProveedorController = require('../controllers/proveedores/proveedor.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(cors());

// Validaciones para proveedores
const validacionesProveedor = [
  body('razon_social').notEmpty().withMessage('La razón social es obligatoria'),
  body('telefono').matches(/^[0-9]{10}$/).withMessage('El teléfono debe tener 10 dígitos'),
  body('pais').notEmpty().withMessage('El país es obligatorio'),
  body('estado').notEmpty().withMessage('El estado es obligatorio'),
  body('ciudad').notEmpty().withMessage('La ciudad es obligatoria'),
  body('cp').matches(/^[0-9]{5}$/).withMessage('El código postal debe tener 5 dígitos'),
  body('tipo_proveedor').isIn(['nacional', 'internacional']).withMessage('El tipo de proveedor debe ser nacional o internacional')
];

// Middleware para verificar roles autorizados
const esAutorizado = verificarRol(['admin']);

// Rutas de proveedores
router.get('/', verificarToken, ProveedorController.getAllProveedores);
router.get('/:id', verificarToken, ProveedorController.getProveedorById);
router.post('/', [verificarToken, esAutorizado, ...validacionesProveedor, validarCampos], ProveedorController.createProveedor);
router.put('/:id', [verificarToken, esAutorizado, ...validacionesProveedor, validarCampos], ProveedorController.updateProveedor);
router.delete('/:id', verificarToken, ProveedorController.deleteProveedor);

// Rutas adicionales
router.get('/buscar/razon-social/:razonSocial', [verificarToken, esAutorizado], ProveedorController.buscarPorRazonSocial);
router.get('/tipo/:tipoProveedor', [verificarToken, esAutorizado], ProveedorController.buscarPorTipo);
router.get('/:id/compras', [verificarToken, esAutorizado], ProveedorController.obtenerComprasProveedor);
router.get('/estadisticas/compras', [verificarToken, esAutorizado], ProveedorController.obtenerEstadisticasCompras);

module.exports = router;