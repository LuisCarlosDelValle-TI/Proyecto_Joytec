const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Configuración de la base de datos

// Ruta para registrar una compra y sus detalles
router.post('/', async (req, res) => {
    const { total, descuento, subtotal, id_proveedor, id_empleado, id_metodo_pago, detalles } = req.body;

    try {
        // Iniciar una transacción
        await pool.query('BEGIN');

        // Insertar la compra en la tabla `compras`
        const compraQuery = `
            INSERT INTO compras (total, descuento, subtotal, id_proveedor, id_empleado, id_metodo_pago, fecha)
            VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING id_compra
        `;
        const compraValues = [total, descuento, subtotal, id_proveedor, id_empleado, id_metodo_pago];
        const compraResult = await pool.query(compraQuery, compraValues);
        const idCompra = compraResult.rows[0].id_compra;

        // Insertar los detalles de la compra en la tabla `detalles_compra`
        const detalleQuery = `
            INSERT INTO detalles_compra (id_compra, id_producto, cantidad, costo_unitario, subtotal_producto)
            VALUES ($1, $2, $3, $4, $5)
        `;
        for (const detalle of detalles) {
            const detalleValues = [idCompra, detalle.id_producto, detalle.cantidad, detalle.costo_unitario, detalle.subtotal_producto];
            await pool.query(detalleQuery, detalleValues);
        }

        // Confirmar la transacción
        await pool.query('COMMIT');

        res.status(201).json({ message: 'Compra registrada exitosamente', id_compra: idCompra });
    } catch (error) {
        // Revertir la transacción en caso de error
        await pool.query('ROLLBACK');
        console.error('Error al registrar la compra:', error);
        res.status(500).json({ message: 'Error al registrar la compra', error: error.message });
    }
});

module.exports = router;