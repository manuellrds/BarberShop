const express = require('express');
const bodyParser = require('body-parser');
const { inserirUsuario } = require('./database'); // Certifique-se de que o caminho está correto

const app = express();
app.use(bodyParser.json()); // Para analisar o corpo da solicitação JSON

// Rota para cadastrar usuários
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const result = await inserirUsuario(nome, email, senha);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
});

// Exporte a aplicação Express
module.exports = app;
