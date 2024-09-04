import { Card } from 'react-bootstrap';
import { Anuncio } from '../../types/adverts';
import { API_BASE_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import { Link } from 'react-router-dom';
import Img from '../image/Img';
import './advertCard.css';

const AdvertCard = ({ anuncio }: { anuncio: Anuncio }) => {
  return (
    <Card className="product-card">
      <div className='product-img'>
        <Img 
          src={`${API_BASE_URL}/images/${anuncio.imagen}`}
          alt={sanitizeInput(anuncio.nombre)}
          crossOrigin="anonymous"
        />
      </div>
      <Card.Body className="product-card-content">
        <h3>
          <Link to={`/articulos/${anuncio.slug}`}>
            {sanitizeInput(anuncio.nombre)}
          </Link>
        </h3>
        <div className="tags">
          {anuncio.tags.map(tag => <span className="tag" key={tag}>{sanitizeInput(tag)}</span>)}
        </div>
        <p className="price">{anuncio.precio} €</p>
        <p>{sanitizeInput(anuncio.descripcion)}</p>
        {
					anuncio.estado === 'disponible' &&
					<p className={`sale ${anuncio.tipoAnuncio === 'venta' ? '' : 'busca'}`}>{anuncio.tipoAnuncio === 'venta' ? 'Se vende' : 'Se busca'}</p>
				}
				{
					anuncio.estado === 'vendido' &&
					<div className="sold">
						<p>Vendido</p>
					</div>
				}
      </Card.Body>
      <Card.Footer>
        <div className="actions">
          <Link to={`/articulos/${anuncio.slug}`}>
            Ir al detalle
          </Link>
          <Link to={`/articulos/usuario/${anuncio.autor.nombre}`}>
            @{anuncio.autor.nombre}
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default AdvertCard;
