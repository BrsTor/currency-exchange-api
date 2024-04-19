const ExchangeService = require('../services/exchangeService');
const { handleError, handleSuccess } = require('../utils/apiUtils');

// Controller function to convert currency
async function convertCurrency(req, res) {
  try {
    const { amount, from } = req.body;
    const result = await ExchangeService.convertCurrency(amount, from);
    handleSuccess(res, result);
  } catch (error) {
    handleError(res, error);
  }
}

// Export controller functions
module.exports = {
  convertCurrency,
};