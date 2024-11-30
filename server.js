const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database');
const app = express();

// Definição da porta
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const { buscarAgendamentosCompletos } = require('./database');

app.get('/agendamentos/completos', async (req, res) => {
    try {
        const agendamentos = await buscarAgendamentosCompletos();
        if (agendamentos.length === 0) {
            return res.status(404).json({ message: 'Nenhum agendamento encontrado.' });
        }
        res.json(agendamentos);
    } catch (error) {
        console.error('Erro ao buscar agendamentos completos:', error);
        res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
    }
});

// Rotas de Autenticação
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, role } = req.body; 
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Nome, email e senha são obrigatórios!' });
  }
  try {
    const existingUser = await db.buscarUsuarioPorEmail(email);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    await db.inserirUsuario(nome, email, senhaCriptografada, role || 'user');
    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
  }
});

app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }
  try {
    const usuarios = await db.buscarUsuarioPorEmail(email);
    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuarios[0].senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    const isAdmin = usuarios[0].role === 'admin'; 
    return res.status(200).json({ 
      message: 'Login bem-sucedido', 
      usuario: {
        id: usuarios[0].id,
        nome: usuarios[0].nome,
        email: usuarios[0].email,
        isAdmin,
      }
    });
  } catch (err) {
    console.error('Erro ao realizar login:', err);
    return res.status(500).json({ message: 'Erro ao realizar login' });
  }
});

