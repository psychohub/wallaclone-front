import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Anuncio } from '../../types/adverts';
import { API_BASE_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import { Link } from 'react-router-dom';
import Img from '../image/Img';
import { useAppSelector } from '../../hooks/useStore';
import './advertCard.css';

const AdvertCard = ({ anuncio }: { anuncio: Anuncio }) => {
  const user = useAppSelector((state) => state.auth.user);

  // Agregar console.log para depuración
  console.log('AdvertCard - anuncio:', anuncio);
  console.log('AdvertCard - user:', user);
  console.log('AdvertCard - detalle URL:', `/anuncios/${anuncio.slug}`);
  console.log('AdvertCard - editar URL:', `/mis-anuncios/${anuncio._id}/editar`);

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
          <Link to={`/anuncios/${anuncio.slug}`}>
            {sanitizeInput(anuncio.nombre)}
          </Link>
        </h3>
        <div className="tags">
          {anuncio.tags.map(tag => <span className="tag" key={tag}>{sanitizeInput(tag)}</span>)}
        </div>
        <p className="price">{anuncio.precio} €</p>
        <p>{sanitizeInput(anuncio.descripcion)}</p>
        <p className={`sale ${anuncio.tipoAnuncio === 'venta' ? '' : 'busca'}`}>
          {anuncio.tipoAnuncio === 'venta' ? 'Se vende' : 'Se busca'}
        </p>
      </Card.Body>
      <Card.Footer>
        <div className="actions">
          <Link to={`/anuncios/${anuncio.slug}`}>
            Ir al detalle
          </Link>
          <Link to={`/anuncios/usuario/${anuncio.autor.nombre}`}>
            @{anuncio.autor.nombre}
          </Link>
          {user && user.id === anuncio.autor._id && (
            <Link to={`/mis-anuncios/${anuncio.slug}/editar`}>
              <Button variant="secondary" size="sm" className="edit-button">
                Editar
              </Button>
            </Link>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default AdvertCard;
