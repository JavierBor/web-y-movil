const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudTramite = sequelize.define('SolicitudTramite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    estado_tramite: {
        type: DataTypes.STRING(50),
        defaultValue: 'Pendiente' // Pendiente, Confirmada, Rechazada (para el Admin)
    },
    documentos_url: {
        type: DataTypes.STRING(255),
        allowNull: true // Aquí guardas el path o link del archivo subido (Licencia de conducir)
    },
    fecha_cita: {
        type: DataTypes.DATEONLY,
        allowNull: true // El día seleccionado en el frontend
    },
    hora_cita: {
        type: DataTypes.TIME,
        allowNull: true // La hora seleccionada en el frontend
    },
    comprobante_url: {
        type: DataTypes.STRING(255),
        allowNull: true // Para que el usuario o admin descarguen el comprobante
    }
}, {
    tableName: 'solicitudes_tramites',
    timestamps: true
});

module.exports = SolicitudTramite;