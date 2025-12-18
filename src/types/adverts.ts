export interface Anuncio {
  _id: string;
  name: string;
  imagen: string;
  description: string;
  price: number;
  typeAdvert: 'venta' | 'búsqueda';
  tags: string[];
  author: { _id: string; name: string; email: string };
  publicationDate: string;
  slug: string;
  state: StatusAnuncio;
}

export interface AnunciosResponse {
  adverts: Anuncio[];
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
}

export const initialFilterValues: IAdvertsFilters = {
  searchTerm: '',
  tags: [],
  tipoAnuncio: '',
  precioMin: '',
  precioMax: '',
  sort: undefined,
};

export type StatusAnuncio = 'disponible' | 'reservado' | 'vendido';
