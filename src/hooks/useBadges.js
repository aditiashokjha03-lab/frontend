import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import { useHabits } from './useHabits';

export const useBadges = () => {
    const { profile, hasSupabase } = useAuth();
    const { habits } = useHabits();
    const [allBadges, setAllBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [computedBadges, setComputedBadges] = useState([]);
    // Track count of completed habit logs for client-side badge evaluation
    const [completedLogsCount, setCompletedLogsCount] = useState(0);

    // Compute basic user stats to check against badges
    const totalHabits = habits?.length || 0;
    const highestStreak = habits?.reduce((max, h) => Math.max(max, h.longest_streak || 0), 0) || 0;
    const currentLevel = profile?.level || 1;
    const userXp = profile?.xp || 0;

    // Fetch badges from Supabase
    const fetchBadgesData = useCallback(async () => {
        if (!hasSupabase) {
            setIsLoading(false);
            return;
        }

        try {
            // 1. Fetch all badge definitions
            const { data: badgesData, error: badgesError } = await supabase.from('badges').select('*');
            if (badgesError) throw badgesError;

            const DEFAULT_BADGES = [
                { id: 'first_habit', key: 'first_habit', name: 'First Step', icon: '🌱', description: 'Reach 25 XP.', requirement: 25, type: 'xp' },
                { id: 'streak_7', key: 'streak_7', name: '7-Day Warrior', icon: '🔥', description: 'Maintain a 7-day streak.', requirement: 7, type: 'streak' },
                { id: 'streak_30', key: 'streak_30', name: '30-Day Legend', icon: '🏆', description: 'Maintain a 30-day streak.', requirement: 30, type: 'streak' },
                { id: 'habits_10', key: 'habits_10', name: 'Habit Builder', icon: '🏗️', description: 'Reach 125 XP.', requirement: 125, type: 'xp' },
                { id: 'level_5', key: 'level_5', name: 'Rising Star', icon: '⭐', description: 'Reach Level 5.', requirement: 5, type: 'level' },
                { id: 'level_up', key: 'level_up', name: 'Level Up!', icon: '🚀', description: 'Reach 500 XP.', requirement: 500, type: 'xp' }
            ];

            const finalBadges = badgesData && badgesData.length > 0 ? badgesData : DEFAULT_BADGES;
            setAllBadges(finalBadges);

            // 2. Fetch earned badges from user_badges if user is authenticated
            let userBadgesData = [];
            const { data: authData } = await supabase.auth.getUser();
            const authUser = authData?.user;

            if (authUser) {
                const { data, error: userBadgesError } = await supabase
                    .from('user_badges')
                    .select('*');
                if (!userBadgesError) {
                    userBadgesData = data || [];
                }

                // 3. Also fetch completed habit logs count for client-side "First Habit" evaluation
                const { count, error: logsError } = await supabase
                    .from('habit_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', authUser.id)
                    .eq('completed', true);

                if (!logsError) {
                    setCompletedLogsCount(count || 0);
                }
            }
            setUserBadges(userBadgesData);
        } catch (err) {
            console.error('Error fetching badges from Supabase:', err);
        } finally {
            setIsLoading(false);
        }
    }, [hasSupabase]);

    const checkAndUnlockBadges = useCallback(async (userId) => {
        // This function is kept for compatibility, but the badge state is now
        // computed client-side in the useEffect below. No DB writes needed for first_habit.
        if (!hasSupabase || !userId) return;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(userId)) return;

        // Refetch badge data to ensure UI is in sync
        await fetchBadgesData();
    }, [hasSupabase, fetchBadgesData]);

    useEffect(() => {
        fetchBadgesData();

        // Only set up realtime if we have a real Supabase user
        const setupRealtime = async () => {
            const { data: authData } = await supabase.auth.getUser();
            const authUser = authData?.user;

            if (authUser && hasSupabase) {
                // Listen for new habit log completions to refresh the count
                const logsChannel = supabase
                    .channel('habit-logs-completion-sync')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'habit_logs', filter: `user_id=eq.${authUser.id}` },
                        () => {
                            // Re-fetch logs count when any log changes
                            fetchBadgesData();
                        }
                    )
                    .subscribe();

                const badgesChannel = supabase
                    .channel('user-badges-sync')
                    .on(
                        'postgres_changes',
                        { event: 'INSERT', schema: 'public', table: 'user_badges', filter: `user_id=eq.${authUser.id}` },
                        (payload) => {
                            if (payload.new) {
                                setUserBadges((prev) => {
                                    const exists = prev.some(b => b.id === payload.new.id || b.badge_id === payload.new.badge_id);
                                    if (exists) return prev;
                                    return [...prev, payload.new];
                                });
                            }
                        }
                    )
                    .subscribe();

                return { logsChannel, badgesChannel };
            }
            return null;
        };

        let channelPromise = setupRealtime();

        return () => {
            channelPromise.then(channels => {
                if (channels?.logsChannel) supabase.removeChannel(channels.logsChannel);
                if (channels?.badgesChannel) supabase.removeChannel(channels.badgesChannel);
            });
        };
    }, [fetchBadgesData, hasSupabase]);

    // Calculate badge statuses
    useEffect(() => {
        if (isLoading || !allBadges.length) return;

        const earnedBadgeKeys = new Set(userBadges.map(ub => ub.badge_key).filter(Boolean));
        const earnedBadgeIds = new Set(userBadges.map(ub => ub.badge_id).filter(Boolean));

        const evaluated = allBadges.map(badge => {
            const type = badge.unlock_type || badge.type;
            let requirement = typeof badge.requirement === 'number' ? badge.requirement : parseInt(badge.requirement || badge.target || 0, 10);

            let currentValue = 0;
            let isEarnedByComputation = false;

            // XP badges: evaluate client-side ONLY for the explicitly requested badges
            // (kept strict to avoid changing behavior for any other badges).
            const badgeName = String(badge.name || badge.title || '').trim();
            const badgeKey = String(badge.key || '').trim();

            if (badgeName.localeCompare('First Step', undefined, { sensitivity: 'accent' }) === 0 || badgeKey === 'first_habit') {
                currentValue = userXp;
                requirement = 25;
                isEarnedByComputation = userXp >= 25;
            } else if (badgeName.localeCompare('Habit Builder', undefined, { sensitivity: 'accent' }) === 0 || badgeKey === 'habits_10') {
                currentValue = userXp;
                requirement = 125;
                isEarnedByComputation = userXp >= 125;
            } else if (badgeName.localeCompare('Rising Star', undefined, { sensitivity: 'accent' }) === 0 || badgeKey === 'level_5') {
                currentValue = userXp;
                requirement = 400;
                isEarnedByComputation = userXp >= 400;
            } else if (badgeName.localeCompare('Level Up!', undefined, { sensitivity: 'accent' }) === 0 || badgeKey === 'level_up') {
                currentValue = userXp;
                requirement = 500;
                isEarnedByComputation = userXp >= 500;
            } else if (type === 'completion') {
                currentValue = completedLogsCount;
                isEarnedByComputation = completedLogsCount >= 1;
            } else {
                switch (type) {
                    case 'habits':
                    case 'habit_count':
                        currentValue = totalHabits;
                        break;
                    case 'streak':
                    case 'longest_streak':
                        currentValue = highestStreak;
                        break;
                    case 'level':
                    case 'user_level':
                        currentValue = currentLevel;
                        break;
                    default:
                        currentValue = 0;
                }
            }

            // isEarned: either computed directly (for first_habit) or stored in user_badges
            const isEarned = isEarnedByComputation || earnedBadgeKeys.has(badge.key) || earnedBadgeIds.has(badge.id);

            const progressPercentage = requirement > 0 ? (currentValue / requirement) * 100 : 0;

            let status = 'locked';
            if (isEarned) {
                status = 'unlocked';
            } else if (progressPercentage >= 70) {
                status = 'unlocking_soon';
            }

            return {
                ...badge,
                isEarned,
                isUnlocked: isEarned,
                status,
                currentValue,
                requirement,
                progressPercentage: Math.min(progressPercentage, 100)
            };
        });

        setComputedBadges(evaluated);
    }, [allBadges, userBadges, completedLogsCount, totalHabits, highestStreak, currentLevel, userXp, isLoading]);

    return { badges: computedBadges, isLoading, fetchBadgesData, checkAndUnlockBadges };
};
