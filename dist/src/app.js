"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const rateLimit_1 = require("./config/rateLimit");
const simpleCache_1 = require("./lib/utils/simpleCache");
const complaints_routes_1 = __importDefault(require("./routes/complaints.routes"));
const vehicles_routes_1 = __importDefault(require("./routes/vehicles.routes"));
const helmet_2 = __importDefault(require("./config/helmet"));
const cors_2 = __importDefault(require("./config/cors"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.set('port', config_1.default.app.port);
app.use((0, helmet_1.default)(helmet_2.default));
app.use((0, cors_1.default)(cors_2.default));
app.use(rateLimit_1.apiRateLimit);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({
        message: 'Service is healthy',
        status: 200,
        data: {
            environment: config_1.default.app.env,
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            cache: (0, simpleCache_1.getCacheStats)(),
        },
    });
});
app.use('/api/complaints', rateLimit_1.dataFetchRateLimit, complaints_routes_1.default);
app.use('/api/vehicles', rateLimit_1.dataFetchRateLimit, vehicles_routes_1.default);
app.get('/', rateLimit_1.basicRateLimit, (req, res) => {
    res.send('Llegar a Casa Backend - Running on port ' + app.get('port'));
});
exports.default = app;
