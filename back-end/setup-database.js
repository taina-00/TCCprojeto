const mysql = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
  });

  try {
    // Criar banco de dados
    await connection.query('CREATE DATABASE IF NOT EXISTS controleEstoque');
    await connection.query('USE controleEstoque');

    // Criar tabelas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS empresas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cnpj VARCHAR(18) NOT NULL UNIQUE,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS itens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        codigo VARCHAR(50) NOT NULL UNIQUE,
        nome_produto VARCHAR(100) NOT NULL,
        tipo_item ENUM('EPI', 'Material') NOT NULL,
        empresa_id INT,
        estoque_atual INT NOT NULL DEFAULT 0,
        estoque_critico INT NOT NULL,
        estoque_seguranca INT NOT NULL,
        estoque_maximo INT NOT NULL,
        estoque_minimo INT NOT NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS itens_epi (
        item_id INT PRIMARY KEY,
        ca VARCHAR(50) NOT NULL,
        tamanho ENUM('Único', 'P', 'M', 'G', 'GG') NOT NULL,
        FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS itens_material (
        item_id INT PRIMARY KEY,
        tipo_material VARCHAR(50) NOT NULL,
        dimensoes VARCHAR(50) NOT NULL,
        FOREIGN KEY (item_id) REFERENCES itens(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS movimentacoes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        item_id INT NOT NULL,
        usuario_id INT NOT NULL,
        tipo ENUM('entrada', 'saida') NOT NULL,
        quantidade INT NOT NULL,
        empresa_id INT,
        data DATE NOT NULL,
        data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES itens(id),
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL
      )
    `);

    // Inserir dados iniciais
    await connection.query(`
      INSERT IGNORE INTO empresas (nome, cnpj) VALUES
      ('Empresa 1', '12.345.678/0001-00'),
      ('Empresa 2', '98.765.432/0001-11'),
      ('Empresa 3', '45.678.901/0001-22')
    `);

    console.log('Banco de dados configurado com sucesso!');
  } catch (error) {
    console.error('Erro ao configurar o banco de dados:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();


