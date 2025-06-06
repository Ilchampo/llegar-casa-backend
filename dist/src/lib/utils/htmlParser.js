"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHtmlVehice = void 0;
const cheerio_1 = require("cheerio");
/**
 * Parse the HTML to get the vehicle information
 * @param html - The HTML to parse
 * @returns The vehicle information
 * @throws An error if the HTML cannot be parsed
 */
const parseHtmlVehice = (html) => {
    try {
        if (!html || html.trim().length === 0) {
            throw new Error('HTML content is empty');
        }
        const $ = (0, cheerio_1.load)(html);
        const vehicle = {
            licensePlate: $('h5:contains("Placa")').next('p').text().trim(),
            brand: $('h5:contains("Marca")').next('p').text().trim(),
            model: $('h5:contains("Modelo")').next('p').text().trim(),
            year: parseInt($('h5:contains("Año Vehículo")').next('p').text().trim(), 10),
            color: $('h5:contains("Color")').next('p').text().trim(),
            stolen: $('h5:contains("Reportado Robado")').next('p').text().trim() === 'NO' ? false : true,
        };
        return vehicle;
    }
    catch (error) {
        throw new Error(`Error parsing Vehicle HTML: ${error instanceof Error ? error.message : error}`);
    }
};
exports.parseHtmlVehice = parseHtmlVehice;
