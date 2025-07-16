const express = require('express');
const { body } = require('express-validator');
const { registrar, login, logout, verificarAutenticacion, refreshToken } = require('../controllers/auth/auth.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken } = require('../middleware/auth');

const router = express.Router();

// Validaciones para el registro
const validacionesRegistro = [
  body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('contraseña').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('correo').isEmail().withMessage('Debe proporcionar un correo válido'),
  body('id_empleado').notEmpty().withMessage('El ID del empleado es obligatorio'),
];

// Validaciones para el login
const validacionesLogin = [
  body('nombre_usuario').notEmpty().withMessage('El nombre de usuario es obligatorio'),
  body('contraseña').notEmpty().withMessage('La contraseña es obligatoria')
];

// Rutas de autenticación
router.post('/registrar', validacionesRegistro, validarCampos, registrar);
router.post('/login', validacionesLogin, validarCampos, login);
router.post('/logout', verificarToken, logout);
router.get('/verificar', verificarToken, verificarAutenticacion);
router.post('/refresh-token', refreshToken);

module.exports = router;