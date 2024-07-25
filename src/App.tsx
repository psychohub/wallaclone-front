import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AdList from './components/AdList';
import Footer from './components/Footer';
import '../src/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" className="logo">
            <span className="logo-blue">Walla</span>
            <span className="logo-gray">clone</span>
          </Link>
          <nav>
            <ul>
              <li><Link to="/register">Registro</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AdList />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;