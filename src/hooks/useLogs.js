import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getLogsByDate, upsertLog } from '../api/logsApi';

export const useLogs = (date) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['logs', date, user?.id],
        queryFn: () => getLogsByDate(date),
        enabled: !!date && !!user?.id,
    });

    const mutation = useMutation({
        mutationFn: (logData) => upsertLog(logData),
        onMutate: async (newLog) => {
            await queryClient.cancelQueries({ queryKey: ['logs', date, user?.id] });
            const previousLogs = queryClient.getQueryData(['logs', date, user?.id]);
            queryClient.setQueryData(['logs', date, user?.id], old => {
                const list = old || [];
                const idx = list.findIndex(l => l.habit_id === newLog.habit_id);
                if (idx !== -1) {
                    const arr = [...list];
                    arr[idx] = { ...arr[idx], ...newLog };
                    return arr;
                }
                return [...list, newLog];
            });
            return { previousLogs };
        },
        onError: (err, _newLog, context) => {
            queryClient.setQueryData(['logs', date, user?.id], context.previousLogs);
        },
        onSettled: (data) => {
            queryClient.invalidateQueries({ queryKey: ['logs', date, user?.id] });
            queryClient.invalidateQueries({ queryKey: ['habits', user?.id] });

            // Always invalidate analytics summary to ensure real-time data
            queryClient.invalidateQueries({ queryKey: ['analytics', 'summary'] });

            // Refetch profile if XP was earned
            if (data?.xp_earned > 0) {
                // We'll handle profile refetching in the component or via a shared query if possible
                // but for now, we'll rely on the dashboard refetching or context
                queryClient.invalidateQueries({ queryKey: ['profile'] }); // assuming there is a profile query
            }
        },
    });

    return {
        logs: query.data || [],
        isLoading: query.isLoading,
        upsertLog: mutation.mutate,
    };
};
