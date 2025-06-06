"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const corsOptions = (req, callback) => {
    let options;
    if (config_1.default.app.env === 'development') {
        options = {
            origin: true,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        };
    }
    else {
        const allowedOrigins = config_1.default.app.corsOrigin
            ? Array.isArray(config_1.default.app.corsOrigin)
                ? config_1.default.app.corsOrigin
                : [config_1.default.app.corsOrigin]
            : [];
        options = {
            origin: (origin, originCallback) => {
                if (!origin) {
                    return originCallback(null, true);
                }
                if (allowedOrigins.includes(origin)) {
                    originCallback(null, true);
                }
                else {
                    originCallback(new Error('Not allowed by CORS'));
                }
            },
            credentials: false,
            methods: ['GET'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
            exposedHeaders: ['X-Total-Count'],
            maxAge: 86400,
            optionsSuccessStatus: 200,
        };
    }
    callback(null, options);
};
exports.default = corsOptions;
