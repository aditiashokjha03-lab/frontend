import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        if (!navigator.onLine && ['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '')) {
            const { offlineQueue } = await import('../services/offlineQueue');
            await offlineQueue.enqueue({
                method: config.method,
                url: config.url,
                data: config.data,
                headers: config.headers
            });
            // Throw a special error to let the caller know it was queued
            const offlineError = new Error('Offline: Action queued for sync');
            offlineError.isOffline = true;
            return Promise.reject(offlineError);
        }

        try {
            // ... original auth logic ...
            const { supabase } = await import('../lib/supabase');
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                }
            } else {
                const demo = localStorage.getItem('habitforge_demo_user');
                if (demo) {
                    const demoUser = JSON.parse(demo);
                    config.headers['X-Demo-User-Id'] = demoUser.id;
                }
            }
        } catch (err) {
            // non-critical: supabase or demo user might not be available
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
