const { pool } = require('../../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.apellidoPaterno = data.apellidoPaterno;
    this.apellidoMaterno = data.apellidoMaterno;
    this.correo = data.correo;
    this.telefono = data.telefono;
    this.rol = data.rol;
    this.password = data.password;
  }

  static async crear(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const usuario = new Usuario({
      ...data,
      password: hashedPassword
    });

    const result = await pool.query(
      'INSERT INTO usuarios (username, password, apellido_paterno, apellido_materno, correo, telefono, rol) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        usuario.username,
        usuario.password,
        usuario.apellidoPaterno,
        usuario.apellidoMaterno,
        usuario.correo,
        usuario.telefono,
        usuario.rol
      ]
    );

    return new Usuario(result.rows[0]);
  }

  static async buscarPorUsername(username) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1',
      [username]
    );
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }

  static async buscarPorId(id) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0] ? new Usuario(result.rows[0]) : null;
  }

  async actualizar(data) {
    const result = await pool.query(
      'UPDATE usuarios SET username = $1, apellido_paterno = $2, apellido_materno = $3, correo = $4, telefono = $5, rol = $6 WHERE id = $7 RETURNING *',
      [
        data.username,
        data.apellidoPaterno,
        data.apellidoMaterno,
        data.correo,
        data.telefono,
        data.rol,
        this.id
      ]
    );
    return new Usuario(result.rows[0]);
  }

  async eliminar() {
    await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [this.id]
    );
  }
}

module.exports = Usuario;
