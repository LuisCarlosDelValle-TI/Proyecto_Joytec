const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class Usuario {
  static async create({ username, apellidoPaterno, apellidoMaterno, correo, password, telefono, rol }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO usuarios (username, apellido_paterno, apellido_materno, correo, password, telefono, rol)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, username, correo, rol, fecha_registro;
    `;
    const values = [username, apellidoPaterno, apellidoMaterno, correo, hashedPassword, telefono, rol];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM usuarios WHERE username = $1';
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, correo, rol FROM usuarios WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = Usuario;