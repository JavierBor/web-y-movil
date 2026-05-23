const app = require('./app');
const sequelize = require('./config/database');

// 1. Importar todos los modelos
const Usuario = require('./models/Usuario');
const Sucursal = require('./models/Sucursal');
const Tramite = require('./models/Tramite');
const SolicitudTramite = require('./models/SolicitudTramite'); // Agrupado aquí

const PORT = 3000;

// 2. Crear las relaciones
// 1. Un usuario puede hacer muchas solicitudes de trámites
Usuario.hasMany(SolicitudTramite, { foreignKey: 'usuario_id' });
SolicitudTramite.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// 2. Una sucursal puede recibir muchas solicitudes
Sucursal.hasMany(SolicitudTramite, { foreignKey: 'sucursal_id' });
SolicitudTramite.belongsTo(Sucursal, { foreignKey: 'sucursal_id' });

// 3. Una solicitud pertenece a un tipo de trámite específico del catálogo
Tramite.hasMany(SolicitudTramite, { foreignKey: 'tramite_id' });
SolicitudTramite.belongsTo(Tramite, { foreignKey: 'tramite_id' });

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