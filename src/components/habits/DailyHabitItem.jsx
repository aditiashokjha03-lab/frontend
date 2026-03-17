import React from 'react';
import { motion } from 'framer-motion';

const DailyHabitItem = React.memo(({ habit, log, date, onToggle }) => {
    const complete = log?.completed || false;

    const handleToggle = () => {
        onToggle(habit.id, { completed: !complete });
    };

    return (
        <div className={`p-4 border rounded-2xl flex items-center gap-4 transition-all duration-300
            ${complete ? 'bg-success/10 border-success/30' : 'bg-card border-border hover:border-primary/30 shadow-sm'}
        `}>
            <button
                onClick={handleToggle}
                className={`w-10 h-10 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${complete ? 'bg-success border-success text-success-foreground shadow-sm' : 'border-border text-transparent hover:border-success'}
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>

            <div className="flex-1">
                <h3 className={`font-semibold text-base transition-all ${complete ? 'text-success' : 'text-foreground'}`}>
                    <span className="mr-2">{habit.icon}</span>
                    {habit.name}
                </h3>
                <p className="text-xs font-medium text-muted-foreground capitalize">{habit.category}</p>
            </div>

            <div className="flex flex-col items-end">
                <div className="text-sm font-bold text-warning flex items-center gap-1">
                    🔥 {habit.current_streak || 0}
                </div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">streak</p>
            </div>
        </div>
    );
});

export default DailyHabitItem;
