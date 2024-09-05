import { useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { updateUserInfo } from "../../api/users";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { setUser } from "../../store/features/auth/authSlice";
import { USER_DATA } from "../../config/environment";

const UpdateInfoTab: React.FC = () => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	const dispatch = useAppDispatch();
	
	const [username, setUsername] = useState<string | undefined>(user?.nombre);
	const [email, setEmail] = useState<string | undefined>(user?.email);

	const [isUsernameDisabled, setIsUsernameDisabled] = useState<boolean>(true);
	const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(true);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>('');
	const [error, setError] = useState<string>('');

	const resetAlertMessages = () => {
		setSuccess('');
		setError('');
	};

	const resetDisabledValues = () => {
		setIsUsernameDisabled(true);
		setIsEmailDisabled(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		resetAlertMessages();

		try {
			setIsLoading(true);
			if (!username || !email) {
				setError('Los campos nombre de usuario y el email son requeridos');
				return;
			}

			await updateUserInfo({ name: username, email: email });
			if (user) {
				const newUser = { ...user, nombre: username, email: email };
				dispatch(setUser(newUser));
				localStorage.setItem(USER_DATA, JSON.stringify(newUser));
			}

			setSuccess('La información se actualizó correctamente');
			resetDisabledValues();
		} catch (error) {
			setError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="small-container">
			{ success && <Alert variant="success">{success}</Alert>}
			{ error && <Alert variant="danger">{error}</Alert> }
			<Form onSubmit={handleSubmit} className="form">
				<Form.Group className="mb-3">
					<Form.Label htmlFor="username">Nombre de usuario</Form.Label>
					<InputGroup>
						<Form.Control
							type="text"
							id="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							disabled={isUsernameDisabled}
						/>
						<Button
							variant="outline-secondary"
							onClick={() => setIsUsernameDisabled(!isUsernameDisabled)}
							className='eye'
						>
							<FontAwesomeIcon icon={isUsernameDisabled ? faPenToSquare : faXmark} />
						</Button>
					</InputGroup>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label htmlFor="email">Email</Form.Label>
					<InputGroup>
						<Form.Control
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							disabled={isEmailDisabled}
						/>
						<Button
							variant="outline-secondary"
							onClick={() => setIsEmailDisabled(!isEmailDisabled)}
							className='eye'
						>
							<FontAwesomeIcon icon={isEmailDisabled ? faPenToSquare : faXmark} />
						</Button>
					</InputGroup>
				</Form.Group>
				<Button variant="primary" type="submit" disabled={isLoading}>
					{isLoading ? 'Procesando...' : 'Actualizar datos'}
				</Button>
			</Form>
		</div>
	);
};

export default UpdateInfoTab;
