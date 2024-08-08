import axios from 'axios';
// import { API_URL } from '../config/environment';  // Descomentar y actualizar cuando BE esté listo

interface ResetPasswordData {
  token: string;
  newPassword: string;
}

// Descomentar y actualizar cuando BE esté listo
 /*
export const resetPassword = async ({ token, newPassword }: ResetPasswordData): Promise<void> => {
  try {
    await axios.post(`${API_URL}/auth/reset-password`, { token, newPassword });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Error al restablecer la contraseña');
    }
    throw error;
  }
};*/