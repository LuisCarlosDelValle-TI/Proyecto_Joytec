const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/envConfig');
const AppError = require('./appError');

class JWTUtils {
    static generateToken(payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new AppError('Token expirado', 401);
            }
            if (error.name === 'JsonWebTokenError') {
                throw new AppError('Token inválido', 401);
            }
            throw new AppError('Error en la verificación del token', 401);
        }
    }

    static extractTokenFromHeader(req) {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            throw new AppError('No se proporcionó token de autenticación', 401);
        }
        return req.headers.authorization.split(' ')[1];
    }
}

module.exports = JWTUtils;