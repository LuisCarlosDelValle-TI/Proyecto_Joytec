const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/envConfig');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};

exports.registrar = async (req, res, next) => {
  try {
    const { username, apellidoPaterno, apellidoMaterno, correo, password, telefono, rol } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findByUsername(username);
    if (usuarioExistente) {
      return next(new AppError('El nombre de usuario ya está en uso', 400));
    }

    const nuevoUsuario = await Usuario.create({
      username,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      password,
      telefono,
      rol
    });

    const token = signToken(nuevoUsuario.id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        usuario: nuevoUsuario
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // 1) Verificar si el usuario y la contraseña existen
    if (!username || !password) {
      return next(new AppError('Por favor ingrese usuario y contraseña', 400));
    }

    // 2) Verificar si el usuario existe
    const usuario = await Usuario.findByUsername(username);
    if (!usuario) {
      return next(new AppError('Usuario o contraseña incorrectos', 401));
    }

    // 3) Verificar contraseña
    const isCorrect = await Usuario.comparePassword(password, usuario.password);
    if (!isCorrect) {
      return next(new AppError('Usuario o contraseña incorrectos', 401));
    }

    // 4) Si todo está bien, enviar token al cliente
    const token = signToken(usuario.id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        usuario: {
          id: usuario.id,
          username: usuario.username,
          rol: usuario.rol
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.protect = (req, res, next) => {
    // ...implementación de la función protect...
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // ...implementación de la función restrictTo...
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
        }
        next();
    };
};

// ...otras exportaciones...