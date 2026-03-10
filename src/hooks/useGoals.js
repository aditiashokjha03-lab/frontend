import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as goalsApi from '../api/goalsApi';

export const useGoals = () => {
    const queryClient = useQueryClient();

    const { data: goals, isLoading } = useQuery({
        queryKey: ['goals'],
        queryFn: goalsApi.getGoals
    });

    const createMutation = useMutation({
        mutationFn: goalsApi.createGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: goalsApi.updateGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: goalsApi.deleteGoal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
        }
    });

    return {
        goals,
        isLoading,
        createGoal: createMutation.mutateAsync,
        updateGoal: updateMutation.mutateAsync,
        deleteGoal: deleteMutation.mutateAsync
    };
};
