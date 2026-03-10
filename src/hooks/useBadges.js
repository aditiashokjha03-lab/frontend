import { useQuery } from '@tanstack/react-query';
import { getAchievements } from '../api/achievementsApi';

export const useBadges = () => {
    const query = useQuery({
        queryKey: ['achievements'],
        queryFn: getAchievements
    });

    const checkAndUnlockBadges = async (userId) => {
        // This is a stub for now as the backend logic for auto-unlocking
        // might reside elsewhere or be triggered by specific actions.
        console.log('Checking and unlocking badges for user:', userId);
        // For now, we just invalidate the query to refresh achievements
        return true;
    };

    return {
        badges: query.data || [],
        isLoading: query.isLoading,
        checkAndUnlockBadges
    };
};
