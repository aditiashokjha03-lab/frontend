import axios from 'axios';

// Always use relative URL — requests are handled by Netlify Functions (same origin).
// In local dev with `netlify dev`, Functions are served on the same port.
const baseURL = '/api/v1';

const axiosInstance = axios.create({
    baseURL,
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
            const { supabase } = await import('../lib/supabase');
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.access_token) {
                    config.headers.Authorization = `Bearer ${session.access_token}`;
                } else {
                    console.warn('No auth token found. User might not be logged in.');
                }
            }
        } catch (err) {
            // non-critical: supabase or demo user might not be available

                {
                console.warn('Auth token setup failed', err);
            }

        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
