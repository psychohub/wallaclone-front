import { Alert, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { deleteUserById } from "../../api/users";
import { useState } from "react";
import { logout } from "../../store/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";

const DeleteAccountTab: React.FC = () => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	const navigate = useNavigate();
  const dispatch = useAppDispatch();

	const [success, setSuccess] = useState<string>('');
	const [error, setError] = useState<string>('');
	const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
	
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
				setSuccess(`Se ha eliminado correctamente la cuenta del usuario ${user.nombre}. Pronto se cerrará la sesión y serás redirigido fuera de la cuenta.`);
      	setTimeout(() => handleLogout(), 10000);
			} else {
				setError(response.data.message);
			}
			handleCloseModal();
		}
	};

	return (
		<>
			<div>
				{ success && <Alert variant="success">{success}</Alert> }
				{ error && <Alert variant="danger">Ocurrió un error al intentar eliminar la cuenta del usuario</Alert> }
				<div style={{ textAlign: 'justify', margin: '1.5rem 0' }}>
					<p>¡Cuidado! Al eliminar tu cuenta se perderán todos los anuncios que hayas guardado, junto con los demás datos relacionados a tu cuenta.</p>
					<p>Continua bajo tu propio riesgo.</p>
				</div>
				<Button variant="danger" onClick={handleShowModal}>Eliminar cuenta</Button>
			</div>
			<ConfirmationModal 
				handleCancel={handleCloseModal}
				handleContinue={handleDeleteAccount}
				show={showModal}
				variant="danger"
				title="Eliminar cuenta"
				text={`¿Estás seguro de continuar con la eliminación de tu cuenta, ${user?.nombre}? Recuerda que una vez confirmada esta acción, ya no hay vuelta atrás.`}
				buttonText="Eliminar"
			/>
		</>
	);
};

export default DeleteAccountTab;
