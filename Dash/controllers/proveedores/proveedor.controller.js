const { pool } = require('../../config/db');

module.exports = {
  // Listar todos los proveedores
  listarProveedores: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id_proveedor, razon_social, telefono, pais, estado, 
               ciudad, cp, tipo_proveedor
        FROM proveedores 
        ORDER BY id_proveedor ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Obtener un proveedor por ID
  obtenerProveedor: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT id_proveedor, razon_social, telefono, pais, estado, 
               ciudad, cp, tipo_proveedor
        FROM proveedores 
        WHERE id_proveedor = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener proveedor:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Crear un nuevo proveedor
  crearProveedor: async (req, res) => {
    try {
      const { 
        razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor 
      } = req.body;

      const result = await pool.query(`
        INSERT INTO proveedores (razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor]);

      res.status(201).json({
        message: 'Proveedor creado exitosamente',
        proveedor: result.rows[0]
      });
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Actualizar un proveedor
  actualizarProveedor: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor 
      } = req.body;

      const result = await pool.query(`
        UPDATE proveedores 
        SET razon_social = $1, telefono = $2, pais = $3, estado = $4, 
            ciudad = $5, cp = $6, tipo_proveedor = $7
        WHERE id_proveedor = $8
        RETURNING *
      `, [razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }

      res.json({
        message: 'Proveedor actualizado exitosamente',
        proveedor: result.rows[0]
      });
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Eliminar un proveedor
  eliminarProveedor: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM proveedores WHERE id_proveedor = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Proveedor no encontrado' });
      }

      res.json({ 
        message: 'Proveedor eliminado exitosamente',
        proveedor: result.rows[0] 
      });
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  }
};