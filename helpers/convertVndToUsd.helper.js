const axios = require('axios');

async function convertVndToUsd(amount) {
    try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
        const rates = response.data.rates;

        const usdRate = rates.VND;

        if (usdRate) {
            const usdAmount = amount / usdRate;
            return usdAmount.toFixed(2);
        } else {
            console.log('Could not find VND/USD exchange rate.');
            return null;
        }
    } catch (error) {
        console.log('An error occurred while retrieving the exchange rate.');
        return null;
    }
}
module.exports = convertVndToUsd;
