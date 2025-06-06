"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parseCorsOrigin = (corsOrigin) => {
    if (!corsOrigin) {
        return undefined;
    }
    const origins = corsOrigin.split(',').map((origin) => origin.trim());
    return origins.length === 1 ? origins[0] : origins;
};
const config = {
    app: {
        port: parseInt(process.env.PORT ?? '3000'),
        env: process.env.NODE_ENV ?? 'development',
        corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN_WHITELIST) ?? 'http://localhost:5173',
    },
    services: {
        complaints: {
            baseURL: process.env.COMPLAINTS_BASE_URL ?? 'http://localhost:8000',
            timeout: parseInt(process.env.COMPLAINTS_TIMEOUT ?? '20000'),
        },
        vehicles: {
            baseURL: process.env.VEHICLES_BASE_URL ?? 'http://localhost:6000',
            timeout: parseInt(process.env.VEHICLES_TIMEOUT ?? '20000'),
        },
    },
};
exports.default = config;
