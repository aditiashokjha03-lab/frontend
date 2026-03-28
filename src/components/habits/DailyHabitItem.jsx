import React from 'react';
import { motion } from 'framer-motion';

const DailyHabitItem = React.memo(({ habit, log, date, onToggle }) => {
    const complete = log?.completed || false;

    const handleToggle = () => {
        onToggle(habit.id, { completed: !complete });
    };

    return (
        <div className={`p-6 border rounded-2xl flex items-center gap-6 transition-all duration-300
            ${complete 
                ? 'bg-secondary/40 border-primary/20' 
                : 'bg-secondary/10 border-border hover:border-border hover:bg-secondary/20'}
        `}>
            <button
                onClick={handleToggle}
                className={`w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-300
                    ${complete 
                        ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : 'bg-background border-border text-transparent hover:border-primary/50'}
                `}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
 
            <div className="flex-1">
                <h3 className={`font-bold text-lg tracking-tight transition-all duration-300 ${complete ? 'text-primary' : 'text-foreground'}`}>
                    <span className="mr-3 text-xl opacity-80">{habit.icon}</span>
                    {habit.name}
                </h3>
                <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mt-1">{habit.category}</p>
            </div>
 
            <div className="flex flex-col items-end">
                <div className={`text-lg font-black flex items-center gap-2 transition-colors duration-300 ${complete ? 'text-primary' : 'text-foreground/80'}`}>
                    <span className="text-sm opacity-50">🔥</span> {habit.current_streak || 0}
                </div>
                <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-[0.25em] mt-0.5">streak</p>
            </div>
        </div>
    );
});

export default DailyHabitItem;
