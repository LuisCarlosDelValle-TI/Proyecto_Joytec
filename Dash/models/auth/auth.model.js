const { pool } = require('../../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class Auth {
  constructor(data) {
    this.id = data.id;
    this.token = data.token;
    this.usuario_id = data.usuario_id;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_expiracion = data.fecha_expiracion;
    this.activo = data.activo;
  }

  static async generarToken(usuario) {
    try {
      const token = jwt.sign(
        { id: usuario.id, username: usuario.username, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const result = await pool.query(
        'INSERT INTO tokens (token, usuario_id, fecha_creacion, fecha_expiracion, activo) VALUES ($1, $2, NOW(), NOW() + INTERVAL \'24 hours\', true) RETURNING *',
        [token, usuario.id]
      );

      return new Auth(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async verificarToken(token) {
    try {
      const result = await pool.query(
        'SELECT * FROM tokens WHERE token = $1 AND activo = true AND fecha_expiracion > NOW()',
        [token]
      );

      if (!result.rows[0]) {
        return null;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw error;
    }
  }

  static async invalidarToken(token) {
    try {
      const result = await pool.query(
        'UPDATE tokens SET activo = false WHERE token = $1 RETURNING *',
        [token]
      );
      return result.rows[0] ? new Auth(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async limpiarTokensExpirados() {
    try {
      await pool.query('DELETE FROM tokens WHERE fecha_expiracion < NOW()');
    } catch (error) {
      throw error;
    }
  }

  static async validarCredenciales(username, password) {
    try {
      const result = await pool.query(
        'SELECT * FROM usuarios WHERE username = $1',
        [username]
      );

      const usuario = result.rows[0];
      if (!usuario) {
        return null;
      }

      const passwordValido = await bcrypt.compare(password, usuario.password);
      if (!passwordValido) {
        return null;
      }

      return usuario;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Auth;