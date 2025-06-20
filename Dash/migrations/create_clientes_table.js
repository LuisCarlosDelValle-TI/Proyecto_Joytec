exports.up = (pgm) => {
    pgm.createTable('clientes', {
        id: { type: 'serial', primaryKey: true },
        nombre: { type: 'varchar(50)', notNull: true },
        apellido_paterno: { type: 'varchar(50)', notNull: true },
        apellido_materno: { type: 'varchar(50)', notNull: true },
        correo: { type: 'varchar(100)', notNull: true, unique: true },
        telefono: { type: 'varchar(10)', notNull: true },
        direccion: { type: 'text', notNull: true },
        fecha_registro: { type: 'timestamp', default: pgm.func('current_timestamp') },
        activo: { type: 'boolean', default: true }
    });

    pgm.createIndex('clientes', 'correo');
};

exports.down = (pgm) => {
    pgm.dropTable('clientes');
};