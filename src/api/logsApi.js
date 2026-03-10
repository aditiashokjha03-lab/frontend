import axiosInstance from './axiosInstance';
import { format } from 'date-fns';

export const getLogsByDate = async (dateObj) => {
    const dateStr = format(dateObj, 'yyyy-MM-dd');
    const { data } = await axiosInstance.get(`/logs?date=${dateStr}`);
    return data;
};

export const upsertLog = async (logData) => {
    const { data } = await axiosInstance.post('/logs', logData);
    return data;
};
