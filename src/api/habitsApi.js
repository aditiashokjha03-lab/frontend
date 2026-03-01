import axiosInstance from './axiosInstance';

export const getHabits = async () => {
    const response = await axiosInstance.get('/habits');
    return response.data.data;
};

export const createHabit = async (habitData) => {
    const response = await axiosInstance.post('/habits', habitData);
    return response.data.data;
};

export const updateHabit = async (id, habitData) => {
    const response = await axiosInstance.put(`/habits/${id}`, habitData);
    return response.data.data;
};

export const deleteHabit = async (id) => {
    const response = await axiosInstance.delete(`/habits/${id}`);
    return response.data.data;
};
