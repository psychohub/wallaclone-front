import { Card } from "react-bootstrap";
import { Anuncio } from "../../types/adverts";
import { API_BASE_URL } from "../../config/environment";
import { sanitizeInput } from "../../utils/sanitize";
import { Link } from "react-router-dom";
import './advertCard.css';

const AdvertCard = ({ anuncio }: { anuncio: Anuncio }) => {
	return (
		<Card className="product-card">
			{anuncio.imagen ? (
				<div className='product-img'>
					<img
						src={`${API_BASE_URL}/images/${anuncio.imagen}`}
						alt={sanitizeInput(anuncio.nombre)}
						crossOrigin="anonymous" />
				</div>
			) : (
				<div className="placeholder-image">Imagen no disponible</div>
			)}
			<Card.Body className="product-card-content">
				<h3>
					<Link to={`/anuncios/${anuncio.slug}`}>
						{sanitizeInput(anuncio.nombre)}
					</Link>
				</h3>
				<div className="tags">
					{ anuncio.tags.map(tag => <span className="tag">{sanitizeInput(tag)}</span>) }
				</div>
				<p className="price">{anuncio.precio} €</p>
				<p>{sanitizeInput(anuncio.descripcion)}</p>
				<p className={`sale ${anuncio.tipoAnuncio === 'venta' ? '' : 'busca'}`}>{anuncio.tipoAnuncio === 'venta' ? 'Se vende' : 'Se busca'}</p>
			</Card.Body>
			<Card.Footer>
				<div className="actions">
					<Link to={`/anuncios/${anuncio.slug}`}>
						Ir al detalle
					</Link>
					<Link to={`/anuncios/usuario/${anuncio.autor.nombre}`}>
						@{anuncio.autor.nombre}
					</Link>
				</div>
			</Card.Footer>
		</Card>
	);
};

export default AdvertCard;