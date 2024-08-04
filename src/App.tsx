import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/index';

import Layout from './layouts/Layout';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import AdvertsPage from './pages/public/AdvertsPage';
import ProfilePage from './pages/private/ProfilePage';

import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import './App.css';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<AdvertsPage />} />
          <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />
          <Route 
            path="/perfil/:nombreUsuario" 
            element={<PrivateRoute element={<ProfilePage />} />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;