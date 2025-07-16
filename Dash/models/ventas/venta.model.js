const { pool } = require('../../config/db');

class Venta {
  constructor(data) {
    this.id_venta = data.id_venta;
    this.fecha_venta = data.fecha_venta;
    this.id_cliente = data.id_cliente;
    this.id_empleado = data.id_empleado;
    this.subtotal = data.subtotal;
    this.descuento = data.descuento;
    this.total = data.total;
    this.metodo_pago = data.metodo_pago;
    this.estado = data.estado;
    this.nota = data.nota;
    this.activo = data.activo;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.productos = data.productos || [];
    this.nombre_cliente = data.nombre_cliente;
    this.nombre_empleado = data.nombre_empleado;
  }

  static async listar() {
    try {
      const result = await pool.query(`
        SELECT v.*, 
               c.nombre as nombre_cliente,
               c.apellido as apellido_cliente,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM ventas v 
        LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
        LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
        WHERE v.activo = true
        ORDER BY v.fecha_venta DESC
      `);
      return result.rows.map(row => new Venta(row));
    } catch (error) {
      throw error;
    }
  }

  static async buscarPorId(id) {
    try {
      const ventaResult = await pool.query(`
        SELECT v.*, 
               c.nombre as nombre_cliente,
               c.apellido as apellido_cliente,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM ventas v 
        LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
        LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
        WHERE v.id_venta = $1 AND v.activo = true
      `, [id]);

      if (!ventaResult.rows[0]) return null;

      const productosResult = await pool.query(`
        SELECT dv.*, p.nombre_producto, p.codigo_barra 
        FROM detalle_venta dv 
        JOIN productos p ON dv.id_producto = p.id_producto 
        WHERE dv.id_venta = $1
      `, [id]);

      const venta = new Venta(ventaResult.rows[0]);
      venta.productos = productosResult.rows;
      return venta;
    } catch (error) {
      throw error;
    }
  }

  static async crear(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Crear la venta
      const ventaResult = await client.query(`
        INSERT INTO ventas (
          fecha_venta, id_cliente, id_empleado, subtotal, 
          descuento, total, metodo_pago, estado, nota
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *
      `, [
        data.fecha_venta || new Date(),
        data.id_cliente,
        data.id_empleado,
        data.subtotal,
        data.descuento || 0,
        data.total,
        data.metodo_pago || 'efectivo',
        data.estado || 'completada',
        data.nota
      ]);

      const venta = new Venta(ventaResult.rows[0]);

      // Insertar detalles de venta y actualizar stock
      for (const producto of data.productos) {
        // Verificar stock disponible
        const stockResult = await client.query(
          'SELECT stock FROM productos WHERE id_producto = $1',
          [producto.id_producto]
        );

        if (!stockResult.rows[0] || stockResult.rows[0].stock < producto.cantidad) {
          throw new Error(`Stock insuficiente para el producto ${producto.id_producto}`);
        }

        // Insertar detalle de venta
        await client.query(`
          INSERT INTO detalle_venta (
            id_venta, id_producto, cantidad, precio_unitario, subtotal_producto
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          venta.id_venta,
          producto.id_producto,
          producto.cantidad,
          producto.precio_unitario,
          producto.subtotal_producto
        ]);

        // Actualizar stock del producto
        await client.query(
          'UPDATE productos SET stock = stock - $1 WHERE id_producto = $2',
          [producto.cantidad, producto.id_producto]
        );
      }

      await client.query('COMMIT');
      return venta;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async actualizar(id, data) {
    try {
      const result = await pool.query(`
        UPDATE ventas SET 
          fecha_venta = $1, id_cliente = $2, id_empleado = $3,
          subtotal = $4, descuento = $5, total = $6,
          metodo_pago = $7, estado = $8, nota = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE id_venta = $10 AND activo = true
        RETURNING *
      `, [
        data.fecha_venta,
        data.id_cliente,
        data.id_empleado,
        data.subtotal,
        data.descuento,
        data.total,
        data.metodo_pago,
        data.estado,
        data.nota,
        id
      ]);
      return result.rows[0] ? new Venta(result.rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  static async eliminar(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Obtener los detalles de la venta para restaurar el stock
      const detalleVenta = await client.query(
        'SELECT * FROM detalle_venta WHERE id_venta = $1',
        [id]
      );

      // Restaurar stock de productos
      for (const detalle of detalleVenta.rows) {
        await client.query(
          'UPDATE productos SET stock = stock + $1 WHERE id_producto = $2',
          [detalle.cantidad, detalle.id_producto]
        );
      }

      // Marcar como inactivo en lugar de eliminar físicamente
      const result = await client.query(
        'UPDATE ventas SET activo = false WHERE id_venta = $1 RETURNING *',
        [id]
      );

      await client.query('COMMIT');
      return result.rows[0] ? new Venta(result.rows[0]) : null;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async ventasPorCliente(idCliente) {
    try {
      const result = await pool.query(`
        SELECT v.*, 
               c.nombre as nombre_cliente,
               c.apellido as apellido_cliente
        FROM ventas v 
        JOIN clientes c ON v.id_cliente = c.id_cliente
        WHERE v.id_cliente = $1 AND v.activo = true
        ORDER BY v.fecha_venta DESC
      `, [idCliente]);
      return result.rows.map(row => new Venta(row));
    } catch (error) {
      throw error;
    }
  }

  static async ventasPorEmpleado(idEmpleado) {
    try {
      const result = await pool.query(`
        SELECT v.*, 
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM ventas v 
        JOIN empleados e ON v.id_empleado = e.id_empleado
        WHERE v.id_empleado = $1 AND v.activo = true
        ORDER BY v.fecha_venta DESC
      `, [idEmpleado]);
      return result.rows.map(row => new Venta(row));
    } catch (error) {
      throw error;
    }
  }

  static async ventasPorRangoFecha(fechaInicio, fechaFin) {
    try {
      const result = await pool.query(`
        SELECT v.*, 
               c.nombre as nombre_cliente,
               c.apellido as apellido_cliente,
               e.nombre as nombre_empleado,
               e.apellido as apellido_empleado
        FROM ventas v 
        LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
        LEFT JOIN empleados e ON v.id_empleado = e.id_empleado
        WHERE v.fecha_venta BETWEEN $1 AND $2 AND v.activo = true
        ORDER BY v.fecha_venta DESC
      `, [fechaInicio, fechaFin]);
      return result.rows.map(row => new Venta(row));
    } catch (error) {
      throw error;
    }
  }

  static async estadisticasMensuales() {
    try {
      const result = await pool.query(`
        SELECT 
          DATE_TRUNC('month', fecha_venta) as mes,
          COUNT(*) as total_ventas,
          SUM(total) as total_ingresos,
          AVG(total) as promedio_venta
        FROM ventas 
        WHERE activo = true
        GROUP BY DATE_TRUNC('month', fecha_venta)
        ORDER BY mes DESC
        LIMIT 12
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  static async historialVentasProducto(idProducto) {
    try {
      const result = await pool.query(`
        SELECT v.*, dv.cantidad, dv.precio_unitario,
               p.nombre_producto, p.codigo_barra
        FROM ventas v
        JOIN detalle_venta dv ON v.id_venta = dv.id_venta
        JOIN productos p ON dv.id_producto = p.id_producto
        WHERE dv.id_producto = $1 AND v.activo = true
        ORDER BY v.fecha_venta DESC
      `, [idProducto]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Venta;
