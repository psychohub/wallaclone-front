import { Dropdown } from "react-bootstrap";
import { logout, User } from '../../store/features/auth/authSlice';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useStore";
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
        <Dropdown.ItemText>{user.email}</Dropdown.ItemText>
        <Dropdown.Divider />
        <Dropdown.Item href="/mi-perfil">Mi perfil</Dropdown.Item>
        <Dropdown.Item href="/mis-anuncios">Mis anuncios</Dropdown.Item>
				<Dropdown.Divider />
        <Dropdown.Item href="#" onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
	);
};

export default UserMenu;
