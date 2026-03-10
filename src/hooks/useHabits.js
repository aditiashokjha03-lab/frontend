import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabits, createHabit, updateHabit, deleteHabit } from '../api/habitsApi';

export const useHabits = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['habits'],
        queryFn: getHabits
    });

    const createMutation = useMutation({
        mutationFn: createHabit,
        onSuccess: () => queryClient.invalidateQueries(['habits'])
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, ...data }) => updateHabit(id, data),
        onSuccess: () => queryClient.invalidateQueries(['habits'])
    });

    const deleteMutation = useMutation({
        mutationFn: deleteHabit,
        onSuccess: () => queryClient.invalidateQueries(['habits'])
    });

    return { query, createMutation, updateMutation, deleteMutation };
};
