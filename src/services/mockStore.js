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
    return { habits: [], logs: {}, goals: [], profile: { xp: 0, level: 1 }, reminders: [] };
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
        const existingIdx = dayLogs.findIndex(l => l.habit_id === logData.habit_id);

        let isNewlyCompleted = false;
        let resultLog;

        if (existingIdx >= 0) {
            isNewlyCompleted = logData.completed && !dayLogs[existingIdx].completed;
            dayLogs[existingIdx] = { ...dayLogs[existingIdx], ...logData };
            resultLog = dayLogs[existingIdx];
        } else {
            isNewlyCompleted = logData.completed;
            resultLog = { id: 'log-' + Date.now(), date, ...logData };
            dayLogs.push(resultLog);
        }
        store.logs[date] = dayLogs;

        let xpEarned = 0;
        let leveledUp = false;
        let currentStreak = 0;

        const habit = store.habits.find(h => h.id === logData.habit_id);
        if (habit) {
            // XP Logic
            if (isNewlyCompleted) {
                const xpMap = { easy: 10, medium: 25, hard: 50, expert: 100 };
                xpEarned = xpMap[habit.difficulty] || 25;

                const getXpThreshold = (level) => level * 100;
                let newXp = (store.profile?.xp || 0) + xpEarned;
                let newLevel = store.profile?.level || 1;

                while (newXp >= getXpThreshold(newLevel)) {
                    newXp -= getXpThreshold(newLevel);
                    newLevel += 1;
                    leveledUp = true;
                }
                store.profile = { ...(store.profile || {}), xp: newXp, level: newLevel };
            }

            // Streak Logic
            if (logData.completed) {
                const today = new Date(date);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                // Simplified streak check in mock store
                if (habit.last_completed === yesterdayStr) {
                    currentStreak = (habit.current_streak || 0) + 1;
                } else if (habit.last_completed === date) {
                    currentStreak = habit.current_streak || 1;
                } else {
                    currentStreak = 1;
                }

                habit.current_streak = currentStreak;
                habit.longest_streak = Math.max(habit.longest_streak || 0, currentStreak);
                habit.last_completed = date;
            } else if (logData.completed === false) {
                // If explicitly uncompleted, we might want to reset streak, 
                // but usually streaks are daily, so we just don't increment.
            }
        }

        saveStore(store);

        // Sync with AuthContext's demo users list for profile fetches
        try {
            const demoUserRaw = localStorage.getItem('habitforge_demo_user');
            if (demoUserRaw) {
                const currentUser = JSON.parse(demoUserRaw);
                const DEMO_USERS_KEY = 'habitforge_demo_users_list';
                const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY)) || {};
                if (users[currentUser.email]) {
                    const updatedProfile = { ...users[currentUser.email], ...store.profile };
                    users[currentUser.email] = updatedProfile;
                    localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
                    // ALSO update the current session user so AuthContext restores it on refresh
                    localStorage.setItem('habitforge_demo_user', JSON.stringify(updatedProfile));
                }
            }
        } catch { }

        return {
            log: resultLog,
            xp_earned: xpEarned,
            leveled_up: leveledUp,
            streak: currentStreak
        };
    },

    // --- Analytics ---
    getSummary() {
        const store = getStore();
        const habits = store.habits;
        const logs = store.logs;
        const profile = store.profile || { xp: 0, level: 1 };

        // Total check-ins (all-time completions)
        let totalCheckins = 0;
        Object.values(logs).forEach(dayLogs => {
            dayLogs.forEach(log => {
                if (log.completed) totalCheckins++;
            });
        });

        // Overall completion rate
        let totalPotentialCompletions = 0;
        const now = new Date();

        habits.forEach(habit => {
            // If habit doesn't have created_at, fallback to a week ago or now
            const createdAt = habit.created_at ? new Date(habit.created_at) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const daysSinceCreation = Math.max(1, Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24)));
            totalPotentialCompletions += daysSinceCreation;
        });

        const overallRate = totalPotentialCompletions > 0
            ? Math.round((totalCheckins / totalPotentialCompletions) * 100)
            : 0;

        return {
            total_habits: habits.length,
            active_habits: habits.filter(h => !h.archived).length,
            best_streak: habits.length > 0 ? Math.max(...habits.map(h => h.longest_streak || 0), 0) : 0,
            total_xp: profile.xp,
            level: profile.level,
            total_checkins: totalCheckins,
            overall_completion_rate: Math.min(100, overallRate)
        };
    },

    // --- Goals ---
    getGoals() {
        return getStore().goals || [];
    },
    createGoal(data) {
        const store = getStore();
        const goal = { ...data, id: 'g-' + Date.now(), current_value: data.current_value || 0, status: data.status || 'active', created_at: new Date().toISOString() };
        store.goals = [...(store.goals || []), goal];
        saveStore(store);
        return goal;
    },
    updateGoal(id, data) {
        const store = getStore();
        store.goals = (store.goals || []).map(g => g.id === id ? { ...g, ...data } : g);
        saveStore(store);
        return store.goals.find(g => g.id === id);
    },
    deleteGoal(id) {
        const store = getStore();
        store.goals = (store.goals || []).filter(g => g.id !== id);
        saveStore(store);
    },

    // --- Reminders ---
    getReminders() {
        return getStore().reminders || [];
    },
    addReminder(data) {
        const store = getStore();
        const reminder = { ...data, id: 'r-' + Date.now(), created_at: new Date().toISOString() };
        store.reminders = [...(store.reminders || []), reminder];
        saveStore(store);
        return reminder;
    },
    updateReminder(id, data) {
        const store = getStore();
        store.reminders = (store.reminders || []).map(r => r.id === id ? { ...r, ...data } : r);
        saveStore(store);
        return store.reminders.find(r => r.id === id);
    },
    deleteReminder(id) {
        const store = getStore();
        store.reminders = (store.reminders || []).filter(r => r.id !== id);
        saveStore(store);
    },
};
