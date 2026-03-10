import axiosInstance from './axiosInstance';

export const getAchievements = async () => {
    const { data } = await axiosInstance.get('/achievements');
    return data;
};
