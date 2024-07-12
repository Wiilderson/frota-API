const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Motorista = sequelize.define('Motorista', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cnh: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    entrega: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
});

// Motorista.hasMany(Entrega, { foreignKey: 'motoristaId' });

module.exports = Motorista;