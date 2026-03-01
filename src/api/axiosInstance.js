import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            // Only try to get Supabase token if supabase is initialized
            const { supabase } = await import('../lib/supabase');
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                }
            } else {
                // Demo mode: attach demo flag so backend knows
                const demo = localStorage.getItem('habitforge_demo_user');
                if (demo) {
                    const demoUser = JSON.parse(demo);
                    config.headers['X-Demo-User-Id'] = demoUser.id;
                }
            }
        } catch { /* non-critical */ }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
