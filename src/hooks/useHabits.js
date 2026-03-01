import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { mockStore } from '../services/mockStore';
import { getHabits, createHabit, updateHabit, deleteHabit } from '../api/habitsApi';
import { toast } from 'sonner';

export const useHabits = () => {
    const { isDemoMode } = useAuth();
    const queryClient = useQueryClient();

    const habitsQuery = useQuery({
        queryKey: ['habits'],
        queryFn: () => isDemoMode ? mockStore.getHabits() : getHabits(),
    });

    const createMutation = useMutation({
        mutationFn: (data) => isDemoMode ? mockStore.createHabit(data) : createHabit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            toast.success('Habit created!');
        },
        onError: () => toast.error('Failed to create habit'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => isDemoMode ? mockStore.updateHabit(id, data) : updateHabit(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
        onError: () => toast.error('Failed to update habit'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => isDemoMode ? mockStore.deleteHabit(id) : deleteHabit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits'] });
            toast.success('Habit removed');
        },
        onError: () => toast.error('Failed to delete habit'),
    });

    return {
        habits: habitsQuery.data || [],
        isLoading: habitsQuery.isLoading,
        isError: habitsQuery.isError,
        createHabit: createMutation.mutate,
        updateHabit: updateMutation.mutate,
        deleteHabit: deleteMutation.mutate,
        isCreating: createMutation.isPending,
    };
};
