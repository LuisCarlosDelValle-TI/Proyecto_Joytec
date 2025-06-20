const { pool } = require('../config/db');

class Proveedor {
  static async create({ razonSocial, contacto, pais, estado, ciudad, codigoPostal, tipoProveedor }) {
    const query = `
      INSERT INTO proveedores 
      (razon_social, contacto, pais, estado, ciudad, codigo_postal, tipo_proveedor)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [razonSocial, contacto, pais, estado, ciudad, codigoPostal, tipoProveedor];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM proveedores WHERE activo = true ORDER BY fecha_registro DESC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM proveedores WHERE id = $1 AND activo = true';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async update(id, { razonSocial, contacto, pais, estado, ciudad, codigoPostal, tipoProveedor }) {
    const query = `
      UPDATE proveedores 
      SET razon_social = $1, contacto = $2, pais = $3, estado = $4, 
          ciudad = $5, codigo_postal = $6, tipo_proveedor = $7
      WHERE id = $8
      RETURNING *;
    `;
    const values = [razonSocial, contacto, pais, estado, ciudad, codigoPostal, tipoProveedor, id];
    
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'UPDATE proveedores SET activo = false WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }
}

module.exports = Proveedor;