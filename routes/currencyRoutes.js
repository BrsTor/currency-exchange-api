const express = require("express");
const router = express.Router();
const currencyController = require("../controllers/currencyController");

// Route to get all currencies
router.get("/", currencyController.getAllCurrencies);

// Route to update currency price
router.patch('/:id', currencyController.updateCurrencyPrice);

// Route to update currency price
router.patch('/:id/status', currencyController.updateCurrencyStatus);

module.exports = router;
