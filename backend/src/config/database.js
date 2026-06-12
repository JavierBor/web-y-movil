const { Sequelize } = require('sequelize');

// 🔒 EF 3: Cargamos las credenciales de forma segura desde las variables de entorno
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false // Para que no llene la consola de mensajes de SQL
    }
);

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