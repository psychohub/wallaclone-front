import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ListGroup, Container, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEye } from '@fortawesome/free-regular-svg-icons';
import { Anuncio, StatusAnuncio } from '../../types/adverts';
import { AWS_S3_BUCKET_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import Img from '../image/Img';
import AdvertStatusActions from '../advertStatusActions/AdvertStatusActions';
import './advertListItem.css';

const AdvertListItem = ({ anuncio }: { anuncio: Anuncio }) => {
  const [selectedStatus, setSelectedStatus] = useState<StatusAnuncio>(anuncio.state);

  const showStatus = () => {
    if (anuncio.state === 'disponible') {
      return (
        <div className="status">
          <p>{anuncio.typeAdvert === 'venta' ? 'Se vende' : 'Se busca'}</p>
        </div>
      );
    } else if (anuncio.state === 'reservado') {
      return (
        <div className="status reserved">
          <p>Reservado</p>
        </div>
      );
    } else if (anuncio.state === 'vendido') {
      return (
        <div className="status sold">
          <p>Vendido</p>
        </div>
      );
    }
  };

  return (
    <ListGroup.Item className="product-item">
      <Container fluid>
        <Row>
          <Col sm={12} md={2}>
            <Img
              src={`${AWS_S3_BUCKET_URL}${anuncio.imagen}`}
              alt={sanitizeInput(anuncio.name)}
              crossOrigin="anonymous"
            />
          </Col>
          <Col sm={12} md={10}>
            <div className="product-item-content">
              <h3>{sanitizeInput(anuncio.name)}</h3>
              <div className="tags">
                {anuncio.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {sanitizeInput(tag)}
                  </span>
                ))}
              </div>
              {showStatus()}
              <p className="price">{anuncio.price} €</p>
              <p>{sanitizeInput(anuncio.description)}</p>
            </div>
            <div className="actions">
              <Link to={`/articulos/${anuncio.slug}`}>
                <OverlayTrigger overlay={<Tooltip>Ver detalles del anuncio</Tooltip>}>
                  <Button type="button" variant="link">
                    <FontAwesomeIcon icon={faEye} size="lg" />
                  </Button>
                </OverlayTrigger>
              </Link>
              {anuncio.state !== 'vendido' && (
                <>
                  <Link to={`/app/articulos/${anuncio.slug}/editar`}>
                    <OverlayTrigger overlay={<Tooltip>Editar anuncio</Tooltip>}>
                      <Button type="button" variant="link">
                        <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                      </Button>
                    </OverlayTrigger>
                  </Link>
                  <AdvertStatusActions
                    advertId={anuncio._id}
                    owner={anuncio.author._id}
                    currentStatus={selectedStatus}
                    setCurrentStatus={setSelectedStatus}
                    size="lg"
                  />
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </ListGroup.Item>
  );
};

export default AdvertListItem;
