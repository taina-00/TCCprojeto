const pool = require('../database/connection');

module.exports = {
  async list(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT i.*, 
          e.nome AS empresa_nome,
          IF(i.tipo_item = 'EPI', ie.ca, im.tipo_material) AS detalhe_principal
        FROM itens i
        LEFT JOIN empresas e ON i.empresa_id = e.id
        LEFT JOIN itens_epi ie ON i.id = ie.item_id AND i.tipo_item = 'EPI'
        LEFT JOIN itens_material im ON i.id = im.item_id AND i.tipo_item = 'Material'
      `);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async get(req, res) {
    try {
      const [rows] = await pool.query('SELECT * FROM itens WHERE id = ?', [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Item não encontrado' });
      }
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { codigo, nome_produto, tipo_item, estoque_atual } = req.body;
      
      const [result] = await pool.query('INSERT INTO itens SET ?', {
        codigo,
        nome_produto,
        tipo_item,
        estoque_atual
      });

      res.status(201).json({ id: result.insertId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      await pool.query('DELETE FROM itens WHERE id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};