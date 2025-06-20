const { Pool } = require('pg');
const { dbConfig } = require('./envConfig');

class DatabasePool {
    constructor() {
        this.pool = new Pool({
            user: dbConfig.user,
            host: dbConfig.host,
            database: dbConfig.database,
            password: dbConfig.password,
            port: dbConfig.port,
            ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
            max: dbConfig.maxPool,
            idleTimeoutMillis: dbConfig.idleTimeout,
            connectionTimeoutMillis: 2000
        });

        this.pool.on('connect', () => {
            console.log('Nueva conexión establecida en el pool');
        });

        this.pool.on('error', (err, client) => {
            console.error('Error inesperado en el cliente del pool:', err);
            console.error('Cliente afectado:', client);
        });

        this.pool.on('remove', () => {
            console.log('Conexión removida del pool');
        });
    }

    async query(text, params) {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Consulta ejecutada:', {
                text,
                duration,
                rows: result.rowCount
            });
            return result;
        } catch (error) {
            console.error('Error en la consulta:', error);
            throw error;
        }
    }

    async getClient() {
        const client = await this.pool.connect();
        const query = client.query;
        const release = client.release;

        // Sobrescribir la función query para logging
        client.query = (...args) => {
            client.lastQuery = args;
            return query.apply(client, args);
        };

        // Sobrescribir la función release para logging
        client.release = () => {
            client.query = query;
            client.release = release;
            return release.apply(client);
        };

        return client;
    }

    async transaction(callback) {
        const client = await this.getClient();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async end() {
        try {
            await this.pool.end();
            console.log('Pool de conexiones cerrado exitosamente');
        } catch (error) {
            console.error('Error al cerrar el pool de conexiones:', error);
            throw error;
        }
    }
}

const db = new DatabasePool();

process.on('SIGINT', async () => {
    try {
        await db.end();
        process.exit(0);
    } catch (error) {
        console.error('Error durante el cierre de la aplicación:', error);
        process.exit(1);
    }
});

module.exports = db;
