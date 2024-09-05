import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAdvertBySlug } from "../../../api/adverts";
import { Anuncio, StatusAnuncio } from "../../../types/adverts";
import Loader from "../../../components/loader/Loader";
import { API_BASE_URL } from "../../../config/environment";
import { sanitizeInput } from "../../../utils/sanitize";
import { Card } from "react-bootstrap";
import AdvertStatusAction from "../../../components/advertStatusActions/AdvertStatusActions";
import { useAppSelector } from "../../../hooks/useStore";
import chatIcon from "../../../assets/icons/chat-icon.svg";
import './advertPage.css';

type AdvertPageParams = { slug: string };

const AdvertPage: React.FC = () => {
  const { slug } = useParams<AdvertPageParams>();
  const [advert, setAdvert] = useState<Anuncio>();
  const [selectedStatus, setSelectedStatus] = useState<StatusAnuncio>();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchAdvert = async () => {
      if (slug) {
        const response = await getAdvertBySlug(slug);
        if (response.status === 200) {
          setAdvert(response.data);
          setSelectedStatus(response.data.estado);
        }
      }
    };
    fetchAdvert();
  }, [slug]);

  if (!advert) {
    return <Loader />;
  }

  return (
    <>
       <Card className="product-card detail">
        <Card.Header>
          <div className="header-content">
            <Link to={`/anuncios/usuario/${advert.autor.nombre}`} className="username">
              @{advert.autor.nombre}
            </Link>
            {user && user.id !== advert.autor._id && (
  <Link to={`/app/chat/${advert._id}`} className="chat-icon-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
      <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
    </svg>
    Chat
  </Link>
)}
          </div>
          {selectedStatus && (
            <AdvertStatusAction
              advertId={advert._id}
              owner={advert.autor._id}
              currentStatus={selectedStatus}
              setCurrentStatus={setSelectedStatus}
            />
          )}
        </Card.Header>
        {advert.imagen ? (
          <div className="product-img">
            <img
              src={`${API_BASE_URL}/images/${advert.imagen}`}
              alt={sanitizeInput(advert.nombre)}
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="placeholder-image">Imagen no disponible</div>
        )}
        <Card.Body className="content">
          <h2>{sanitizeInput(advert.nombre)}</h2>
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
    </>
  );
};

export default AdvertPage;