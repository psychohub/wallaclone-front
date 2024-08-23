import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppSelector } from "../../hooks/useStore";
import { RootState } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faStar } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck as faCircleCheckRegular, faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { StatusAnuncio } from "../../types/adverts";
import { changeAdvertStatus } from "../../api/adverts";
import './advertStatusActions.css';

type Props = {
	advertId: string;
	owner: string;
	currentStatus: StatusAnuncio;
	setCurrentStatus: (status: StatusAnuncio) => void;
};

const AdvertStatusActions = ({ advertId, owner, currentStatus, setCurrentStatus }: Props) => {
	const user = useAppSelector((state: RootState) => state.auth.user);
	
	const [reserved, setReserved] = useState<boolean>(false);
	const [sold, setSold] = useState<boolean>(false);

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
		resetStatus();
		try {
			await changeAdvertStatus(advertId, newStatus);
			if (newStatus === 'reservado') setReserved(true);
			if (newStatus === 'vendido') setSold(true);
		} catch (error) {
			console.log(error);
		}
	};
	
	if (!user || user.id !== owner) {
		return <></>;
	}

	return (
		<div className="actions">
			<OverlayTrigger overlay={<Tooltip>Marcar como reservado</Tooltip>}>	
				<Button variant="link" onClick={() => changeStatus('reservado')}>
					<FontAwesomeIcon icon={reserved ? faStar : faStarRegular} size="xl" />
				</Button>
			</OverlayTrigger>
			<OverlayTrigger overlay={<Tooltip>Marcar como vendido</Tooltip>}>	
				<Button variant="link" onClick={() => changeStatus('vendido')}>
					<FontAwesomeIcon icon={sold ? faCircleCheck : faCircleCheckRegular} size="xl" />
				</Button>
			</OverlayTrigger>
		</div>
	);
};

export default AdvertStatusActions;
