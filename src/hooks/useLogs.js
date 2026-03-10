import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLogsByDate, upsertLog } from '../api/logsApi';
import { format } from 'date-fns';

export const useLogs = (dateStr) => {
    const queryClient = useQueryClient();
    // Ensure dateStr is a string in YYYY-MM-DD format. If a Date object is passed, format it.
    const formattedDate = typeof dateStr === 'string' ? dateStr : format(dateStr, 'yyyy-MM-dd');

    const query = useQuery({
        queryKey: ['logs', formattedDate],
        queryFn: () => getLogsByDate(formattedDate)
    });

    const upsertMutation = useMutation({
        mutationFn: upsertLog,
        onMutate: async (newLog) => {
            await queryClient.cancelQueries({ queryKey: ['logs', newLog.log_date] });
            const prev = queryClient.getQueryData(['logs', newLog.log_date]);

            // Optimistic update
            queryClient.setQueryData(['logs', newLog.log_date], old => {
                if (!old) return [newLog];
                const existingIdx = old.findIndex(l => l.habit_id === newLog.habit_id);
                if (existingIdx > -1) {
                    const updated = [...old];
                    updated[existingIdx] = { ...updated[existingIdx], ...newLog };
                    return updated;
                }
                return [...old, newLog];
            });
            return { prev };
        },
        onError: (err, newLog, context) => {
            queryClient.setQueryData(['logs', newLog.log_date], context.prev);
        },
        onSettled: (newLog) => {
            if (newLog?.log?.log_date) {
                queryClient.invalidateQueries(['logs', newLog.log.log_date]);
                queryClient.invalidateQueries(['habits']);
            }
        }
    });

    const upsertLogFn = (habitId, date, completed, value, notes, mood) => {
        upsertMutation.mutate({
            habit_id: habitId,
            log_date: date,
            completed,
            completion_value: value,
            notes,
            mood
        });
    };

    return { query, mutation: upsertMutation, upsertLog: upsertLogFn, isPending: upsertMutation.isPending };
};
