import axiosInstance from '../lib/axiosInstance';
import { AxiosError } from 'axios';
import { Anuncio, AnunciosResponse, IGetAdvertsParams, StatusAnuncio } from '../types/adverts';
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
		throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
};

export const getAdvertBySlug = async (slug: string) => {
	try {
		const response = await axiosInstance.get(`/anuncios/item/${slug}`);
		return {
			status: response.status,
			data: response.data.result as Anuncio
		};
	} catch (error) {
		throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
};

export const changeAdvertStatus = async (advertId: string, newStatus: StatusAnuncio) => {
	try {
		const response = await axiosInstance.put(`/anuncios/status/${advertId}`, { estado: newStatus });
		return {
			status: response.status,
			data: response.data.result
		};
	} catch (error: any) {
		throw new Error(error.response.data.message as string ?? error.message);
	}
};

export const getAdvertById = async (id: string) => {
	try {
	  const response = await axiosInstance.get(`/anuncios/${id}`);
	  return {
		status: response.status,
		data: response.data as Anuncio
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

  export const addFavorite = async (anuncioId: string) => {
	try {
	  const response = await axiosInstance.post('/favoritos', { anuncioId });
	  return {
		status: response.status,
		data: response.data
	  };
	} catch (error) {
	  throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
  };
  
  export const removeFavorite = async (anuncioId: string) => {
	try {
	  const response = await axiosInstance.delete(`/favoritos/${anuncioId}`);
	  return {
		status: response.status,
		data: response.data
	  };
	} catch (error) {
	  throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
  };
  
  export const getFavorites = async () => {
	try {
	  const response = await axiosInstance.get('/favoritos');
	  return {
		status: response.status,
		data: response.data
	  };
	} catch (error) {
	  if ((error as AxiosError).response?.status === 401) {
		return {
		  status: 200,
		  data: { favoritos: [] }
		};
	  }
	  throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
  };