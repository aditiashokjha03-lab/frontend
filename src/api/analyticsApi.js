import axiosInstance from './axiosInstance';

export const getSummary = async () => {
    const { data } = await axiosInstance.get('/analytics/summary');
    return data;
};

export const getHeatmap = async (year) => {
    const { data } = await axiosInstance.get(`/analytics/heatmap?year=${year}`);
    return data;
};

export const getTrend = async (days) => {
    const { data } = await axiosInstance.get(`/analytics/trend?days=${days}`);
    return data;
};
