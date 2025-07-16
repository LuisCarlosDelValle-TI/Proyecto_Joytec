const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const compression = require('compression');

const config = require('./index');
const corsOptions = require('./cors');
const logger = require('./logger');

const configureMiddleware = (app) => {
    // Seguridad básica con helmet
    app.use(helmet(config.security.helmet));

    // Configuración de CORS
    app.use(cors(corsOptions));

    // Parseo de JSON y URL-encoded
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Compresión de respuestas
    app.use(compression());

    // Logging de solicitudes HTTP
    if (config.app.environment === 'development') {
        app.use(morgan('dev'));
    } else {
        app.use(logger.logRequest);
    }

    // Límite de tasa de solicitudes
    const limiter = rateLimit({
        windowMs: config.security.rateLimit.windowMs,
        max: config.security.rateLimit.max,
        message: 'Demasiadas solicitudes desde esta IP, por favor intente nuevamente más tarde',
        standardHeaders: true,
        legacyHeaders: false
    });
    app.use(limiter);

    // Configuración de sesión
    app.use(session({
        ...config.security.session,
        name: 'sessionId',
        store: createSessionStore(), // Implementar según necesidades
    }));

    // Servir archivos estáticos
    app.use(
        express.static(config.static.path, config.static.options)
    );

    // Middleware personalizado para manejar errores 404
    app.use((req, res, next) => {
        const error = new Error('No encontrado');
        error.status = 404;
        next(error);
    });

    // Middleware de manejo de errores
    app.use((err, req, res, next) => {
        logger.logError(err, req);

        // No exponer detalles del error en producción
        const error = config.app.environment === 'production' ? 
            { message: 'Error interno del servidor' } : 
            { message: err.message, stack: err.stack };

        res.status(err.status || 500).json({
            success: false,
            error
        });
    });
};

const createSessionStore = () => {
    return null;
};

module.exports = configureMiddleware;