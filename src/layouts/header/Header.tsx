import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import UserMenu from "../../components/userMenu/UserMenu";
import './Header.css';

const Header = () => {
	const location = useLocation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const hideHeaderRoutes = ['/login', '/register'];

	return (
		<>
		{!hideHeaderRoutes.includes(location.pathname) && (
			<header className="app-header">
				<div className="logo-container">
					<Link to="/" className="logo">
						<span className="logo-blue">Walla</span>
						<span className="logo-gray">clone</span>
					</Link>
					{ user && <span className="bienvenido">Bienvenido, {user.nombre}</span> }
				</div>
				<nav className="app-navbar">
					<ul>
						{user ? (
							<>
								<li className="menu"><Link to="/">Anuncios</Link></li>
								<li>
									<UserMenu userInitial={user.nombre.charAt(0)} />
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
		</>
	);
};

export default Header;
