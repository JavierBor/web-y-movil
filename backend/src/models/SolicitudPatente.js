const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudPatente = sequelize.define('SolicitudPatente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Datos del negocio
    nombre_negocio: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    rubro: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    direccion_comercial: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    tipo_patente: {
        type: DataTypes.ENUM('comercial', 'industrial', 'profesional', 'servicios'),
        allowNull: false,
        defaultValue: 'comercial'
    },
    // Documentos requeridos
    rut_documento_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    patente_anterior_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    certificado_dgi_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    // Estado del trámite
    estado: {
        type: DataTypes.ENUM('Pendiente', 'En Revisión', 'Aprobada', 'Rechazada'),
        defaultValue: 'Pendiente'
    },
    observaciones: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // Fechas importantes
    fecha_revision: {
        type: DataTypes.DATE,
        allowNull: true
    },
    fecha_aprobacion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // Llaves foráneas
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    sucursal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sucursales',
            key: 'id'
        }
    }
}, {
    tableName: 'solicitudes_patentes',
    timestamps: true
});

module.exports = SolicitudPatente;