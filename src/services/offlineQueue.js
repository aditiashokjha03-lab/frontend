import { get, update, clear } from 'idb-keyval';

const QUEUE_KEY = 'habitforge_offline_queue';

export const offlineQueue = {
    async enqueue(action) {
        const item = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            ...action
        };

        await update(QUEUE_KEY, (val) => {
            const queue = val || [];
            return [...queue, item];
        });

        return item;
    },

    async dequeue() {
        let firstItem = null;
        await update(QUEUE_KEY, (val) => {
            const queue = val || [];
            if (queue.length === 0) return queue;

            firstItem = queue[0];
            return queue.slice(1);
        });
        return firstItem;
    },

    async getAll() {
        return (await get(QUEUE_KEY)) || [];
    },

    async clear() {
        await clear();
    }
};
