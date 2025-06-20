const pool = require('./config/db');
const { hashPassword } = require('./utils/password.utils');

async function seed() {
    try {
        // Crear categorías iniciales
        const categorias = [
            { nombre: 'Anillos', descripcion: 'Todo tipo de anillos' },
            { nombre: 'Collares', descripcion: 'Collares y cadenas' },
            { nombre: 'Pulseras', descripcion: 'Pulseras y brazaletes' },
            { nombre: 'Aretes', descripcion: 'Aretes y pendientes' },
            { nombre: 'Relojes', descripcion: 'Relojes de lujo' }
        ];

        for (const categoria of categorias) {
            await pool.query(
                'INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING',
                [categoria.nombre, categoria.descripcion]
            );
        }

        // Crear usuario administrador por defecto
        const adminPassword = await hashPassword('Admin123!');
        await pool.query(
            'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
            ['Administrador', 'admin@joytec.com', adminPassword, 'admin']
        );

        // Crear métodos de pago
        const metodosPago = [
            { nombre: 'Efectivo', descripcion: 'Pago en efectivo' },
            { nombre: 'Tarjeta de Crédito', descripcion: 'Pago con tarjeta de crédito' },
            { nombre: 'Tarjeta de Débito', descripcion: 'Pago con tarjeta de débito' },
            { nombre: 'Transferencia', descripcion: 'Pago por transferencia bancaria' }
        ];

        for (const metodo of metodosPago) {
            await pool.query(
                'INSERT INTO metodos_pago (nombre, descripcion) VALUES ($1, $2) ON CONFLICT (nombre) DO NOTHING',
                [metodo.nombre, metodo.descripcion]
            );
        }

        // Crear proveedor de prueba
        await pool.query(
            `INSERT INTO proveedores 
            (razon_social, telefono, pais, estado, ciudad, cp, tipo_proveedor) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            ON CONFLICT (razon_social) DO NOTHING`,
            ['Joyería Mayorista SA de CV', '5555555555', 'México', 'CDMX', 'Ciudad de México', '01000', 'nacional']
        );

        // Crear productos de prueba
        const productos = [
            {
                nombre: 'Anillo de Oro 14K',
                descripcion: 'Anillo de oro de 14 quilates',
                precio: 1999.99,
                stock: 10,
                id_categoria: 1
            },
            {
                nombre: 'Collar de Plata 925',
                descripcion: 'Collar de plata sterling',
                precio: 899.99,
                stock: 15,
                id_categoria: 2
            }
        ];

        for (const producto of productos) {
            await pool.query(
                `INSERT INTO productos 
                (nombre, descripcion, precio, stock, id_categoria) 
                VALUES ($1, $2, $3, $4, $5) 
                ON CONFLICT (nombre) DO NOTHING`,
                [producto.nombre, producto.descripcion, producto.precio, producto.stock, producto.id_categoria]
            );
        }

        console.log('Base de datos inicializada con éxito');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    } finally {
        await pool.end();
    }
}

// Ejecutar el seed
seed();