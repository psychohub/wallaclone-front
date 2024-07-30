import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register'];

  return (
    <div className="App">
      {!hideHeaderRoutes.includes(location.pathname) && (
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
      )}
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
