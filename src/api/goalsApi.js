import axiosInstance from './axiosInstance';

export const getGoals = async () => {
    const { data } = await axiosInstance.get('/goals');
    return data;
};

export const createGoal = async (goalData) => {
    const { data } = await axiosInstance.post('/goals', goalData);
    return data;
};

export const updateGoal = async ({ id, ...updates }) => {
    const { data } = await axiosInstance.patch(`/goals/${id}`, updates);
    return data;
};

export const deleteGoal = async (id) => {
    await axiosInstance.delete(`/goals/${id}`);
    return id;
};
