import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index';
import { logout } from '../store/features/auth/authSlice';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const hideHeaderRoutes = ['/login', '/register'];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

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
              {user ? (
                <>
                  <li>
                    <span>Bienvenido, {user.nombre}</span>
                  </li>
                  <li>
                    <Link to={'/mi-perfil'}>Mi perfil</Link>
                  </li>
                  <li>
                    <Link to={'/mis-anuncios'}>Mis anuncios</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/register">Registro</Link></li>
                  <li><Link to="/login">Login</Link></li>
                </>
              )}
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