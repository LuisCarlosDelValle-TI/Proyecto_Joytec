const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/auth');
const UsuarioController = require('../../controllers/usuarios/usuario.controller');

// Rutas protegidas
router.use(authMiddleware);

// Rutas solo para administradores
router.use(adminMiddleware);

// Rutas CRUD
router.get('/:id', UsuarioController.listar);
router.post('/', UsuarioController.crear);
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', UsuarioController.eliminar);

module.exports = router;
