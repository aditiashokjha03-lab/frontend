import React, { useMemo } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = React.memo(({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-card/40 backdrop-blur-3xl border border-border rounded-2xl p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] ring-1 ring-border transition-all duration-300"
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
});

const AnalyticsChart = ({ data }) => {
    const chartData = useMemo(() => 
        data && data.length > 0 ? data : [{ date: new Date().toISOString(), count: 0 }]
    , [data]);

    // Prevent rendering if data is not yet available to avoid layout jumps
    if (!data || data.length === 0) return <div className="w-full h-[320px] mt-4 bg-muted/5 rounded-3xl animate-pulse" />;

    return (
        <div className="w-full h-[320px] min-h-[300px] relative mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
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
                    />
                    <YAxis hide />
                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: 'rgba(34,197,94,0.2)', strokeWidth: 2 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="rgba(34,197,94,0.6)"
                        strokeWidth={10}
                        fill="transparent"
                        filter="url(#neonGlow)"
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#22C55E"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorTrend)"
                        mask="url(#chartMask)"
                        animationDuration={1000}
                        dot={{
                            fill: '#22C55E',
                            r: 3,
                            strokeWidth: 2,
                            stroke: 'var(--card)'
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
        </div>
    );
};

export default React.memo(AnalyticsChart);
