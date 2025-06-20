const db = require('../../config/db');
const AppError = require('../../utils/appError');

class ProveedorController {
    static async getAllProveedores(req, res, next) {
        try {
            const query = 'SELECT * FROM proveedores WHERE activo = true';
            const [proveedores] = await db.execute(query);
            res.status(200).json({
                status: 'success',
                data: proveedores
            });
        } catch (error) {
            next(new AppError('Error al obtener proveedores', 500));
        }
    }

    static async getProveedorById(req, res, next) {
        try {
            const { id } = req.params;
            const query = 'SELECT * FROM proveedores WHERE id = ? AND activo = true';
            const [proveedor] = await db.execute(query, [id]);

            if (!proveedor.length) {
                return next(new AppError('Proveedor no encontrado', 404));
            }

            res.status(200).json({
                status: 'success',
                data: proveedor[0]
            });
        } catch (error) {
            next(new AppError('Error al obtener el proveedor', 500));
        }
    }

    static async createProveedor(req, res, next) {
        try {
            const { nombre, direccion, telefono, email, rfc } = req.body;
            const query = 'INSERT INTO proveedores (nombre, direccion, telefono, email, rfc) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.execute(query, [nombre, direccion, telefono, email, rfc]);

            res.status(201).json({
                status: 'success',
                message: 'Proveedor creado exitosamente',
                data: { id: result.insertId }
            });
        } catch (error) {
            next(new AppError('Error al crear el proveedor', 500));
        }
    }

    static async updateProveedor(req, res, next) {
        try {
            const { id } = req.params;
            const { nombre, direccion, telefono, email, rfc } = req.body;
            const query = 'UPDATE proveedores SET nombre = ?, direccion = ?, telefono = ?, email = ?, rfc = ? WHERE id = ?';
            const [result] = await db.execute(query, [nombre, direccion, telefono, email, rfc, id]);

            if (result.affectedRows === 0) {
                return next(new AppError('Proveedor no encontrado', 404));
            }

            res.status(200).json({
                status: 'success',
                message: 'Proveedor actualizado exitosamente'
            });
        } catch (error) {
            next(new AppError('Error al actualizar el proveedor', 500));
        }
    }

    static async deleteProveedor(req, res, next) {
        try {
            const { id } = req.params;
            const query = 'UPDATE proveedores SET activo = false WHERE id = ?';
            const [result] = await db.execute(query, [id]);

            if (result.affectedRows === 0) {
                return next(new AppError('Proveedor no encontrado', 404));
            }

            res.status(200).json({
                status: 'success',
                message: 'Proveedor eliminado exitosamente'
            });
        } catch (error) {
            next(new AppError('Error al eliminar el proveedor', 500));
        }
    }

    static async buscarPorRazonSocial(req, res, next) {
        try {
            const { razonSocial } = req.query;
            const query = 'SELECT * FROM proveedores WHERE razon_social LIKE ? AND activo = true';
            const [proveedores] = await db.execute(query, [`%${razonSocial}%`]);

            res.status(200).json({
                status: 'success',
                data: proveedores
            });
        } catch (error) {
            next(new AppError('Error al buscar proveedores por razón social', 500));
        }
    }

    static async buscarPorTipo(req, res, next) {
        try {
            const { tipo } = req.query;
            const query = 'SELECT * FROM proveedores WHERE tipo = ? AND activo = true';
            const [proveedores] = await db.execute(query, [tipo]);

            res.status(200).json({
                status: 'success',
                data: proveedores
            });
        } catch (error) {
            next(new AppError('Error al buscar proveedores por tipo', 500));
        }
    }

    static async obtenerComprasProveedor(req, res, next) {
        try {
            const { id } = req.params;
            const query = `
                SELECT c.*, p.nombre AS proveedor_nombre
                FROM compras c
                JOIN proveedores p ON c.proveedor_id = p.id
                WHERE p.id = ?
            `;
            const [compras] = await db.execute(query, [id]);

            res.status(200).json({
                status: 'success',
                data: compras
            });
        } catch (error) {
            next(new AppError('Error al obtener las compras del proveedor', 500));
        }
    }

    static async obtenerEstadisticasCompras(req, res, next) {
        try {
            const query = `
                SELECT p.id, p.nombre, COUNT(c.id) AS total_compras, SUM(c.monto) AS total_gastado
                FROM proveedores p
                LEFT JOIN compras c ON p.id = c.proveedor_id
                WHERE p.activo = true
                GROUP BY p.id
            `;
            const [estadisticas] = await db.execute(query);

            res.status(200).json({
                status: 'success',
                data: estadisticas
            });
        } catch (error) {
            next(new AppError('Error al obtener estadísticas de compras', 500));
        }
    }
}

module.exports = {
  getAllProveedores: ProveedorController.getAllProveedores,
  getProveedorById: ProveedorController.getProveedorById,
  createProveedor: ProveedorController.createProveedor,
  updateProveedor: ProveedorController.updateProveedor,
  deleteProveedor: ProveedorController.deleteProveedor,
  buscarPorRazonSocial: ProveedorController.buscarPorRazonSocial,
  buscarPorTipo: ProveedorController.buscarPorTipo,
  obtenerComprasProveedor: ProveedorController.obtenerComprasProveedor,
  obtenerEstadisticasCompras: ProveedorController.obtenerEstadisticasCompras
};