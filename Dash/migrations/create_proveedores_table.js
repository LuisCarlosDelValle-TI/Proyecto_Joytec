exports.up = (pgm) => {
    pgm.createTable('proveedores', {
      id: { type: 'serial', primaryKey: true },
      razon_social: { type: 'varchar(100)', notNull: true },
      contacto: { type: 'varchar(10)', notNull: true },
      pais: { type: 'varchar(40)', notNull: true },
      estado: { type: 'varchar(40)', notNull: true },
      ciudad: { type: 'varchar(40)', notNull: true },
      codigo_postal: { type: 'varchar(5)', notNull: true },
      tipo_proveedor: { type: 'varchar(10)', notNull: true },
      fecha_registro: { type: 'timestamp', default: pgm.func('current_timestamp') },
      activo: { type: 'boolean', default: true }
    });
  
    pgm.createIndex('proveedores', 'razon_social');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('proveedores');
  };