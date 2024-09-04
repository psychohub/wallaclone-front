import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { updateUserInfo } from "../../api/users";
import { useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { setUser } from "../../store/features/auth/authSlice";

const UpdateInfoTab: React.FC = () => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	
	const [username, setUsername] = useState<string | undefined>(user?.nombre);
	const [email, setEmail] = useState<string | undefined>(user?.email);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>('');
	const [error, setError] = useState<string>('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setIsLoading(true);
			if (!username || !email) {
				setError('Los campos nombre de usuario y el email son requeridos');
				return;
			}
			await updateUserInfo({ name: username, email: email });
			if (user) setUser({ ...user, nombre: username, email: email });
			setSuccess('La información se actualizó correctamente');
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
					<Form.Control
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label htmlFor="email">Email</Form.Label>
					<Form.Control
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</Form.Group>
				<Button variant="primary" type="submit" disabled={isLoading}>
					{isLoading ? 'Procesando...' : 'Actualizar datos'}
				</Button>
			</Form>
		</div>
	);
};

export default UpdateInfoTab;
