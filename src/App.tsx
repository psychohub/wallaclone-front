import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ACCESS_TOKEN, USER_DATA } from './config/environment';
import { setToken, setUser, User } from './store/features/auth/authSlice';
import { useAppDispatch } from './hooks/useStore';

import Layout from './layouts/Layout';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import AdvertsPage from './pages/public/AdvertsPage';
import UserAdvertsPage from './pages/public/UserAdvertsPage';
import PrivateRoute from './components/privateRoute/PrivateRoute';
import ProfilePage from './pages/private/profile/ProfilePage';
import MyAdvertsPage from './pages/private/MyAdvertsPage';

import './App.css';

function App() {
  const dispatch = useAppDispatch();

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN);
  const user = window.localStorage.getItem(USER_DATA);
  
  if (accessToken) {
    dispatch(setToken(accessToken));
  }

  if (user) {
    dispatch(setUser(JSON.parse(user) as User));
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
          <Route path="/anuncios/usuario/:username" element={<UserAdvertsPage />} />
          <Route path="/" element={<AdvertsPage />} />
          <Route 
            path="/mi-perfil"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />
          <Route 
            path="/mis-anuncios"
            element={
              <PrivateRoute>
                <MyAdvertsPage />
              </PrivateRoute>
            } />
          <Route path="/404" element={<div>404 | Not found</div>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;