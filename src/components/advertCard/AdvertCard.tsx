import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Anuncio } from '../../types/adverts';
import { AWS_S3_BUCKET_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import { useAppSelector } from '../../hooks/useStore';
import Img from '../image/Img';
import FavoriteButton from '../favoriteButton/FavoriteButton';
import './advertCard.css';

interface AdvertCardProps {
  anuncio: Anuncio;
  isFavorite: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

const AdvertCard: React.FC<AdvertCardProps> = ({ anuncio, isFavorite, onFavoriteChange }) => {
  const user = useAppSelector((state) => state.auth.user);
  
  return (
    <Card className="product-card">
      <div className='product-img'>
        <Img 
          src={`${AWS_S3_BUCKET_URL}${anuncio.imagen}`}
          alt={sanitizeInput(anuncio.nombre)}
          crossOrigin="anonymous"
        />
      </div>
      <Card.Body className="product-card-content">
        <div className="d-flex justify-content-between align-items-start">
          <h3>
            <Link to={`/articulos/${anuncio.slug}`}>
              {sanitizeInput(anuncio.nombre)}
            </Link>
          </h3>
          {user && (
            <FavoriteButton 
              anuncioId={anuncio._id} 
              isFavorite={isFavorite}
              onFavoriteChange={onFavoriteChange}
            />
          )}
        </div>
        <div className="tags">
          {anuncio.tags.map(tag => <span className="tag" key={tag}>{sanitizeInput(tag)}</span>)}
        </div>
        <p className="price">{anuncio.precio} €</p>
        <p>{sanitizeInput(anuncio.descripcion)}</p>
        <Link className='user-action'
          to={
            (user && user.id === anuncio.autor._id) ? '/app/articulos' : `/articulos/usuario/${anuncio.autor.nombre}`
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