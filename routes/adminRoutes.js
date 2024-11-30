const express = require('express');
const router = express.Router();
const db = require('../dbConfig'); // Conexão com o banco de dados MySQL

// Cortes
router.post('/cortes', async (req, res) => {
    const { nome, preco } = req.body;
  
    // Validação simples
    if (!nome || !preco) {
      return res.status(400).send({ message: 'Nome e preco do corte são obrigatórios!' });
    }
  
    const query = 'INSERT INTO cortes (nome, preco) VALUES (?, ?)';
    try {
      await db.execute(query, [nome, preco]);
      res.status(201).send({ message: 'Corte adicionado com sucesso!' });
    } catch (error) {
      res.status(500).send({ message: 'Erro ao adicionar corte', error });
    }
  });
  
  router.get('/cortes', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM cortes');
      res.status(200).json(rows); // Retorna todos os cortes cadastrados
    } catch (error) {
      res.status(500).send({ message: 'Erro ao buscar cortes', error });
    }
  });
  
  // Horários
  router.post('/horarios', async (req, res) => {
    const { hora, disponivel } = req.body;
  
    // Validação simples
    if (!hora || disponivel === undefined) {
      return res.status(400).send({ message: 'Hora e status de disponibilidade são obrigatórios!' });
    }
  
    const query = 'INSERT INTO horarios (hora, disponivel) VALUES (?, ?)';
    try {
      await db.execute(query, [hora, disponivel]);
      res.status(201).send({ message: 'Horário adicionado com sucesso!' });
    } catch (error) {
      res.status(500).send({ message: 'Erro ao adicionar horário', error });
    }
  });
  
  router.get('/horarios', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM horarios');
      res.status(200).json(rows); // Retorna todos os horários cadastrados
    } catch (error) {
      res.status(500).send({ message: 'Erro ao buscar horários', error });
    }
  });
  

// Barbeiros
router.post('/barbeiros', async (req, res) => {
  const { nome, especialidade } = req.body;
  const query = 'INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)';
  try {
    await db.execute(query, [nome, especialidade]);
    res.status(201).send({ message: 'Barbeiro adicionado com sucesso!' });
  } catch (error) {
    res.status(500).send({ message: 'Erro ao adicionar barbeiro', error });
  }
});



module.exports = router;
