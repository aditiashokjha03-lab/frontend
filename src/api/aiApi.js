import axiosInstance from './axiosInstance';

export const askHabitTAI = async (goal) => {
    const response = await axiosInstance.post('/ai/habit-ai/suggestions', { goal });
    return response.data.data;
};
