import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import { getAdvertBySlug } from "../../../api/adverts";
import { getChatIdByAdvertId } from '../../../api/chat'; 
import { Anuncio, StatusAnuncio } from "../../../types/adverts";
import { API_BASE_URL } from "../../../config/environment";
import { sanitizeInput } from "../../../utils/sanitize";
import { useAppSelector } from "../../../hooks/useStore";
import Loader from "../../../components/loader/Loader";
import AdvertStatusAction from "../../../components/advertStatusActions/AdvertStatusActions";
import ChatButton from '../../../components/shared/ChatButton/ChatButton'; 
import FavoriteButton from '../../../components/favoriteButton/FavoriteButton';
import './advertPage.css';

type AdvertPageParams = { slug: string };

const AdvertPage: React.FC = () => {
  const { slug } = useParams<AdvertPageParams>();
  const [advert, setAdvert] = useState<Anuncio>();
  const [selectedStatus, setSelectedStatus] = useState<StatusAnuncio>();
  const [chatId, setChatId] = useState<string | null>(null); 
  const [isFavorite, setIsFavorite] = useState(false);
  
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
    <Container className="medium-container">
      <Card className="product-card detail">
        <Card.Header>
          <div className="header-content">
            <Link className="username"
              to={
                (user && user.id !== advert.autor._id) ? `/articulos/usuario/${advert.autor.nombre}` : '/app/articulos'
              }>
              @{advert.autor.nombre}
            </Link>
            { (user && user.id !== advert.autor._id) && (
              <>
                <ChatButton advertId={advert._id} chatId={chatId} />
                <FavoriteButton 
                  anuncioId={advert._id} 
                  isFavorite={isFavorite}
                  onFavoriteChange={setIsFavorite}
                />
              </>
            )}
            {selectedStatus && (
              <AdvertStatusAction
                advertId={advert._id}
                owner={advert.autor._id}
                currentStatus={selectedStatus}
                setCurrentStatus={setSelectedStatus}
              />
            )}
          </div>
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
    </Container>
  );
};

export default AdvertPage;
