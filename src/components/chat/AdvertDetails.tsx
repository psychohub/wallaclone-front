import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Anuncio } from '../../types/adverts'; 
import { AWS_S3_BUCKET_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';

interface AdvertDetailsProps {
  advert: Anuncio; 
}

const AdvertDetails: React.FC<AdvertDetailsProps> = ({ advert }) => {
  return (
    <Card className="product-card detail">
      {advert.imagen ? (
        <div className="product-img">
          <img
            src={`${AWS_S3_BUCKET_URL}${advert.imagen}`}
            alt={sanitizeInput(advert.nombre)}
            crossOrigin="anonymous"
          />
        </div>
      ) : (
        <div className="placeholder-image">Imagen no disponible</div>
      )}
      <Card.Body className="content">
        <h2>
          <Link to={`/articulos/${advert.slug}`}>
            {sanitizeInput(advert.nombre)}
          </Link>
        </h2>
        <p>Publicado el {new Date(advert.fechaPublicacion).toLocaleDateString()}</p>
        <p className="price">{advert.precio} €</p>
        <p className={`sale-detail ${advert.tipoAnuncio === 'venta' ? '' : 'busca'}`}>
          {advert.tipoAnuncio === 'venta' ? 'Se vende' : 'Se busca'}
        </p>
        <p>{sanitizeInput(advert.descripcion)}</p>
        <div className="tags">
          {advert.tags.map(tag => (
            <span className="tag" key={tag}>
              {sanitizeInput(tag)}
            </span>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdvertDetails;
