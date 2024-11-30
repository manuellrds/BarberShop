const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '192.168.192.145',
    user: 'joao', // seu username
    password: 'joao', // sua senha
    database: 'Barber_dados' // nome do seu banco de dados
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

module.exports = connection;
