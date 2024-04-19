const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchangeController');

// Route to convert currency
router.get('/convert', exchangeController.convertCurrency);

module.exports = router;