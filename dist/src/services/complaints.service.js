"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintsService = void 0;
const simpleCache_1 = require("../lib/utils/simpleCache");
const responseHandler_1 = require("../lib/utils/responseHandler");
const apiCaller_1 = require("../lib/utils/apiCaller");
const config_1 = __importDefault(require("../config"));
class ComplaintsService {
    apiCaller;
    constructor() {
        this.apiCaller = new apiCaller_1.ApiCaller(config_1.default.services.complaints.baseURL);
    }
    async getComplaints(licensePlate) {
        const cacheKey = `complaints:${licensePlate}`;
        const cached = (0, simpleCache_1.getFromCache)(cacheKey);
        if (cached) {
            return cached;
        }
        const result = await responseHandler_1.ResponseHandler.handleApiCall(async () => {
            const response = await this.apiCaller.get('/scraper/complaints', {
                params: {
                    license_plate: licensePlate.replace('-', ''),
                },
            });
            if (!response.data.search_successful) {
                throw new Error(response.data.error_message ?? 'Scrapper service temporarily unavailable');
            }
            const transformedData = {
                location: response.data.lugar,
                date: response.data.fecha,
                offense: response.data.delito,
            };
            return {
                data: transformedData,
                status: response.status,
            };
        }, 'Complaints retrieved successfully');
        if (result.status >= 200 && result.status < 400) {
            (0, simpleCache_1.setInCache)(cacheKey, result, simpleCache_1.CacheTTL.COMPLAINTS);
        }
        return result;
    }
}
exports.ComplaintsService = ComplaintsService;
