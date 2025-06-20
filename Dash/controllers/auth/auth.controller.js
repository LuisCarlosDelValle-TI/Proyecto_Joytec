const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../../config/db');
const config = require('../../config');

exports.registrar = (req, res) => res.send('registrar');
exports.login = (req, res) => res.send('login');
exports.logout = (req, res) => res.send('logout');
exports.verificarAutenticacion = (req, res) => res.send('verificar');
exports.refreshToken = (req, res) => res.send('refresh');

// Si quieres mantener la clase para uso interno, déjala, pero NO la exportes ni la uses en las rutas.
class AuthController {
  static async registro(req, res) {
    try {
      const { nombre_usuario, contraseña, rol } = req.body;
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      
      const result = await pool.query(
        'INSERT INTO usuarios (nombre_usuario, contraseña, rol) VALUES ($1, $2, $3) RETURNING *',
        [nombre_usuario, hashedPassword, rol]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}