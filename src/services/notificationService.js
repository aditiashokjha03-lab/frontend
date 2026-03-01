import { toast } from 'sonner';

class NotificationService {
    constructor() {
        this.reminders = JSON.parse(localStorage.getItem('habit_reminders') || '[]');
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            toast.error('This browser does not support desktop notifications');
            return false;
        }

        if (Notification.permission === 'granted') return true;

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') return true;
        }

        return false;
    }

    scheduleReminder(habit, timeStr) {
        this.reminders = this.reminders.filter(r => r.habitId !== habit.id);
        this.reminders.push({
            habitId: habit.id,
            habitName: habit.name,
            habitIcon: habit.icon,
            timeStr: timeStr, // "14:30"
        });
        localStorage.setItem('habit_reminders', JSON.stringify(this.reminders));
        toast.success(`Reminder set for ${timeStr}`);
    }

    checkAndFire() {
        if (Notification.permission !== 'granted') return;

        const now = new Date();
        const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        // In strict testing mode, prevent multiple fires
        const firedToday = JSON.parse(localStorage.getItem('reminders_fired_today') || '{}');
        const todayStr = now.toDateString();

        this.reminders.forEach(reminder => {
            if (reminder.timeStr === currentTimeStr) {
                const key = `${reminder.habitId}-${todayStr}`;
                if (!firedToday[key]) {
                    new Notification('HabitForge Reminder', {
                        body: `Time to: ${reminder.habitIcon} ${reminder.habitName}! Keep your streak!`,
                        icon: '/favicon.ico'
                    });
                    firedToday[key] = true;
                }
            }
        });

        localStorage.setItem('reminders_fired_today', JSON.stringify(firedToday));
    }
}

export const notificationService = new NotificationService();
