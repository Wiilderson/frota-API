const express = require('express');
const router = express.Router();
const Caminhao = require('../models/Caminhao')

router.get('/', async (req, res) => {
    const caminhoes = await Caminhao.findAll();
    res.json(caminhoes);
})

router.post('/create', async (req, res) => {
    const novoCaminhao = await Caminhao.create(req.body);
    res.json(novoCaminhao);
});

module.exports = router;