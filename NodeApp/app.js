const express = require('express');
const mysql = require('mysql');
const app = express();

require('dotenv').config();

// Função para tentar conectar ao banco de dados com retentativas
function connectToDatabase() {
  const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
  });

  connection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err.message);
      setTimeout(connectToDatabase, 2000); // Tenta novamente após 2 segundos
    } else {
      console.log('Conexão bem-sucedida ao banco de dados');
    }
  });

  connection.on('error', (err) => {
    console.error('Erro de conexão com o banco de dados:', err.message);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectToDatabase(); // Reconectar em caso de conexão perdida
    } else {
      throw err;
    }
  });

  return connection;
}

// Rota para buscar produtos
app.get('/produtos', (req, res) => {
  const dbConnection = connectToDatabase();

  dbConnection.query('SELECT * FROM produtos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });

  dbConnection.end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});