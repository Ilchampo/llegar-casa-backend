"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const simpleCache_1 = require("../lib/utils/simpleCache");
const responseHandler_1 = require("../lib/utils/responseHandler");
const htmlParser_1 = require("../lib/utils/htmlParser");
const apiCaller_1 = require("../lib/utils/apiCaller");
const form_data_1 = __importDefault(require("form-data"));
const config_1 = __importDefault(require("../config"));
class VehicleService {
    apiCaller;
    constructor() {
        this.apiCaller = new apiCaller_1.ApiCaller(config_1.default.services.vehicles.baseURL);
    }
    async getVehicle(licensePlate) {
        const cacheKey = `vehicle:${licensePlate}`;
        const cached = (0, simpleCache_1.getFromCache)(cacheKey);
        if (cached) {
            return cached;
        }
        const result = await responseHandler_1.ResponseHandler.handleApiCall(async () => {
            const form = new form_data_1.default();
            form.append('placa_vehiculo', licensePlate.replace('-', ''));
            const response = await this.apiCaller.post('/', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.length === 0) {
                throw new Error('No vehicle found');
            }
            const vehicle = (0, htmlParser_1.parseHtmlVehice)(response.data);
            return {
                data: vehicle,
                status: response.status,
            };
        }, 'Vehicle retrieved successfully');
        if (result.status >= 200 && result.status < 400) {
            (0, simpleCache_1.setInCache)(cacheKey, result, simpleCache_1.CacheTTL.VEHICLES);
        }
        return result;
    }
}
exports.VehicleService = VehicleService;
