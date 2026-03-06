import { useState, useEffect } from 'react';
import remindersApi from '../api/remindersApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const useReminders = () => {
    useAuth(); // ensure auth context is initialized if needed
    const [reminders, setReminders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReminders = async () => {
        try {
            setIsLoading(true);
            const response = await remindersApi.getAll();
            setReminders(response.data.data);
        } catch (err) {
            console.error('Failed to fetch reminders:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addReminder = async (data) => {
        try {
            const response = await remindersApi.create(data);
            setReminders(prev => [...prev, response.data.data]);
            toast.success('Reminder added');
            return response.data.data;
        } catch (err) {
            toast.error('Failed to add reminder');
            throw err;
        }
    };

    const updateReminder = async (id, data) => {
        try {
            const response = await remindersApi.update(id, data);
            setReminders(prev => prev.map(r => r.id === id ? response.data.data : r));
            toast.success('Reminder updated');
        } catch (err) {
            toast.error('Failed to update reminder');
            throw err;
        }
    };

    const deleteReminder = async (id) => {
        try {
            await remindersApi.delete(id);
            setReminders(prev => prev.filter(r => r.id !== id));
            toast.success('Reminder deleted');
        } catch (err) {
            toast.error('Failed to delete reminder');
            throw err;
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    return { reminders, isLoading, addReminder, updateReminder, deleteReminder, refetch: fetchReminders };
};
