import React, { createContext, useContext, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useReminders } from '../hooks/useReminders';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { reminders } = useReminders();

    useEffect(() => {
        // Sync local service with backend reminders
        if (reminders.length > 0) {
            reminders.forEach(r => {
                if (r.is_active && r.habits) {
                    notificationService.scheduleReminder(r.habits, r.reminder_time);
                }
            });
        }
    }, [reminders]);

    useEffect(() => {
        // Request permission on mount
        notificationService.requestPermission();

        // Check reminders every minute
        const interval = setInterval(() => {
            notificationService.checkAndFire();
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <NotificationContext.Provider value={{ notificationService }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
