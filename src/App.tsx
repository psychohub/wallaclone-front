import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN, USER_DATA } from './config/environment';
import { setToken, setUser, User } from './store/features/auth/authSlice';
import { useAppDispatch } from './hooks/useStore';
import Layout from './layouts/Layout';
import AdvertsPage from './pages/public/AdvertsPage';
import PublicRoute from './components/private/PublicRoute';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import UserAdvertsPage from './pages/public/UserAdvertsPage';
import PrivateRoute from './components/private/PrivateRoute';
import ProfilePage from './pages/private/profile/ProfilePage';
import MyAdvertsPage from './pages/private/MyAdvertsPage';
import AdvertPage from './pages/public/AdvertPage/AdvertPage';
import ChatPage from './components/chat/ChatPage';
import CreateAdvertPage from './pages/private/CreateAdvertPage';
import EditAdvertPage from './pages/private/EditAdvertPage';
import './App.css';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const user = localStorage.getItem(USER_DATA);
    
    if (accessToken) {
      dispatch(setToken(accessToken));
    }
    if (user) {
      try {
        dispatch(setUser(JSON.parse(user) as User));
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        // Si hay un error al parsear el usuario, limpiar el almacenamiento local
        localStorage.removeItem(USER_DATA);
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<AdvertsPage />} />
          <Route path="/articulos" element={<AdvertsPage />} />
          <Route path="/articulos/usuario/:username" element={<UserAdvertsPage />} />
          <Route path="/articulos/:slug" element={<AdvertPage />} />
          <Route 
            path="/"
            element={
              <PublicRoute>
                <Outlet />
              </PublicRoute>
            }>  
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
            <Route path="/restablecer-contrasena" element={<ResetPasswordPage />} />
          </Route>
          <Route 
            path="/app"
            element={
              <PrivateRoute>
                <Outlet />
              </PrivateRoute>
            }>
            <Route path="/app/perfil" element={ <ProfilePage /> } />
            <Route path="/app/articulos" element={ <MyAdvertsPage /> } />
            <Route path="/app/articulos/nuevo" element={ <CreateAdvertPage /> } />
            <Route path="/app/articulos/:slug/editar" element={<EditAdvertPage />} />
            <Route path="/app/chat/:anuncioId" element={<ChatPage />} />
          </Route>
          <Route path="/404" element={<div>404 | Not found</div>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;