import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Check, Flame, Share2 } from 'lucide-react';
import { toast } from 'sonner';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const defaultHabit = { icon: '⭐', name: 'Unknown', color: 'bg-primary' };

const DailyHabitItem = ({ log, habit = defaultHabit, onToggle }) => {
    const isCompleted = log?.completed || false;
    const [isAnimating, setIsAnimating] = useState(false);

    const handleShare = (e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: 'HabitForge Progress',
                text: `I just completed my "${habit.name}" habit! Streak: ${habit.current_streak || 0} days. Join me on HabitForge!`,
                url: window.location.origin,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(`I'm crushing my "${habit.name}" habit on HabitForge!`);
            toast.info('Progress copied to clipboard');
        }
    };

    const handleToggle = () => {
        const newVal = !isCompleted;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 800);
        onToggle(habit.id, { completed: newVal });
    };

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all duration-300 overflow-hidden relative group",
                isCompleted ? "border-green-500/50 bg-green-50/10 dark:bg-green-950/20 shadow-green-900/10 shadow-lg" : "hover:border-primary/50"
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
                        <h3 className={cn("text-lg font-semibold transition-colors", isCompleted && "text-muted-foreground line-through")}>
                            {habit.name}
                        </h3>
                        <span className="text-sm text-muted-foreground">
                            {habit.category} • <span className="uppercase">{habit.difficulty}</span>
                            {habit.goal_target > 0 && (
                                <span className="ml-2 font-black text-primary">
                                    • {habit.goal_value || 0}/{habit.goal_target}
                                </span>
                            )}
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

                    {!isCompleted && (
                        <button
                            onClick={handleShare}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Share2 size={18} />
                        </button>
                    )}

                    <motion.div
                        className={cn(
                            "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm",
                            isCompleted
                                ? "bg-green-500 border-green-500 text-white"
                                : "border-muted-foreground/30 hover:border-primary group-hover:bg-primary/5"
                        )}
                        animate={isAnimating ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                    >
                        {isCompleted && <Check strokeWidth={3} className="w-6 h-6" />}
                    </motion.div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyHabitItem;
