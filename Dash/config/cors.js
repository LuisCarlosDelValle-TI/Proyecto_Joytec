const config = require('./index');

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = config.cors.origin === '*' 
            ? true 
            : config.cors.origin.split(',').map(o => o.trim());

        // Permitir solicitudes sin origen (como las aplicaciones móviles o postman)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins === true || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: config.cors.methods,
    allowedHeaders: config.cors.allowedHeaders,
    exposedHeaders: config.cors.exposedHeaders,
    credentials: config.cors.credentials,
    maxAge: config.cors.maxAge,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

module.exports = corsOptions;