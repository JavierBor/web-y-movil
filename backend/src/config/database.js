const { Sequelize } = require('sequelize');

// Configuración de la conexión a PostgreSQL
const sequelize = new Sequelize('tramites_db', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false // Para que no llene la consola de mensajes de SQL
});

// Probando la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos PostgreSQL establecida con éxito.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
};

testConnection();

module.exports = sequelize;