const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true
    },
    nombre_usuario: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    region: {
        type: DataTypes.STRING(50)
    },
    comuna: {
        type: DataTypes.STRING(50)
    },
    contrasena_hash: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING(20),
        defaultValue: 'ciudadano'
    }
}, {
    tableName: 'usuarios',
    timestamps: true
});

module.exports = Usuario;