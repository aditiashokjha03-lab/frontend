import { offlineQueue } from './offlineQueue';
import axiosInstance from '../api/axiosInstance';
import { queryClient } from '../store/queryClient';
import { toast } from 'sonner';

export const processSyncQueue = async () => {
    if (!navigator.onLine) return;

    const queue = await offlineQueue.getAll();
    if (queue.length === 0) return;

    toast.loading(`Syncing ${queue.length} offline changes...`, { id: 'sync-toast' });

    let successCount = 0;
    let hasErrors = false;

    while (true) {
        const item = await offlineQueue.dequeue();
        if (!item) break; // queue is empty

        try {
            // Replay the request
            await axiosInstance({
                method: item.method,
                url: item.url,
                data: item.data,
                headers: item.headers,
            });
            successCount++;
        } catch (error) {
            console.error('Failed to sync offline item:', item, error);
            hasErrors = true;
            // Re-enqueue the item at the end or wait? 
            // For MVP, if one fails we stop and re-enqueue to maintain order
            await offlineQueue.enqueue(item);
            break;
        }
    }

    if (successCount > 0) {
        toast.success(`Successfully synced ${successCount} changes!`, { id: 'sync-toast' });
        queryClient.invalidateQueries(); // Refresh UI with real server data
    } else if (hasErrors) {
        toast.error('Sync process paused due to server error. Will try again later.', { id: 'sync-toast' });
    } else {
        toast.dismiss('sync-toast');
    }
};

// Listen to window online event to trigger sync automatically
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        // Small delay to ensure network is fully stable
        setTimeout(processSyncQueue, 2000);
    });
}
