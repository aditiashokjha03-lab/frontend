import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { mockStore } from '../services/mockStore';
import * as goalsApi from '../api/goalsApi';
import { toast } from 'sonner';

export const useGoals = () => {
    const { isDemoMode } = useAuth();
    const queryClient = useQueryClient();

    const goalsQuery = useQuery({
        queryKey: ['goals'],
        queryFn: () => isDemoMode ? mockStore.getGoals() : goalsApi.getGoals(),
    });

    const createMutation = useMutation({
        mutationFn: (data) => isDemoMode ? mockStore.createGoal(data) : goalsApi.createGoal(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            toast.success('Goal created!');
        },
        onError: () => toast.error('Failed to create goal'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => isDemoMode ? mockStore.updateGoal(id, data) : goalsApi.updateGoal(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            toast.success('Progress updated!');
        },
        onError: () => toast.error('Failed to update goal'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => isDemoMode ? mockStore.deleteGoal(id) : goalsApi.deleteGoal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
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
