import axios from 'axios';
import { supabase } from '../lib/supabase';

const getBaseURL = () => {
    // Development fallback
    if (import.meta.env.DEV) {
        return (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1/').replace(/\/$/, '') + '/';
    }

    // Production: Always use the Render URL with explicit prefix
    // This is more reliable than Vercel environment variables which can vary
    const prodUrl = 'https://backend-cxl4.onrender.com/api/v1/';
    console.log('[Axios] Production Mode - Using baseURL:', prodUrl);
    return prodUrl;
};

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
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
