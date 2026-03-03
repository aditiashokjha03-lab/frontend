import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { mockStore } from '../services/mockStore';
import { getSummary, getHeatmap, getWeeklyReport, getMonthlyReport, getInsights } from '../api/analyticsApi';

export const useAnalytics = () => {
    const { isDemoMode } = useAuth();

    const summaryQuery = useQuery({
        queryKey: ['analytics', 'summary'],
        queryFn: () => isDemoMode ? mockStore.getSummary() : getSummary(),
    });

    const heatmapQuery = useQuery({
        queryKey: ['analytics', 'heatmap'],
        queryFn: () => isDemoMode ? [] : getHeatmap(),
    });

    const weeklyReportQuery = useQuery({
        queryKey: ['analytics', 'weekly'],
        queryFn: () => isDemoMode ? [] : getWeeklyReport(),
    });

    const monthlyReportQuery = useQuery({
        queryKey: ['analytics', 'monthly'],
        queryFn: () => isDemoMode ? [] : getMonthlyReport(),
    });

    const insightsQuery = useQuery({
        queryKey: ['analytics', 'insights'],
        queryFn: () => isDemoMode ? { peak_hours: [], correlations: [] } : getInsights(),
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
