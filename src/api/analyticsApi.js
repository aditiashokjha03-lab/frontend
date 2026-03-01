import axiosInstance from './axiosInstance';

export const getSummary = async () => {
    const res = await axiosInstance.get('/analytics/summary');
    return res.data.data;
};

export const getHeatmap = async () => {
    const res = await axiosInstance.get('/analytics/heatmap');
    return res.data.data;
};
