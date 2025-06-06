"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simpleCache_1 = require("./lib/utils/simpleCache");
const app_1 = __importDefault(require("./app"));
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
app_1.default.listen(app_1.default.get('port'), () => {
    console.log(`Server is running on port ${app_1.default.get('port')}`);
});
setInterval(() => {
    (0, simpleCache_1.cleanExpiredCache)();
}, CLEANUP_INTERVAL_MS);
