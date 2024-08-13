import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';
import { API_BASE_URL } from '../config/environment';

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const resetPassword = async ({ token, newPassword }: ResetPasswordData): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/users/restablecer-contrasena`, { token, newPassword });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Error al restablecer la contraseña');
    }
    throw error;
  }
};
