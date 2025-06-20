const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta para obtener la lista de proveedores
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT id_proveedor, razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor
            FROM proveedores
        `;
        const result = await pool.query(query); // pool es la conexión a la base de datos
        res.json(result.rows); // Enviar los datos como respuesta
    } catch (error) {
        console.error('Error al obtener los proveedores:', error); // Mostrar el error en la consola
        res.status(500).json({ error: 'Error al obtener los proveedores' }); // Enviar un mensaje de error al cliente
    }
});

// Ruta para registrar un nuevo usuario
router.post('/', async (req, res) => {
  const {razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO PROVEEDORES (razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [ razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor]);
    res.status(201).json({ message: 'Proveedor registrado exitosamente', data: { usuario: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar un usuario por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM proveedores WHERE id_proveedor = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        res.status(500).json({ message: 'Error al eliminar el proveedor', error: error.message });
    }
});

// Ruta para obtener un proveedor por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT id_proveedor, razon_social, telefono AS telefono, pais, estado, ciudad, cp AS cp, tipo_proveedor
            FROM proveedores
            WHERE id_proveedor = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        res.status(500).json({ message: 'Error al obtener el proveedor', error: error.message });
    }
});

// Ruta para actualizar un proveedor por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor } = req.body;

    try {
        const query = `
            UPDATE proveedores
            SET razon_social = $1, telefono = $2, pais = $3, estado = $4, ciudad = $5, cp = $6, tipo_proveedor = $7
            WHERE id_proveedor = $8
        `;
        const values = [razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor, id];
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Proveedor actualizado exitosamente' });
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el proveedor:', error);
        res.status(500).json({ message: 'Error al actualizar el proveedor', error: error.message });
    }
});

module.exports = router;