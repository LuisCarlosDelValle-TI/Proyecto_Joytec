const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const UsuarioController = require('../controllers/usuarios/usuario.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(cors());

// Validaciones para usuarios
const validacionesUsuario = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('email').isEmail().withMessage('El email debe ser válido')
        .normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula')
        .matches(/[!@#$%^&*]/).withMessage('La contraseña debe contener al menos un carácter especial'),
    body('rol').isIn(['admin', 'empleado']).withMessage('El rol debe ser admin o empleado'),
    body('estado').optional().isBoolean().withMessage('El estado debe ser un valor booleano')
];

// Validaciones para actualización de usuario
const validacionesActualizacion = [
    body('nombre').optional().isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('email').optional().isEmail().withMessage('El email debe ser válido').normalizeEmail(),
    body('password').optional()
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
        .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una minúscula')
        .matches(/[!@#$%^&*]/).withMessage('La contraseña debe contener al menos un carácter especial'),
    body('rol').optional().isIn(['admin', 'empleado']).withMessage('El rol debe ser admin o empleado'),
    body('estado').optional().isBoolean().withMessage('El estado debe ser un valor booleano')
];

// Middleware para verificar roles autorizados
const esAdmin = verificarRol(['admin']);

// Rutas CRUD básicas
router.get('/', verificarToken, UsuarioController.listarUsuarios);
router.get('/:id', [verificarToken, esAdmin], UsuarioController.obtenerUsuario);
router.post('/', [verificarToken, ...validacionesUsuario, validarCampos], UsuarioController.crearUsuario);
router.put('/:id', [verificarToken, ...validacionesUsuario, validarCampos], UsuarioController.actualizarUsuario);
router.delete('/:id', verificarToken, UsuarioController.eliminarUsuario);
router.patch('/:id/cambiar-contraseña', verificarToken, UsuarioController.cambiarContraseña);

// Rutas adicionales
router.get('/rol/:rol', [verificarToken, esAdmin], UsuarioController.usuariosPorRol);
router.get('/estado/:estado', [verificarToken, esAdmin], UsuarioController.usuariosPorEstado);
router.put('/:id/cambiar-estado', [verificarToken, esAdmin], UsuarioController.cambiarEstado);
router.put('/:id/cambiar-password', [verificarToken], UsuarioController.cambiarPassword);

module.exports = router;