import { useAppSelector, useAppDispatch } from './reduxHooks';
import { loginUser, registerUser } from '../features/auth/authSlice';

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