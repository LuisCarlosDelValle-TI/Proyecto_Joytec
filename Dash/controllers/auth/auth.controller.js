const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../../config/db');
const config = require('../../config');

exports.registrar = async (req, res) => {
  try {
    const { nombre_usuario, contraseña, correo, id_empleado } = req.body;
    
    console.log('Datos recibidos:', { nombre_usuario, correo, id_empleado });
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = $1 OR correo = $2',
      [nombre_usuario, correo]
    );

    console.log('Usuarios encontrados:', usuarioExistente.rows.length);
    if (usuarioExistente.rows.length > 0) {
      console.log('Usuario existente encontrado:', usuarioExistente.rows[0]);
    }

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ 
        mensaje: 'El usuario o correo ya existe' 
      });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    
    console.log('Intentando insertar usuario...');
    
    // Insertar el nuevo usuario con la estructura real de la BD
    const result = await pool.query(
      'INSERT INTO usuarios (nombre_usuario, contraseña, correo, id_empleado) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre_usuario, hashedPassword, correo, parseInt(id_empleado)]
    );

    console.log('Usuario insertado correctamente:', result.rows[0]);

    // No devolver la contraseña en la respuesta
    const { contraseña: _, ...usuarioSinPassword } = result.rows[0];

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: usuarioSinPassword
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor',
      error: error.message 
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { nombre_usuario, contraseña } = req.body;
    
    // Buscar el usuario en la base de datos
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE nombre_usuario = $1',
      [nombre_usuario]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }

    const usuario = result.rows[0];
    
    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    
    if (!contraseñaValida) {
      return res.status(401).json({ 
        mensaje: 'Usuario o contraseña incorrectos' 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario 
      },
      config.security.jwt.secret || 'secreto_temporal',
      { expiresIn: config.security.jwt.expiresIn || '24h' }
    );

    // No devolver la contraseña en la respuesta
    const { contraseña: _, ...usuarioSinPassword } = usuario;

    res.json({
      mensaje: 'Login exitoso',
      usuario: usuarioSinPassword,
      token: token
    });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor',
      error: error.message 
    });
  }
};
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