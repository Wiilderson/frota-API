const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Caminhao = sequelize.define('Caminhoes', {
    placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    modelo: {
        type: DataTypes.STRING,
    },
    capacidade: {
        type: DataTypes.INTEGER,
    }
});

// Caminhao.hasMany(Entrega, { foreignKey: 'caminhaoId' });

module.exports = Caminhao;