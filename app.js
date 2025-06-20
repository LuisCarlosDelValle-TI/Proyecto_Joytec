require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const { pool } = require('./Dash/config/db');
<<<<<<< HEAD
const client = require('./Dash/config/database');

// Importar rutas
const authRoutes = require('./Dash/routes/authRoutes');
const categoriasRoutes = require('./Dash/routes/categoriasRoutes');
const clientesRoutes = require('./Dash/routes/clientesRoutes'); // Corrección aquí
const empleadosRoutes = require('./Dash/routes/empleadosRoutes');
const productosRoutes = require('./Dash/routes/productosRoutes');
const proveedoresRoutes = require('./Dash/routes/proveedoresRoutes');
const usuariosRoutes = require('./Dash/routes/usuariosRoutes');
const comprasRoutes = require('./Dash/routes/comprasRoutes'); // Importar las rutas de compras
=======
const errorHandler = require('./Dash/middleware/error');
const limiter = require('./Dash/middleware/ratel.limited');

// Importar rutas
const authRoutes = require('./Dash/routes/auth.routes');
const categoriasRoutes = require('./Dash/routes/categorias.routes');
const clientesRoutes = require('./Dash/routes/clientes.routes');
const empleadosRoutes = require('./Dash/routes/empleados.routes');
const productosRoutes = require('./Dash/routes/productos.routes');
const proveedoresRoutes = require('./Dash/routes/proveedores.routes');
const usuariosRoutes = require('./Dash/routes/usuarios.routes');
const comprasRoutes = require('./Dash/routes/compras.routes');
>>>>>>> 556a526 (Primer commit)

// Configuración de la aplicación
const app = express();
const PORT = process.env.PORT || 3001;

<<<<<<< HEAD
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error de conexión a PostgreSQL:', err);
  } else {
    console.log('Conectado a PostgreSQL at:', res.rows[0].now);
  }
});

app.get('/', (req, res) => {
  client.query('SELECT NOW()', (err, result) => {
    if (err) {
      console.error('Error ejecutando la consulta', err.stack);
      res.status(500).send('Error en la consulta');
    } else {
      res.send(`Hora actual en la base de datos: ${result.rows[0].now}`);
    }
  });
});

// Rutas
=======
// Middlewares globales
app.use(cors());
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
>>>>>>> 556a526 (Primer commit)
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/usuarios', usuariosRoutes);
<<<<<<< HEAD
app.use('/api/compras', comprasRoutes); // Conectar las rutas de compras

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

=======
app.use('/api/compras', comprasRoutes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

>>>>>>> 556a526 (Primer commit)
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

<<<<<<< HEAD
let usuarios = [
  // Ejemplo de usuarios existentes
  { id: 1, username: 'usuario1', apellidoPaterno: 'Paterno1', apellidoMaterno: 'Materno1', correo: 'correo1@example.com', telefono: '1234567890', rol: 'usuario' },
  { id: 2, username: 'usuario2', apellidoPaterno: 'Paterno2', apellidoMaterno: 'Materno2', correo: 'correo2@example.com', telefono: '0987654321', rol: 'admin' }
];

// Ruta para obtener la lista de usuarios
app.get('/Dash/migrations', (req, res) => {
  res.json(usuarios);
});

// Ruta para registrar un nuevo usuario
app.post('/Dash/migrations/', (req, res) => {
  const { username, apellidoPaterno, apellidoMaterno, correo, password, telefono, rol } = req.body;

  // Generar un nuevo ID para el usuario
  const nuevoUsuario = {
    id: usuarios.length + 1,
    username,
    apellidoPaterno,
    apellidoMaterno,
    correo,
    password,
    telefono,
    rol
  };

  // Agregar el nuevo usuario a la lista
  usuarios.push(nuevoUsuario);

  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    data: {
      usuario: nuevoUsuario
    }
  });
});

// Ruta para eliminar un usuario por ID
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const usuarioIndex = usuarios.findIndex(usuario => usuario.id === parseInt(id));

  if (usuarioIndex !== -1) {
    const usuarioEliminado = usuarios.splice(usuarioIndex, 1);
    res.status(200).json({
      message: 'Usuario eliminado exitosamente',
      data: {
        usuario: usuarioEliminado[0]
      }
    });
  } else {
    res.status(404).json({
      message: 'Usuario no encontrado'
    });
  }
=======
// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando servidor...');
  console.log(err.name, err.message);
  process.exit(1);
>>>>>>> 556a526 (Primer commit)
});