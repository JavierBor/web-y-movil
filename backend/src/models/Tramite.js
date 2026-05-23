const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tramite = sequelize.define('Tramite', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_tramite: {
        type: DataTypes.STRING(100),
        allowNull: false // Ej: "Licencia de Conducir B", "Derechos de Aseo"
    },
    requiere_documentos: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Útil para saber si el frontend debe mostrar la pestaña de carga
    }
}, {
    tableName: 'tramites',
    timestamps: true
});

module.exports = Tramite;