import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Anuncio } from '../../types/adverts';
import { AWS_S3_BUCKET_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import { useAppSelector } from '../../hooks/useStore';
import Img from '../image/Img';
import './advertCard.css';

const AdvertCard = ({ anuncio }: { anuncio: Anuncio }) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Card className="product-card">
      <div className="product-img">
        <Img
          src={`${AWS_S3_BUCKET_URL}${anuncio.imagen}`}
          alt={sanitizeInput(anuncio.name)}
          crossOrigin="anonymous"
        />
      </div>
      <Card.Body className="product-card-content">
        <h3>
          <Link to={`/articulos/${anuncio.slug}`}>{sanitizeInput(anuncio.name)}</Link>
        </h3>
        <div className="tags">
          {anuncio.tags.map((tag) => (
            <span className="tag" key={tag}>
              {sanitizeInput(tag)}
            </span>
          ))}
        </div>
        <p className="price">{anuncio.price} €</p>
        <p>{sanitizeInput(anuncio.description)}</p>
        <Link
          className="user-action"
          to={
            user && user.id === anuncio.author._id
              ? '/app/articulos'
              : `/articulos/usuario/${anuncio.author.name}`
          }
        >
          @{anuncio.author.name}
        </Link>
        {anuncio.state === 'disponible' && (
          <p className={`sale ${anuncio.typeAdvert === 'venta' ? '' : 'busca'}`}>
            {anuncio.typeAdvert === 'venta' ? 'Se vende' : 'Se busca'}
          </p>
        )}
        {anuncio.state === 'vendido' && (
          <div className="sold">
            <p>Vendido</p>
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        <Link to={`/articulos/${anuncio.slug}`} className="detail-action">
          <Button type="button" variant="outline-primary">
            Ver más
          </Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default AdvertCard;
