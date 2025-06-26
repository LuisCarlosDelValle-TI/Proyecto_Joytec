const express = require('express');
const cors = require('cors');
const { pool } = require('./Dash/config/db');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Endpoint de proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_proveedor, razon_social, telefono, pais, estado, 
             ciudad, cp, tipo_proveedor
      FROM proveedores 
      ORDER BY id_proveedor ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Endpoint de categorías
app.get('/api/categorias', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_categoria, nombre_categoria
      FROM categorias 
      ORDER BY id_categoria ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Endpoint de empleados
app.get('/api/empleados', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_empleado, nombre, apellido_paterno, apellido_materno, 
             telefono, salario
      FROM empleados 
      ORDER BY id_empleado ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener empleados:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Endpoint de clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_cliente, nombre, apellido_paterno, apellido_materno, 
             telefono, correo, pais, estado, ciudad, cp, fecha_nacimiento
      FROM clientes 
      ORDER BY id_cliente ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Endpoint de productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id_producto, p.nombre, p.precio, p.stock_minimo, p.existencias, 
             p.id_categoria, c.nombre_categoria, 
             m.nombre_material
      FROM productos p 
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      LEFT JOIN materiales m ON p.id_material = m.id_material
      ORDER BY p.id_producto ASC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor',
      error: error.message 
    });
  }
});

// Servir archivos estáticos
app.use(express.static('./Dashboards'));

app.listen(PORT, () => {
  console.log(`Servidor de prueba corriendo en http://localhost:${PORT}`);
});
