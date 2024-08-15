export interface Anuncio {
  _id: string;
  nombre: string;
  imagen: string;
  descripcion: string;
  precio: number;
  tipoAnuncio: 'venta' | 'búsqueda';
  tags: string[];
  autor: { _id: string; nombre: string };
  fechaPublicacion: string;
  slug: string;
}

export interface AnunciosResponse {
  anuncios: Anuncio[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AnunciosFilter {
  tags: string[];
  tipoAnuncio: string;
  precioMin: string;
  precioMax: string;
}

export type Sort = 'asc' | 'desc';

export interface IGetAdvertsParams {
  currentPage: number;
  searchTerm: string;
  filter: AnunciosFilter;
  sort: Sort;
  username?: string;
}
