import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import UserMenu from "../userMenu/UserMenu";

const Menu = () => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	
	return (
		<nav className="app-navbar">
			<ul>
				<li className="menu"><Link to="/">Anuncios</Link></li>
				{user ? (
					<>
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
	);
};

export default Menu;
