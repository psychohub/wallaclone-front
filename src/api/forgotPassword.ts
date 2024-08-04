import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';
import { RequestResetPasswordResponse } from '../types/auth';

interface IRequestResetPasswordParams {
	sanitizedEmail: string;
};

export const requestResetPassword = async ({ sanitizedEmail }: IRequestResetPasswordParams) => {
	try {
		const response = await axios.post<RequestResetPasswordResponse>('/auth/recuperar-contrasena', {
			body: JSON.stringify({ email: sanitizedEmail }),
		});
		return {
			status: response.status,
			data: response.data
		};
	} catch (error) {
		throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
};
