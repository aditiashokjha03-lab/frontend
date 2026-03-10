import { useQuery, useMutation } from '@tanstack/react-query';
import { suggestHabits, getHistory } from '../api/habitaiApi';

export const useHabiTAI = () => {
    const suggestMutation = useMutation({
        mutationFn: suggestHabits,
    });

    const historyQuery = useQuery({
        queryKey: ['habitai-history'],
        queryFn: getHistory
    });

    return { suggestMutation, historyQuery };
};
