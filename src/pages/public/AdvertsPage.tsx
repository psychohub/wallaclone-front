import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { sanitizeInput } from '../../utils/sanitize';
import Loader from '../../components/loader/Loader';
import CategoryFilter from '../../components/CategoryFilter';
import { API_BASE_URL } from '../../config/environment';
import { Anuncio, AnunciosFilter, Sort } from '../../types/adverts';
import { getAdverts } from '../../api/adverts';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdvertsPage: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<AnunciosFilter>({ tags: [], tipoAnuncio: '', precioMin: '', precioMax: '' });
  const [sort, setSort] = useState<Sort>('desc'); 

  const fetchAnuncios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const adverts = await getAdverts({ currentPage, searchTerm, filter, sort });
      
      if (adverts.data && adverts.data.anuncios && Array.isArray(adverts.data.anuncios)) {
        setAnuncios(adverts.data.anuncios);
        setTotalPages(adverts.data.totalPages);
      } else {
        setError('Error en el formato de datos recibido.');
      }
    } catch (error) {
      setError('Error al cargar los anuncios. Por favor, intenta de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnuncios();
  }, [currentPage, searchTerm, filter, sort]); 
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleTagsChange = (selectedCategories: string[]) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      tags: selectedCategories
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value as Sort);
  };

  return (
    <div className="list-container">
      <div className="search-container">
        <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Buscar anuncios..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <div className="filters-container">
        <CategoryFilter 
          categories={[
            'tech', 'audio', 'tablet', 'wearable', 'home', 'gaming',
            'furniture', 'office', 'lifestyle', 'sports', 'keyboard',
            'work', 'mobile', 'photo'
          ]}
          selectedCategories={filter.tags}
          onChange={handleTagsChange}
        />
        <div className="filter-group">
          <label htmlFor="tipoAnuncio">Tipo:</label>
          <select id="tipoAnuncio" name="tipoAnuncio" value={filter.tipoAnuncio} onChange={handleFilterChange}>
            <option value="">Todos</option>
            <option value="venta">Venta</option>
            <option value="búsqueda">Búsqueda</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="precioMin">Precio Mín:</label>
          <input type="number" id="precioMin" name="precioMin" value={filter.precioMin} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label htmlFor="precioMax">Precio Máx:</label>
          <input type="number" id="precioMax" name="precioMax" value={filter.precioMax} onChange={handleFilterChange} />
        </div>
        <div className="filter-group">
          <label htmlFor="sort">Ordenar por:</label>
          <select id="sort" name="sort" value={sort} onChange={handleSortChange}>
            <option value="desc">Más reciente</option>
            <option value="asc">Más antiguo</option>
          </select>
        </div>
      </div>

      {isLoading && <Loader />}
      {error && <div>{error}</div>}
      {!isLoading && !error && anuncios.length > 0 ? (
        <div className="list">
          {anuncios.map((anuncio) => (
            <Card key={anuncio._id} className="advert-card">
              {anuncio.imagen ? (
                <div className='advert-img'>
                  <img
                    src={`${API_BASE_URL}/images/${anuncio.imagen}`}
                    alt={sanitizeInput(anuncio.nombre)}
                    crossOrigin="anonymous" />
                </div>
              ) : (
                <div className="placeholder-image">Imagen no disponible</div>
              )}
              <Card.Body className="advert-card-content">
                <h3>
                  <Link to={`/anuncios/${anuncio.slug}`}>
                    {sanitizeInput(anuncio.nombre)}
                  </Link>
                </h3>
                <div className="tags">
                  { anuncio.tags.map(tag => <span className="tag">{sanitizeInput(tag)}</span>) }
                </div>
                <p className="price">{anuncio.precio} €</p>
                <p>{sanitizeInput(anuncio.descripcion)}</p>
                <p className={`sale ${anuncio.tipoAnuncio === 'venta' ? '' : 'busca'}`}>{anuncio.tipoAnuncio === 'venta' ? 'Se vende' : 'Se busca'}</p>
              </Card.Body>
              <Card.Footer>
                <div className="actions">
                  <Link to={`/anuncios/${anuncio.slug}`}>
                    Ir al detalle
                  </Link>
                  <Link to={`/anuncios/usuario/${anuncio.autor.nombre}`}>
                    @{anuncio.autor.nombre}
                  </Link>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      ) : (
        !isLoading && !error && <p>No hay anuncios disponibles.</p>
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
