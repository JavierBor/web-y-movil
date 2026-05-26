const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SolicitudBeca = sequelize.define('SolicitudBeca', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Datos del estudiante
    nombre_estudiante: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    rut_estudiante: {
        type: DataTypes.STRING(12),
        allowNull: false
    },
    institucion: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    carrera: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    nivel_estudio: {
        type: DataTypes.ENUM('basica', 'media', 'superior', 'postgrado'),
        allowNull: false
    },
    ingreso_familiar: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    // Documentos requeridos
    certificado_alumno_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    concentracion_notas_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    certificado_renta_url: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    fotocopia_cedula_url: {
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
    fecha_resolucion: {
        type: DataTypes.DATE,
        allowNull: true
    },
    monto_asignado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Monto de beca asignado en pesos chilenos'
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
    tableName: 'solicitudes_becas',
    timestamps: true
});

module.exports = SolicitudBeca;