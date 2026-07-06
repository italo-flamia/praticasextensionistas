const express = require('express');
const router = express.Router();
const { criarContatoController } = require('../controllers/contatoController');

router.post('/', criarContatoController);

module.exports = router;
