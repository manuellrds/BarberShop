const mysql = require('mysql2/promise');

const connection = mysql.createPool({
  host: '192.168.192.145',
  user: 'root',
  password: '160203',
  database: 'barber_dados'
});

// Usuários
const inserirUsuario = async (nome, email, senha, role) => {
  const [result] = await connection.execute(
      'INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)',
      [nome, email, senha, role]
  );
  return result;
};


const buscarUsuarioPorEmail = async (email) => {
  const [result] = await connection.execute(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return result;
};

// Barbeiros
const inserirBarbeiro = async (nome, especialidade) => {
  const [result] = await connection.execute(
    'INSERT INTO barbeiros (nome, especialidade) VALUES (?, ?)',
    [nome, especialidade]
  );
  return result;
};

const getBarbeiros = async () => {
  const [rows] = await connection.execute('SELECT * FROM barbeiros');
  return rows;
};

const atualizarBarbeiro = async (id, nome, especialidade) => {
  await connection.execute(
    'UPDATE barbeiros SET nome = ?, especialidade = ? WHERE id = ?',
    [nome, especialidade, id]
  );
};

const excluirBarbeiro = async (id) => {
  // Primeiro, exclua todos os agendamentos associados a esse barbeiro
  await connection.execute('DELETE FROM agendamentos WHERE barbeiro_id = ?', [id]);
  // Em seguida, exclua o barbeiro
  await connection.execute('DELETE FROM barbeiros WHERE id = ?', [id]);
};

// Cortes
const inserirCorte = async (nome, preco) => {
  const [result] = await connection.execute(
    'INSERT INTO cortes (nome, preco) VALUES (?, ?)',
    [nome, preco]
  );
  return result;
};

const getCortes = async () => {
  const [rows] = await connection.execute('SELECT * FROM cortes');
  return rows;
};

const atualizarCorte = async (id, nome, preco) => {
  await connection.execute(
    'UPDATE cortes SET nome = ?, preco = ? WHERE id = ?',
    [nome, preco, id]
  );
};

const excluirCorte = async (id) => {
  await connection.execute('DELETE FROM cortes WHERE id = ?', [id]);
};

// Horários
const inserirHorario = async (hora, disponivel) => {
  const [result] = await connection.execute(
    'INSERT INTO horarios (hora, disponivel) VALUES (?, ?)',
    [hora, disponivel]
  );
  return result;
};

const getHorarios = async () => {
  const [rows] = await connection.execute('SELECT * FROM horarios');
  return rows;
};

const atualizarHorario = async (id, { hora, disponivel }) => {
  await connection.execute(
    'UPDATE horarios SET hora = ?, disponivel = ? WHERE id = ?',
    [hora, disponivel, id]
  );
};

const excluirHorario = async (id) => {
  // Primeiro, exclua todos os agendamentos associados a esse horário
  await connection.execute('DELETE FROM agendamentos WHERE horario_id = ?', [id]);
  // Em seguida, exclua o horário
  await connection.execute('DELETE FROM horarios WHERE id = ?', [id]);
};


// Agendamentos
const inserirAgendamento = async (corte, barbeiro_id, horario_id, usuario_id, cliente, data) => {
  const [result] = await connection.execute(
    'INSERT INTO agendamentos (corte, barbeiro_id, horario_id, usuario_id, cliente, data) VALUES (?, ?, ?, ?, ?, ?)',
    [corte, barbeiro_id, horario_id, usuario_id, cliente, data]
  );
  return result;
};


const carregarAgendamentos = async () => {
  setLoading(true);
  try {
    const response = await axios.get('http://192.168.192.145:3000/agendamentos'); // Usando 192.168.192.145
    console.log('Dados recebidos:', response.data); // Adiciona um log aqui
    setAgendamentos(response.data); // Armazena os agendamentos no estado
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    Alert.alert('Erro', 'Erro ao carregar agendamentos');
  } finally {
    setLoading(false);
  }
};

const buscarAgendamentosCompletos = async () => {
  try {
    const [rows] = await connection.execute(`
      SELECT 
        agendamentos.id AS agendamento_id,
        agendamentos.corte AS corte_nome,
        barbeiros.nome AS barbeiro_nome,
        agendamentos.cliente AS cliente_nome,
        horarios.hora AS horario,
        agendamentos.data AS data
      FROM agendamentos
      LEFT JOIN usuarios ON agendamentos.usuario_id = usuarios.id
      LEFT JOIN barbeiros ON agendamentos.barbeiro_id = barbeiros.id
      LEFT JOIN horarios ON agendamentos.horario_id = horarios.id
    `);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    throw new Error('Erro ao buscar agendamentos');
  }
};

const agendar = async () => {
  const corteFinal = customCorte || 'Corte padrão'; // Define um nome padrão se customCorte estiver vazio

  if (!selectedBarbeiro || !selectedHorario || !dataAgendamento) {
    return Alert.alert('Erro', 'Todos os campos são obrigatórios!');
  }

  const dataFormatada = formatData(dataAgendamento); // Formata a data

  try {
    const response = await axios.post('http://192.168.192.145:3000/agendamentos', {
      corte: corteFinal,
      barbeiro_id: selectedBarbeiro,
      horario_id: selectedHorario,
      usuario_id: usuarioId,
      data: dataFormatada, // Envia a data formatada
    });

    Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
    navigation.goBack(); // Redireciona para a tela anterior
  } catch (error) {
    console.error('Erro ao agendar:', error);
    Alert.alert('Erro', 'Erro ao agendar o serviço');
  }
};

const atualizarAgendamento = async (id, corte, barbeiro_id, horario_id, cliente, data) => {
  try {
    const [result] = await connection.execute(
      'UPDATE agendamentos SET corte = ?, barbeiro_id = ?, horario_id = ?, cliente = ?, data = ? WHERE id = ?',
      [corte, barbeiro_id, horario_id, cliente, data, id]
    );
    return result;
  } catch (error) {
    console.error('Erro ao atualizar agendamento no banco de dados:', error);
    throw error;
  }
};

const excluirAgendamento = async (id) => {
  const [result] = await connection.execute('DELETE FROM agendamentos WHERE id = ?', [id]);
  return result;
};

// Criar feedback
const criarFeedback = async (mensagem) => {
  try {
    const [result] = await connection.execute(
      'INSERT INTO feedback (mensagem) VALUES (?)',
      [mensagem]
    );
    return result;
  } catch (error) {
    console.error('Erro ao criar feedback no banco de dados:', error);
    throw error;
  }
};

// Listar feedbacks
const listarFeedbacks = async () => {
  try {
    const [rows] = await connection.query('SELECT id, mensagem, data FROM feedback ORDER BY data DESC');
    return rows;
  } catch (error) {
    console.error('Erro ao listar feedbacks no banco de dados:', error);
    throw error;
  }
};


// Excluir feedback
const excluirFeedback = async (id) => {
  try {
    const [result] = await connection.execute('DELETE FROM feedback WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error('Erro ao excluir feedback no banco de dados:', error);
    throw error;
  }
};

const atualizarFeedback = async (id, mensagem) => {
  const [result] = await connection.execute(
    'UPDATE feedback SET mensagem = ? WHERE id = ?',
    [mensagem, id]
  );
  return result;
};

const getUsuario = async () => {
  try {
    const [rows] = await connection.execute('SELECT id FROM usuarios LIMIT 1'); // Ajuste a consulta conforme necessário
    return rows[0];
  } catch (error) {
    console.error('Erro ao buscar usuário no banco de dados:', error);
    throw error;
  }
};

const inserirPreco = async (nome, valor) => {
  const [result] = await connection.execute(
    'INSERT INTO precos (nome, valor) VALUES (?, ?)',
    [nome, valor]
  );
  return result;
};

const getPrecos = async () => {
  const [rows] = await connection.execute('SELECT * FROM precos');
  return rows;
};

const atualizarPreco = async (id, nome, valor) => {
  await connection.execute(
    'UPDATE precos SET nome = ?, valor = ? WHERE id = ?',
    [nome, valor, id]
  );
};

const excluirPreco = async (id) => {
  await connection.execute('DELETE FROM precos WHERE id = ?', [id]);
};

module.exports = {
  inserirUsuario,
  atualizarFeedback,
  getUsuario,
  buscarUsuarioPorEmail,
  inserirBarbeiro,
  excluirAgendamento,
  getBarbeiros,
  atualizarBarbeiro,
  excluirBarbeiro,
  atualizarAgendamento,
  excluirAgendamento,
  inserirCorte,
  getCortes,
  atualizarCorte,
  excluirCorte,
  inserirHorario,
  getHorarios,
  atualizarHorario,
  excluirHorario,
  inserirAgendamento,
  carregarAgendamentos,
  agendar,
  buscarAgendamentosCompletos,
  excluirFeedback,
  listarFeedbacks,
  criarFeedback,
  inserirPreco,
  getPrecos,
  atualizarPreco,
  excluirPreco,
};
