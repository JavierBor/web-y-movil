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
        defaultValue: 'Pendiente'
    },
    documentos_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_cita: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    hora_cita: {
        type: DataTypes.TIME,
        allowNull: true
    },
    comprobante_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    
    datos_extra: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {}
    },
    
    tipo_tramite: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'general'
    },
    // Llaves foráneas
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sucursal_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tramite_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'solicitudes_tramites',
    timestamps: true
});

module.exports = SolicitudTramite;