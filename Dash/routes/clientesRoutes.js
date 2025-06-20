// filepath: c:\Users\luisc\OneDrive\Desktop\Dashboard-v3\Dash\routes\clientesRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const cors = require('cors');

router.use(cors());

// Ruta para obtener la lista de clientes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para registrar un nuevo cliente
router.post('/', async (req, res) => {
  const { nombre, apellido_paterno, apellido_materno, telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO clientes (nombre, apellido_paterno, apellido_materno, telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [nombre, apellido_paterno, apellido_materno, telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento]
    );
    res.status(201).json({ message: 'Cliente registrado exitosamente', data: { cliente: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener un cliente por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Consultar el cliente en la base de datos
        const result = await pool.query('SELECT * FROM clientes WHERE id_cliente = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
    }
});

// Ruta para eliminar un cliente por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si el cliente existe
    const clienteExiste = await pool.query('SELECT * FROM clientes WHERE id_cliente = $1', [id]);
    if (clienteExiste.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Eliminar el cliente
    await pool.query('DELETE FROM clientes WHERE id_cliente = $1', [id]);
    res.status(200).json({ message: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
  }
});

// Ruta para actualizar un cliente por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento } = req.body;

    try {
        const result = await pool.query(
            `UPDATE clientes 
             SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, telefono = $4, correo = $5, 
                 pais = $6, estado = $7, ciudad = $8, cp = $9, fecha_nacimiento = $10 
             WHERE id_cliente = $11 RETURNING *`,
            [nombre, apellido_paterno, apellido_materno, telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente actualizado exitosamente', data: result.rows[0] });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
    }
});

module.exports = router;