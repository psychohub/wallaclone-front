import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../lib/axiosInstance';
import { AxiosError } from 'axios';
import { ACCESS_TOKEN } from '../../config/environment';

interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  nombre: string;
  contraseña: string;
  rememberMe: boolean;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', {
        nombre: credentials.nombre,
        contraseña: credentials.contraseña
      });
      if (credentials.rememberMe) {
        localStorage.setItem(ACCESS_TOKEN, response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data || (error as Error).message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { nombre: string; email: string; contraseña: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as AxiosError).response?.data || (error as Error).message);
    }
  }
);

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
