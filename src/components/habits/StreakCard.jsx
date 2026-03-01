import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const StreakCard = ({ streak = 0, longestStreak = 0, heatmap = [] }) => {
    return (
        <Card className="bg-gradient-to-br from-orange-400 to-red-600 text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 scale-[2] pointer-events-none">
                <Flame size={150} fill="currentColor" />
            </div>
            <CardContent className="p-6 relative z-10 flex flex-col h-full justify-between">
                <div>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-orange-100">Best Current Streak</h2>
                    <div className="flex items-baseline gap-2 mt-2">
                        <motion.span
                            className="text-6xl font-black tabular-nums"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {streak}
                        </motion.span>
                        <span className="text-xl font-medium text-orange-200">Days</span>
                    </div>
                    <p className="text-sm mt-1 text-orange-100/80">Longest Streak: {longestStreak}</p>
                </div>

                <div className="mt-8 flex gap-1 justify-between items-end h-10">
                    {heatmap.map((active, i) => (
                        <div
                            key={i}
                            className={`w-full rounded-sm transition-all ${active ? 'bg-white/90 h-full' : 'bg-white/20 h-4'
                                }`}
                            title={active ? 'Completed' : 'Missed'}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default StreakCard;
