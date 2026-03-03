import React, { useMemo } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Flame, Target, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon, color, delay }) => {
    const Icon = icon;
    return (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}>
            <Card className="overflow-hidden relative group">
                <div className={`absolute right-0 top-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform ${color}`}>
                    <Icon size={100} />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${color}`} /> {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black tabular-nums">{value}</div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const Analytics = () => {
    const { summary, heatmap, weeklyReport, isLoading } = useAnalytics();

    const trendData = useMemo(() => {
        if (!weeklyReport) return [];

        // Generate last 7 days
        return Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(new Date(), 6 - i);
            const dateStr = format(date, 'yyyy-MM-dd');
            const completedCount = weeklyReport.filter(log =>
                log.date === dateStr && log.completed
            ).length;

            return {
                name: format(date, 'EEE'),
                completed: completedCount
            };
        });
    }, [weeklyReport]);

    if (isLoading) return <div className="p-8 flex items-center justify-center h-full">Loading insights...</div>;

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8 relative">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight">Analytics & Intelligence</h1>
                <p className="text-muted-foreground mt-1">Data-driven insights to optimize your consistency.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Active Habits" value={summary.active_habits} icon={Target} color="text-blue-500" delay={0.1} />
                <StatCard title="Total Check-ins" value={summary.total_checkins || 0} icon={Activity} color="text-green-500" delay={0.2} />
                <StatCard title="Best Streak" value={`${summary.best_streak}d`} icon={Flame} color="text-orange-500" delay={0.3} />
                <StatCard title="Overall Rate" value={`${summary.overall_completion_rate}%`} icon={Trophy} color="text-purple-500" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Completion Trend (Last 7 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorComplete" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis dataKey="name" tick={{ fill: 'currentColor', opacity: 0.6 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'currentColor', opacity: 0.6 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                                />
                                <Area type="monotone" dataKey="completed" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorComplete)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm flex items-center justify-center p-8 bg-muted/20 border-dashed">
                    <div className="text-center">
                        <div className="mb-4 inline-flex p-3 bg-card rounded-full shadow-sm text-primary">
                            <CalendarIcon size={32} />
                        </div>
                        <h3 className="text-lg font-semibold">Heatmap Calendar</h3>
                        <p className="text-muted-foreground text-sm max-w-[250px] mx-auto mt-2">
                            {heatmap?.length > 0
                                ? `You have ${heatmap.length} total completions logged in your history.`
                                : "Commit histories will populate here showing month-by-month consistency intensity."}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
