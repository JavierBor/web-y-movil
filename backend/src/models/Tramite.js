const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tramite = sequelize.define('Tramite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tipo_tramite: {
        type: DataTypes.STRING(100),
        allowNull: false // Ej: "Permiso de Circulación", "Aseo"
    },
    estado_tramite: {
        type: DataTypes.STRING(50),
        defaultValue: 'Pendiente' // Puede ser: Pendiente, Aprobado, Rechazado
    },
    fecha_solicitud: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'tramites',
    timestamps: true // Crea automáticamente createdAt y updatedAt
});

module.exports = Tramite;