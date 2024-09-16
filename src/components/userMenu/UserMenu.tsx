import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from '../../store/features/auth/authSlice';
import { useAppDispatch } from "../../hooks/useStore";
import { User } from "../../types/user";
import './UserMenu.css';

interface Props {
	user: User;
};

const UserMenu = ({ user }: Props) => {
	const navigate = useNavigate();
  const dispatch = useAppDispatch();

	const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

	return (
		<Dropdown className="user-menu-dropdown">
      <Dropdown.Toggle>
        <span>{user.nombre.charAt(0).toUpperCase()}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.ItemText className="username">{user.email}</Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.ItemText>
          <Link to="/app/perfil">Perfil</Link>
        </Dropdown.ItemText>
        <Dropdown.ItemText>
          <Link to="/app/articulos">Mis anuncios</Link>
        </Dropdown.ItemText>
        <Dropdown.ItemText>
          <Link to="/app/articulos/nuevo">Nuevo anuncio</Link>
        </Dropdown.ItemText>
        <Dropdown.ItemText>
          <Link to="/app/chats">Mis Conversaciones</Link>
        </Dropdown.ItemText> 
				<Dropdown.Divider />
        <Dropdown.Item href="#" onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
	);
};

export default UserMenu;
