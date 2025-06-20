const winston = require('winston');
const { format } = winston;
const config = require('./index');

// Formato personalizado para los logs
const customFormat = format.combine(
    format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.printf(({ level, message, timestamp, stack, ...metadata }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (stack) {
            log += `\n${stack}`;
        }
        if (Object.keys(metadata).length > 0) {
            log += `\n${JSON.stringify(metadata, null, 2)}`;
        }
        return log;
    })
);

// Configuración de transports
const transports = [
    // Siempre loguear a la consola
    new winston.transports.Console({
        level: config.logging.level,
        format: format.combine(
            format.colorize(),
            customFormat
        )
    })
];

// Agregar transport de archivo si estamos en producción
if (config.app.environment === 'production') {
    transports.push(
        new winston.transports.File({
            filename: config.logging.filename,
            level: config.logging.level,
            format: customFormat,
            maxsize: config.logging.maxSize,
            maxFiles: config.logging.maxFiles,
            tailable: true
        })
    );
}

// Crear el logger
const logger = winston.createLogger({
    level: config.logging.level,
    format: customFormat,
    transports,
    // Manejo de excepciones no capturadas
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ],
    // Manejo de rechazos de promesas no capturados
    rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log' })
    ],
    exitOnError: false
});

// Agregar métodos de conveniencia para logging con contexto
logger.startTimer = () => {
    return {
        start: Date.now(),
        done: (message) => {
            const duration = Date.now() - this.start;
            logger.info(`${message} (${duration}ms)`);
        }
    };
};

logger.logRequest = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('HTTP Request', {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent'),
            ip: req.ip
        });
    });
    next();
};

logger.logError = (err, req) => {
    logger.error('Error de aplicación', {
        error: err.message,
        stack: err.stack,
        method: req?.method,
        url: req?.url,
        body: req?.body,
        user: req?.user?.id
    });
};

module.exports = logger;