"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCaller = void 0;
const axios_1 = __importStar(require("axios"));
class ApiCaller {
    client;
    constructor(baseURL, timeout = 120000) {
        this.client = axios_1.default.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            timeout,
        });
    }
    /**
     * Make a GET request to the specified URL
     * @param url - The URL to make the request to
     * @param config - Optional Axios request configuration
     * @returns Axios response with the requested data
     */
    async get(url, config) {
        try {
            const response = await this.client.get(url, config);
            return response;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                const errorMessage = error.response?.data?.error_message ||
                    error.response?.data?.message ||
                    error.response?.data?.detail ||
                    error.message ||
                    'Request failed';
                throw new Error(errorMessage);
            }
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
    /**
     * Make a POST request to the specified URL
     * @param url - The URL to make the request to
     * @param data - The data to send in the request body
     * @param config - Optional Axios request configuration
     * @returns Axios response with the requested data
     */
    async post(url, data, config) {
        try {
            const response = await this.client.post(url, data, config);
            return response;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new Error(error.response?.data.message);
            }
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
    /**
     * Make a PUT request to the specified URL
     * @param url - The URL to make the request to
     * @param data - The data to send in the request body
     * @param config - Optional Axios request configuration
     * @returns Axios response with the requested data
     */
    async put(url, data, config) {
        try {
            const response = await this.client.put(url, data, config);
            return response;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new Error(error.response?.data.message);
            }
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
    /**
     * Make a DELETE request to the specified URL
     * @param url - The URL to make the request to
     * @param config - Optional Axios request configuration
     * @returns Axios response with the requested data
     */
    async delete(url, config) {
        try {
            const response = await this.client.delete(url, config);
            return response;
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                throw new Error(error.response?.data.message);
            }
            throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
        }
    }
}
exports.ApiCaller = ApiCaller;
