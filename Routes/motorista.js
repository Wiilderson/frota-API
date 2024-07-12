const express = require('express');
const router = express.Router();
const Motorista = require('../models/Motorista')

router.get('/', async (req, res) => {
    const motorista = await Motorista.findAll();
    res.json(motorista);
})

router.post('/create', async (req, res) => {
    const novoMotorista = await Motorista.create(req.body);
    res.json(novoMotorista);
});

module.exports = router;