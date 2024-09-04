import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
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
	size?: SizeProp;
};

const AdvertStatusActions = ({ advertId, owner, currentStatus, setCurrentStatus, size }: Props) => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	const dispatch = useAppDispatch();
	
	const [reserved, setReserved] = useState<boolean>(false);
	const [sold, setSold] = useState<boolean>(false);
	const [wait, setWait] = useState<boolean>(false);
	const [showSoldConfirmationModal, setShowSoldConfirmationModal] = useState(false);

	useEffect(() => {
		if (currentStatus === 'reservado') setReserved(true);
		if (currentStatus === 'vendido') setSold(true);
	}, [currentStatus]);

	useEffect(() => {
		setWait(true);
		if (reserved) setCurrentStatus('reservado');
		if (sold) setCurrentStatus('vendido');
		setTimeout(() => setWait(false), 1000);
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
			
			dispatch(addNotification({ text: `El anuncio se marcó como ${newStatus}`, variant: 'success', delay: 3000 }));
		} catch (error: any) {
			dispatch(addNotification({ text: error.message, variant: 'danger' }));
		}
	};

	const handleMarkAsReserved = () => {
		if (!wait) {
			changeStatus(reserved ? 'disponible' : 'reservado');
		}
	}
	
	const handleMarkAsSold = () => {
		if (!wait) {
			changeStatus('vendido');
			handleCloseSoldConfirmationModal();
		}
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
					<Button variant="link" onClick={handleMarkAsReserved} disabled={sold || wait}>
						<FontAwesomeIcon icon={reserved ? faStar : faStarRegular} size={size ? size : "xl"} />
					</Button>
				</OverlayTrigger>
				<OverlayTrigger overlay={<Tooltip>Marcar como vendido</Tooltip>}>	
					<Button variant="link" onClick={sold ? handleMarkAsSold : handleShowSoldConfirmationModal} disabled={wait}>
						<FontAwesomeIcon icon={sold ? faCircleCheck : faCircleCheckRegular} size={size ? size : "xl"} />
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
