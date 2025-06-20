const db = require('../../config/db');
const AppError = require('../../utils/appError');

class CompraController {
  static async listarCompras(req, res) { res.json([]); }
  static async obtenerCompra(req, res) { res.json({}); }
  static async crearCompra(req, res) { res.json({}); }
  static async actualizarCompra(req, res) { res.json({}); }
  static async eliminarCompra(req, res) { res.json({}); }
  static async comprasPorProveedor(req, res) { res.json([]); }
  static async comprasPorEmpleado(req, res) { res.json([]); }
  static async comprasPorRangoFecha(req, res) { res.json([]); }
  static async estadisticasMensuales(req, res) { res.json([]); }
  static async historialComprasProducto(req, res) { res.json([]); }
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