// Rotas para Cortes
app.get('/cortes', async (req, res) => {
  try {
    const cortes = await db.getCortes();
    res.json(cortes);
  } catch (error) {
    console.error('Erro ao buscar cortes:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/cortes', async (req, res) => {
  try {
    const { nome, preco } = req.body;
    const result = await db.inserirCorte(nome, preco);
    res.status(201).json({ id: result.insertId, nome, preco });
  } catch (error) {
    console.error('Erro ao adicionar corte:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/cortes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco } = req.body;
    await db.atualizarCorte(id, nome, preco);
    res.json({ id, nome, preco });
  } catch (error) {
    console.error('Erro ao atualizar corte:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.excluirAgendamento(id);
    res.status(200).json({ message: 'Agendamento excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir agendamento' });
  }
});

// Rotas para Barbeiros
app.get('/barbeiros', async (req, res) => {
  try {
    const barbeiros = await db.getBarbeiros();
    res.json(barbeiros);
  } catch (error) {
    console.error('Erro ao buscar barbeiros:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/barbeiros', async (req, res) => {
  try {
    const { nome, especialidade } = req.body;
    const result = await db.inserirBarbeiro(nome, especialidade);
    res.status(201).json({ id: result.insertId, nome, especialidade });
  } catch (error) {
    console.error('Erro ao adicionar barbeiro:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/barbeiros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, especialidade } = req.body;
    await db.atualizarBarbeiro(id, nome, especialidade);
    res.json({ id, nome, especialidade });
  } catch (error) {
    console.error('Erro ao atualizar barbeiro:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/barbeiros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.excluirBarbeiro(id);
    res.json({ message: 'Barbeiro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir barbeiro:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Horários
app.get('/horarios', async (req, res) => {
  try {
    const horarios = await db.getHorarios();
    res.json(horarios);
  } catch (error) {
    console.error('Erro ao buscar horários:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/horarios', async (req, res) => {
  try {
    const { hora, disponivel } = req.body;
    const result = await db.inserirHorario(hora, disponivel);
    res.status(201).json({ id: result.insertId, hora, disponivel });
  } catch (error) {
    console.error('Erro ao adicionar horário:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/horarios/:id', async (req, res) => {
  const { id } = req.params;
  const { hora, disponivel } = req.body;
  try {
    const result = await db.atualizarHorario(id, { hora, disponivel });
    res.status(200).json({ message: 'Horário atualizado com sucesso!', result });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar horário' });
  }
});

app.delete('/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.excluirHorario(id);
    res.json({ message: 'Horário excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir horário:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rotas para Agendamentos
app.post('/agendamentos', async (req, res) => {
  const { corte, barbeiro_id, horario_id, usuario_id, cliente, data } = req.body;
  if (!corte || !barbeiro_id || !horario_id || !usuario_id || !cliente || !data) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const result = await db.inserirAgendamento(corte, barbeiro_id, horario_id, usuario_id, cliente, data);
    res.status(201).json({ message: 'Agendamento realizado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao salvar agendamento:', error);
    res.status(500).json({ error: 'Erro ao salvar agendamento' });
  }
});

app.get('/agendamentos', async (req, res) => {
  try {
    const agendamentos = await db.buscarAgendamentosCompletos();
    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    res.status(500).json({ message: 'Erro ao buscar agendamentos' });
  }
});

app.put('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { corte, barbeiro_id, horario_id, cliente, data } = req.body;

  console.log('Recebendo dados para atualização:', { id, corte, barbeiro_id, horario_id, cliente, data });

  if (!corte || !barbeiro_id || !horario_id || !cliente || !data) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    await db.atualizarAgendamento(id, corte, barbeiro_id, horario_id, cliente, data);
    res.status(200).json({ message: 'Agendamento atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Erro ao atualizar agendamento' });
  }
});

app.delete('/agendamentos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.excluirAgendamento(id);
    res.status(200).json({ message: 'Agendamento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ error: 'Erro ao excluir agendamento' });
  }
});

// Criar feedback
app.post('/feedback', async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ error: 'A mensagem é obrigatória' });
  }

  try {
    await db.criarFeedback(mensagem);
    res.status(201).json({ message: 'Feedback enviado com sucesso' });
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    res.status(500).json({ error: 'Erro ao enviar feedback' });
  }
});

// Listar feedbacks
app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await db.listarFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Erro ao listar feedbacks:', error);
    res.status(500).json({ error: 'Erro ao listar feedbacks' });
  }
});

app.put('/feedback/:id', async (req, res) => {
  const { id } = req.params;
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ message: 'A mensagem é obrigatória' });
  }

  try {
    await db.atualizarFeedback(id, mensagem); // Certifique-se de que db.atualizarFeedback está correto
    res.status(200).json({ message: 'Feedback atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar feedback:', error);
    res.status(500).json({ message: 'Erro ao atualizar feedback', error });
  }
});

// Excluir feedback
app.delete('/feedback/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.excluirFeedback(id);
    res.status(200).json({ message: 'Feedback excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir feedback:', error);
    res.status(500).json({ error: 'Erro ao excluir feedback' });
  }
});

// Endpoint para obter o ID do usuário
app.get('/usuario', async (req, res) => {
  try {
    const usuario = await db.getUsuario(); // Supondo que você tenha uma função para buscar o usuário no banco de dados
    res.status(200).json(usuario);
  } catch (error) {
    console.error('Erro ao obter usuário:', error);
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
});

// Excluir agendamentos por horário
app.delete('/agendamentos/porHorario/:horarioId', async (req, res) => {
  const { horarioId } = req.params;
  try {
    await db.query('DELETE FROM agendamentos WHERE horario_id = ?', [horarioId]);
    res.status(200).send({ message: 'Agendamentos excluídos com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir agendamentos:', error);
    res.status(500).send({ message: 'Erro ao excluir agendamentos', error });
  }
});

// Adicionando a importação das funções corretas do database.js
const { inserirPreco, getPrecos, atualizarPreco, excluirPreco } = require('./database');

// ... (outras rotas e middleware)

// Rotas para Preços
app.get('/precos', async (req, res) => {
  try {
    const precos = await getPrecos();
    res.json(precos);
  } catch (error) {
    console.error('Erro ao buscar preços:', error);
    res.status(500).send({ error: 'Erro ao buscar preços' });
  }
});

app.post('/precos', async (req, res) => {
  try {
    const { nome, valor } = req.body;
    const result = await inserirPreco(nome, valor);
    res.status(201).send(result);
  } catch (error) {
    console.error('Erro ao adicionar preço:', error);
    res.status(500).send({ error: 'Erro ao adicionar preço' });
  }
});

app.put('/precos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, valor } = req.body;
    await atualizarPreco(id, nome, valor);
    res.status(200).send({ id, nome, valor });
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    res.status(500).send({ error: 'Erro ao atualizar preço' });
  }
});

app.delete('/precos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await excluirPreco(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir preço:', error);
    res.status(500).send({ error: 'Erro ao excluir preço' });
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Iniciar o servidor
app.listen(PORT, (error) => {
  if (error) {
    console.error("Erro ao iniciar o servidor:", error);
  } else {
    console.log(`Servidor rodando na porta ${PORT}`);
  }
});
