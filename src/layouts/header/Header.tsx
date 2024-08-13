import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import UserMenu from "../../components/userMenu/UserMenu";
import './Header.css';

const Header = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  
	return (
		<header className="app-header">
			<div className="logo-container">
				<Link to="/" className="logo">
					<span className="logo-blue">Walla</span>
					<span className="logo-gray">clone</span>
				</Link>
			</div>
			<nav className="app-navbar">
				<ul>
					{user ? (
						<>
							<li className="menu"><Link to="/">Anuncios</Link></li>
							<li>
								<UserMenu user={user} />
							</li>
						</>
					) : (
						<>
							<li className="menu"><Link to="/register">Registro</Link></li>
							<li className="menu"><Link to="/login">Login</Link></li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
