import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Anuncio } from '../../types/adverts';
import { API_BASE_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import { useAppSelector } from '../../hooks/useStore';
import Img from '../image/Img';
import './advertCard.css';

const AdvertCard = ({ anuncio }: { anuncio: Anuncio }) => {
  const user = useAppSelector((state) => state.auth.user);
  
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
        <Link className='user-action'
          to={
            (user && user.id !== anuncio.autor._id) ? `/articulos/usuario/${anuncio.autor.nombre}` : '/app/articulos'
          }>
          @{anuncio.autor.nombre}
        </Link>
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
        <Link to={`/articulos/${anuncio.slug}`} className='detail-action'>
          <Button type='button' variant='outline-primary'>Ver más</Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default AdvertCard;
