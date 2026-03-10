import axiosInstance from './axiosInstance';

export const getHabits = async () => {
    const { data } = await axiosInstance.get('/habits');
    return data;
};

export const createHabit = async (habitData) => {
    const { data } = await axiosInstance.post('/habits', habitData);
    return data;
};

export const updateHabit = async (id, habitData) => {
    const { data } = await axiosInstance.put(`/habits/${id}`, habitData);
    return data;
};

export const deleteHabit = async (id) => {
    const { data } = await axiosInstance.delete(`/habits/${id}`);
    return data;
};
