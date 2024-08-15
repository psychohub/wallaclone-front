import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdvertBySlug } from "../../../api/adverts";
import { Anuncio } from "../../../types/adverts";
import Loader from "../../../components/loader/Loader";
import { API_BASE_URL } from "../../../config/environment";
import { sanitizeInput } from "../../../utils/sanitize";
import './advertPage.css';
import { Card } from "react-bootstrap";

type AdvertPageParams = { slug: string };

const AdvertPage: React.FC = () => {
	const { slug } = useParams<AdvertPageParams>();

	const [advert, setAdvert] = useState<Anuncio>();

	useEffect(() => {
		const fetchAdvert = async () => {
			if (slug) {
				const response = await getAdvertBySlug(slug);
				if (response.status === 200) {
					setAdvert(response.data);
				}
			}
		};

		fetchAdvert();
	}, []);

	if (!advert) {
		return <Loader />;
	}

	return (
		<>
			<Card className="advert-detail">
				{advert.imagen ? (
					<div className="advert-img">
						<img
							src={`${API_BASE_URL}/images/${advert.imagen}`}
							alt={sanitizeInput(advert.nombre)}
							crossOrigin="anonymous" />
					</div>
				) : (
					<div className="placeholder-image">Imagen no disponible</div>
				)}
				<Card.Body className="content">
					<h3>{sanitizeInput(advert.nombre)}</h3>
					<p>{sanitizeInput(advert.descripcion)}</p>
					<p className="price">Precio: {advert.precio}€</p>
					<p>Tipo: {advert.tipoAnuncio}</p>
					<p>Autor: 
						<Link to={`/anuncios/usuario/${advert.autor.nombre}`}>
							{advert.autor.nombre}
						</Link>
					</p>
					<p>Tags: {advert.tags.map(tag => sanitizeInput(tag)).join(', ')}</p>
				</Card.Body>
			</Card>
		</>
	);
};

export default AdvertPage;