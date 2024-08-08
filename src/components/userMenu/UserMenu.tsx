import { Dropdown } from "react-bootstrap";
import { logout } from '../../store/features/auth/authSlice';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useStore";
import './UserMenu.css';

interface Props {
	userInitial: string;
};

const UserMenu = ({ userInitial }: Props) => {
	const navigate = useNavigate();
  const dispatch = useAppDispatch();

	const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

	return (
		<Dropdown className="user-menu-dropdown">
      <Dropdown.Toggle>
					<span>{userInitial.toUpperCase()}</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/mi-perfil">Mi perfil</Dropdown.Item>
        <Dropdown.Item href="/mis-anuncios">Mis anuncios</Dropdown.Item>
				<Dropdown.Divider />
        <Dropdown.Item href="#" onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
	);
};

export default UserMenu;
