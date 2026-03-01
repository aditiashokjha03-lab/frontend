// In-memory + localStorage mock data store for Demo Mode
// All demo data is persisted in localStorage so it survives page refreshes

function getStoreKey() {
    try {
        const demoUserRaw = localStorage.getItem('habitforge_demo_user');
        if (demoUserRaw) {
            const user = JSON.parse(demoUserRaw);
            if (user && user.email) {
                return `habitforge_store_${user.email}`;
            }
        }
    } catch { }
    return 'habitforge_demo_store';
}

function getStore() {
    const key = getStoreKey();
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);

        // Fallback to migrate existing demo user data
        if (key !== 'habitforge_demo_store') {
            const oldRaw = localStorage.getItem('habitforge_demo_store');
            if (oldRaw) {
                const oldData = JSON.parse(oldRaw);
                localStorage.setItem(key, oldRaw);
                return oldData;
            }
        }
    } catch { /* ignore invalid or missing store */ }
    return { habits: [], logs: {} };
}

function saveStore(store) {
    const key = getStoreKey();
    try {
        localStorage.setItem(key, JSON.stringify(store));
    } catch { /* ignore write failures */ }
}

export const mockStore = {
    // --- Habits ---
    getHabits() {
        return getStore().habits;
    },
    createHabit(data) {
        const store = getStore();
        const habit = { ...data, id: 'h-' + Date.now(), current_streak: 0, longest_streak: 0 };
        store.habits = [...store.habits, habit];
        saveStore(store);
        return habit;
    },
    updateHabit(id, data) {
        const store = getStore();
        store.habits = store.habits.map(h => h.id === id ? { ...h, ...data } : h);
        saveStore(store);
        return store.habits.find(h => h.id === id);
    },
    deleteHabit(id) {
        const store = getStore();
        store.habits = store.habits.filter(h => h.id !== id);
        saveStore(store);
    },

    // --- Logs ---
    getLogsByDate(date) {
        return getStore().logs[date] || [];
    },
    upsertLog(logData) {
        const store = getStore();
        const date = logData.date || new Date().toISOString().split('T')[0];
        const dayLogs = store.logs[date] || [];
        const existing = dayLogs.findIndex(l => l.habit_id === logData.habit_id);
        if (existing >= 0) {
            dayLogs[existing] = { ...dayLogs[existing], ...logData };
        } else {
            dayLogs.push({ id: 'log-' + Date.now(), date, ...logData });
        }
        store.logs[date] = dayLogs;

        // Update streak on the habit
        if (logData.completed) {
            store.habits = store.habits.map(h => {
                if (h.id !== logData.habit_id) return h;
                const newStreak = (h.current_streak || 0) + 1;
                return {
                    ...h,
                    current_streak: newStreak,
                    longest_streak: Math.max(h.longest_streak || 0, newStreak),
                };
            });
        }

        saveStore(store);
        return store.logs[date];
    },

    // --- Analytics ---
    getSummary() {
        const store = getStore();
        const habits = store.habits;
        return {
            total_habits: habits.length,
            active_habits: habits.length,
            best_streak: Math.max(...habits.map(h => h.current_streak || 0), 0),
            total_xp: habits.reduce((a, h) => a + (h.current_streak || 0) * 10, 0),
        };
    },
};
