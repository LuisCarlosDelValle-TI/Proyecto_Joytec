const { pool } = require('../../config/db');

class Empleado {
  constructor(data) {
    this.id_empleado = data.id_empleado;
    this.nombre = data.nombre;
    this.apellido_paterno = data.apellido_paterno;
    this.apellido_materno = data.apellido_materno;
    this.correo = data.correo;
    this.telefono = data.telefono;
    this.puesto = data.puesto;
    this.fecha_contratacion = data.fecha_contratacion;
    this.salario = data.salario;
  }

  static async listar() {
    try {
      const result = await pool.query(
        'SELECT * FROM empleados'
      );
      return result.rows.map(row => new Empleado(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM empleados WHERE id_empleado = $1',
        [id]
      );
      return result.rows[0] ? new Empleado(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data) {
    try {
      const result = await pool.query(
        'INSERT INTO empleados (nombre, apellido_paterno, apellido_materno, correo, telefono, puesto, fecha_contratacion, salario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [data.nombre, data.apellido_paterno, data.apellido_materno, data.correo, data.telefono, data.puesto, data.fecha_contratacion, data.salario]
      );
      return new Empleado(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async actualizar(id, data) {
    try {
      const result = await pool.query(
        'UPDATE empleados SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, correo = $4, telefono = $5, puesto = $6, fecha_contratacion = $7, salario = $8 WHERE id_empleado = $9 RETURNING *',
        [data.nombre, data.apellido_paterno, data.apellido_materno, data.correo, data.telefono, data.puesto, data.fecha_contratacion, data.salario, id]
      );
      return result.rows[0] ? new Empleado(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    try {
      const result = await pool.query(
        'DELETE FROM empleados WHERE id_empleado = $1 RETURNING *',
        [id]
      );
      return result.rows[0] ? new Empleado(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Empleado;