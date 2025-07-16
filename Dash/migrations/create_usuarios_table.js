exports.up = (pgm) => {
    pgm.createTable('usuarios', {
      id_usuario: { type: 'serial', primaryKey: true },
      nombre_usuario: { type: 'varchar(255)', notNull: true, unique: true },
      contraseña: { type: 'varchar(255)', notNull: true },
      id_empleado: { type: 'integer', notNull: true },
      correo: { type: 'varchar(100)', notNull: true, unique: true },
      // Campos adicionales opcionales que puedes agregar después
      apellido_paterno: { type: 'varchar(50)', notNull: false },
      apellido_materno: { type: 'varchar(50)', notNull: false },
      telefono: { type: 'varchar(10)', notNull: false },
      rol: { type: 'varchar(20)', notNull: false, default: 'user' },
      fecha_registro: { type: 'timestamp', default: pgm.func('current_timestamp') },
      activo: { type: 'boolean', default: true }
    });
  
    pgm.createIndex('usuarios', 'nombre_usuario');
    pgm.createIndex('usuarios', 'correo');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('usuarios');
  };