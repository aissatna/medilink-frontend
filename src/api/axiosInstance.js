import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const axiosInstance = axios.create({
    //baseURL: 'http://localhost:8070/medilink',
     baseURL: 'https://laughing-telegram-pg9vpxpgwvwcr5g-8070.app.github.dev/medilink',
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (config.authRequired !== false) {
            const { accessToken } = useAuthStore();
            if (accessToken) {
                config.headers.Authorization = 'Bearer ' + accessToken;
            }
        }

        return config;
    },
    (error) => {
        //TODO: handle error with sankbar
        return Promise.reject(error);
    },
);

export default axiosInstance;

