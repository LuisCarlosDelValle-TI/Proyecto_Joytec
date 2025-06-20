const { pool } = require('../../config/db');
const bcrypt = require('bcryptjs');

class UsuarioController {
  static async listar(req, res) {
    try {
        const result = await pool.query(
            `SELECT 
                id_usuario, 
                nombre_usuario, 
                correo
            FROM usuarios`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error en listarUsuarios:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  static async crear(req, res) {
    try {
      const { nombre_usuario, contraseña, rol } = req.body;
      const hashedPassword = await bcrypt.hash(contraseña, 10);
      
      const result = await pool.query(
        'INSERT INTO usuarios (nombre_usuario, contraseña, rol) VALUES ($1, $2, $3) RETURNING id_usuario, nombre_usuario, rol',
        [nombre_usuario, hashedPassword, rol]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre_usuario, contraseña, rol } = req.body;
      let query, values;

      if (contraseña) {
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        query = 'UPDATE usuarios SET nombre_usuario = $1, contraseña = $2, rol = $3 WHERE id_usuario = $4 RETURNING id_usuario, nombre_usuario, rol';
        values = [nombre_usuario, hashedPassword, rol, id];
      } else {
        query = 'UPDATE usuarios SET nombre_usuario = $1, rol = $2 WHERE id_usuario = $3 RETURNING id_usuario, nombre_usuario, rol';
        values = [nombre_usuario, rol, id];
      }

      const result = await pool.query(query, values);
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await pool.query('UPDATE usuarios SET activo = false WHERE id_usuario = $1', [id]);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarContraseña(req, res) {
    try {
      const { id } = req.params;
      const { contraseña_actual, nueva_contraseña } = req.body;

      const usuario = await pool.query('SELECT contraseña FROM usuarios WHERE id_usuario = $1', [id]);
      if (!usuario.rows.length) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const validPassword = await bcrypt.compare(contraseña_actual, usuario.rows[0].contraseña);
      if (!validPassword) {
        return res.status(400).json({ error: 'Contraseña actual incorrecta' });
      }

      const hashedPassword = await bcrypt.hash(nueva_contraseña, 10);
      await pool.query('UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2', [hashedPassword, id]);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async obtener(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT id_usuario, nombre_usuario, rol FROM usuarios WHERE id_usuario = $1 AND activo = true', [id]);

      if (!result.rows.length) {
        res.status(404).json({ error: 'Usuario no encontrado' });
      } else {
        res.json(result.rows[0]);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async usuariosPorRol(req, res) {
    try {
      const { rol } = req.params;
      const result = await pool.query('SELECT id_usuario, nombre_usuario, rol FROM usuarios WHERE rol = $1 AND activo = true', [rol]);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async usuariosPorEstado(req, res) {
    try {
      const { estado } = req.params;
      const result = await pool.query('SELECT id_usuario, nombre_usuario, rol FROM usuarios WHERE activo = $1', [estado === 'true']);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      await pool.query('UPDATE usuarios SET activo = $1 WHERE id_usuario = $2', [estado, id]);
      res.json({ message: 'Estado de usuario actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cambiarPassword(req, res) {
    try {
      const { id } = req.params;
      const { nueva_contraseña } = req.body;

      const hashedPassword = await bcrypt.hash(nueva_contraseña, 10);
      await pool.query('UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2', [hashedPassword, id]);

      res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = {
  listarUsuarios: UsuarioController.listar,
  obtenerUsuario: UsuarioController.obtener,
  crearUsuario: UsuarioController.crear,
  actualizarUsuario: UsuarioController.actualizar,
  eliminarUsuario: UsuarioController.eliminar,
  cambiarContraseña: UsuarioController.cambiarContraseña,
  usuariosPorRol: UsuarioController.usuariosPorRol,
  usuariosPorEstado: UsuarioController.usuariosPorEstado,
  cambiarEstado: UsuarioController.cambiarEstado,
  cambiarPassword: UsuarioController.cambiarPassword
};