import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { logout } from "../../store/features/auth/authSlice";

const MobileMenu = ({ openMenu }: { openMenu?: boolean, }) => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	const navigate = useNavigate();
  const dispatch = useAppDispatch();

	const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
	
	return (
		<nav className={`app-navbar ${openMenu === false ? 'closed' : ''}`}>
			<ul>
				<li className="menu"><Link to="/">Todos los anuncios</Link></li>
				{user ? (
					<>
						<li className="menu"><Link to="/app/perfil">Perfil</Link></li>
						<li className="menu"><Link to="/app/articulos">Mis anuncios</Link></li>
						<li className="menu"><Link to="/app/articulos/nuevo">Nuevo anuncio</Link></li>
						<li className="menu"><Link to="/app/chats">Mis Conversaciones</Link></li>
						<li className="menu"><a href="#" onClick={handleLogout}>Cerrar sesión</a></li>
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

export default MobileMenu;
