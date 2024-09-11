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
import { getChatIdByAdvertId } from '../../../api/chat'; 
import ChatButton from '../../../components/shared/ChatButton/ChatButton'; 
import './advertPage.css';

type AdvertPageParams = { slug: string };

const AdvertPage: React.FC = () => {
  const { slug } = useParams<AdvertPageParams>();
  const [advert, setAdvert] = useState<Anuncio>();
  const [selectedStatus, setSelectedStatus] = useState<StatusAnuncio>();
  const [chatId, setChatId] = useState<string | null>(null); 
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchAdvert = async () => {
      if (slug) {
        const response = await getAdvertBySlug(slug);
        if (response.status === 200) {
          setAdvert(response.data);
          setSelectedStatus(response.data.estado);
          
          // Intentar obtener el chatId si el usuario no es el autor del anuncio
          if (user && user.id !== response.data.autor._id) {
            const chatResponse = await getChatIdByAdvertId(response.data._id);
            if (chatResponse.status === 200) {
              setChatId(chatResponse.data);  
            }
          }
        }
      }
    };
    fetchAdvert();
  }, [slug, user]);

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
              <ChatButton advertId={advert._id} chatId={chatId} /> 
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
