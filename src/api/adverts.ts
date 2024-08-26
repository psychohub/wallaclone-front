
import axiosInstance from '../lib/axiosInstance';
import { AxiosError } from 'axios';
import { Anuncio, AnunciosResponse, IGetAdvertsParams } from '../types/adverts';
import { ITEMS_PER_PAGE } from '../config/environment';

export const getAdverts = async ({ currentPage, filter }: IGetAdvertsParams) => {
	try {
		let params: any = {
			page: currentPage,
			limit: ITEMS_PER_PAGE
		};
		if (filter) {
			params = {
				...params,
				nombre: filter.searchTerm,
				tag: filter.tags ? filter.tags.join(',') : undefined,
				tipoAnuncio: filter.tipoAnuncio,
				minPrecio: filter.precioMin,
				maxPrecio: filter.precioMax,
				sort: filter.sort 
			};
		}

		const response = await axiosInstance.get<AnunciosResponse>('/anuncios', { params });
		return {
			status: response.status,
			data: response.data
		};
	} catch (error) {
		throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
};

export const getAdvertsByUser = async ({ currentPage, filter, username }: IGetAdvertsParams) => {
	try {
	  let params: any = {
		page: currentPage,
		limit: ITEMS_PER_PAGE
	  };
	  if (filter) {
		params = {
		  ...params,
		  nombre: filter.searchTerm,
		  tag: filter.tags ? filter.tags.join(',') : undefined,
		  tipoAnuncio: filter.tipoAnuncio,
		  minPrecio: filter.precioMin,
		  maxPrecio: filter.precioMax,
		  sort: filter.sort 
		};
	  }
  
	  const response = await axiosInstance.get<AnunciosResponse>(`/anuncios/user/${username}`, { params });
	  return {
		status: response.status,
		data: response.data
	  };
	} catch (error) {
	  console.error('Error en getAdvertsByUser:', error);
	  throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
  };

export const getAdvertBySlug = async (id: string) => {
	try {
	  const response = await axiosInstance.get<{ result: Anuncio }>(`/anuncios/item/${id}`);
	  return {
		status: response.status,
		data: response.data.result
	  };
	} catch (error) {
	  throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
  };

export const createAdvert = async (formData: FormData) => {
	try {
	  const response = await axiosInstance.post('/anuncios/item', formData, {
		headers: {
		  'Content-Type': 'multipart/form-data',
		},
	  });
	  return response.data;
	} catch (error) {
	  throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
  };
  
  export const editAdvert = async (id: string, formData: FormData) => {
	try {
	  const response = await axiosInstance.put(`/anuncios/item/${id}`, formData, {
		headers: {
		  'Content-Type': 'multipart/form-data',
		},
	  });
	  return response.data;
	} catch (error) {
	  throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
  };