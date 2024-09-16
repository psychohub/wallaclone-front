import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import { getAdvertBySlug } from "../../../api/adverts";
import { Anuncio, StatusAnuncio } from "../../../types/adverts";
import { AWS_S3_BUCKET_URL } from "../../../config/environment";
import { sanitizeInput } from "../../../utils/sanitize";
import { useAppDispatch, useAppSelector } from "../../../hooks/useStore";
import { setSelectedChat } from "../../../store/features/chats/chatsSlice";
import { setSelectedAdvertSlug } from "../../../store/features/adverts/advertsSlice";
import Loader from "../../../components/loader/Loader";
import AdvertStatusAction from "../../../components/advertStatusActions/AdvertStatusActions";
import ChatButton from '../../../components/shared/ChatButton/ChatButton'; 
import './advertPage.css';

type AdvertPageParams = { slug: string };

const AdvertPage: React.FC = () => {
  const { slug } = useParams<AdvertPageParams>();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  
  const [selectedStatus, setSelectedStatus] = useState<StatusAnuncio>();
  const [advert, setAdvert] = useState<Anuncio>();
  
  useEffect(() => {
    const fetchAdvert = async () => {
      if (slug) {
        const response = await getAdvertBySlug(slug);
        if (response.status === 200) {
          setSelectedStatus(response.data.estado);
          setAdvert(response.data);
          dispatch(setSelectedAdvertSlug(response.data.slug));
        }
      }
    };
    fetchAdvert();
  }, [slug, user]);

  const handleChatButton = () => {
    if (!advert || !user) return;

    const chat = {
      advertId: advert._id,
      ownerId: advert.autor._id,
      userId: user.id,
    };
    dispatch(setSelectedChat(chat));
  };

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
              <ChatButton onClick={handleChatButton} /> 
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
              src={`${AWS_S3_BUCKET_URL}${advert.imagen}`}
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
