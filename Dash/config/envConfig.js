require('dotenv').config();


const envConfig = {
    // Configuración de la base de datos
    dbConfig: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        ssl: process.env.DB_SSL === 'true',
        maxPool: parseInt(process.env.DB_MAX_POOL, 10) || 20,
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT, 10) || 30000
    },

    // Configuración de JWT
    jwtConfig: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        algorithm: process.env.JWT_ALGORITHM || 'HS256'
    },

    // Configuración del servidor
    serverConfig: {
        port: parseInt(process.env.PORT, 10) || 3001,
        env: process.env.NODE_ENV || 'development',
        corsOrigin: process.env.CORS_ORIGIN || '*',
        apiPrefix: process.env.API_PREFIX || '/api/v1'
    },

    // Configuración de seguridad
    securityConfig: {
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15 * 60 * 1000, // 15 minutos
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
        sessionSecret: process.env.SESSION_SECRET || 'session-secret',
        sessionExpiry: parseInt(process.env.SESSION_EXPIRY, 10) || 24 * 60 * 60 * 1000 // 24 horas
    },

    // Configuración de logging
    loggingConfig: {
        level: process.env.LOG_LEVEL || 'info',
        filename: process.env.LOG_FILE || 'app.log',
        maxSize: process.env.LOG_MAX_SIZE || '10m',
        maxFiles: parseInt(process.env.LOG_MAX_FILES, 10) || 5
    }
};

// Validación de configuraciones críticas
const requiredEnvVars = [
    'DB_USER',
    'DB_PASSWORD',
    'DB_NAME',
    'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    throw new Error(`Variables de entorno requeridas no encontradas: ${missingEnvVars.join(', ')}`);
}

module.exports = envConfig;
