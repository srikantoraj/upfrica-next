// /app/utils.js
/**
 * Converts the price from the base currency to the target currency.
 *
 * @param {number} price - The price in the base currency.
 * @param {string} baseCurrency - The code of the base currency (e.g., 'USD').
 * @param {string} targetCurrency - The code of the target currency (e.g., 'EUR').
 * @param {Array} rates - Array of exchange rate objects.
 * @returns {number} - The converted price.
 */
export const convertPrice = (price, baseCurrency, targetCurrency, rates) => {
    const baseRateObj = rates.find(rate => rate.currency === baseCurrency);
    const targetRateObj = rates.find(rate => rate.currency === targetCurrency);

    if (!baseRateObj || !targetRateObj) {
        // If either rate is missing, return the original price.
        return price;
    }

    // Calculate the conversion factor: (target rate / base rate)
    const conversionFactor = parseFloat(targetRateObj.rate) / parseFloat(baseRateObj.rate);
    return price * conversionFactor;
};
