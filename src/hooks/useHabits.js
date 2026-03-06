import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getHabits, createHabit, updateHabit, deleteHabit } from '../api/habitsApi';
import { toast } from 'sonner';
export const useHabits = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const habitsQuery = useQuery({
        queryKey: ['habits', user?.id],
        queryFn: () => getHabits(),
        enabled: !!user?.id,
    });

    const createMutation = useMutation({
        mutationFn: (data) => createHabit(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
            toast.success('Habit created!');
        },
        onError: () => toast.error('Failed to create habit'),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateHabit(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
        },
        onError: () => toast.error('Failed to update habit'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteHabit(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });
            toast.success('Habit removed');
        },
        onError: () => toast.error('Failed to delete habit'),
    });

    return {
        habits: habitsQuery.data || [],
        isLoading: habitsQuery.isLoading,
        isError: habitsQuery.isError,
        createHabit: createMutation.mutate,
        createHabitAsync: createMutation.mutateAsync,
        updateHabit: updateMutation.mutate,
        deleteHabit: deleteMutation.mutate,
        isCreating: createMutation.isPending,
    };
};
