const path = require('path');
const envConfig = require('./envConfig');

const config = {
    // Configuración de la aplicación
    app: {
        name: 'Joytec API',
        version: '1.0.0',
        description: 'API para el sistema de gestión de joyería',
        port: envConfig.serverConfig.port,
        environment: envConfig.serverConfig.env,
        apiPrefix: envConfig.serverConfig.apiPrefix
    },

    // Configuración de CORS
    cors: {
        origin: envConfig.serverConfig.corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
        maxAge: 86400 // 24 horas
    },

    // Configuración de archivos estáticos
    static: {
        path: path.join(__dirname, '../../public'),
        options: {
            maxAge: '1d',
            etag: true,
            lastModified: true,
            dotfiles: 'ignore'
        }
    },

    // Configuración de seguridad
    security: {
        jwt: envConfig.jwtConfig,
        bcrypt: {
            saltRounds: envConfig.securityConfig.bcryptSaltRounds
        },
        rateLimit: {
            windowMs: envConfig.securityConfig.rateLimitWindow,
            max: envConfig.securityConfig.rateLimitMax
        },
        session: {
            secret: envConfig.securityConfig.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: envConfig.serverConfig.env === 'production',
                httpOnly: true,
                maxAge: envConfig.securityConfig.sessionExpiry
            }
        },
        helmet: {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
                }
            },
            referrerPolicy: { policy: 'same-origin' }
        }
    },

    // Configuración de logging
    logging: envConfig.loggingConfig,

    // Configuración de la base de datos
    database: envConfig.dbConfig,

    // Configuración de rutas
    routes: {
        auth: '/auth',
        users: '/users',
        products: '/products',
        categories: '/categories',
        suppliers: '/suppliers',
        purchases: '/purchases',
        sales: '/sales',
        reports: '/reports'
    },

    // Configuración de validación
    validation: {
        password: {
            minLength: 8,
            requireCapital: true,
            requireNumber: true,
            requireSpecial: true
        },
        pagination: {
            defaultLimit: 10,
            maxLimit: 100
        }
    },

    // Configuración de caché
    cache: {
        ttl: 60 * 60 * 1000, // 1 hora
        checkPeriod: 60 * 60 * 1000 // 1 hora
    }
};

module.exports = config;
