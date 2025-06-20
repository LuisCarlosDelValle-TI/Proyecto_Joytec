const { pool } = require('../../config/db');

class Proveedor {
  constructor(data) {
    this.id_proveedor = data.id_proveedor;
    this.nombre = data.nombre;
    this.empresa = data.empresa;
    this.rfc = data.rfc;
    this.correo = data.correo;
    this.telefono = data.telefono;
    this.direccion = data.direccion;
  }

  static async listar() {
    try {
      const result = await pool.query(
        'SELECT * FROM proveedores'
      );
      return result.rows.map(row => new Proveedor(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM proveedores WHERE id_proveedor = $1',
        [id]
      );
      return result.rows[0] ? new Proveedor(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorRFC(rfc) {
    try {
      const result = await pool.query(
        'SELECT * FROM proveedores WHERE rfc = $1',
        [rfc]
      );
      return result.rows[0] ? new Proveedor(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data) {
    try {
      const result = await pool.query(
        'INSERT INTO proveedores (nombre, empresa, rfc, correo, telefono, direccion) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [data.nombre, data.empresa, data.rfc, data.correo, data.telefono, data.direccion]
      );
      return new Proveedor(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async actualizar(id, data) {
    try {
      const result = await pool.query(
        'UPDATE proveedores SET nombre = $1, empresa = $2, rfc = $3, correo = $4, telefono = $5, direccion = $6 WHERE id_proveedor = $7 RETURNING *',
        [data.nombre, data.empresa, data.rfc, data.correo, data.telefono, data.direccion, id]
      );
      return result.rows[0] ? new Proveedor(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      // Verificar si el proveedor tiene compras asociadas
      const comprasResult = await pool.query(
        'SELECT COUNT(*) FROM compras WHERE id_proveedor = $1',
        [id]
      );

      if (parseInt(comprasResult.rows[0].count) > 0) {
        throw new Error('No se puede eliminar el proveedor porque tiene compras asociadas');
      }

      const result = await pool.query(
        'DELETE FROM proveedores WHERE id_proveedor = $1 RETURNING *',
        [id]
      );
      return result.rows[0] ? new Proveedor(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Proveedor;