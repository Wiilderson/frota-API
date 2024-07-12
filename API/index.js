require('dotenv').config();
const express = require('express');
const sequelize = require('../config/database');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/caminhoes', require('../routes/caminhoes'));
app.use('/motoristas', require('../routes/motorista'));
app.use('/entregas', require('../routes/entregas'));

sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log('Servidor rodando na porta ' + port);
    });
});
