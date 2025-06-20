exports.up = (pgm) => {
    pgm.createTable('compras', {
        id: { type: 'serial', primaryKey: true },
        proveedor_id: {
            type: 'integer',
            notNull: true,
            references: '"proveedores"',
            onDelete: 'RESTRICT'
        },
        fecha_compra: { type: 'timestamp', default: pgm.func('current_timestamp') },
        total: { type: 'decimal(12,2)', notNull: true },
        estado: { type: 'varchar(20)', notNull: true, default: 'pendiente' },
        activo: { type: 'boolean', default: true }
    });

    pgm.createTable('detalle_compra', {
        id: { type: 'serial', primaryKey: true },
        compra_id: {
            type: 'integer',
            notNull: true,
            references: '"compras"',
            onDelete: 'CASCADE'
        },
        producto_id: {
            type: 'integer',
            notNull: true,
            references: '"productos"',
            onDelete: 'RESTRICT'
        },
        cantidad: { type: 'integer', notNull: true },
        precio_unitario: { type: 'decimal(10,2)', notNull: true },
        subtotal: { type: 'decimal(12,2)', notNull: true }
    });

    pgm.createIndex('compras', 'proveedor_id');
    pgm.createIndex('detalle_compra', 'compra_id');
    pgm.createIndex('detalle_compra', 'producto_id');
};

exports.down = (pgm) => {
    pgm.dropTable('detalle_compra');
    pgm.dropTable('compras');
};