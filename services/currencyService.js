const axios = require("axios");
const Currency = require("../models/currency");

// Service function to fetch currency data from CoinMarketCap API
async function fetchCurrencyDataFromCoinMarketCapAPI() {
    const apiKey = process.env.COINMARKETCAP_API_KEY;
    const apiUrl =
        "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
    const params = {
        symbol: "BTC,ETH,BNB,USDT,EUR",
        convert: "USD",
    };
    const headers = {
        "X-CMC_PRO_API_KEY": apiKey,
    };

    try {
        const response = await axios.get(apiUrl, { params, headers });
        return response.data.data;
    } catch (error) {
        throw new Error("Failed to fetch currency data from CoinMarketCap API");
    }
}

// Service function to fetch currency data from pyDolarVenezuela API
async function fetchCurrencyDataFrompyDolarVenezuelaAPI() {
    try {
        const pyDolarVenezuelaUrl =
            "https://pydolarvenezuela-api.vercel.app/api/v1/dollar";
        const params = {
            page: "bcv",
        };
        const pyDolarVenezuelaResponse = await axios.get(pyDolarVenezuelaUrl, {
            params,
        });
        return pyDolarVenezuelaResponse.data.monitors;
    } catch (error) {
        throw new Error(
            "Failed to fetch currency data from pyDolarVenezuela API"
        );
    }
}

// Service function to populate currencies in the database
async function populateCurrencies() {
    try {
        const currencyCryptoData =
            await fetchCurrencyDataFromCoinMarketCapAPI();
        const currencies = Object.entries(currencyCryptoData).map(
            ([symbol, data]) => ({
                name: data.name,
                symbol: symbol,
                price: data.quote.USD.price,
            })
        );
        const currencyFiatData =
            await fetchCurrencyDataFrompyDolarVenezuelaAPI();
        currencies.push({
            name: "Bolivares",
            symbol: "BS",
            price: currencyFiatData.usd.price,
        });
        currencies.push({
            name: "Euro",
            symbol: "EUR",
            price: currencyFiatData.eur.price / currencyFiatData.usd.price,
        });
        // Loop through each currency and update or insert into the database
        for (const currency of currencies) {
            await Currency.upsert(currency, { where: { symbol: currency.symbol } });
        }
        console.log("Currencies populated successfully");
    } catch (error) {
        throw new Error("Failed to populate currencies");
    }
}

// Service function to get all currencies from the database
async function getAllCurrencies() {
    try {
        const currencies = await Currency.findAll({
            where: { isActive: true },
            order: [["symbol", "ASC"]],
        });
        return currencies;
    } catch (error) {
        throw new Error("Failed to fetch currencies");
    }
}

// Service function to update currency price
async function updateCurrencyPrice(id, price) {
    try {
        await Currency.update({ price: price }, { where: { id: id } });
    } catch (error) {
        throw new Error("Failed to update currency price");
    }
}

// Service function to update currency price
async function updateCurrencyStatus(id, isActive) {
    try {
        await Currency.update({ isActive: isActive }, { where: { id: id } });
    } catch (error) {
        throw new Error("Failed to update currency status");
    }
}

module.exports = {
    populateCurrencies,
    getAllCurrencies,
    updateCurrencyPrice,
    updateCurrencyStatus,
};
