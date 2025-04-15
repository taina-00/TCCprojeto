const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');
const movementController = require('../controllers/movementController');

// Rotas de usuário
router.post('/login', authController.login);
router.post('/usuarios', authController.register);

// Rotas de itens
router.get('/itens', itemController.list);
router.get('/itens/:id', itemController.get);
router.post('/itens', itemController.create);
router.delete('/itens/:id', itemController.delete);

// Rotas de movimentações
router.get('/movimentacoes', movementController.list);
router.post('/movimentacoes', movementController.create);

module.exports = router;