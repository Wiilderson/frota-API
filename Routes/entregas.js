const express = require('express');
const router = express.Router();
const Entrega = require('../models/Entrega');
const Caminhao = require('../models/Caminhao');
const Motorista = require('../models/Motorista');

router.get('/', async (req, res) => {
    const entregas = await Entrega.findAll({
        include: [
            { model: Caminhao, as: 'caminhoes' },
            { model: Motorista, as: 'motoristas' },
        ]
    });
    res.json(entregas);
});

router.post('/create', async (req, res) => {

    try {
        const novaEntrega = await Entrega.create(req.body);
        console.log("testando", novaEntrega);
        res.json(novaEntrega);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
