import React, { useState, useEffect } from 'react';
import axios from '../lib/axiosInstance';
import ReactPaginate from 'react-paginate';
import { sanitizeInput } from '../utils/sanitize';
import Loader from '../utils/Loader';
import '../App.css';
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

const AdList: React.FC = () => {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchAnuncios = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get<AnunciosResponse>(
          `/api/anuncios?page=${currentPage}&limit=${itemsPerPage}`
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
    fetchAnuncios();
  }, [currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <div className="ad-list-container">
      <h2>Anuncios</h2>
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
                    e.currentTarget.src = `${API_BASE_URL}/images/no-image-placeholder.jpg`; // Ruta a una imagen de marcador de posición
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
                <p>Autor: {anuncio.autor ? anuncio.autor.nombre : 'Autor desconocido'}</p> {/* Manejar autor null */}
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

export default AdList;
