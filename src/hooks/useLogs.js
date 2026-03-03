import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { mockStore } from '../services/mockStore';
import { getLogsByDate, upsertLog } from '../api/logsApi';

export const useLogs = (date) => {
    const { isDemoMode } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['logs', date],
        queryFn: () => isDemoMode ? mockStore.getLogsByDate(date) : getLogsByDate(date),
        enabled: !!date,
    });

    const mutation = useMutation({
        mutationFn: (logData) => isDemoMode
            ? mockStore.upsertLog({ ...logData, date })
            : upsertLog(logData),
        onMutate: async (newLog) => {
            await queryClient.cancelQueries({ queryKey: ['logs', date] });
            const previousLogs = queryClient.getQueryData(['logs', date]);
            queryClient.setQueryData(['logs', date], old => {
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
            queryClient.setQueryData(['logs', date], context.previousLogs);
        },
        onSettled: (data) => {
            queryClient.invalidateQueries({ queryKey: ['logs', date] });
            // Also refresh habits so streaks update
            queryClient.invalidateQueries({ queryKey: ['habits'] });

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
