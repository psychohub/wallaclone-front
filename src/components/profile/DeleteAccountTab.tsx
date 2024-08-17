import { Alert, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { deleteUserById } from "../../api/users";
import { useState } from "react";
import { logout } from "../../store/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const DeleteAccountTab: React.FC = () => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	const navigate = useNavigate();
  const dispatch = useAppDispatch();

	const [success, setSuccess] = useState<string>('');
	const [error, setError] = useState<string>('');
	
	const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

	const handleDeleteAccount = async () => {
		setSuccess('');
		setError('');
		if (user) {
			const response = await deleteUserById(user.id);
			if (response.status === 200) {
				setSuccess(`Se ha eliminado correctamente la cuenta del usuario ${user.nombre}.`);
      	setTimeout(() => handleLogout(), 5000);
			} else {
				setError(response.data.message);
			}
		}
	};

	return (
		<div>
			{ success && <Alert variant="success">{success}</Alert> }
			{ error && <Alert variant="danger">Ocurrió un error al intentar eliminar la cuenta del usuario</Alert> }
			<p>¡Cuidado! Al eliminar su cuenta se perderán todos los anuncios que haya guardado, junto con los demás datos relacionados a su cuenta. Continue bajo su propio riesgo.</p>
			<Button variant="danger" onClick={handleDeleteAccount}>Eliminar cuenta</Button>
		</div>
	);
};

export default DeleteAccountTab;
