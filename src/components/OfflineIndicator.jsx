import { useOffline } from '../context/OfflineContext';

export default function OfflineIndicator() {
    const { isOnline } = useOffline();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 animate-in slide-in-from-bottom-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20" /><path d="M8.5 8.5c.3-.3.7-.5 1.1-.7" /><path d="M12 4a8.9 8.9 0 0 1 5.4 1.8" /><path d="M2.6 11.4A15 15 0 0 1 12 8c.6 0 1.2.1 1.8.2" /><path d="M17.4 17.4A15.3 15.3 0 0 1 12 19c-3.1 0-6.1-.9-8.5-2.6" /><path d="M7 11.6C4.8 12.8 2.9 14.5 1.4 16.5" /></svg>
            You are offline. Changes will sync when reconnected.
        </div>
    );
}
