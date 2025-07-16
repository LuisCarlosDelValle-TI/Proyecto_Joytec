const Compra = require('../../models/compras/compra.model');
const AppError = require('../../utils/appError');
const { crearRespuestaExitosa, crearRespuestaError } = require('../../utils/response.utils');

class CompraController {
  static async listarCompras(req, res, next) {
    try {
      const compras = await Compra.listar();
      res.json(crearRespuestaExitosa(compras, 'Compras obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las compras', 500));
    }
  }

  static async obtenerCompra(req, res, next) {
    try {
      const { id } = req.params;
      const compra = await Compra.buscarPorId(id);
      
      if (!compra) {
        return next(new AppError('Compra no encontrada', 404));
      }
      
      res.json(crearRespuestaExitosa(compra, 'Compra obtenida exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener la compra', 500));
    }
  }

  static async crearCompra(req, res, next) {
    try {
      const compraData = {
        ...req.body,
        id_empleado: req.usuario.id_empleado // Obtenido del token JWT
      };

      const nuevaCompra = await Compra.crear(compraData);
      res.status(201).json(crearRespuestaExitosa(nuevaCompra, 'Compra creada exitosamente'));
    } catch (error) {
      next(new AppError('Error al crear la compra', 500));
    }
  }

  static async actualizarCompra(req, res, next) {
    try {
      const { id } = req.params;
      const compraActualizada = await Compra.actualizar(id, req.body);
      
      if (!compraActualizada) {
        return next(new AppError('Compra no encontrada', 404));
      }
      
      res.json(crearRespuestaExitosa(compraActualizada, 'Compra actualizada exitosamente'));
    } catch (error) {
      next(new AppError('Error al actualizar la compra', 500));
    }
  }

  static async eliminarCompra(req, res, next) {
    try {
      const { id } = req.params;
      const compraEliminada = await Compra.eliminar(id);
      
      if (!compraEliminada) {
        return next(new AppError('Compra no encontrada', 404));
      }
      
      res.json(crearRespuestaExitosa(null, 'Compra eliminada exitosamente'));
    } catch (error) {
      next(new AppError('Error al eliminar la compra', 500));
    }
  }

  static async comprasPorProveedor(req, res, next) {
    try {
      const { idProveedor } = req.params;
      const compras = await Compra.comprasPorProveedor(idProveedor);
      res.json(crearRespuestaExitosa(compras, 'Compras del proveedor obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las compras del proveedor', 500));
    }
  }

  static async comprasPorEmpleado(req, res, next) {
    try {
      const { idEmpleado } = req.params;
      const compras = await Compra.comprasPorEmpleado(idEmpleado);
      res.json(crearRespuestaExitosa(compras, 'Compras del empleado obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las compras del empleado', 500));
    }
  }

  static async comprasPorRangoFecha(req, res, next) {
    try {
      const { inicio, fin } = req.params;
      const compras = await Compra.comprasPorRangoFecha(inicio, fin);
      res.json(crearRespuestaExitosa(compras, 'Compras por rango de fecha obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las compras por fecha', 500));
    }
  }

  static async estadisticasMensuales(req, res, next) {
    try {
      const estadisticas = await Compra.estadisticasMensuales();
      res.json(crearRespuestaExitosa(estadisticas, 'Estadísticas mensuales obtenidas exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener las estadísticas mensuales', 500));
    }
  }

  static async historialComprasProducto(req, res, next) {
    try {
      const { idProducto } = req.params;
      const historial = await Compra.historialComprasProducto(idProducto);
      res.json(crearRespuestaExitosa(historial, 'Historial de compras del producto obtenido exitosamente'));
    } catch (error) {
      next(new AppError('Error al obtener el historial de compras del producto', 500));
    }
  }
}

module.exports = {
  listarCompras: CompraController.listarCompras,
  obtenerCompra: CompraController.obtenerCompra,
  crearCompra: CompraController.crearCompra,
  actualizarCompra: CompraController.actualizarCompra,
  eliminarCompra: CompraController.eliminarCompra,
  comprasPorProveedor: CompraController.comprasPorProveedor,
  comprasPorEmpleado: CompraController.comprasPorEmpleado,
  comprasPorRangoFecha: CompraController.comprasPorRangoFecha,
  estadisticasMensuales: CompraController.estadisticasMensuales,
  historialComprasProducto: CompraController.historialComprasProducto
};