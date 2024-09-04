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
          <Link to={`/anuncios/usuario/${advert.autor.nombre}`} className="username">
            @{advert.autor.nombre}
          </Link>
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
          {user && user.id !== advert.autor._id && (
            <Link to={`/chat/${advert._id}`} className="chat-button">
              <img src={chatIcon} alt="" />
              Chatear con el vendedor
            </Link>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default AdvertPage;