import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Flame } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const defaultHabit = { icon: '⭐', name: 'Unknown', color: 'bg-primary' };

const DailyHabitItem = ({ log, habit = defaultHabit, onToggle }) => {
    const [complete, setComplete] = useState(log?.completed || false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = () => {
        const newVal = !complete;
        setComplete(newVal);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 800);
        onToggle({ ...log, completed: newVal, habit_id: habit.id });
    };

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all duration-300 overflow-hidden relative group",
                complete ? "border-green-500/50 bg-green-50/10 dark:bg-green-950/20 shadow-green-900/10 shadow-lg" : "hover:border-primary/50"
            )}
            onClick={handleToggle}
        >
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5 transition-colors"
                style={{ backgroundColor: habit.color || 'hsl(var(--primary))' }}
            />
            <CardContent className="p-4 flex items-center justify-between ml-2">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {habit.icon}
                    </div>
                    <div className="flex flex-col">
                        <h3 className={cn("text-lg font-semibold transition-colors", complete && "text-muted-foreground line-through")}>
                            {habit.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                            {habit.category} • <span className="uppercase">{habit.difficulty}</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {(habit.current_streak > 0) && (
                        <div className="hidden sm:flex items-center text-orange-500 bg-orange-100 dark:bg-orange-950 px-2 py-1 rounded-full space-x-1">
                            <Flame size={16} fill="currentColor" />
                            <span className="font-bold">{habit.current_streak}</span>
                        </div>
                    )}

                    <motion.div
                        className={cn(
                            "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm",
                            complete
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-muted-foreground/30 hover:border-primary group-hover:bg-primary/5"
                        )}
                        animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                    >
                        {complete && <Check strokeWidth={3} className="w-6 h-6" />}
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyHabitItem;
