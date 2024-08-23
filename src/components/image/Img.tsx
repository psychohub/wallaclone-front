import { useState } from "react";
import './img.css';

const Img = (props: React.HTMLProps<HTMLImageElement>) => {
	const [isBroken, setIsBroken] = useState<boolean>(false);

	const handleError = () => {
    setIsBroken(true);
  };

	if (isBroken) {
    return <div className="placeholder-image">Imagen no disponible</div>;
  }

	return <img {...props} onError={handleError} />;
};

export default Img;
