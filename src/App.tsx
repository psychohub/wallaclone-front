import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './app/store';
import Register from './components/Register';
import Login from './components/Login';
import AdList from './components/AdList';
import ProfilePage from './pages/ProfilePage';
import Layout from './components/Layout';
import RecuperarContrasena from './components/RecuperarContrasena';
import '../src/App.css';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdList />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
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