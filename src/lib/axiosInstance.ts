import axios from 'axios';
import { ACCESS_TOKEN, API_BASE_URL, USER_DATA } from '../config/environment';
import { store } from '../store';

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
		const accessToken = store.getState().auth.token ?? window.localStorage.getItem(ACCESS_TOKEN);

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

axiosInstance.interceptors.response.use(
	response => response,
  error => {
    const {status} = error.response;
		const accessToken = window.localStorage.getItem(ACCESS_TOKEN);
		
    if (status === 401 && accessToken) {
      localStorage.removeItem(ACCESS_TOKEN);
    	localStorage.removeItem(USER_DATA);
			window.location.href = '/';
    }
   	return Promise.reject(error);
 }
);

export default axiosInstance;
