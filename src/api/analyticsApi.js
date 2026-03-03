import axiosInstance from './axiosInstance';

export const getSummary = async () => {
    const { data } = await axiosInstance.get('/analytics/summary');
    return data.data;
};

export const getHeatmap = async () => {
    const { data } = await axiosInstance.get('/analytics/heatmap');
    return data.data;
};

export const getWeeklyReport = async () => {
    const { data } = await axiosInstance.get('/analytics/weekly-report');
    return data.data;
};

export const getMonthlyReport = async () => {
    const { data } = await axiosInstance.get('/analytics/monthly-report');
    return data.data;
};

export const getInsights = async () => {
    const { data } = await axiosInstance.get('/analytics/insights');
    return data.data;
};
