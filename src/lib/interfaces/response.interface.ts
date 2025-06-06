export interface Response<T> {
	message: string;
	status: number;
	data?: T;
	error?: string;
}
