const { pool } = require('../../config/db');

module.exports = {
  listarClientes: (req, res) => res.json([]),
  obtenerCliente: (req, res) => res.json({}),
  crearCliente: (req, res) => res.json({}),
  actualizarCliente: (req, res) => res.json({}),
  eliminarCliente: (req, res) => res.json({})
};