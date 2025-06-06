"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const helmetOptions = {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    xContentTypeOptions: true,
    xFrameOptions: { action: 'deny' },
    xXssProtection: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    hsts: config_1.default.app.env === 'production'
        ? {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        }
        : false,
    hidePoweredBy: true,
};
exports.default = helmetOptions;
