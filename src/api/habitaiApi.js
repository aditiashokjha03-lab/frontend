import axiosInstance from './axiosInstance';

export const suggestHabits = async ({ goal_category, goal_description }) => {
    const { data } = await axiosInstance.post('/habitai/suggest', {
        goal_category,
        goal_description
    });
    return data;
};

export const getHistory = async () => {
    const { data } = await axiosInstance.get('/habitai/history');
    return data;
};

export const trackAiHabitAddition = async ({ session_id, habit_id }) => {
    const { data } = await axiosInstance.post('/habitai/track-addition', {
        session_id,
        habit_id
    });
    return data;
};
