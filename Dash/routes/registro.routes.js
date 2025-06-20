const express = require('express');
const router = express.Router();
const registroController = require('../controllers/registro/registro.controller');

// Define la ruta y llama al controlador
router.post('/register', registroController.registrarUsuario);

module.exports = router;