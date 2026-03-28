import React, { useEffect, useState, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummary, getTrend, getHeatmap } from '../api/analyticsApi';
import { motion, animate } from 'framer-motion';
import {
    Activity, CheckCircle2, Flame, TrendingUp, Calendar, Info
} from 'lucide-react';

// Lazy loaded chart component
const AnalyticsChart = React.lazy(() => import('../components/analytics/AnalyticsChart'));

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

// Animated Number Component - Memoized
const AnimatedNumber = React.memo(({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = useMemo(() => 
        typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value
    , [value]);
    const suffix = useMemo(() => 
        typeof value === 'string' ? value.replace(/[0-9.]/g, '') : ''
    , [value]);

    useEffect(() => {
        const controls = animate(0, numericValue, {
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => setDisplayValue(Math.floor(latest))
        });
        return () => controls.stop();
    }, [numericValue]);

    return (
        <span className="tabular-nums">
            {displayValue}{suffix}
        </span>
    );
});

// Loading Fallback for Chart
const ChartLoading = () => (
    <div className="w-full h-[320px] flex items-center justify-center bg-card/10 rounded-3xl animate-pulse">
        <TrendingUp className="w-8 h-8 text-muted-foreground/20" />
    </div>
);
export default function Analytics() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setIsMounted(true);
        });
    }, []);

    const { data: summary, isLoading: summaryLoading } = useQuery({
        queryKey: ['analytics-summary'],
        queryFn: getSummary,
        staleTime: 5 * 60 * 1000 // Cache for 5 minutes
    });

    const { data: trendData, isLoading: trendLoading } = useQuery({
        queryKey: ['analytics-trend', 7],
        queryFn: () => getTrend(7),
        staleTime: 5 * 60 * 1000
    });

    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
        queryKey: ['analytics-heatmap', currentYear],
        queryFn: () => getHeatmap(currentYear),
        staleTime: 10 * 60 * 1000
    });

    const stats = useMemo(() => [
        { label: 'Active Habits', value: summary?.active_habits || 0, icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Total Check-ins', value: summary?.total_check_ins || 0, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
        { label: 'Best Streak', value: `${summary?.best_streak || 0} Days`, icon: Flame, color: 'text-warning', bg: 'bg-warning/10' },
        { label: 'Overall Rate', value: `${summary?.completion_rate || 0}%`, icon: TrendingUp, color: 'text-achievement', bg: 'bg-achievement/10' },
    ], [summary]);

    if (summaryLoading || trendLoading || heatmapLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen space-y-8 pb-20">
            <header className="space-y-3 pb-8 border-b border-border">
                <h1 className="text-4xl font-black tracking-tighter lg:text-5xl text-foreground">
                    Performance Analytics
                </h1>
                <p className="text-muted-foreground text-sm font-medium opacity-60 max-w-2xl">
                    Real-time insights into your habit-building journey. Track your professional evolution with precise data and trend analysis.
                </p>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={item}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className="relative group overflow-hidden bg-card border border-border rounded-[2rem] p-8 shadow-2xl shadow-black/5 transition-all duration-500 hover:border-border"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] -z-10 group-hover:bg-primary/10 transition-all duration-500" />
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-xl ${stat.bg} bg-opacity-10 border border-border`}>
                                <stat.icon className={`w-6 h-6 ${stat.color} filter drop-shadow-sm`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                                {stat.label}
                            </p>
                            <h3 className="text-4xl font-black mt-2 tracking-tighter text-foreground">
                                <AnimatedNumber value={stat.value} />
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {/* Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black/5 overflow-hidden flex flex-col relative"
                >
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl border border-border shrink-0">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter">Consistency Trend</h3>
                                <p className="text-xs font-medium text-muted-foreground opacity-60">Success metrics over the last 7 days</p>
                            </div>
                        </div>
                    </div>
 
                    <Suspense fallback={<ChartLoading />}>
                        <div className="flex-1 min-h-[300px]">
                            <AnalyticsChart data={trendData} />
                        </div>
                    </Suspense>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl shadow-black/5 flex flex-col relative overflow-hidden"
                >
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] -z-10" />
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl border border-border shrink-0">
                                <Calendar className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter">Heatmap</h3>
                                <p className="text-xs font-medium text-muted-foreground opacity-60">Yearly activity density</p>
                            </div>
                        </div>
                    </div>
 
                    <div className="flex-grow flex flex-col min-h-[150px]">
                        {heatmapData && heatmapData.length > 0 ? (
                            <div className="flex flex-col gap-6">
                                <div className="flex justify-between text-[9px] text-muted-foreground uppercase font-black tracking-[0.2em] px-10 opacity-40">
                                    <span>Jan</span>
                                    <span>Mar</span>
                                    <span>May</span>
                                    <span>Jul</span>
                                    <span>Sep</span>
                                    <span>Nov</span>
                                    <span>Dec</span>
                                </div>
                                <div className="flex gap-6">
                                    <div className="flex flex-col justify-between text-[8px] text-muted-foreground font-black uppercase py-1 h-[140px] opacity-40">
                                        <span>Mon</span>
                                        <span>Wed</span>
                                        <span>Fri</span>
                                    </div>
 
                                    <div className="flex-grow overflow-x-auto pb-6 scrollbar-hide">
                                        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[700px]">
                                            {heatmapData.map((day, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ scale: 1.5, zIndex: 20 }}
                                                    className={`w-3.5 h-3.5 rounded-[2px] transition-colors duration-500 cursor-pointer border border-border ${day.count === 0 ? 'bg-secondary/30 hover:bg-secondary/50' :
                                                        day.count < 3 ? 'bg-emerald-500/20' :
                                                            day.count < 6 ? 'bg-emerald-500/50' : 'bg-emerald-500'
                                                        }`}
                                                    title={`${day.date}: ${day.count} check-ins`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-secondary/10 rounded-3xl border border-border">
                                <Info className="w-8 h-8 text-muted-foreground" />
                                <p className="font-bold text-lg mt-4">Your legacy starts today</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
