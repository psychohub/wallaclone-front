import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdList from './components/AdList';
import Layout from './components/Layout';
import RecuperarContrasena from './components/RecuperarContrasena';
import '../src/App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<AdList />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
