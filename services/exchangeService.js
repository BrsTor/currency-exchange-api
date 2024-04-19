const axios = require("axios");
const { Op } = require("sequelize");
const Currency = require("../models/currency");
const { populateCurrencies } = require("./currencyService"); // Import populateCurrencies function

async function convertCurrency(amount, from) {
    try {
        let conversionResults;

        // Try to fetch conversion rates from CoinMarketCap API
        try {
            const allCurrencies = ["BNB", "BS", "BTC", "ETH", "EUR", "USDT"];
            const updatedCurrencies = allCurrencies.filter(
                (currency) => currency !== from
            );
            conversionResults = await fetchConversionRatesFromAPI(
                amount,
                from,
                updatedCurrencies
            );
        } catch (apiError) {
            console.error(
                "Failed to fetch conversion rates from CoinMarketCap API:",
                apiError.message
            );
            console.log(
                "Attempting to fetch conversion rates from database..."
            );

            // Attempt to populate currencies again
            await populateCurrencies();
            // Fetch conversion rates from the database
            conversionResults = await fetchConversionRatesFromDatabase(
                amount,
                from
            );
        }

        return conversionResults;
    } catch (error) {
        throw new Error("Failed to convert currency. " + error);
    }
}

async function fetchConversionRatesFromAPI(amount, from, currencies) {
    const apiKey = process.env.COINMARKETCAP_API_KEY;
    const apiUrl =
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
    const headers = {
        "X-CMC_PRO_API_KEY": apiKey,
    };

    const conversionResults = {};
    for (const to of currencies) {
        const params = {
            symbol: from,
            convert: to,
        };
        const response = await axios.get(apiUrl, { params, headers });
        let conversionRate = response.data.data[from].quote[to].price;
        if (to === "BS") {
            
            const bsCurrency = await Currency.findOne({ where: { symbol: "BS" } });
            const fromCurrency = await Currency.findOne({ where: { symbol: from } });
            conversionRate = bsCurrency.price * fromCurrency.price
        }
        const convertedAmount = amount * conversionRate;

        conversionResults[to] = convertedAmount;
    }

    return conversionResults;
}

async function fetchConversionRatesFromDatabase(amount, from) {
    const currencies = await Currency.findAll({
        where: { symbol: { [Op.ne]: from } },
        order: [["symbol", "ASC"]],
    });
    const fromCurrency = await Currency.findOne({ where: { symbol: from } });
    const conversionResults = {};
    let convertedAmount = 0;
    for (const currency of currencies) {
        if (currency.symbol === "BS") {
            convertedAmount = amount * (fromCurrency.price * currency.price);
        } else {
            convertedAmount = amount * (fromCurrency.price / currency.price);
        }

        conversionResults[currency.symbol] = convertedAmount;
    }

    return conversionResults;
}

module.exports = {
    convertCurrency,
};
