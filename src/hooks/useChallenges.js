import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getChallenges, joinChallenge } from '../api/challengesApi';
import axiosInstance from '../api/axiosInstance';

export const useChallenges = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['challenges'],
        queryFn: getChallenges
    });

    const joinMutation = useMutation({
        mutationFn: joinChallenge,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        }
    });

    const leaveMutation = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/challenges/${id}/leave`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
        }
    });

    return {
        query,
        joinMutation,
        leaveMutation,
        challenges: query.data || [],
        isLoading: query.isLoading
    };
};
