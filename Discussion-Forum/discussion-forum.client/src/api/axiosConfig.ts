import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080' // Update with your actual backend URL
});

axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    })

    failedQueue = [];
}

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({resolve, reject});
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                })
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            return new Promise((resolve, reject) => {
                axios.post('http://localhost:8080/refresh', { refreshToken })
                    .then(({ data }) => {
                        localStorage.setItem('token', data.accessToken);
                        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
                        processQueue(null, data.accessToken);
                        resolve(axiosInstance(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
