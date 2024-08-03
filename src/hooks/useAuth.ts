import { useAppSelector, useAppDispatch } from './useStore';
import { loginUser, registerUser } from '../store/features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  const login = (credentials: { nombre: string; contraseña: string; rememberMe: boolean }) => {
    return dispatch(loginUser(credentials));
  };

  const register = (userData: { nombre: string; email: string; contraseña: string }) => {
    return dispatch(registerUser(userData));
  };

  return {
    user,
    isLoading,
    error,
    login,
    register
  };
};