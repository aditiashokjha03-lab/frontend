import axiosInstance from './axiosInstance';

export const getLogsByDate = async (date) => {
    const response = await axiosInstance.get(`/logs?date=${date}`);
    return response.data.data;
};

export const upsertLog = async (logData) => {
    const response = await axiosInstance.post('/logs', logData);
    return response.data.data;
};
