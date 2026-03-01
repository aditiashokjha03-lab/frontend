/* eslint react-refresh/only-export-components: "off" */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

const OfflineContext = createContext({
    isOnline: true,
});

export const OfflineProvider = ({ children }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const goOnline = () => {
            setIsOnline(true);
            toast.success('Back online! Syncing changes...');
            // Sync processing happens in syncService.js (tied to window 'online' event)
        };

        const goOffline = () => {
            setIsOnline(false);
            toast.error('You are offline. Changes will be saved locally.');
        };

        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);

        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    return (
        <OfflineContext.Provider value={{ isOnline }}>
            {children}
        </OfflineContext.Provider>
    );
};

export const useOffline = () => useContext(OfflineContext);
