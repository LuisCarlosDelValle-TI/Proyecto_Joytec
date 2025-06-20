const { pool } = require('../../config/db');

class Producto {
  constructor(data) {
    this.id_producto = data.id_producto;
    this.nombre_producto = data.nombre_producto;
    this.descripcion = data.descripcion;
    this.precio = data.precio;
    this.stock = data.stock;
    this.id_categoria = data.id_categoria;
  }

  static async listar() {
    try {
      const result = await pool.query(
        'SELECT p.*, c.nombre_categoria FROM productos p LEFT JOIN categorias c ON p.id_categoria = c.id_categoria'
      );
      return result.rows.map(row => new Producto(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const result = await pool.query(
        'SELECT p.*, c.nombre_categoria FROM productos p LEFT JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.id_producto = $1',
        [id]
      );
      return result.rows[0] ? new Producto(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data) {
    try {
      const result = await pool.query(
        'INSERT INTO productos (nombre_producto, descripcion, precio, stock, id_categoria) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [data.nombre_producto, data.descripcion, data.precio, data.stock, data.id_categoria]
      );
      return new Producto(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async actualizar(id, data) {
    try {
      const result = await pool.query(
        'UPDATE productos SET nombre_producto = $1, descripcion = $2, precio = $3, stock = $4, id_categoria = $5 WHERE id_producto = $6 RETURNING *',
        [data.nombre_producto, data.descripcion, data.precio, data.stock, data.id_categoria, id]
      );
      return result.rows[0] ? new Producto(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const result = await pool.query(
        'DELETE FROM productos WHERE id_producto = $1 RETURNING *',
        [id]
      );
      return result.rows[0] ? new Producto(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Producto;
