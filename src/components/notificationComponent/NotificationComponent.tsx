import { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

type Props = {
	variant: string;
	text: string;
};

const NotificationComponent = ({ variant, text }: Props) => {
	const [show, setShow] = useState<boolean>(true);
	
	useEffect(() => {
		setTimeout(() => {
			setShow(false);
		}, 5000);
	}, []);
	
	return (
		<Toast bg={variant} onClose={() => setShow(false)} show={show} style={{ marginBottom: '10px' }}>
			<Toast.Body className="text-white">
				{text}
			</Toast.Body>
		</Toast>
	);
};

export default NotificationComponent;
