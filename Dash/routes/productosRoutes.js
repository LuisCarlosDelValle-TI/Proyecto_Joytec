const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta para obtener la lista de productos con nombres de material y categoría
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.id_producto, 
        p.nombre AS nombre_producto, 
        m.nombre_material AS nombre_material, 
        p.precio, 
        p.stock_minimo, 
        p.existencias, 
        c.nombre_categoria AS nombre_categoria -- Usar "nombre_categoria" aquí
      FROM productos p
      LEFT JOIN materiales m ON p.id_material = m.id_material
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para registrar un nuevo producto
router.post('/', async (req, res) => {
  const {nombre, id_material, precio, stock_minimo, existencias, id_categoria} = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO PRODUCTOS (nombre, id_material, precio, stock_minimo, existencias, id_categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, id_material, precio, stock_minimo, existencias, id_categoria]);
    res.status(201).json({ message: 'Producto registrado exitosamente', data: { producto: result.rows[0] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para actualizar un producto por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, id_material, precio, stock_minimo, existencias, id_categoria } = req.body;

  // Validar que id_material no sea null
  if (!id_material) {
    return res.status(400).json({ error: 'El material es obligatorio' });
  }

  try {
    const result = await pool.query(
      'UPDATE productos SET nombre = $1, id_material = $2, precio = $3, stock_minimo = $4, existencias = $5, id_categoria = $6 WHERE id_producto = $7 RETURNING *',
      [nombre, id_material, precio, stock_minimo, existencias, id_categoria, id]
    );

    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Producto actualizado exitosamente', data: { producto: result.rows[0] } });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM productos WHERE id_producto = $1 RETURNING *', [id]);
    if (result.rowCount > 0) {
      res.status(200).json({ message: 'Producto eliminado exitosamente', data: { producto: result.rows[0] } });
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM productos WHERE id_producto = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

module.exports = router;