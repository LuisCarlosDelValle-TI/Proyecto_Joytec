const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const ClientesController = require('../controllers/clientes/cliente.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken } = require('../middleware/auth');

router.use(cors());

// Validaciones para clientes
const validacionesCliente = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido_paterno').notEmpty().withMessage('El apellido paterno es obligatorio'),
  body('apellido_materno').notEmpty().withMessage('El apellido materno es obligatorio'),
  body('telefono').matches(/^[0-9]{10}$/).withMessage('El teléfono debe tener 10 dígitos'),
  body('correo').isEmail().withMessage('Debe proporcionar un correo válido'),
  body('pais').notEmpty().withMessage('El país es obligatorio'),
  body('estado').notEmpty().withMessage('El estado es obligatorio'),
  body('ciudad').notEmpty().withMessage('La ciudad es obligatoria'),
  body('cp').matches(/^[0-9]{5}$/).withMessage('El código postal debe tener 5 dígitos'),
  body('fecha_nacimiento').isDate().withMessage('La fecha de nacimiento debe ser válida')
];

// Rutas de clientes
router.get('/', verificarToken, ClientesController.listarClientes);
router.get('/:id', verificarToken, ClientesController.obtenerCliente);
router.post('/', [verificarToken, ...validacionesCliente, validarCampos], ClientesController.crearCliente);
router.put('/:id', [verificarToken, ...validacionesCliente, validarCampos], ClientesController.actualizarCliente);
router.delete('/:id', verificarToken, ClientesController.eliminarCliente);

module.exports = router;