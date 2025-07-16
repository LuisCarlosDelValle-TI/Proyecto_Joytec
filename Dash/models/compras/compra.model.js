const { pool } = require('../../config/db');

class Compra {
  constructor(data) {
    this.id_compra = data.id_compra;
    this.fecha_compra = data.fecha_compra;
    this.id_proveedor = data.id_proveedor;
    this.id_empleado = data.id_empleado;
    this.subtotal = data.subtotal;
    this.descuento = data.descuento || 0;
    this.total = data.total;
    this.metodo_pago = data.metodo_pago;
    this.estado = data.estado;
    this.nota = data.nota;
    this.activo = data.activo;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.productos = data.productos || [];
    this.nombre_proveedor = data.nombre_proveedor;
    this.nombre_empleado = data.nombre_empleado;
  }

  static async listar() {
    try {
      const result = await pool.query(`
        SELECT c.*, 
               p.nombre as nombre_proveedor,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM compras c 
        LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
        LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
        WHERE c.activo = true
        ORDER BY c.fecha_compra DESC
      `);
      return result.rows.map(row => new Compra(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const compraResult = await pool.query(`
        SELECT c.*, 
               p.nombre as nombre_proveedor,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM compras c 
        LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
        LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
        WHERE c.id_compra = $1 AND c.activo = true
      `, [id]);

      if (!compraResult.rows[0]) return null;

      const productosResult = await pool.query(`
        SELECT dc.*, p.nombre_producto, p.codigo_barra
        FROM detalle_compra dc 
        JOIN productos p ON dc.id_producto = p.id_producto 
        WHERE dc.id_compra = $1
      `, [id]);

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

      const compraResult = await client.query(`
        INSERT INTO compras (
          fecha_compra, id_proveedor, id_empleado, subtotal,
          descuento, total, metodo_pago, estado, nota
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *
      `, [
        data.fecha_compra || new Date(),
        data.id_proveedor,
        data.id_empleado,
        data.subtotal,
        data.descuento || 0,
        data.total,
        data.metodo_pago || 'efectivo',
        data.estado || 'completada',
        data.nota
      ]);

      const compra = new Compra(compraResult.rows[0]);

      for (const producto of data.productos) {
        await client.query(`
          INSERT INTO detalle_compra (
            id_compra, id_producto, cantidad, precio_unitario, subtotal_producto
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          compra.id_compra,
          producto.id_producto,
          producto.cantidad,
          producto.precio_unitario,
          producto.subtotal_producto
        ]);

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

  static async comprasPorProveedor(idProveedor) {
    try {
      const result = await pool.query(`
        SELECT c.*, 
               p.nombre as nombre_proveedor,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM compras c 
        JOIN proveedores p ON c.id_proveedor = p.id_proveedor
        LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
        WHERE c.id_proveedor = $1 AND c.activo = true
        ORDER BY c.fecha_compra DESC
      `, [idProveedor]);
      return result.rows.map(row => new Compra(row));
    } catch (error) {
      throw error;
    }
  }

  static async comprasPorEmpleado(idEmpleado) {
    try {
      const result = await pool.query(`
        SELECT c.*, 
               p.nombre as nombre_proveedor,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM compras c 
        LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
        JOIN empleados e ON c.id_empleado = e.id_empleado
        WHERE c.id_empleado = $1 AND c.activo = true
        ORDER BY c.fecha_compra DESC
      `, [idEmpleado]);
      return result.rows.map(row => new Compra(row));
    } catch (error) {
      throw error;
    }
  }

  static async comprasPorRangoFecha(fechaInicio, fechaFin) {
    try {
      const result = await pool.query(`
        SELECT c.*, 
               p.nombre as nombre_proveedor,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM compras c 
        LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
        LEFT JOIN empleados e ON c.id_empleado = e.id_empleado
        WHERE c.fecha_compra BETWEEN $1 AND $2 AND c.activo = true
        ORDER BY c.fecha_compra DESC
      `, [fechaInicio, fechaFin]);
      return result.rows.map(row => new Compra(row));
    } catch (error) {
      throw error;
    }
  }

  static async estadisticasMensuales() {
    try {
      const result = await pool.query(`
        SELECT 
          DATE_TRUNC('month', fecha_compra) as mes,
          COUNT(*) as total_compras,
          SUM(total) as total_gastos,
          AVG(total) as promedio_compra
        FROM compras 
        WHERE activo = true
        GROUP BY DATE_TRUNC('month', fecha_compra)
        ORDER BY mes DESC
        LIMIT 12
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async historialComprasProducto(idProducto) {
    try {
      const result = await pool.query(`
        SELECT c.*, dc.cantidad, dc.precio_unitario,
               p.nombre_producto, p.codigo_barra,
               pr.nombre as nombre_proveedor
        FROM compras c
        JOIN detalle_compra dc ON c.id_compra = dc.id_compra
        JOIN productos p ON dc.id_producto = p.id_producto
        LEFT JOIN proveedores pr ON c.id_proveedor = pr.id_proveedor
        WHERE dc.id_producto = $1 AND c.activo = true
        ORDER BY c.fecha_compra DESC
      `, [idProducto]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Compra;