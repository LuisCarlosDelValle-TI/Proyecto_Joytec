const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const EmpleadosController = require('../controllers/empleados/empleados.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken } = require('../middleware/auth');

router.use(cors());

// Validaciones para empleados
const validacionesEmpleado = [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido_paterno').notEmpty().withMessage('El apellido paterno es obligatorio'),
  body('apellido_materno').notEmpty().withMessage('El apellido materno es obligatorio'),
  body('correo').isEmail().withMessage('Debe proporcionar un correo válido'),
  body('telefono').matches(/^[0-9]{10}$/).withMessage('El teléfono debe tener 10 dígitos'),
  body('puesto').notEmpty().withMessage('El puesto es obligatorio'),
  body('fecha_contratacion').isDate().withMessage('La fecha de contratación debe ser válida'),
  body('salario').isFloat({ min: 0 }).withMessage('El salario debe ser un número positivo')
];

// Rutas de empleados
router.get('/', verificarToken, EmpleadosController.listarEmpleados);
router.get('/:id', verificarToken, EmpleadosController.obtenerEmpleado);
router.post('/', [verificarToken, ...validacionesEmpleado, validarCampos], EmpleadosController.crearEmpleado);
router.put('/:id', [verificarToken, ...validacionesEmpleado, validarCampos], EmpleadosController.actualizarEmpleado);
router.delete('/:id', verificarToken, EmpleadosController.eliminarEmpleado);

module.exports = router;