import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { getSummary, getHeatmap, getWeeklyReport, getMonthlyReport, getInsights } from '../api/analyticsApi';

export const useAnalytics = () => {
    const { user } = useAuth();

    const summaryQuery = useQuery({
        queryKey: ['analytics', 'summary', user?.id],
        queryFn: () => getSummary(),
        enabled: !!user?.id,
    });

    const heatmapQuery = useQuery({
        queryKey: ['analytics', 'heatmap', user?.id],
        queryFn: () => getHeatmap(),
        enabled: !!user?.id,
    });

    const weeklyReportQuery = useQuery({
        queryKey: ['analytics', 'weekly', user?.id],
        queryFn: () => getWeeklyReport(),
        enabled: !!user?.id,
    });

    const monthlyReportQuery = useQuery({
        queryKey: ['analytics', 'monthly', user?.id],
        queryFn: () => getMonthlyReport(),
        enabled: !!user?.id,
    });

    const insightsQuery = useQuery({
        queryKey: ['analytics', 'insights', user?.id],
        queryFn: () => getInsights(),
        enabled: !!user?.id,
    });

    return {
        summary: summaryQuery.data || { total_habits: 0, active_habits: 0, best_streak: 0, total_xp: 0, total_checkins: 0, overall_completion_rate: 0 },
        heatmap: heatmapQuery.data || [],
        weeklyReport: weeklyReportQuery.data || [],
        monthlyReport: monthlyReportQuery.data || [],
        insights: insightsQuery.data || { peak_hours: [], correlations: [] },
        isLoading: summaryQuery.isLoading || weeklyReportQuery.isLoading || monthlyReportQuery.isLoading,
        refetch: () => {
            summaryQuery.refetch();
            heatmapQuery.refetch();
            weeklyReportQuery.refetch();
            monthlyReportQuery.refetch();
            insightsQuery.refetch();
        }
    };
};
