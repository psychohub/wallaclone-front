import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Loader from './loader/Loader';
import { RootState } from '../store/index';
import { useAppSelector } from '../hooks/useStore';
import { getAdvertsByUser } from '../api/adverts';
import { Anuncio, IAdvertsFilters, IGetAdvertsParams } from '../types/adverts';
import AdvertCard from './advertCard/AdvertCard';
import AdvertsFilters from './advertsFilters/AdvertsFilters';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const UserAdList: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const token = useAppSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAnuncios = async (filters?: IAdvertsFilters) => {
    if (!user || !token) return;

    setIsLoading(true);
    setError(null);
    try {
      let params: IGetAdvertsParams = { currentPage, username: user.nombre };
      if (filters) {
        params = { ...params, filter: filters };
      }
      const adverts = await getAdvertsByUser(params);

      if (adverts.data && adverts.data.anuncios && Array.isArray(adverts.data.anuncios)) {
        setAnuncios(adverts.data.anuncios);
        setTotalPages(adverts.data.totalPages);
      } else {
        setError('Error en el formato de datos recibido.');
      }
    } catch (error) {
      console.error('Error fetching anuncios:', error);
      setError('Error al cargar los anuncios. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    fetchAnuncios();
  }, [currentPage, user, token, navigate]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleFilter = (filters: IAdvertsFilters) => {
    fetchAnuncios(filters);
  };

  if (!user || !token) {
    return null; 
  }

  console.log('Rendering UserAdList component with ads:', anuncios);

  return (
    <div className="list-container">
      <h2 className="page-title">Mis artículos</h2>
      
      <Link to="/mis-anuncios/nuevo">
        <Button variant="primary" className="mb-3">Crear nuevo anuncio</Button>
      </Link>

      <AdvertsFilters onFilter={handleFilter} />

      {isLoading && <Loader />}
      
      {error && <div>{error}</div>}
      
      {!isLoading && !error && anuncios.length > 0 ? (
        <Container>
          <Row>
            {anuncios.map((anuncio) => {
              console.log('Rendering advert card with slug:', anuncio.slug);
              return (
                <Col sm={12} md={6} lg={3} key={anuncio._id}>
                  {/* Usando el slug en el enlace */}
                  <Link to={`/mis-anuncios/${anuncio.slug}/editar`}> 
                    <AdvertCard anuncio={anuncio} />
                  </Link>
                </Col>
              );
            })}
          </Row>
        </Container>
      ) : (
        !isLoading && !error && <p>No hay artículos disponibles.</p>
      )}

      {totalPages > 1 && (
        <ReactPaginate
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageLinkClassName={"page-link"}
          previousLinkClassName={"previous-link"}
          nextLinkClassName={"next-link"}
          disabledClassName={"disabled"}
          forcePage={currentPage - 1}
        />
      )}
    </div>
  );
};

export default UserAdList;
