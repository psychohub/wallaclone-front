import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';
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

		const response = await axios.get<AnunciosResponse>('/anuncios', { params });
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

		const response = await axios.get<AnunciosResponse>(`/anuncios/user/${username}`, { params });
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
		const response = await axios.get(`/anuncios/item/${slug}`);
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
		const response = await axios.put(`/anuncios/status/${advertId}`, { estado: newStatus });
		return {
			status: response.status,
			data: response.data.result
		};
	} catch (error: any) {
		throw new Error(error.response.data.message as string ?? error.message);
	}
};
