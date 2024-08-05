import axios from 'axios';
import { ACCESS_TOKEN, API_BASE_URL } from '../config/environment';

const axiosInstance = axios.create({
	baseURL: `${API_BASE_URL}/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

// Request interceptor
axiosInstance.interceptors.request.use(
	async config => {
		const accessToken = window.localStorage.getItem(ACCESS_TOKEN);

		if (accessToken) {
			if (config.headers) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
		}

		return config;
	},
	error => {
		return Promise.reject(error)
	}
);

export default axiosInstance;
