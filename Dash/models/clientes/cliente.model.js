const { pool } = require('../../config/db');

class Cliente {
  constructor(data) {
    this.id_cliente = data.id_cliente;
    this.nombre = data.nombre;
    this.apellido_paterno = data.apellido_paterno;
    this.apellido_materno = data.apellido_materno;
    this.correo = data.correo;
    this.telefono = data.telefono;
    this.direccion = data.direccion;
  }

  static async listar() {
    try {
      const result = await pool.query(
        'SELECT * FROM clientes'
      );
      return result.rows.map(row => new Cliente(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM clientes WHERE id_cliente = $1',
        [id]
      );
      return result.rows[0] ? new Cliente(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data) {
    try {
      const result = await pool.query(
        'INSERT INTO clientes (nombre, apellido_paterno, apellido_materno, correo, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [data.nombre, data.apellido_paterno, data.apellido_materno, data.correo, data.telefono, data.direccion]
      );
      return new Cliente(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async actualizar(id, data) {
    try {
      const result = await pool.query(
        'UPDATE clientes SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, correo = $4, telefono = $5, direccion = $6 WHERE id_cliente = $7 RETURNING *',
        [data.nombre, data.apellido_paterno, data.apellido_materno, data.correo, data.telefono, data.direccion, id]
      );
      return result.rows[0] ? new Cliente(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const result = await pool.query(
        'DELETE FROM clientes WHERE id_cliente = $1 RETURNING *',
        [id]
      );
      return result.rows[0] ? new Cliente(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cliente;