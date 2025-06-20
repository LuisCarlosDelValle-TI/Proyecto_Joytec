const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta para obtener la lista de usuarios
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para registrar un nuevo usuario
router.post('/', async (req, res) => {
  const {nombre_usuario, contraseña, id_empleado} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO USUARIOS (nombre_usuario, contraseña, id_empleado) VALUES ($1, $2, $3) RETURNING *',
      [nombre_usuario, contraseña, id_empleado]);
    res.status(201).json({ message: 'Usuario registrado exitosamente', data: { usuario: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Usuario eliminado exitosamente', data: { usuario: result.rows[0] } });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;