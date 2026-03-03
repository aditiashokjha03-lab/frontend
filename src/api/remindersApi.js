import axiosInstance from './axiosInstance';

export const remindersApi = {
    getAll: () => axiosInstance.get('/reminders'),
    create: (data) => axiosInstance.post('/reminders', data),
    update: (id, data) => axiosInstance.put(`/reminders/${id}`, data),
    delete: (id) => axiosInstance.delete(`/reminders/${id}`),
};

export default remindersApi;
