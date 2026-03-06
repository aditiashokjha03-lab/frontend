import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHabits } from '../hooks/useHabits';
import { useLogs } from '../hooks/useLogs';
import { useBadges } from '../hooks/useBadges';
import DailyHabitItem from '../components/habits/DailyHabitItem';
import StreakCard from '../components/habits/StreakCard';
import TodayProgress from '../components/habits/TodayProgress';
import XPBar from '../components/ui/XPBar';
import XpPopup from '../components/XpPopup';
import LevelUp from '../components/LevelUp';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { profile, fetchProfile, user } = useAuth();
    const { habits } = useHabits();
    const { checkAndUnlockBadges } = useBadges();
    const username = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'friend';

    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    const { logs, upsertLog, isLoading } = useLogs(dateStr);

    const [previousXp, setPreviousXp] = useState(0);
    const [previousLevel, setPreviousLevel] = useState(null);
    const [xpGained, setXpGained] = useState(null);
    const [levelUp, setLevelUp] = useState(false);

    const bestStreakHabit = [...habits].sort((a, b) => (b.longest_streak || 0) - (a.longest_streak || 0))[0];

    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', ...new Set(habits.map(h => h.category).filter(Boolean))];

    const habitsForSelectedDay = selectedCategory === 'All'
        ? habits
        : habits.filter(h => h.category === selectedCategory);

    const visibleHabitIds = new Set(habitsForSelectedDay.map(h => h.id));
    const completedCount = logs.filter(l => l.completed && visibleHabitIds.has(l.habit_id)).length;
    const totalCount = habitsForSelectedDay.length;

    const handlePrevDay = () => setSelectedDate(subDays(selectedDate, 1));
    const handleNextDay = () => setSelectedDate(addDays(selectedDate, 1));
    const handleToday = () => setSelectedDate(new Date());

    const getLogForHabit = (habitId) => logs.find(l => l.habit_id === habitId);

    const onToggle = async (habitId, date, status) => {
        upsertLog({ habit_id: habitId, date, ...status }, {
            onSuccess: () => {
                if (profile?.id) {
                    fetchProfile(profile.id);
                }
                if (user?.id) {
                    checkAndUnlockBadges(user.id);
                }
            }
        });
    };

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Focus & Forge</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Your habits shape your future, {username}.</p>
                </div>

                <div className="flex items-center gap-2 bg-card p-1 rounded-lg border shadow-sm">
                    <Button variant="ghost" size="icon" onClick={handlePrevDay}><ChevronLeft className="h-5 w-5" /></Button>
                    <div className="flex items-center gap-2 px-4 font-medium tabular-nums min-w-[140px] justify-center">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM d, yyyy')}
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleNextDay}><ChevronRight className="h-5 w-5" /></Button>
                    {!isToday(selectedDate) && (
                        <Button variant="outline" size="sm" onClick={handleToday} className="ml-2 hidden sm:flex">Today</Button>
                    )}
                </div>
            </div>

            {profile && (
                <div className="w-full bg-card border rounded-xl p-4 shadow-sm space-y-3">
                    <XPBar xp={profile.xp} level={profile.level} />
                    <p className="text-xs text-muted-foreground">
                        You earn XP by completing habits and focus sessions. Each new level requires{' '}
                        <strong>100 x your current level</strong> XP, so level 3 needs 300 XP, level 4 needs 400 XP,
                        and so on. Filling this bar and leveling up is a simple way to see your long-term consistency
                        growing over time.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <TodayProgress completed={completedCount} total={totalCount} />
                    <StreakCard
                        streak={bestStreakHabit?.current_streak || 0}
                        longestStreak={bestStreakHabit?.longest_streak || 0}
                        heatmap={[true, true, false, true, true, true, false]}
                    />
                </div>

                <div className="md:col-span-2 bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Daily Checklist
                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {completedCount}/{totalCount}
                        </span>
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border hover:bg-card'}`}
                            >
                                {cat}
                            </button>
                        ))}
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
                                            onToggle={(habitId, status) => onToggle(habitId, dateStr, status)}
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
