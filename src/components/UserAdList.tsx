import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Container, Button, ListGroup } from 'react-bootstrap';
import { RootState } from '../store/index';
import { useAppSelector } from '../hooks/useStore';
import { getAdvertsByUser } from '../api/adverts';
import { Anuncio, IAdvertsFilters, IGetAdvertsParams } from '../types/adverts';
import Loader from './loader/Loader';
import AdvertsFilters from './advertsFilters/AdvertsFilters';
import AdvertListItem from './advertListItem/AdvertListItem';

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
      console.error('Error fetching articulos:', error);
      setError('Error al cargar los artículos. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchAnuncios();
  }, [currentPage, user]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleFilter = (filters: IAdvertsFilters) => {
    fetchAnuncios(filters);
  };

  return (
    <div className="list-container">
      <h2 className="page-title">Mis anuncios</h2>
      
      <Link to="/app/articulos/nuevo">
        <Button variant="secondary" className="mb-3">Crear nuevo anuncio</Button>
      </Link>

      <AdvertsFilters onFilter={handleFilter} />

      {isLoading && <Loader />}
      
      {error && <div>{error}</div>}
      
      {!isLoading && !error && anuncios.length > 0 ? (
        <Container>
          <ListGroup>
            {anuncios.map((anuncio) => (
              <AdvertListItem anuncio={anuncio} key={anuncio._id}/>
            ))}
          </ListGroup>
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
