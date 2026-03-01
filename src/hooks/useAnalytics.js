import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { mockStore } from '../services/mockStore';
import { getSummary, getHeatmap } from '../api/analyticsApi';

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

    return {
        summary: summaryQuery.data || { total_habits: 0, active_habits: 0, best_streak: 0, total_xp: 0 },
        heatmap: heatmapQuery.data || [],
        isLoading: summaryQuery.isLoading,
    };
};
