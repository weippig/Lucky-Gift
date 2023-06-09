import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3001/',
	headers: {
		Accept: 'application/json',
		timeout: 8000,
	},
});

export default axiosInstance