const { pool } = require('../../config/db');

module.exports = {
  // Listar todos los empleados
  listarEmpleados: async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id_empleado, nombre, apellido_paterno, apellido_materno, 
               telefono, salario
        FROM empleados 
        ORDER BY id_empleado ASC
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Obtener un empleado por ID
  obtenerEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(`
        SELECT id_empleado, nombre, apellido_paterno, apellido_materno, 
               telefono, salario
        FROM empleados 
        WHERE id_empleado = $1
      `, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al obtener empleado:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Crear un nuevo empleado
  crearEmpleado: async (req, res) => {
    try {
      const { 
        nombre, apellido_paterno, apellido_materno, telefono, salario 
      } = req.body;

      const result = await pool.query(`
        INSERT INTO empleados (nombre, apellido_paterno, apellido_materno, telefono, salario)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `, [nombre, apellido_paterno, apellido_materno, telefono, salario]);

      res.status(201).json({
        message: 'Empleado creado exitosamente',
        empleado: result.rows[0]
      });
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Actualizar un empleado
  actualizarEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        nombre, apellido_paterno, apellido_materno, telefono, salario 
      } = req.body;

      const result = await pool.query(`
        UPDATE empleados 
        SET nombre = $1, apellido_paterno = $2, apellido_materno = $3,
            telefono = $4, salario = $5
        WHERE id_empleado = $6
        RETURNING *
      `, [nombre, apellido_paterno, apellido_materno, telefono, salario, id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      res.json({
        message: 'Empleado actualizado exitosamente',
        empleado: result.rows[0]
      });
    } catch (error) {
      console.error('Error al actualizar empleado:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  },

  // Eliminar un empleado
  eliminarEmpleado: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM empleados WHERE id_empleado = $1 RETURNING *', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      res.json({ 
        message: 'Empleado eliminado exitosamente',
        empleado: result.rows[0] 
      });
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.status(500).json({ 
        message: 'Error interno del servidor',
        error: error.message 
      });
    }
  }
};