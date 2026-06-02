const app = require('./app');
const sequelize = require('./config/database');
const bcrypt = require('bcrypt'); // Importado arriba para evitar errores en las funciones asíncronas

// 1. Importamos todos los modelos para que Sequelize los registre en memoria
require('./models/Usuario');
require('./models/Sucursal');
require('./models/Tramite');
require('./models/SolicitudTramite');

const PORT = 3000;
  
// FUNCIÓN AUTOMÁTICA DE SEEDING (Con tus datos reales de trámites)
async function poblarDatosBase() {
    try {
        // Obtenemos las referencias seguras de los modelos registrados
        const { Sucursal, Tramite, Usuario } = sequelize.models;

        // 1. Verificar e insertar Sucursales reales
        const conteoSucursales = await Sucursal.count();
        if (conteoSucursales === 0) {
            await Sucursal.bulkCreate([
                { 
                    id: 1, 
                    nombre_sucursal: 'Edificio Consistorial Av. Sta Teresa', 
                    direccion: 'Plaza de Armas 123', 
                    telefono: '+56352200000' 
                },
                { 
                    id: 2, 
                    nombre_sucursal: 'Edificio Plaza Cabildo', 
                    direccion: 'Av. Chile Intercomunal 456', 
                    telefono: '+56352200001' 
                }
            ], { ignoreDuplicates: true });
            console.log('Base de datos: Sucursales cargadas correctamente.');
        }

        // 2. Verificar e insertar el Catálogo de Trámites real (Incluye Plaza Cabildo)
        const conteoTramites = await Tramite.count();
        if (conteoTramites === 0) {
            await Tramite.bulkCreate([
                { 
                    id: 1, 
                    nombre_tramite: 'Permiso de Circulación', 
                    requiere_documentos: false 
                },
                { 
                    id: 2, 
                    nombre_tramite: 'Licencia de Conducir B', 
                    requiere_documentos: true 
                },
                { 
                    id: 3, 
                    nombre_tramite: 'Derechos de Aseo', 
                    requiere_documentos: false 
                },
                { 
                    id: 4, 
                    nombre_tramite: 'Patente Municipal', 
                    requiere_documentos: true 
                },
                { 
                    id: 5, 
                    nombre_tramite: 'Beca Municipal', 
                    requiere_documentos: true 
                }
            ], { ignoreDuplicates: true });
            console.log('Base de datos: Catálogo de trámites completo y sincronizado.');
        }

        // 3. Verificar e insertar Usuarios Base
        const conteoUsuarios = await Usuario.count();
        if (conteoUsuarios === 0) {
            const saltRounds = 10;
            // Encriptamos las contraseñas de prueba (EP 2.6 b)
            const passwordHashUser = await bcrypt.hash('user123', saltRounds);
            const passwordHashAdmin = await bcrypt.hash('admin123', saltRounds);

            await Usuario.bulkCreate([
                {
                    id: 1,
                    rut: '12.345.678-9',
                    nombre_usuario: 'Juan Pérez',
                    correo: 'user@santodomingo.cl',
                    region: 'Región Metropolitana',
                    comuna: 'Santiago',
                    contrasena_hash: passwordHashUser,
                    rol: 'contribuyente', 
                    "createdAt": new Date(),
                    "updatedAt": new Date()
                },
                {
                    id: 2,
                    rut: '22.345.678-9',
                    nombre_usuario: 'Admin',
                    correo: 'admin@santodomingo.cl',
                    region: 'Región Metropolitana',
                    comuna: 'Santiago',
                    contrasena_hash: passwordHashAdmin,
                    rol: 'admin', 
                    "createdAt": new Date(),
                    "updatedAt": new Date()
                }
            ], { ignoreDuplicates: true });
            console.log('Base de datos: Usuarios base (contribuyente y admin) listos.');
        }
    } catch (error) {
        console.error('Error al ejecutar el Seeding automático:', error);
    }
}

// 2. Crear las relaciones de manera segura una vez cargados los modelos
const { Usuario: ModelUsuario, Sucursal: ModelSucursal, Tramite: ModelTramite, SolicitudTramite } = sequelize.models;

ModelUsuario.hasMany(SolicitudTramite, { foreignKey: 'usuario_id' });
SolicitudTramite.belongsTo(ModelUsuario, { foreignKey: 'usuario_id' });

ModelSucursal.hasMany(SolicitudTramite, { foreignKey: 'sucursal_id' });
SolicitudTramite.belongsTo(ModelSucursal, { foreignKey: 'sucursal_id' });

ModelTramite.hasMany(SolicitudTramite, { foreignKey: 'tramite_id' });
SolicitudTramite.belongsTo(ModelTramite, { foreignKey: 'tramite_id' });


// 3. Sincronizar, poblar base de datos y levantar servidor
sequelize.sync({ alter: false }) 
    .then(async () => {
        console.log('Tablas y Relaciones sincronizadas en la base de datos.');
        
        // Ejecuta la inyección automática con tus datos exactos
        await poblarDatosBase();
        
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });