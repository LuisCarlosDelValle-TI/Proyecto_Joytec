require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { pool } = require('./Dash/config/db');
const errorHandler = require('./Dash/middleware/error');
const limiter = require('./Dash/middleware/ratel.limited');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importar rutas
const authRoutes = require('./Dash/routes/auth.routes');
const categoriasRoutes = require('./Dash/routes/categorias.routes');
const clientesRoutes = require('./Dash/routes/clientes.routes');
const empleadosRoutes = require('./Dash/routes/empleados.routes');
const productosRoutes = require('./Dash/routes/productos.routes');
const proveedoresRoutes = require('./Dash/routes/proveedores.routes');
const usuariosRoutes = require('./Dash/routes/usuarios.routes');
const comprasRoutes = require('./Dash/routes/compras.routes');
const registroRoutes = require('./Dash/routes/registro.routes');

// Configuración de la aplicación
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares globales
app.use(cors({
    origin: '*', // O especifica el origen de tu frontend, por ejemplo: 'http://127.0.0.1:5501'
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'Dashboards')));

// Test DB connection
pool.connect()
  .then(() => console.log('Conectado a PostgreSQL'))
  .catch(err => console.error('Error de conexión a PostgreSQL:', err));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Dashboards', 'html', 'index.html'));
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/auth', registroRoutes);

// Supón que tienes algo así en tu backend:
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    // Busca el usuario por correo
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [email]);
    const usuario = result.rows[0];
    if (!usuario) {
        return res.json({ success: false });
    }
    // Compara la contraseña ingresada con el hash
    const hash = usuario.contraseña; 
    const match = await bcrypt.compare(password, hash);
    if (match) {
        // Login correcto
        const token = jwt.sign({ id: usuario.id }, 'secreto', { expiresIn: '1h' });
        res.json({ success: true, token });
    } else {
        // Contraseña incorrecta
        res.json({ success: false });
    }
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando servidor...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Ejemplo de cómo hacer una solicitud con el token en los headers
const hacerSolicitudConToken = async () => {
  const token = 'tu_token_aqui';
  const response = await fetch('http://localhost:3001/api/algun-endpoint', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data);
};

hacerSolicitudConToken();
