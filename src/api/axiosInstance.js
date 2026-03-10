import axios from 'axios';
import { supabase } from '../lib/supabase';

const getBaseURL = () => {
    // Robust runtime detection
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.port === '5173';

    if (isLocal) {
        return (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1/').replace(/\/$/, '') + '/';
    }

    return 'https://backend-cxl4.onrender.com/api/v1/';
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Added for production debugging
axiosInstance.interceptors.request.use(config => {
    console.log(`[Axios Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
