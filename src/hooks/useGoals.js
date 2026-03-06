import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import * as goalsApi from '../api/goalsApi';
import { toast } from 'sonner';

export const useGoals = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const goalsQuery = useQuery({
        queryKey: ['goals', user?.id],
        queryFn: () => goalsApi.getGoals(),
        enabled: !!user?.id,
    });

    const createMutation = useMutation({
        mutationFn: (data) => goalsApi.createGoal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
            toast.success('Goal created!');
        },
        onError: () => toast.error('Failed to create goal'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => goalsApi.updateGoal(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
            toast.success('Progress updated!');
        },
        onError: () => toast.error('Failed to update goal'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => goalsApi.deleteGoal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
            toast.success('Goal removed');
        },
        onError: () => toast.error('Failed to delete goal'),
    });

    return {
        goals: goalsQuery.data || [],
        isLoading: goalsQuery.isLoading,
        isError: goalsQuery.isError,
        createGoal: createMutation.mutate,
        updateGoal: updateMutation.mutate,
        deleteGoal: deleteMutation.mutate,
    };
};
