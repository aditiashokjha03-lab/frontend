import { useEffect, useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummary, getTrend, getHeatmap } from '../api/analyticsApi';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
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

// Animated Number Component
const AnimatedNumber = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    const suffix = typeof value === 'string' ? value.replace(/[0-9.]/g, '') : '';

    useEffect(() => {
        const controls = animate(0, numericValue, {
            duration: 2,
            ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for premium feel
            onUpdate: (latest) => setDisplayValue(Math.floor(latest))
        });
        return () => controls.stop();
    }, [numericValue]);

    return (
        <span className="tabular-nums">
            {displayValue}{suffix}
        </span>
    );
};

// Custom Premium Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-card/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] ring-1 ring-white/5 transition-all duration-300"
            >
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-2 px-0.5">
                    {new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' })}
                </p>
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_15px_rgba(34,197,94,0.6)] animate-pulse" />
                    <span className="text-2xl font-black text-foreground tabular-nums tracking-tighter">
                        {payload[0].value} <span className="text-xs font-medium text-muted-foreground ml-0.5 uppercase tracking-widest">Acts</span>
                    </span>
                </div>
            </motion.div>
        );
    }
    return null;
};

// Isolated Chart Component to ensure Hook stability
const AnalyticsChart = ({ data, isMounted }) => {
    const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

    const chartRef = (node) => {
        if (node !== null) {
            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (width > 0 && height > 0) {
                        setChartSize({ width, height });
                    }
                }
            });
            resizeObserver.observe(node);
        }
    };

    return (
        <div ref={chartRef} className="w-full h-[320px] min-h-[300px] relative mt-4">
            {isMounted && chartSize.width > 0 && (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data && data.length > 0 ? data : [{ date: new Date().toISOString(), count: 0 }]}
                        margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.6} />
                                <stop offset="50%" stopColor="#22C55E" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                            </linearGradient>
                            <mask id="chartMask">
                                <rect x="0" y="0" width="100%" height="100%" fill="url(#maskGradient)" />
                            </mask>
                            <linearGradient id="maskGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" />
                                <stop offset="80%" stopColor="white" />
                                <stop offset="100%" stopColor="black" />
                            </linearGradient>
                            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(128,128,128,0.03)" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
                            stroke="rgba(128,128,128,0.2)"
                            fontSize={10}
                            fontWeight="900"
                            axisLine={false}
                            tickLine={false}
                            dy={15}
                            tick={{ translate: "uppercase" }}
                        />
                        <YAxis hide />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: 'rgba(34,197,94,0.2)', strokeWidth: 2 }}
                        />

                        {/* Area 1: The Glow Base */}
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="rgba(34,197,94,0.6)"
                            strokeWidth={10}
                            fill="transparent"
                            filter="url(#neonGlow)"
                            animationDuration={2500}
                            animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
                        />

                        {/* Area 2: The Actual Data Surface with Masking */}
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#22C55E"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTrend)"
                            mask="url(#chartMask)"
                            animationDuration={2000}
                            animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
                            dot={{
                                fill: '#22C55E',
                                r: 3,
                                strokeWidth: 2,
                                stroke: 'var(--card)',
                                className: "transition-all duration-500 hover:r-5"
                            }}
                            activeDot={{
                                r: 6,
                                strokeWidth: 0,
                                fill: 'var(--primary)',
                                className: "animate-ping"
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default function Analytics() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            requestAnimationFrame(() => {
                setIsMounted(true);
            });
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const { data: summary, isLoading: summaryLoading } = useQuery({
        queryKey: ['analytics-summary'],
        queryFn: getSummary
    });

    const { data: trendData, isLoading: trendLoading } = useQuery({
        queryKey: ['analytics-trend', 7],
        queryFn: () => getTrend(7)
    });

    const currentYear = new Date().getFullYear();
    const { data: heatmapData, isLoading: heatmapLoading } = useQuery({
        queryKey: ['analytics-heatmap', currentYear],
        queryFn: () => getHeatmap(currentYear)
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
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="relative group overflow-hidden bg-card backdrop-blur-xl border border-border rounded-3xl p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${stat.bg} bg-opacity-20`}>
                                <stat.icon className={`w-6 h-6 ${stat.color} filter drop-shadow-sm`} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                {stat.label}
                            </p>
                            <h3 className="text-4xl font-black mt-2 tracking-tighter">
                                <AnimatedNumber value={stat.value} />
                            </h3>
                        </div>
                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700" />
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
                    className="lg:col-span-2 bg-card backdrop-blur-md border border-border rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Consistency Trend</h3>
                                <p className="text-sm text-muted-foreground whitespace-nowrap">Activities over the last 7 days</p>
                            </div>
                        </div>
                    </div>

                    <AnalyticsChart data={trendData} isMounted={isMounted} />
                </motion.div>

                {/* Heatmap Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-card backdrop-blur-md border border-border rounded-3xl p-8 shadow-2xl flex flex-col"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-success/10 rounded-lg">
                                <Calendar className="w-6 h-6 text-success" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">Activity Heatmap</h3>
                                <p className="text-sm text-muted-foreground">Yearly contribution grid</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest bg-white/5 px-3 py-1.5 rounded-full">
                            <span>Less</span>
                            <div className="flex gap-1 mx-1">
                                <div className="w-3 h-3 rounded-sm bg-muted" />
                                <div className="w-3 h-3 rounded-sm bg-success/30" />
                                <div className="w-3 h-3 rounded-sm bg-success/60" />
                                <div className="w-3 h-3 rounded-sm bg-success" />
                            </div>
                            <span>More</span>
                        </div>
                    </div>

                    <div className="flex-grow flex flex-col min-h-[150px]">
                        {heatmapData && heatmapData.length > 0 ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-tighter px-10">
                                    <span>Jan</span>
                                    <span>Mar</span>
                                    <span>May</span>
                                    <span>Jul</span>
                                    <span>Sep</span>
                                    <span>Nov</span>
                                    <span>Dec</span>
                                </div>
                                <div className="flex gap-4">
                                    {/* Day Labels */}
                                    <div className="flex flex-col justify-between text-[9px] text-muted-foreground font-bold uppercase py-1 h-[140px]">
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
                                                    className={`w-3 h-3 md:w-4 md:h-4 rounded-[2px] transition-colors duration-500 cursor-pointer border border-border/5 ${day.count === 0 ? 'bg-muted hover:bg-muted/80' :
                                                        day.count < 3 ? 'bg-success/30' :
                                                            day.count < 6 ? 'bg-success/60' : 'bg-success'
                                                        }`}
                                                    title={`${day.date}: ${day.count} check-ins`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center p-8 bg-white/2 rounded-2xl border-2 border-dashed border-white/5">
                                <div className="text-center space-y-4">
                                    <div className="p-4 bg-white/5 rounded-full inline-block">
                                        <Info className="w-8 h-8 text-muted-foreground animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-lg">Your legacy starts today</p>
                                        <p className="text-sm text-muted-foreground max-w-[240px]">
                                            Complete habits to visualize your streak progress here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
