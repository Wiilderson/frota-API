const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');
const Caminhao = require('./Caminhao');
const Motorista = require('./Motorista');

const Entrega = sequelize.define('Entregas', {
    descricao: {
        type: DataTypes.STRING
    },
    tipo: {
        type: DataTypes.STRING
    },
    valor: {
        type: DataTypes.FLOAT
    },
    destino: {
        type: DataTypes.ENUM('Nordeste', 'Argentina', 'Amazonia', 'Outros')
    },
    seguro: {
        type: DataTypes.BOOLEAN
    },
    indicadorValioso: {
        type: DataTypes.BOOLEAN,
    },
    indicadorSeguro: {
        type: DataTypes.STRING,
    },
    indicadorPerigoso: {
        type: DataTypes.BOOLEAN,
    },
});

// Entrega.belongsTo(Caminhao, { foreignKey: 'caminhaoId' });
// Entrega.belongsTo(Motorista, { foreignKey: 'motoristaId' });
Entrega.belongsTo(Caminhao, { foreignKey: 'caminhaoId', as: 'caminhoes' });
Entrega.belongsTo(Motorista, { foreignKey: 'motoristaId', as: 'motoristas' });

Entrega.beforeCreate(async (entrega) => {
    const caminhaoCadastrado = await Caminhao.findByPk(entrega.caminhaoId);

    if (!caminhaoCadastrado) throw new Error('Caminhão não encontrado');

    const entregasCaminhao = await Entrega.count({ where: { caminhaoId: caminhaoCadastrado.id } });
    if (entregasCaminhao >= 1) throw new Error('Caminhão vinculado a outra entrega');

    const entregasNoMesCaminhao = await Entrega.count({
        where: {
            caminhaoId: caminhaoCadastrado.id,
            createdAt: {
                [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
        },
    });
    if (entregasNoMesCaminhao >= 4) throw new Error('Caminhão já atingiu o limite de 4 entregas no mês');

    const motorista = await Motorista.findByPk(entrega.motoristaId);
    if (!motorista) throw new Error('Motorista não encontrado');

    const entregasNoMesMotorista = await Entrega.count({
        where: {
            motoristaId: motorista.id,
            createdAt: {
                [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
        },
    });
    if (entregasNoMesMotorista >= 2) throw new Error('Motorista já atingiu o limite de 2 entregas no mês');

    const entregasNordesteMotorista = await Entrega.count({
        where: {
            motoristaId: motorista.id,
            destino: 'Nordeste',
        },
    });
    if (entregasNordesteMotorista >= 1) throw new Error('Motorista já fez uma entrega para o Nordeste');
});

Entrega.beforeCreate((entrega) => {
    entrega.setDataValue('indicadorValioso', entrega.valor > 30000 ? true : false);
    entrega.setDataValue('indicadorSeguro', (entrega.tipo === 'eletronicos' && !entrega.seguro) ? 'sem seguro' : 'com seguro');
    entrega.setDataValue('indicadorPerigoso', entrega.tipo === 'combustivel' ? true : false);

    switch (entrega.destino) {
        case 'Nordeste':
            entrega.valor *= 1.2;
            break;
        case 'Argentina':
            entrega.valor *= 1.4;
            break;
        case 'Amazonia':
            entrega.valor *= 1.3;
            break;
    }
});

module.exports = Entrega;
