import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { getFavorites } from '../../api/adverts';
import AdvertCard from '../../components/advertCard/AdvertCard';
import AdvertsFilters from '../../components/advertsFilters/AdvertsFilters'; 
import Loader from '../../components/loader/Loader';
import { Anuncio, IAdvertsFilters, initialFilterValues } from '../../types/adverts';
import './favoritesPage.css';

interface Favorite {
  anuncio: Anuncio;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]); 
  const [filteredFavorites, setFilteredFavorites] = useState<Favorite[]>([]); 
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IAdvertsFilters>(initialFilterValues); 


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getFavorites();
        setFavorites(response.data.favoritos || []);
        setFilteredFavorites(response.data.favoritos || []); 
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);


  const handleFilter = (newFilters: IAdvertsFilters) => {
    setFilters(newFilters);
  
    const filtered = favorites.filter((favorite) => {
      const { anuncio } = favorite;
      
  
      const matchesSearchTerm = anuncio.nombre.toLowerCase().includes((newFilters.searchTerm || '').toLowerCase());
  
  
      const matchesTags = (newFilters.tags || []).length === 0 || newFilters.tags.every(tag => anuncio.tags.includes(tag));
  
 
      const matchesTipoAnuncio = !newFilters.tipoAnuncio || anuncio.tipoAnuncio === newFilters.tipoAnuncio;
  

      const matchesPrice = 
        (newFilters.precioMin === '' || anuncio.precio >= Number(newFilters.precioMin || 0)) &&
        (newFilters.precioMax === '' || anuncio.precio <= Number(newFilters.precioMax || Infinity));
  

      return matchesSearchTerm && matchesTags && matchesTipoAnuncio && matchesPrice;
    });
  
 
    const sortedFavorites = [...filtered].sort((a, b) => {
      if (newFilters.sort === 'asc') {
        return new Date(a.anuncio.fechaPublicacion).getTime() - new Date(b.anuncio.fechaPublicacion).getTime();
      }
      if (newFilters.sort === 'desc') {
        return new Date(b.anuncio.fechaPublicacion).getTime() - new Date(a.anuncio.fechaPublicacion).getTime();
      }
      return 0;
    });
  
    setFilteredFavorites(sortedFavorites); 
  };
  
  if (loading) {
    return <Loader />;
  }

  return (
    <Container className="favorites-page">
      <h1 className="page-title">Mis Favoritos</h1>

   
      <AdvertsFilters onFilter={handleFilter} />

      {filteredFavorites.length === 0 ? (
        <p>No tienes anuncios favoritos.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredFavorites.map((favorite) => (
            <Col key={favorite.anuncio._id}>
              <AdvertCard anuncio={favorite.anuncio} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default FavoritesPage;
