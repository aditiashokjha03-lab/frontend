import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../hooks/useHabits';
import { useLogs } from '../hooks/useLogs';
import { useBadges } from '../hooks/useBadges';
import { getTrend } from '../api/analyticsApi';
import { useQuery } from '@tanstack/react-query';
import DailyHabitItem from '../components/habits/DailyHabitItem';
import StreakCard from '../components/habits/StreakCard';
import TodayProgress from '../components/analytics/TodayProgress';
import XPBar from '../components/ui/XPBar';
import XpPopup from '../components/XpPopup';
import LevelUp from '../components/LevelUp';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { profile, fetchProfile, user } = useAuth();
    const { query: habitsQuery } = useHabits();
    const habits = habitsQuery.data || [];
    const { checkAndUnlockBadges } = useBadges();
    const username = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'friend';

    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const { query: logsQuery, mutation } = useLogs(dateStr);
    const logs = logsQuery.data || [];
    const isLoading = logsQuery.isLoading || habitsQuery.isLoading;

    const { data: trendData } = useQuery({
        queryKey: ['analytics-trend', 7],
        queryFn: () => getTrend(7)
    });

    const [previousXp, setPreviousXp] = useState(0);
    const [previousLevel, setPreviousLevel] = useState(null);
    const [xpGained, setXpGained] = useState(null);
    const [levelUp, setLevelUp] = useState(false);

    const bestStreakHabit = [...habits].sort((a, b) => (b.longest_streak || 0) - (a.longest_streak || 0))[0];

    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = useMemo(() => ['All', ...new Set(habits.map(h => h.category).filter(Boolean))], [habits]);

    const habitsForSelectedDay = useMemo(() => 
        selectedCategory === 'All'
            ? habits
            : habits.filter(h => h.category === selectedCategory)
    , [habits, selectedCategory]);

    const { completedCount, totalCount } = useMemo(() => {
        const visibleHabitIds = new Set(habitsForSelectedDay.map(h => h.id));
        return {
            completedCount: logs.filter(l => l.completed && visibleHabitIds.has(l.habit_id)).length,
            totalCount: habitsForSelectedDay.length
        };
    }, [logs, habitsForSelectedDay]);

    const handlePrevDay = useCallback(() => setSelectedDate(prev => subDays(prev, 1)), []);
    const handleNextDay = useCallback(() => setSelectedDate(prev => addDays(prev, 1)), []);
    const handleToday = useCallback(() => setSelectedDate(new Date()), []);

    const getLogForHabit = useCallback((habitId) => logs.find(l => l.habit_id === habitId), [logs]);

    const onToggle = useCallback((habitId, status) => {
        mutation.mutate({ habit_id: habitId, log_date: dateStr, ...status }, {
            onSuccess: () => {
                if (profile?.id) {
                    fetchProfile(profile.id);
                }
                if (user?.id) {
                    checkAndUnlockBadges(user.id);
                }
            },
            onError: (err) => {
                console.error('Dashboard: upsertLog onError:', err);
            }
        });
    }, [mutation, dateStr, profile?.id, user?.id, fetchProfile, checkAndUnlockBadges]);

    useEffect(() => {
        if (!profile) return;

        if (previousLevel === null) {
            setPreviousLevel(profile.level || 1);
        }

        if (previousXp === 0 && profile.xp >= 0) {
            setPreviousXp(profile.xp || 0);
            return;
        }

        if (profile.xp > previousXp) {
            setXpGained(profile.xp - previousXp);
            setPreviousXp(profile.xp);
        } else if (profile.xp !== previousXp) {
            setPreviousXp(profile.xp);
        }

        if (previousLevel !== null && profile.level > previousLevel) {
            setLevelUp(true);
            setPreviousLevel(profile.level);
        }
    }, [profile, previousXp, previousLevel]);

    useEffect(() => {
        if (!xpGained) return;
        const timer = setTimeout(() => setXpGained(null), 2000);
        return () => clearTimeout(timer);
    }, [xpGained]);

    useEffect(() => {
        if (!levelUp) return;
        const timer = setTimeout(() => setLevelUp(false), 3000);
        return () => clearTimeout(timer);
    }, [levelUp]);

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">Focus & Forge</h1>
                    <p className="text-muted-foreground mt-2 font-medium text-sm">Your habits shape your future, {username}</p>
                </div>
 
                <div className="flex items-center gap-1 bg-secondary/30 p-1 rounded-lg border border-white/5">
                    <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"><ChevronLeft className="h-4 w-4" /></Button>
                    <div className="flex items-center gap-2 px-4 font-bold text-xs uppercase tracking-widest text-foreground tabular-nums min-w-[140px] justify-center">
                        {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            {profile && (
                <div className="w-full bg-secondary/10 border border-white/5 rounded-[2rem] p-10 space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                    <XPBar xp={profile.xp} level={profile.level} />
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl font-medium opacity-80">
                        You earn XP by completing habits and focus sessions. This bar represents your professional consistency and growth.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-8">
                    <TodayProgress completedCount={completedCount} habitsCount={totalCount} />
                    <StreakCard
                        streak={bestStreakHabit?.current_streak || 0}
                        longestStreak={bestStreakHabit?.longest_streak || 0}
                        heatmap={(trendData || []).map(d => d.count > 0)}
                    />
                </div>

                <div className="md:col-span-2 bg-card border border-white/5 rounded-[2rem] p-10 min-h-[500px] shadow-2xl shadow-black/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-between mb-10 gap-6">
                        <h2 className="text-2xl font-black tracking-tighter text-foreground flex items-center gap-3">
                            Daily Checklist
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full border border-white/5">
                                {completedCount}/{totalCount}
                            </span>
                        </h2>
 
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${selectedCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/30 text-muted-foreground border-white/5 hover:bg-secondary/50 hover:text-foreground'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-12"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
                        ) : habitsForSelectedDay.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                No habits scheduled for today.<br />
                                Take a rest or enjoy your achievements!
                            </div>
                        ) : (
                            <AnimatePresence>
                                {habitsForSelectedDay.map((habit, i) => (
                                    <motion.div
                                        key={habit.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <DailyHabitItem
                                            habit={habit}
                                            log={getLogForHabit(habit.id)}
                                            date={dateStr}
                                            onToggle={onToggle}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>

            {xpGained && <XpPopup xp={xpGained} />}
            {levelUp && profile && <LevelUp level={profile.level} />}
        </div>
    );
};

export default Dashboard;
