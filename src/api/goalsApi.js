import axiosInstance from './axiosInstance';

export const getGoals = async () => {
    const { data } = await axiosInstance.get('/goals');
    return data.data;
};

export const createGoal = async (goalData) => {
    const { data } = await axiosInstance.post('/goals', goalData);
    return data.data;
};

export const updateGoal = async (id, goalData) => {
    const { data } = await axiosInstance.patch(`/goals/${id}`, goalData);
    return data.data;
};

export const deleteGoal = async (id) => {
    const { data } = await axiosInstance.delete(`/goals/${id}`);
    return data.data;
};
