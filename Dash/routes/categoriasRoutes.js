const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Asegúrate de que este archivo configure correctamente la conexión a la base de datos

// Ruta para obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id_categoria, nombre_categoria FROM categorias');
    res.json(result.rows); // Devuelve las categorías como JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener una categoría por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT id_categoria, nombre_categoria FROM categorias WHERE id_categoria = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la categoría:', error);
        res.status(500).json({ message: 'Error al obtener la categoría', error: error.message });
    }
});

// Ruta para registrar una nueva categoría
router.post('/', async (req, res) => {
    const { nombre_categoria } = req.body;

    try {
        // Insertar la nueva categoría
        const query = `
            INSERT INTO categorias (nombre_categoria)
            VALUES ($1) RETURNING *
        `;
        const values = [nombre_categoria];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Categoría registrada exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar la categoría:', error);
        res.status(500).json({ message: 'Error al registrar la categoría', error: error.message });
    }
});

// Ruta para actualizar una categoría por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre_categoria } = req.body;

    try {
        const query = `
            UPDATE categorias
            SET nombre_categoria = $1
            WHERE id_categoria = $2 RETURNING *
        `;
        const values = [nombre_categoria, id];
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Categoría actualizada exitosamente', data: result.rows[0] });
        } else {
            res.status(404).json({ message: 'Categoría no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        res.status(500).json({ message: 'Error al actualizar la categoría', error: error.message });
    }
});

// Ruta para eliminar una categoría por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM categorias WHERE id_categoria = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Categoría eliminada exitosamente', data: { categoria: result.rows[0] } });
    } else {
      res.status(404).json({ message: 'Categoría no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;