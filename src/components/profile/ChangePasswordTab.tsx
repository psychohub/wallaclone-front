import { useState } from "react";
import { Alert, Button, Form, InputGroup } from "react-bootstrap";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { changePassword } from "../../api/users";
import { passwordsMatch } from "../../utils/password";

const ChangePasswordTab: React.FC = () => {
	const [oldPassword, setOldPassword] = useState<string>('');
	const [newPassword, setNewPassword] = useState<string>('');
	const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
	const [success, setSuccess] = useState<string>('');
	const [error, setError] = useState<string>('');

	const resetAlertMessages = () => {
		setSuccess('');
		setError('');
	};

	const resetFormValues = () => {
		setOldPassword('');
		setNewPassword('');
		setNewPasswordConfirm('');
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		resetAlertMessages();
		try {
			setIsLoading(true);
			const newPasswordMatch = passwordsMatch(newPassword, newPasswordConfirm);
			const oldMatchesNewPassword = passwordsMatch(oldPassword, newPassword);
			if (newPasswordMatch && !oldMatchesNewPassword) {
				await changePassword({ oldPassword, newPassword });
				resetFormValues();
				setSuccess('La contraseña se actualizó correctamente');
			} else if (!newPasswordMatch) {
				setError('Las contraseñas nuevas no coinciden');
			}	else if (oldMatchesNewPassword) {
				setError('La contraseña nueva no puede ser igual a la actual');
			}	
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
					<Form.Label htmlFor="oldPassword">Contraseña actual</Form.Label>
					<InputGroup>
						<Form.Control
							type={showOldPassword ? 'text' : 'password'}
							id="oldPassword"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							required
						/>
						<Button
							variant="outline-secondary"
							onClick={() => setShowOldPassword(!showOldPassword)}
							className='eye'
						>
							<FontAwesomeIcon icon={showOldPassword ? faEyeSlash : faEye} />
						</Button>
					</InputGroup>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label htmlFor="newPassword">Contraseña nueva</Form.Label>
					<InputGroup>
						<Form.Control
							type={showNewPassword ? 'text' : 'password'}
							id="newPassword"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							required
						/>
						<Button
							variant="outline-secondary"
							onClick={() => setShowNewPassword(!showNewPassword)}
							className='eye'
						>
							<FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
						</Button>
					</InputGroup>
				</Form.Group>
				<Form.Group className="mb-3">
					<Form.Label htmlFor="newPasswordConfirm">Confirmar contraseña nueva</Form.Label>
					<InputGroup>
						<Form.Control
							type={showNewPassword ? 'text' : 'password'}
							id="newPasswordConfirm"
							value={newPasswordConfirm}
							onChange={(e) => setNewPasswordConfirm(e.target.value)}
							required
						/>
						<Button
							variant="outline-secondary"
							onClick={() => setShowNewPassword(!showNewPassword)}
							className='eye'
						>
							<FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
						</Button>
					</InputGroup>
				</Form.Group>
				<Button variant="primary" type="submit" disabled={isLoading}>
					{isLoading ? 'Procesando...' : 'Cambiar contraseña'}
				</Button>
			</Form>
		</div>
	);
};

export default ChangePasswordTab;
