import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';

export interface Anuncio {
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

const ITEMS_PER_PAGE = 12;

export const getAdvertsByUser = async ({ currentPage, searchTerm, filter, sort, username }: IGetAdvertsParams): Promise<{ status: number; data: AnunciosResponse }> => {
  try {
    const response = await axios.get<AnunciosResponse>(
      `/anuncios/user/${username}`,
      {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          nombre: searchTerm,
          tag: filter.tags.join(','),
          tipoAnuncio: filter.tipoAnuncio,
          minPrecio: filter.precioMin,
          maxPrecio: filter.precioMax,
          sort: sort 
        }
      }
    );
    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
  }
};