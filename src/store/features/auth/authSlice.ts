import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../../lib/axiosInstance';
import { AxiosError } from 'axios';
import { ACCESS_TOKEN } from '../../../config/environment';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

interface User {
  id: string;
  nombre: string;
  email: string;
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
      const response = await axios.post('/auth/login', {
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
      const response = await axios.post('/auth/register', userData);
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
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(ACCESS_TOKEN);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.usuario;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
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

export const { setUser, setToken, logout } = authSlice.actions;
export default authSlice.reducer;