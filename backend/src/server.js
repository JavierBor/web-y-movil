const app = require('./app');
const sequelize = require('./config/database');
const Usuario = require('./models/Usuario'); // Importamos el modelo

const PORT = 3000;

// Sincronizar la base de datos y luego levantar el servidor
sequelize.sync({ force: false }) // force: false evita que se borren los datos al reiniciar
    .then(() => {
        console.log('Tablas sincronizadas en la base de datos.');
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });