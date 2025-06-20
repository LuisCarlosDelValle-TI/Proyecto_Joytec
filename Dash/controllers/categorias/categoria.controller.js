const { pool } = require('../../config/db');

class CategoriaController {
  static async listar(req, res) {
    try {
      const result = await pool.query('SELECT * FROM categorias WHERE activo = true');
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { nombre_categoria, descripcion } = req.body;
      const result = await pool.query(
        'INSERT INTO categorias (nombre_categoria, descripcion) VALUES ($1, $2) RETURNING *',
        [nombre_categoria, descripcion]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre_categoria, descripcion } = req.body;
      const result = await pool.query(
        'UPDATE categorias SET nombre_categoria = $1, descripcion = $2 WHERE id_categoria = $3 RETURNING *',
        [nombre_categoria, descripcion, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await pool.query('UPDATE categorias SET activo = false WHERE id_categoria = $1', [id]);
      res.json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async buscarPorNombre(req, res) {
    try {
      const { nombre } = req.params;
      const result = await pool.query(
        'SELECT * FROM categorias WHERE nombre_categoria ILIKE $1 AND activo = true',
        [`%${nombre}%`]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerProductosCategoria(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT p.* FROM productos p JOIN categorias c ON p.id_categoria = c.id_categoria WHERE c.id_categoria = $1 AND c.activo = true',
        [id]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM categorias WHERE id_categoria = $1 AND activo = true',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  listarCategorias: CategoriaController.listar,
  buscarPorId: CategoriaController.buscarPorId,
  crear: CategoriaController.crear,
  actualizar: CategoriaController.actualizar,
  eliminar: CategoriaController.eliminar,
  buscarPorNombre: CategoriaController.buscarPorNombre,
  obtenerProductosCategoria: CategoriaController.obtenerProductosCategoria,
};