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
  estado: StatusAnuncio;
}

export interface AnunciosResponse {
  anuncios: Anuncio[];
  total: number;
  page: number;
  totalPages: number;
}

export type Sort = 'asc' | 'desc';

export interface IGetAdvertsParams {
  currentPage: number;
  filter?: IAdvertsFilters;
  username?: string;
}

export interface IAdvertsFilters {
  searchTerm?: string;
  tags: string[];
  tipoAnuncio?: string;
  precioMin?: string;
  precioMax?: string;
	sort?: Sort;
};

export const initialFilterValues: IAdvertsFilters = {
	searchTerm: '',
	tags: [], 
	tipoAnuncio: '', 
	precioMin: '', 
	precioMax: '',
	sort: undefined,
};

export type StatusAnuncio = 'disponible' | 'reservado' | 'vendido';
