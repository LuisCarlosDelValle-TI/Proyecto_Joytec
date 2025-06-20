exports.up = (pgm) => {
    pgm.createTable('usuarios', {
      id: { type: 'serial', primaryKey: true },
      username: { type: 'varchar(50)', notNull: true, unique: true },
      apellido_paterno: { type: 'varchar(50)', notNull: true },
      apellido_materno: { type: 'varchar(50)', notNull: true },
      correo: { type: 'varchar(100)', notNull: true, unique: true },
      password: { type: 'varchar(100)', notNull: true },
      telefono: { type: 'varchar(10)', notNull: true },
      rol: { type: 'varchar(20)', notNull: true },
      fecha_registro: { type: 'timestamp', default: pgm.func('current_timestamp') },
      activo: { type: 'boolean', default: true }
    });
  
    pgm.createIndex('usuarios', 'username');
    pgm.createIndex('usuarios', 'correo');
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('usuarios');
  };