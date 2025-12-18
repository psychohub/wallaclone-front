import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Container } from 'react-bootstrap';
import { getAdvertBySlug } from '../../../api/adverts';
import { Anuncio, StatusAnuncio } from '../../../types/adverts';
import { AWS_S3_BUCKET_URL } from '../../../config/environment';
import { sanitizeInput } from '../../../utils/sanitize';
import { useAppDispatch, useAppSelector } from '../../../hooks/useStore';
import { setSelectedChat } from '../../../store/features/chats/chatsSlice';
import { setSelectedAdvertSlug } from '../../../store/features/adverts/advertsSlice';
import Loader from '../../../components/loader/Loader';
import AdvertStatusAction from '../../../components/advertStatusActions/AdvertStatusActions';
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
          setSelectedStatus(response.data.state);
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
      ownerId: advert.author._id,
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
            <Link
              className="username"
              to={
                user && user.id !== advert.author._id
                  ? `/articulos/usuario/${advert.author.name}`
                  : '/app/articulos'
              }
            >
              @{advert.author.name}
            </Link>
            {user && user.id !== advert.author._id && <ChatButton onClick={handleChatButton} />}
            {selectedStatus && (
              <AdvertStatusAction
                advertId={advert._id}
                owner={advert.author._id}
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
              alt={sanitizeInput(advert.name)}
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="placeholder-image">Imagen no disponible</div>
        )}
        <Card.Body className="content">
          <h2>{sanitizeInput(advert.name)}</h2>
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
    </Container>
  );
};

export default AdvertPage;
