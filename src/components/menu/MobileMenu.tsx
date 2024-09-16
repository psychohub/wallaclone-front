import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { logout } from "../../store/features/auth/authSlice";

const MobileMenu = ({ openMenu, setOpenMenu }: { openMenu: boolean, setOpenMenu: (value: boolean) => void }) => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	const navigate = useNavigate();
  const dispatch = useAppDispatch();

	const handleItemClick = (url: string) => {
		setOpenMenu(false);
		navigate(url);
	};

	const handleLogout = () => {
		dispatch(logout());
		setOpenMenu(false);
    navigate('/');
  };
	
	return (
		<nav className={`app-navbar ${openMenu ? '' : 'closed'}`}>
			<ul>
				<li className="menu"><a onClick={() => handleItemClick("/")}>Todos los anuncios</a></li>
				{user ? (
					<>
						<li className="menu"><a onClick={() => handleItemClick("/app/perfil")}>Perfil</a></li>
						<li className="menu"><a onClick={() => handleItemClick("/app/articulos")}>Mis anuncios</a></li>
						<li className="menu"><a onClick={() => handleItemClick("/app/articulos/nuevo")}>Nuevo anuncio</a></li>
						<li className="menu"><a onClick={() => handleItemClick("/app/chats")}>Mis Conversaciones</a></li>
						<li className="menu"><a href="#" onClick={handleLogout}>Cerrar sesión</a></li>
					</>
				) : (
					<>
						<li className="menu"><a onClick={() => handleItemClick("/register")}>Registro</a></li>
						<li className="menu"><a onClick={() => handleItemClick("/login")}>Login</a></li>
					</>
				)}
			</ul>
		</nav>
	);
};

export default MobileMenu;
