import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import { Helmet } from 'react-helmet-async';
import { getAdvertBySlug } from "../../../api/adverts";
import { getChatIdByAdvertId } from '../../../api/chat'; 
import { Anuncio, StatusAnuncio } from "../../../types/adverts";
import { API_BASE_URL } from "../../../config/environment";
import { sanitizeInput } from "../../../utils/sanitize";
import { useAppSelector } from "../../../hooks/useStore";
import Loader from "../../../components/loader/Loader";
import AdvertStatusAction from "../../../components/advertStatusActions/AdvertStatusActions";
import ChatButton from '../../../components/shared/ChatButton/ChatButton'; 
import SocialShare from '../../../components/socialShare/SocialShare';
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

  const shareUrl = `${window.location.origin}/articulos/${advert.slug}`;
  const shareTitle = `Mira este artículo en Wallaclone: ${advert.nombre}`;

  return (
    <Container className="medium-container">
       <Helmet>
        <title>{`${advert.nombre} - Wallaclone`}</title>
        <meta property="og:title" content={`${advert.nombre} - Wallaclone`} />
        <meta property="og:description" content={advert.descripcion} />
        <meta property="og:image" content={`${API_BASE_URL}/images/${advert.imagen}`} />
        <meta property="og:url" content={shareUrl} />
      </Helmet>
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
              <ChatButton advertId={advert._id} chatId={chatId} /> 
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
          <SocialShare url={shareUrl} title={shareTitle} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdvertPage;