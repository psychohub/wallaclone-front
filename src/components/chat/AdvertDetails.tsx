import React from 'react';
import './AdvertDetails.css';
import { Anuncio } from '../../types/adverts'; 

interface AdvertDetailsProps {
  advert: Anuncio; 
}

const AdvertDetails: React.FC<AdvertDetailsProps> = ({ advert }) => {
  return (
    <div className="advert-details card">
      <img src={advert.imagen} className="card-img-top" alt={advert.nombre} />
      <div className="card-body">
        <h2 className="card-title h5">{advert.nombre}</h2>
        <p className="card-text">{advert.descripcion}</p>
        <p className="card-text"><strong>Precio:</strong> ${advert.precio}</p>
        <p className="card-text"><strong>Tipo de Anuncio:</strong> {advert.tipoAnuncio === 'venta' ? 'Venta' : 'Búsqueda'}</p>
        <p className="card-text"><strong>Publicado por:</strong> {advert.autor.nombre}</p>
        <p className="card-text"><strong>Fecha de Publicación:</strong> {new Date(advert.fechaPublicacion).toLocaleDateString()}</p>
        <p className="card-text"><strong>Estado:</strong> {advert.estado}</p>
        <div className="card-text">
          <strong>Tags:</strong> {advert.tags.length > 0 ? advert.tags.join(', ') : 'Ninguno'}
        </div>
      </div>
    </div>
  );
};

export default AdvertDetails;
