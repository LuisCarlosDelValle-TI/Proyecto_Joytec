const { pool } = require('../../config/db');

module.exports = {
  // Listar todas las categorías
  listarCategorias: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id_categoria, nombre_categoria
        FROM categorias 
        ORDER BY id_categoria ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Obtener una categoría por ID
  obtenerCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT id_categoria, nombre_categoria
        FROM categorias 
        WHERE id_categoria = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Crear una nueva categoría
  crearCategoria: async (req, res) => {
    try {
      const { nombre_categoria } = req.body;

      const result = await pool.query(`
        INSERT INTO categorias (nombre_categoria)
        VALUES ($1)
        RETURNING *
      `, [nombre_categoria]);

      res.status(201).json({
        message: 'Categoría creada exitosamente',
        categoria: result.rows[0]
      });
    } catch (error) {
      console.error('Error al crear categoría:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Actualizar una categoría
  actualizarCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_categoria } = req.body;

      const result = await pool.query(`
        UPDATE categorias 
        SET nombre_categoria = $1
        WHERE id_categoria = $2
        RETURNING *
      `, [nombre_categoria, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      res.json({
        message: 'Categoría actualizada exitosamente',
        categoria: result.rows[0]
      });
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Eliminar una categoría
  eliminarCategoria: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM categorias WHERE id_categoria = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
      }

      res.json({ 
        message: 'Categoría eliminada exitosamente',
        categoria: result.rows[0] 
      });
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  }
};
