const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta para obtener la lista de empleados
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT id_empleado, nombre, apellido_paterno, apellido_materno, telefono, salario FROM empleados';
        const result = await pool.query(query);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los empleados:', error);
        res.status(500).json({ message: 'Error al obtener los empleados', error: error.message });
    }
});

// Ruta para obtener un empleado por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'SELECT id_empleado, nombre, apellido_paterno, apellido_materno, telefono, salario FROM empleados WHERE id_empleado = $1';
        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        res.status(500).json({ message: 'Error al obtener el empleado', error: error.message });
    }
});

// Ruta para registrar un nuevo empleado
router.post('/', async (req, res) => {
    const { nombre, apellido_paterno, apellido_materno, telefono, salario } = req.body;

    try {
        const query = `
            INSERT INTO empleados (nombre, apellido_paterno, apellido_materno, telefono, salario)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const values = [nombre, apellido_paterno, apellido_materno, telefono, salario];
        const result = await pool.query(query, values);

        res.status(201).json({
            message: 'Empleado registrado exitosamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar el empleado:', error);
        res.status(500).json({ message: 'Error al registrar el empleado', error: error.message });
    }
});

// Ruta para actualizar un empleado por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, telefono, salario } = req.body;

    try {
        const query = `
            UPDATE empleados
            SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, telefono = $4, salario = $5
            WHERE id_empleado = $6 RETURNING *
        `;
        const values = [nombre, apellido_paterno, apellido_materno, telefono, salario, id];
        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Empleado actualizado exitosamente', data: result.rows[0] });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el empleado:', error);
        res.status(500).json({ message: 'Error al actualizar el empleado', error: error.message });
    }
});

// Ruta para eliminar un empleado por ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM empleados WHERE id_empleado = $1';
        const result = await pool.query(query, [id]);

        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Empleado eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Empleado no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el empleado:', error);
        res.status(500).json({ message: 'Error al eliminar el empleado', error: error.message });
    }
});

module.exports = router;