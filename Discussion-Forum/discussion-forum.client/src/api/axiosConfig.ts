// axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080' // Update with your actual backend URL
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        console.log('token', token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
