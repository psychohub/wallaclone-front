import React, { useState, useEffect } from 'react';
import axios from '../lib/axiosInstance';
import ReactPaginate from 'react-paginate';
import { sanitizeInput } from '../utils/sanitize';
import Loader from './loader/Loader';
import CategoryFilter from './CategoryFilter';
import { useSelector } from 'react-redux';
import { RootState } from '../store/index';
import { API_BASE_URL } from '../config/environment';

interface Anuncio {
  _id: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  precio: number;
  tipoAnuncio: 'venta' | 'búsqueda';
  tags: string[];
  autor: { _id: string; nombre: string } | null;
  fechaPublicacion: string;
}

interface AnunciosResponse {
  anuncios: Anuncio[];
  total: number;
  page: number;
  totalPages: number;
}

interface Filter {
  tags: string[];
  tipoAnuncio: string;
  precioMin: string;
  precioMax: string;
}

const UserAdList: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<Filter>({ tags: [], tipoAnuncio: '', precioMin: '', precioMax: '' });
  const [sort, setSort] = useState('desc');

  const itemsPerPage = 12;

  const fetchAnuncios = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<AnunciosResponse>(
        `/perfil/${user.nombre}/anuncios`,
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            nombre: searchTerm,
            tag: filter.tags.join(','),
            tipoAnuncio: filter.tipoAnuncio,
            minPrecio: filter.precioMin,
            maxPrecio: filter.precioMax,
            sort: sort 
          }
        }
      );

      if (response.data && response.data.anuncios && Array.isArray(response.data.anuncios)) {
        setAnuncios(response.data.anuncios);
        setTotalPages(response.data.totalPages);
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
  }, [currentPage, searchTerm, filter, sort, user]);

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
    setSort(e.target.value);
  };

  return (
    <div className="ad-list-container">
      <h2>Mis Anuncios</h2>
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
        <div className="ad-list">
          {anuncios.map((anuncio) => (
            <div key={anuncio._id} className="ad-card">
              {anuncio.imagen ? (
                <img
                  crossOrigin="anonymous"
                  src={`${API_BASE_URL}/images/${anuncio.imagen}`}
                  alt={sanitizeInput(anuncio.nombre)}
                  onError={(e) => {
                    e.currentTarget.src = '/path/to/placeholder.jpg'; 
                    e.currentTarget.alt = 'Imagen no disponible';
                  }}
                />
              ) : (
                <div className="placeholder-image">Imagen no disponible</div>
              )}
              <div className="ad-card-content">
                <h3>{sanitizeInput(anuncio.nombre)}</h3>
                <p>{sanitizeInput(anuncio.descripcion)}</p>
                <p className="price">Precio: {anuncio.precio}€</p>
                <p>Tipo: {anuncio.tipoAnuncio}</p>
                <p>Tags: {anuncio.tags.map(tag => sanitizeInput(tag)).join(', ')}</p>
              </div>
            </div>
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

export default UserAdList;