const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Tu conexión a la DB

const Sucursal = sequelize.define('Sucursal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre_sucursal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // Forzamos a que en PostgreSQL la tabla se llame exactamente "sucursales"
    tableName: 'sucursales', 
    // Al activar timestamps, Sequelize crea automáticamente 'createdAt' y 'updatedAt'
    timestamps: true 
});

module.exports = Sucursal;