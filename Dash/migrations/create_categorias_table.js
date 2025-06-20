exports.up = (pgm) => {
    pgm.createTable('categorias', {
        id: { type: 'serial', primaryKey: true },
        nombre: { type: 'varchar(50)', notNull: true, unique: true },
        descripcion: { type: 'text' },
        fecha_registro: { type: 'timestamp', default: pgm.func('current_timestamp') },
        activo: { type: 'boolean', default: true }
    });

    pgm.createIndex('categorias', 'nombre');
};

exports.down = (pgm) => {
    pgm.dropTable('categorias');
};