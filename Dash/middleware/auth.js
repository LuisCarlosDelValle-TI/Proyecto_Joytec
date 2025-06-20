const jwt = require('jsonwebtoken');
const config = require('../config');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }
    const decoded = jwt.verify(token, config.security.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }
  next();
};

const verificarRol = (rolesPermitidos) => (req, res, next) => {
  if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
    return res.status(403).json({ error: 'Acceso no autorizado' });
  }
  next();
};

module.exports = {
  verificarToken: authMiddleware,
  authMiddleware,
  adminMiddleware,
  verificarRol
};
