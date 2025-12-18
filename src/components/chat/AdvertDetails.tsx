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
            alt={sanitizeInput(advert.name)}
            crossOrigin="anonymous"
          />
        </div>
      ) : (
        <div className="placeholder-image">Imagen no disponible</div>
      )}
      <Card.Body className="content">
        <h2>
          <Link to={`/articulos/${advert.slug}`}>{sanitizeInput(advert.name)}</Link>
        </h2>
        <p>Publicado el {new Date(advert.publicationDate).toLocaleDateString()}</p>
        <p className="price">{advert.price} €</p>
        <p className={`sale-detail ${advert.typeAdvert === 'venta' ? '' : 'busca'}`}>
          {advert.typeAdvert === 'venta' ? 'Se vende' : 'Se busca'}
        </p>
        <p>{sanitizeInput(advert.description)}</p>
        <div className="tags">
          {advert.tags.map((tag) => (
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
