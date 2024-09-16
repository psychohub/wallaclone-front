import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ListGroup, Container, Row, Col, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faEye } from "@fortawesome/free-regular-svg-icons";
import { Anuncio, StatusAnuncio } from '../../types/adverts';
import { AWS_S3_BUCKET_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import Img from '../image/Img';
import AdvertStatusActions from '../advertStatusActions/AdvertStatusActions';
import './advertListItem.css';

const AdvertListItem = ({ anuncio }: { anuncio: Anuncio }) => {
	const [selectedStatus, setSelectedStatus] = useState<StatusAnuncio>(anuncio.estado);
  
	const showStatus = () => {
		if (anuncio.estado === 'disponible') {
			return (
				<div className="status">
					<p>{anuncio.tipoAnuncio === 'venta' ? 'Se vende' : 'Se busca'}</p>
				</div>
			);
		} else if (anuncio.estado === 'reservado') {
			return (
				<div className="status reserved">
					<p>Reservado</p>
				</div>
			);
		} else if (anuncio.estado === 'vendido') {
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
							alt={sanitizeInput(anuncio.nombre)}
							crossOrigin="anonymous"
						/>
					</Col>
					<Col sm={12} md={10}>
						<div className="product-item-content">
							<h3>{sanitizeInput(anuncio.nombre)}</h3>
							<div className="tags">
								{anuncio.tags.map(tag => <span className="tag" key={tag}>{sanitizeInput(tag)}</span>)}
							</div>
							{ showStatus() }
							<p className="price">{anuncio.precio} €</p>
							<p>{sanitizeInput(anuncio.descripcion)}</p>
						</div>
						<div className="actions">
							<Link to={`/articulos/${anuncio.slug}`}>
								<OverlayTrigger overlay={<Tooltip>Ver detalles del anuncio</Tooltip>}>	
									<Button type="button" variant="link">
										<FontAwesomeIcon icon={faEye} size="lg" />
									</Button>
								</OverlayTrigger>
							</Link>
							{anuncio.estado !== 'vendido' && (
								<>
									<Link to={`/app/articulos/${anuncio.slug}/editar`}>
										<OverlayTrigger overlay={<Tooltip>Editar anuncio</Tooltip>}>	
											<Button type="button" variant="link">
												<FontAwesomeIcon icon={faPenToSquare} size="lg" />
											</Button>
										</OverlayTrigger>
									</Link>
									<AdvertStatusActions advertId={anuncio._id} owner={anuncio.autor._id} currentStatus={selectedStatus} setCurrentStatus={setSelectedStatus} size="lg" />
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
