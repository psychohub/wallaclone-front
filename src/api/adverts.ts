import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';
import { AnunciosFilter, AnunciosResponse, Sort } from '../types/adverts';

interface IGetAdvertsParams {
	currentPage: number;
	searchTerm: string;
	filter: AnunciosFilter;
	sort: Sort;
};

export const getAdverts = async ({ currentPage, searchTerm, filter, sort }: IGetAdvertsParams) => {
	const itemsPerPage = 12;

	try {
		const response = await axios.get<AnunciosResponse>(
			'/anuncios', {
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
		return {
			status: response.status,
			data: response.data
		};
	} catch (error) {
		throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
};
