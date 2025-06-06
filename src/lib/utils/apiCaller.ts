import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

import axios, { AxiosError } from 'axios';

export class ApiCaller {
	private readonly client: AxiosInstance;

	constructor(baseURL: string, timeout: number = 120000) {
		this.client = axios.create({
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
	async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		try {
			const response = await this.client.get<T>(url, config);

			return response;
		} catch (error) {
			if (error instanceof AxiosError) {
				const errorMessage =
					error.response?.data?.error_message ||
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
	async post<T, K>(url: string, data?: K, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		try {
			const response = await this.client.post<T>(url, data, config);

			return response;
		} catch (error) {
			if (error instanceof AxiosError) {
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
	async put<T, K>(url: string, data?: K, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		try {
			const response = await this.client.put<T>(url, data, config);

			return response;
		} catch (error) {
			if (error instanceof AxiosError) {
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
	async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
		try {
			const response = await this.client.delete<T>(url, config);

			return response;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data.message);
			}
			throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
		}
	}
}
