import { Button, ListGroup, Container, Row, Col } from 'react-bootstrap';
import { Anuncio } from '../../types/adverts';
import { API_BASE_URL } from '../../config/environment';
import { sanitizeInput } from '../../utils/sanitize';
import { Link } from 'react-router-dom';
import Img from '../image/Img';
import './advertListItem.css';

const AdvertListItem = ({ anuncio }: { anuncio: Anuncio }) => {
  
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
					<Col sm={12} md={3}>
						<Img 
							src={`${API_BASE_URL}/images/${anuncio.imagen}`}
							alt={sanitizeInput(anuncio.nombre)}
							crossOrigin="anonymous"
						/>
					</Col>
					<Col sm={12} md={9}>
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
								<Button type="button" variant="outline-primary" size="sm">
									Ver
								</Button>
							</Link>
							{anuncio.estado !== 'vendido' && (
								<Link to={`/app/articulos/${anuncio.slug}/editar`}>
									<Button type="button" variant="primary" size="sm">
										Editar
									</Button>
								</Link>
							)}
						</div>
					</Col>
				</Row>
			</Container>
		</ListGroup.Item>
  );
};

export default AdvertListItem;
