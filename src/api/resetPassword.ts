import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';
import { RequestResetPasswordResponse } from '../types/auth';

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const resetPassword = async ({ token, newPassword }: ResetPasswordData) => {
  try {
    const response = await axios.post<RequestResetPasswordResponse>('/users/restablecer-contrasena', { token, newPassword });
    return {
			status: response.status,
			data: response.data
		};
  } catch (error) {
    throw new Error(((error as AxiosError).response?.data as any).message as string ?? (error as Error).message);
  }
};
