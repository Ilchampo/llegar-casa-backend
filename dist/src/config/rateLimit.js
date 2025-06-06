"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicRateLimit = exports.dataFetchRateLimit = exports.apiRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const config_1 = __importDefault(require("../config"));
// Time windows (in milliseconds)
const ONE_MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;
// Request limits for production environment
const PROD_GENERAL_API_LIMIT = 100;
const PROD_DATA_FETCH_LIMIT = 30;
// Request limits for development environment
const DEV_GENERAL_API_LIMIT = 1000;
const DEV_DATA_FETCH_LIMIT = 100;
// Request limits for basic endpoints
const BASIC_ENDPOINT_LIMIT = 60;
const rateLimitMessage = {
    message: 'Too many requests',
    status: 429,
    error: 'Rate limit exceeded. Please try again later.',
};
exports.apiRateLimit = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.app.env === 'production' ? FIFTEEN_MINUTES : ONE_MINUTE,
    max: config_1.default.app.env === 'production' ? PROD_GENERAL_API_LIMIT : DEV_GENERAL_API_LIMIT,
    message: rateLimitMessage,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json(rateLimitMessage);
    },
});
exports.dataFetchRateLimit = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.app.env === 'production' ? FIFTEEN_MINUTES : ONE_MINUTE,
    max: config_1.default.app.env === 'production' ? PROD_DATA_FETCH_LIMIT : DEV_DATA_FETCH_LIMIT,
    message: {
        message: 'Too many data requests',
        status: 429,
        error: 'Rate limit exceeded for data fetching. Please wait before making more requests.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many data requests',
            status: 429,
            error: 'Rate limit exceeded for data fetching. Please wait before making more requests.',
        });
    },
    skip: (req) => {
        return req.path === '/' || req.path === '/health';
    },
});
exports.basicRateLimit = (0, express_rate_limit_1.default)({
    windowMs: ONE_MINUTE,
    max: BASIC_ENDPOINT_LIMIT,
    message: rateLimitMessage,
    standardHeaders: true,
    legacyHeaders: false,
});
