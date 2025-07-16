const Venta = require('../../models/ventas/venta.model');
const AppError = require('../../utils/appError');
const { crearRespuestaExitosa, crearRespuestaError } = require('../../utils/response.utils');

class VentaController {
  static async listarVentas(req, res, next) {
    try {
      const ventas = await Venta.listar();
      res.json(crearRespuestaExitosa(ventas, 'Ventas obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las ventas', 500));
    }
  }

  static async obtenerVenta(req, res, next) {
    try {
      const { id } = req.params;
      const venta = await Venta.buscarPorId(id);
      
      if (!venta) {
        return next(new AppError('Venta no encontrada', 404));
      }
      
      res.json(crearRespuestaExitosa(venta, 'Venta obtenida exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener la venta', 500));
    }
  }

  static async crearVenta(req, res, next) {
    try {
      const ventaData = {
        ...req.body,
        id_empleado: req.usuario.id_empleado // Obtenido del token JWT
      };

      const nuevaVenta = await Venta.crear(ventaData);
      res.status(201).json(crearRespuestaExitosa(nuevaVenta, 'Venta creada exitosamente'));
    } catch (error) {
      if (error.message.includes('Stock insuficiente')) {
        return next(new AppError(error.message, 400));
      }
      next(new AppError('Error al crear la venta', 500));
    }
  }

  static async actualizarVenta(req, res, next) {
    try {
      const { id } = req.params;
      const ventaActualizada = await Venta.actualizar(id, req.body);
      
      if (!ventaActualizada) {
        return next(new AppError('Venta no encontrada', 404));
      }
      
      res.json(crearRespuestaExitosa(ventaActualizada, 'Venta actualizada exitosamente'));
    } catch (error) {
      next(new AppError('Error al actualizar la venta', 500));
    }
  }

  static async eliminarVenta(req, res, next) {
    try {
      const { id } = req.params;
      const ventaEliminada = await Venta.eliminar(id);
      
      if (!ventaEliminada) {
        return next(new AppError('Venta no encontrada', 404));
      }
      
      res.json(crearRespuestaExitosa(null, 'Venta eliminada exitosamente'));
    } catch (error) {
      next(new AppError('Error al eliminar la venta', 500));
    }
  }

  static async ventasPorCliente(req, res, next) {
    try {
      const { idCliente } = req.params;
      const ventas = await Venta.ventasPorCliente(idCliente);
      res.json(crearRespuestaExitosa(ventas, 'Ventas del cliente obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las ventas del cliente', 500));
    }
  }

  static async ventasPorEmpleado(req, res, next) {
    try {
      const { idEmpleado } = req.params;
      const ventas = await Venta.ventasPorEmpleado(idEmpleado);
      res.json(crearRespuestaExitosa(ventas, 'Ventas del empleado obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las ventas del empleado', 500));
    }
  }

  static async ventasPorRangoFecha(req, res, next) {
    try {
      const { inicio, fin } = req.params;
      const ventas = await Venta.ventasPorRangoFecha(inicio, fin);
      res.json(crearRespuestaExitosa(ventas, 'Ventas por rango de fecha obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las ventas por fecha', 500));
    }
  }

  static async estadisticasMensuales(req, res, next) {
    try {
      const estadisticas = await Venta.estadisticasMensuales();
      res.json(crearRespuestaExitosa(estadisticas, 'Estadísticas mensuales obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las estadísticas mensuales', 500));
    }
  }

  static async historialVentasProducto(req, res, next) {
    try {
      const { idProducto } = req.params;
      const historial = await Venta.historialVentasProducto(idProducto);
      res.json(crearRespuestaExitosa(historial, 'Historial de ventas del producto obtenido exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener el historial de ventas del producto', 500));
    }
  }
}

module.exports = {
  listarVentas: VentaController.listarVentas,
  obtenerVenta: VentaController.obtenerVenta,
  crearVenta: VentaController.crearVenta,
  actualizarVenta: VentaController.actualizarVenta,
  eliminarVenta: VentaController.eliminarVenta,
  ventasPorCliente: VentaController.ventasPorCliente,
  ventasPorEmpleado: VentaController.ventasPorEmpleado,
  ventasPorRangoFecha: VentaController.ventasPorRangoFecha,
  estadisticasMensuales: VentaController.estadisticasMensuales,
  historialVentasProducto: VentaController.historialVentasProducto
};
