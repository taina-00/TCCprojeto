// database.js
const mysql = require('mysql2/promise'); // Importe a versão Promise
require('dotenv').config(); // Para variáveis de ambiente

// Configuração do pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'controle_estoque',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para testar a conexão
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT 1 + 1 AS result');
    console.log('✅ Conexão bem-sucedida! Resultado do teste:', rows[0].result);
  } catch (err) {
    console.error('❌ Erro na conexão:', err.message);
  } finally {
    if (conn) conn.release(); // Libera a conexão de volta para o pool
  }
}

// Executa o teste
testConnection();

// Exporta o pool para uso em outros arquivos
module.exports = pool;