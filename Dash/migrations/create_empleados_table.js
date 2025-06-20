exports.up = (pgm) => {
    pgm.createTable('empleados', {
        id: { type: 'serial', primaryKey: true },
        nombre: { type: 'varchar(50)', notNull: true },
        apellido_paterno: { type: 'varchar(50)', notNull: true },
        apellido_materno: { type: 'varchar(50)', notNull: true },
        correo: { type: 'varchar(100)', notNull: true, unique: true },
        telefono: { type: 'varchar(10)', notNull: true },
        puesto: { type: 'varchar(50)', notNull: true },
        salario: { type: 'decimal(10,2)', notNull: true },
        fecha_contratacion: { type: 'date', notNull: true },
        fecha_registro: { type: 'timestamp', default: pgm.func('current_timestamp') },
        activo: { type: 'boolean', default: true }
    });

    pgm.createIndex('empleados', 'correo');
};

exports.down = (pgm) => {
    pgm.dropTable('empleados');
};