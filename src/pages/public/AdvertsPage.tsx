import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import Loader from '../../components/loader/Loader';
import { Anuncio, IAdvertsFilters, IGetAdvertsParams  } from '../../types/adverts';
import { getAdverts, getFavorites  } from '../../api/adverts';
import AdvertCard from '../../components/advertCard/AdvertCard';
import AdvertsFilters from '../../components/advertsFilters/AdvertsFilters';
import { Col, Container, Row } from 'react-bootstrap';

const AdvertsPage: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const fetchAnuncios = async (filters?: IAdvertsFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      let params: IGetAdvertsParams = { currentPage };
      if (filters) {
        params = { ...params, filter: filters };
      }
      
      const adverts = await getAdverts(params);
      const favoritesResponse = await getFavorites();
      
      if (adverts.data && adverts.data.anuncios && Array.isArray(adverts.data.anuncios)) {
        setAnuncios(adverts.data.anuncios);
        setTotalPages(adverts.data.totalPages);
        try {
          const favoritesResponse = await getFavorites();
          setFavorites(favoritesResponse.data.favoritos.map((fav: any) => fav.anuncio._id));
        } catch (favError) {
          console.error('Error al cargar favoritos:', favError);
          setFavorites([]);
        }
      } else {
        setError('Error en el formato de datos recibido.');
      }
    } catch (error) {
      setError('Error al cargar los artículos. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, [currentPage]);
  
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleFilter = (filters: IAdvertsFilters) => {
    fetchAnuncios(filters);
  };

  const handleFavoriteChange = (anuncioId: string, isFavorite: boolean) => {
    if (isFavorite) {
      setFavorites([...favorites, anuncioId]);
    } else {
      setFavorites(favorites.filter(id => id !== anuncioId));
    }
  };

  return (
    <div className="list-container">
      <AdvertsFilters onFilter={handleFilter} />

      {isLoading && <Loader />}
      
      {error && <div>{error}</div>}
      
      {!isLoading && !error && anuncios.length > 0 ? (
        <Container>
          <Row>
          {anuncios.map((anuncio, index) => (
            <Col sm={12} md={6} lg={3} key={`card-${index}`}>
              <AdvertCard 
                anuncio={anuncio} 
                isFavorite={favorites.includes(anuncio._id)}
                onFavoriteChange={(isFavorite) => handleFavoriteChange(anuncio._id, isFavorite)}
              />
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

export default AdvertsPage;