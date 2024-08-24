import { Button, Modal } from 'react-bootstrap';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

type Props = {
	show: boolean
	handleCancel: () => void
	handleContinue: () => void
	title?: string
	text?: string
	variant?: ButtonVariant
	buttonText?: string
};

const ConfirmationModal = ({ show, handleCancel, handleContinue, title, text, variant, buttonText }: Props) => {
	return (
		<Modal show={show} onHide={handleCancel} centered>
			<Modal.Header closeButton>
				<Modal.Title style={{ fontSize: '1.2rem' }}>
					{title ? title : 'Confirmar'}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<p style={{ margin: '0.5rem 0', textAlign: 'justify' }}>{ text ? text : '¿Estás seguro de querer continuar?' }</p>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-secondary" onClick={handleCancel}>
					Cancelar
				</Button>
				<Button variant={variant ? variant : 'primary'} onClick={handleContinue}>
					{buttonText ? buttonText : 'Continuar'}
				</Button>
			</Modal.Footer>
		</Modal>
	)
};

export default ConfirmationModal;
