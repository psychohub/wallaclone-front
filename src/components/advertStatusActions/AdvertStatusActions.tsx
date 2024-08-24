import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { StatusAnuncio } from "../../types/adverts";
import { changeAdvertStatus } from "../../api/adverts";
import { addNotification } from "../../store/features/notifications/notificationsSlice";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import './advertStatusActions.css';

type Props = {
	advertId: string;
	owner: string;
	currentStatus: StatusAnuncio;
	setCurrentStatus: (status: StatusAnuncio) => void;
};

const AdvertStatusActions = ({ advertId, owner, currentStatus, setCurrentStatus }: Props) => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	const dispatch = useAppDispatch();
	
	const [reserved, setReserved] = useState<boolean>(false);
	const [sold, setSold] = useState<boolean>(false);
	const [showSoldConfirmationModal, setShowSoldConfirmationModal] = useState(false);

	useEffect(() => {
		if (currentStatus === 'reservado') setReserved(true);
		if (currentStatus === 'vendido') setSold(true);
	}, [currentStatus]);

	useEffect(() => {
		if (reserved) setCurrentStatus('reservado');
		if (sold) setCurrentStatus('vendido');
	}, [reserved, sold]);
	
	const resetStatus = () => {
		setReserved(false);
		setSold(false);
	};

	const changeStatus = async (newStatus: StatusAnuncio) => {
		try {
			await changeAdvertStatus(advertId, newStatus);
			
			resetStatus();
			if (newStatus === 'reservado') setReserved(true);
			if (newStatus === 'vendido') setSold(true);
			
			dispatch(addNotification({ text: `El anuncio se marcó como ${newStatus}`, variant: 'success' }));
		} catch (error: any) {
			dispatch(addNotification({ text: error.message, variant: 'danger' }));
		}
	};

	const handleMarkAsReserved = () => changeStatus(reserved ? 'disponible' : 'reservado');
	
	const handleMarkAsSold = () => {
		changeStatus('vendido');
		handleCloseSoldConfirmationModal();
	}

	const handleCloseSoldConfirmationModal = () => setShowSoldConfirmationModal(false);
  const handleShowSoldConfirmationModal = () => setShowSoldConfirmationModal(true);
	
	if (!user || user.id !== owner) {
		return <></>;
	}

	return (
		<>
			<div className="actions">
				<OverlayTrigger overlay={<Tooltip>Marcar como {reserved ? 'disponible' : 'reservado'}</Tooltip>}>	
					<Button variant="link" onClick={handleMarkAsReserved} disabled={sold}>
						<FontAwesomeIcon icon={reserved ? faStar : faStarRegular} size="xl" />
					</Button>
				</OverlayTrigger>
				<OverlayTrigger overlay={<Tooltip>Marcar como vendido</Tooltip>}>	
					<Button variant="link" onClick={sold ? handleMarkAsSold : handleShowSoldConfirmationModal}>
						<FontAwesomeIcon icon={sold ? faCircleCheck : faCircleCheckRegular} size="xl" />
					</Button>
				</OverlayTrigger>
			</div>
			<ConfirmationModal 
				handleCancel={handleCloseSoldConfirmationModal}
				handleContinue={handleMarkAsSold}
				show={showSoldConfirmationModal}
				variant="primary"
				title="Marcar como vendido"
				text="¿Estás seguro de marcar este anuncio como vendido? Recuerda que una vez confirmada esta acción, el anuncio ya no podrá ni editarse ni volver a estar disponible."
			/>
		</>
	);
};

export default AdvertStatusActions;
