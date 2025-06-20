exports.up = (pgm) => {
    pgm.createTable('productos', {
        id: { type: 'serial', primaryKey: true },
        codigo: { type: 'varchar(20)', notNull: true, unique: true },
        nombre: { type: 'varchar(100)', notNull: true },
        descripcion: { type: 'text' },
        precio_compra: { type: 'decimal(10,2)', notNull: true },
        precio_venta: { type: 'decimal(10,2)', notNull: true },
        stock: { type: 'integer', notNull: true, default: 0 },
        stock_minimo: { type: 'integer', notNull: true, default: 5 },
        categoria_id: {
            type: 'integer',
            notNull: true,
            references: '"categorias"',
            onDelete: 'RESTRICT'
        },
        fecha_registro: { type: 'timestamp', default: pgm.func('current_timestamp') },
        activo: { type: 'boolean', default: true }
    });

    pgm.createIndex('productos', 'codigo');
    pgm.createIndex('productos', 'categoria_id');
};

exports.down = (pgm) => {
    pgm.dropTable('productos');
};