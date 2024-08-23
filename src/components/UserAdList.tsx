import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Loader from './loader/Loader';
import { RootState } from '../store/index';
import { useAppSelector } from '../hooks/useStore';
import { getAdvertsByUser } from '../api/adverts';
import { Anuncio, IAdvertsFilters, IGetAdvertsParams } from '../types/adverts';
import AdvertCard from './advertCard/AdvertCard';
import AdvertsFilters from './advertsFilters/AdvertsFilters';
import { Col, Container, Row } from 'react-bootstrap';

const UserAdList: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchAnuncios = async (filters?: IAdvertsFilters) => {
    if (!user) return;

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
    if (user) {
      fetchAnuncios();
    }
  }, [currentPage, user]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleFilter = (filters: IAdvertsFilters) => {
    fetchAnuncios(filters);
  };

  return (
    <div className="list-container">
      <AdvertsFilters onFilter={handleFilter} />

      <h2 className="page-title">Mis artículos</h2>

      {isLoading && <Loader />}
      
      {error && <div>{error}</div>}
      
      {!isLoading && !error && anuncios.length > 0 ? (
        <Container>
          <Row>
          {anuncios.map((anuncio, index) => (
            <Col sm={12} md={6} lg={3} key={`card-${index}`}>
              <AdvertCard anuncio={anuncio} />
            </Col>
          ))}
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