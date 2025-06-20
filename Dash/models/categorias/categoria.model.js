const { pool } = require('../../config/db');

class Categoria {
  constructor(data) {
    this.id_categoria = data.id_categoria;
    this.nombre_categoria = data.nombre_categoria;
  }

  static async listar() {
    try {
      const result = await pool.query('SELECT id_categoria, nombre_categoria FROM categorias');
      return result.rows.map(row => new Categoria(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const result = await pool.query(
        'SELECT id_categoria, nombre_categoria FROM categorias WHERE id_categoria = $1',
        [id]
      );
      return result.rows[0] ? new Categoria(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data) {
    try {
      const result = await pool.query(
        'INSERT INTO categorias (nombre_categoria) VALUES ($1) RETURNING *',
        [data.nombre_categoria]
      );
      return new Categoria(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async actualizar(id, data) {
    try {
      const result = await pool.query(
        'UPDATE categorias SET nombre_categoria = $1 WHERE id_categoria = $2 RETURNING *',
        [data.nombre_categoria, id]
      );
      return result.rows[0] ? new Categoria(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const result = await pool.query(
        'DELETE FROM categorias WHERE id_categoria = $1 RETURNING *',
        [id]
      );
      return result.rows[0] ? new Categoria(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Categoria;
