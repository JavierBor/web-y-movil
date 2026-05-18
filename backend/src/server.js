const app = require('./app');
const sequelize = require('./config/database');

// 1. Importar todos los modelos
const Usuario = require('./models/Usuario');
const Sucursal = require('./models/Sucursal');
const Tramite = require('./models/Tramite');

const PORT = 3000;

// 2. Crear las relaciones (Ese "algo" que los identifica)
// Un Usuario tiene muchos Trámites
Usuario.hasMany(Tramite, { foreignKey: 'usuarioId' });
Tramite.belongsTo(Usuario, { foreignKey: 'usuarioId' });

// Una Sucursal tiene muchos Trámites
Sucursal.hasMany(Tramite, { foreignKey: 'sucursalId' });
Tramite.belongsTo(Sucursal, { foreignKey: 'sucursalId' });

// 3. Sincronizar y levantar servidor
sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('Tablas y Relaciones sincronizadas en la base de datos.');
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });