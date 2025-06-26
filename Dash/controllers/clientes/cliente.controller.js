const { pool } = require('../../config/db');

module.exports = {
  // Listar todos los clientes
  listarClientes: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id_cliente, nombre, apellido_paterno, apellido_materno, 
               telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento
        FROM clientes 
        ORDER BY id_cliente ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Obtener un cliente por ID
  obtenerCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT id_cliente, nombre, apellido_paterno, apellido_materno, 
               telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento
        FROM clientes 
        WHERE id_cliente = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener cliente:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Crear un nuevo cliente
  crearCliente: async (req, res) => {
    try {
      const { 
        nombre, apellido_paterno, apellido_materno, 
        telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento 
      } = req.body;

      const result = await pool.query(`
        INSERT INTO clientes (nombre, apellido_paterno, apellido_materno, 
                            telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [nombre, apellido_paterno, apellido_materno, telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento]);

      res.status(201).json({
        message: 'Cliente creado exitosamente',
        cliente: result.rows[0]
      });
    } catch (error) {
      console.error('Error al crear cliente:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Actualizar un cliente
  actualizarCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        nombre, apellido_paterno, apellido_materno, 
        telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento 
      } = req.body;

      const result = await pool.query(`
        UPDATE clientes 
        SET nombre = $1, apellido_paterno = $2, apellido_materno = $3,
            telefono = $4, correo = $5, pais = $6, estado = $7, 
            ciudad = $8, cp = $9, fecha_nacimiento = $10
        WHERE id_cliente = $11
        RETURNING *
      `, [nombre, apellido_paterno, apellido_materno, telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      res.json({
        message: 'Cliente actualizado exitosamente',
        cliente: result.rows[0]
      });
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Eliminar un cliente
  eliminarCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM clientes WHERE id_cliente = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado' });
      }

      res.json({ 
        message: 'Cliente eliminado exitosamente',
        cliente: result.rows[0] 
      });
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  }
};