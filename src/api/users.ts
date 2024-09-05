import { AxiosError } from 'axios';
import axios from '../lib/axiosInstance';

export const changePassword = async ({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) => {
	try {
		const response = await axios.put('/users/actualizar-contrasena', {
			oldPass: oldPassword,
			newPass: newPassword,
		});
		return {
			status: response.status,
			data: response.data.result
		};
	} catch (error) {
		throw new Error(((error as AxiosError).response?.data as any).message as string ?? (error as Error).message);
	}
};

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

export const updateUserInfo = async ({ name, email }: { name: string, email: string }) => {
	try {
		const response = await axios.put('/users/actualizar-datos', {
			name,
			email
		});
		return {
			status: response.status,
			data: response.data.result
		};
	} catch (error) {
		throw new Error(((error as AxiosError).response?.data as any).message as string ?? (error as Error).message);
	}
};
