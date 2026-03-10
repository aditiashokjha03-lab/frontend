import { useQuery } from '@tanstack/react-query';
import { getSummary, getTrend, getHeatmap } from '../api/analyticsApi';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Activity, CheckCircle2, Flame, TrendingUp, Calendar, Info
} from 'lucide-react';

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

export default function Analytics() {
    const { data: summary, isLoading: summaryLoading } = useQuery({
        queryKey: ['analytics-summary'],
        queryFn: getSummary
    });

    const { data: trendData, isLoading: trendLoading } = useQuery({
        queryKey: ['analytics-trend', 7],
        queryFn: () => getTrend(7)
    });

    const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
        queryKey: ['analytics-heatmap', 2024], // Should ideally be dynamic
        queryFn: () => getHeatmap(2024)
    });

    if (summaryLoading || trendLoading || heatmapLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const stats = [
        { label: 'Active Habits', value: summary?.active_habits || 0, icon: Activity, color: 'text-primary', bg: 'bg-primary/10' },
        { label: 'Total Check-ins', value: summary?.total_check_ins || 0, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
        { label: 'Best Streak', value: `${summary?.best_streak || 0} Days`, icon: Flame, color: 'text-warning', bg: 'bg-warning/10' },
        { label: 'Overall Rate', value: `${summary?.completion_rate || 0}%`, icon: TrendingUp, color: 'text-achievement', bg: 'bg-achievement/10' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen space-y-8 pb-20">
            <header className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Performance Analytics
                </h1>
                <p className="text-muted-foreground text-lg">
                    Real-time insights into your habit-building journey and consistency.
                </p>
            </header>

            {/* Stat Cards */}
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
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="relative group overflow-hidden bg-card/50 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 shadow-sm"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {stat.label}
                                </p>
                                <h3 className="text-3xl font-bold mt-2 tracking-tight">
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-500" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-2 rounded-2xl p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                7-Day Consistency
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">Growth trend across all habits</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData || []}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                                    stroke="var(--muted-foreground)"
                                    fontSize={12}
                                />
                                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        borderColor: 'var(--border)',
                                        borderRadius: '12px',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTrend)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Heatmap Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card/50 backdrop-blur-sm border-2 rounded-2xl p-6 shadow-sm flex flex-col"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <Calendar className="w-5 h-5 text-success" />
                        <h3 className="text-xl font-bold">Activity Heatmap</h3>
                    </div>

                    <div className="flex-grow flex flex-col items-center justify-center p-8 bg-accent/20 rounded-xl border-2 border-dashed border-border group relative overflow-hidden">
                        {heatmapData && heatmapData.length > 0 ? (
                            <div className="grid grid-cols-7 gap-1">
                                {/* Simplified Heatmap Grid */}
                                {heatmapData.map((day, i) => (
                                    <div
                                        key={i}
                                        className={`w-4 h-4 rounded-sm ${day.count === 0 ? 'bg-muted' :
                                                day.count < 3 ? 'bg-success/30' :
                                                    day.count < 6 ? 'bg-success/60' : 'bg-success'
                                            }`}
                                        title={`${day.date}: ${day.count} check-ins`}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="p-4 bg-muted/50 rounded-full inline-block">
                                    <Info className="w-8 h-8 text-muted-foreground animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-semibold text-lg italic">The journey begins here</p>
                                    <p className="text-sm text-muted-foreground max-w-[200px]">
                                        Complete your first habit to start generating activity heatmaps.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Decorative Background for Empty State */}
                        {!heatmapData?.length && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
