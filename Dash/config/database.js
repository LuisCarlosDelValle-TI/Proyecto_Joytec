require('dotenv').config();
const { Client } = require('pg');

const { dbConfig } = require('./envConfig');

class Database {
    constructor() {
        this.client = new Client({
            user: dbConfig.user,
            host: dbConfig.host,
            database: dbConfig.database,
            password: dbConfig.password,
            port: dbConfig.port,
            ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false
        });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Conexión exitosa a la base de datos');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.client.end();
            console.log('Desconexión exitosa de la base de datos');
        } catch (error) {
            console.error('Error al desconectar de la base de datos:', error);
            throw error;
        }
    }

    async query(text, params) {
        try {
            const start = Date.now();
            const result = await this.client.query(text, params);
            const duration = Date.now() - start;
            console.log('Consulta ejecutada:', { text, duration, rows: result.rowCount });
            return result;
        } catch (error) {
            console.error('Error en la consulta:', error);
            throw error;
        }
    }

    async transaction(callback) {
        try {
            await this.query('BEGIN');
            const result = await callback(this);
            await this.query('COMMIT');
            return result;
        } catch (error) {
            await this.query('ROLLBACK');
            throw error;
        }
    }
}

module.exports = new Database();
