const { pool } = require('../../config/db');

class ProductoController {
  static async listar(req, res) {
    try {
      const result = await pool.query(`
        SELECT p.id_producto, p.nombre, p.precio, p.stock_minimo, p.existencias, 
               p.id_categoria, c.nombre_categoria, 
               m.nombre_material
        FROM productos p 
        LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN materiales m ON p.id_material = m.id_material
        ORDER BY p.id_producto ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async crear(req, res) {
    try {
      const { nombre, descripcion, precio, stock, id_categoria } = req.body;
      const result = await pool.query(
        'INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, descripcion, precio, stock, id_categoria]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock, id_categoria } = req.body;
      const result = await pool.query(
        'UPDATE productos SET nombre = $1, descripcion = $2, precio = $3, stock = $4, id_categoria = $5 WHERE id_producto = $6 RETURNING *',
        [nombre, descripcion, precio, stock, id_categoria, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await pool.query('UPDATE productos SET activo = false WHERE id_producto = $1', [id]);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizarStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      const result = await pool.query(
        'UPDATE productos SET stock = stock + $1 WHERE id_producto = $2 RETURNING *',
        [cantidad, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT p.*, c.nombre_categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.id_producto = $1 AND p.activo = true',
        [id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async buscarPorCategoria(req, res) {
    try {
      const { id_categoria } = req.params;
      const result = await pool.query(
        'SELECT p.*, c.nombre_categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.id_categoria = $1 AND p.activo = true',
        [id_categoria]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async buscarPorNombre(req, res) {
    try {
      const { nombre } = req.params;
      const result = await pool.query(
        'SELECT p.*, c.nombre_categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.nombre ILIKE $1 AND p.activo = true',
        [`%${nombre}%`]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtenerProductosStockBajo(req, res) {
    try {
      const result = await pool.query(
        'SELECT p.*, c.nombre_categoria FROM productos p JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.stock < 10 AND p.activo = true'
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async ajustarStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const result = await pool.query(
        'UPDATE productos SET stock = $1 WHERE id_producto = $2 RETURNING *',
        [stock, id]
      );
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  listarProductos: ProductoController.listar,
  buscarPorId: ProductoController.buscarPorId,
  buscarPorCategoria: ProductoController.buscarPorCategoria,
  crearProducto: ProductoController.crear,
  actualizarProducto: ProductoController.actualizar,
  eliminarProducto: ProductoController.eliminar,
  actualizarStock: ProductoController.actualizarStock,
  buscarPorNombre: ProductoController.buscarPorNombre,
  obtenerProductosStockBajo: ProductoController.obtenerProductosStockBajo,
  ajustarStock: ProductoController.ajustarStock
};