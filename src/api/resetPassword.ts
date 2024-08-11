import axios from 'axios';
import { API_BASE_URL } from '../config/environment';

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export const resetPassword = async ({ token, newPassword }: ResetPasswordData): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/api/restablecer-contrasena`, { token, newPassword });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Error al restablecer la contraseña');
    }
    throw error;
  }
};