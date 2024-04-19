const CurrencyService = require("../services/currencyService");
const { handleError, handleSuccess } = require("../utils/apiUtils");

// Controller function to get all currencies
async function getAllCurrencies(req, res) {
    try {
        const currencies = await CurrencyService.getAllCurrencies();
        handleSuccess(res, currencies);
    } catch (error) {
        handleError(res, error);
    }
}

// Controller function to update currency price
async function updateCurrencyPrice(req, res) {
    try {
        const { id } = req.params;
        const { price } = req.body;
        await CurrencyService.updateCurrencyPrice(id, price);
        handleSuccess(
            res,
            `Currency ID:${id} price updated successfully to ${price}`
        );
    } catch (error) {
        handleError(res, error);
    }
}

// Controller function to update currency price
async function updateCurrencyStatus(req, res) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        // Validate isActive value
        if (typeof isActive !== "boolean") {
            return res
                .status(400)
                .json({ error: "isActive must be a boolean value" });
        }
        await CurrencyService.updateCurrencyStatus(id, isActive);
        handleSuccess(
            res,
            `Currency ID:${id} status updated successfully to ${isActive}`
        );
    } catch (error) {
        handleError(res, error);
    }
}

// Export controller functions
module.exports = {
    getAllCurrencies,
    updateCurrencyPrice,
    updateCurrencyStatus,
};
