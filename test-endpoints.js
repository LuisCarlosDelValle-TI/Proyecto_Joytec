const { pool } = require('./Dash/config/db');

// Probar la conexión y las consultas básicas
async function probarEndpoints() {
  try {
    console.log('Probando proveedores...');
    const proveedores = await pool.query('SELECT * FROM proveedores LIMIT 2');
    console.log('Proveedores:', proveedores.rows);

    console.log('\nProbando categorías...');
    const categorias = await pool.query('SELECT * FROM categorias LIMIT 2');
    console.log('Categorías:', categorias.rows);

    console.log('\nProbando empleados...');
    const empleados = await pool.query('SELECT * FROM empleados LIMIT 2');
    console.log('Empleados:', empleados.rows);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

probarEndpoints();
