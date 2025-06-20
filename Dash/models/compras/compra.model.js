const { pool } = require('../../config/db');

class Compra {
  constructor(data) {
    this.id_compra = data.id_compra;
    this.fecha_compra = data.fecha_compra;
    this.id_proveedor = data.id_proveedor;
    this.total = data.total;
    this.estado = data.estado;
    this.productos = data.productos;
  }

  static async listar() {
    try {
      const result = await pool.query(
        `SELECT c.*, p.nombre as nombre_proveedor 
         FROM compras c 
         LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor`
      );
      return result.rows.map(row => new Compra(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const compraResult = await pool.query(
        `SELECT c.*, p.nombre as nombre_proveedor 
         FROM compras c 
         LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor 
         WHERE c.id_compra = $1`,
        [id]
      );

      if (!compraResult.rows[0]) return null;

      const productosResult = await pool.query(
        `SELECT dc.*, p.nombre_producto 
         FROM detalle_compra dc 
         JOIN productos p ON dc.id_producto = p.id_producto 
         WHERE dc.id_compra = $1`,
        [id]
      );

      const compra = new Compra(compraResult.rows[0]);
      compra.productos = productosResult.rows;
      return compra;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const compraResult = await client.query(
        'INSERT INTO compras (fecha_compra, id_proveedor, total, estado) VALUES ($1, $2, $3, $4) RETURNING *',
        [data.fecha_compra, data.id_proveedor, data.total, data.estado]
      );

      const compra = new Compra(compraResult.rows[0]);

      for (const producto of data.productos) {
        await client.query(
          'INSERT INTO detalle_compra (id_compra, id_producto, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
          [compra.id_compra, producto.id_producto, producto.cantidad, producto.precio_unitario]
        );

        await client.query(
          'UPDATE productos SET stock = stock + $1 WHERE id_producto = $2',
          [producto.cantidad, producto.id_producto]
        );
      }

      await client.query('COMMIT');
      return compra;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async actualizar(id, data) {
    try {
      const result = await pool.query(
        'UPDATE compras SET fecha_compra = $1, id_proveedor = $2, total = $3, estado = $4 WHERE id_compra = $5 RETURNING *',
        [data.fecha_compra, data.id_proveedor, data.total, data.estado, id]
      );
      return result.rows[0] ? new Compra(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const detalleCompra = await client.query(
        'SELECT * FROM detalle_compra WHERE id_compra = $1',
        [id]
      );

      for (const detalle of detalleCompra.rows) {
        await client.query(
          'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2',
          [detalle.cantidad, detalle.id_producto]
        );
      }

      await client.query('DELETE FROM detalle_compra WHERE id_compra = $1', [id]);
      
      const result = await client.query(
        'DELETE FROM compras WHERE id_compra = $1 RETURNING *',
        [id]
      );

      await client.query('COMMIT');
      return result.rows[0] ? new Compra(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = Compra;