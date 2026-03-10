import axiosInstance from './axiosInstance';

export const getChallenges = async () => {
    const { data } = await axiosInstance.get('challenges');
    return data;
};

export const joinChallenge = async (id) => {
    const { data } = await axiosInstance.post(`challenges/${id}/join`);
    return data;
};
