import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';

export const deleteUserById = async (id: string) => {
	try {
		const response = await axios.delete(`/users/${id}`);
		return {
			status: response.status,
			data: response.data.result
		};
	} catch (error) {
		throw new Error((error as AxiosError).response?.data as string ?? (error as Error).message);
	}
};
