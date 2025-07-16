exports.up = (pgm) => {
    // Tabla principal de ventas
    pgm.createTable('ventas', {
        id_venta: { type: 'serial', primaryKey: true },
        fecha_venta: { type: 'timestamp', default: pgm.func('current_timestamp') },
        id_cliente: {
            type: 'integer',
            references: '"clientes"',
            onDelete: 'SET NULL'
        },
        id_empleado: {
            type: 'integer',
            notNull: true,
            references: '"empleados"',
            onDelete: 'RESTRICT'
        },
        subtotal: { type: 'decimal(12,2)', notNull: true },
        descuento: { type: 'decimal(12,2)', default: 0 },
        total: { type: 'decimal(12,2)', notNull: true },
        metodo_pago: { type: 'varchar(20)', notNull: true, default: 'efectivo' },
        estado: { type: 'varchar(20)', notNull: true, default: 'completada' },
        nota: { type: 'text' },
        activo: { type: 'boolean', default: true },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });

    // Tabla de detalle de ventas
    pgm.createTable('detalle_venta', {
        id_detalle: { type: 'serial', primaryKey: true },
        id_venta: {
            type: 'integer',
            notNull: true,
            references: '"ventas"',
            onDelete: 'CASCADE'
        },
        id_producto: {
            type: 'integer',
            notNull: true,
            references: '"productos"',
            onDelete: 'RESTRICT'
        },
        cantidad: { type: 'integer', notNull: true },
        precio_unitario: { type: 'decimal(10,2)', notNull: true },
        subtotal_producto: { type: 'decimal(12,2)', notNull: true }
    });

    // Crear índices para mejorar el rendimiento
    pgm.createIndex('ventas', 'fecha_venta');
    pgm.createIndex('ventas', 'id_cliente');
    pgm.createIndex('ventas', 'id_empleado');
    pgm.createIndex('ventas', 'estado');
    pgm.createIndex('detalle_venta', 'id_venta');
    pgm.createIndex('detalle_venta', 'id_producto');

    // Actualizar la tabla de compras para que sea consistente
    pgm.alterColumn('compras', 'id', { name: 'id_compra' });
    pgm.alterColumn('compras', 'proveedor_id', { name: 'id_proveedor' });
    
    // Agregar campos faltantes a compras si no existen
    pgm.addColumns('compras', {
        id_empleado: {
            type: 'integer',
            references: '"empleados"',
            onDelete: 'RESTRICT'
        },
        metodo_pago: { type: 'varchar(20)', default: 'efectivo' },
        nota: { type: 'text' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });

    // Actualizar tabla detalle_compra para consistencia
    pgm.alterColumn('detalle_compra', 'compra_id', { name: 'id_compra' });
    pgm.alterColumn('detalle_compra', 'producto_id', { name: 'id_producto' });
    pgm.renameColumn('detalle_compra', 'subtotal', 'subtotal_producto');
};

exports.down = (pgm) => {
    pgm.dropTable('detalle_venta');
    pgm.dropTable('ventas');
    
    // Revertir cambios en compras
    pgm.dropColumns('compras', ['id_empleado', 'metodo_pago', 'nota', 'created_at', 'updated_at']);
    pgm.alterColumn('compras', 'id_compra', { name: 'id' });
    pgm.alterColumn('compras', 'id_proveedor', { name: 'proveedor_id' });
    
    // Revertir cambios en detalle_compra
    pgm.alterColumn('detalle_compra', 'id_compra', { name: 'compra_id' });
    pgm.alterColumn('detalle_compra', 'id_producto', { name: 'producto_id' });
    pgm.renameColumn('detalle_compra', 'subtotal_producto', 'subtotal');
};
