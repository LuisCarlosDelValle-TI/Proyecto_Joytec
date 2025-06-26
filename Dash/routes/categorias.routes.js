const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const cors = require('cors');
const CategoriaController = require('../controllers/categorias/categoria.controller');
const { validarCampos } = require('../middleware/validator');
const { verificarToken, verificarRol } = require('../middleware/auth');

router.use(cors());

// Validaciones para categorías
const validacionesCategoria = [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3, max: 50 }).withMessage('El nombre debe tener entre 3 y 50 caracteres'),
    body('descripcion').optional().isLength({ max: 200 }).withMessage('La descripción no debe exceder los 200 caracteres')
];

// Middleware para verificar roles autorizados
const esAutorizado = verificarRol(['admin', 'empleado']);

// Rutas CRUD básicas (temporalmente sin autenticación para pruebas)
router.get('/', CategoriaController.listarCategorias);
router.get('/:id', CategoriaController.obtenerCategoria);
router.post('/', [...validacionesCategoria, validarCampos], CategoriaController.crearCategoria);
router.put('/:id', [...validacionesCategoria, validarCampos], CategoriaController.actualizarCategoria);
router.delete('/:id', CategoriaController.eliminarCategoria);

module.exports = router;