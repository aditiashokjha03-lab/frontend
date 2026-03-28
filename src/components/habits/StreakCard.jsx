import React from 'react';

const StreakCard = React.memo(({ streak = 0, longestStreak = 0, heatmap = [] }) => {
    return (
        <div className="bg-card border border-border rounded-[2rem] p-10 flex flex-col shadow-2xl shadow-black/5 relative overflow-hidden">
            <div className="flex items-center mb-10">
                <div className="mr-6 flex items-center justify-center text-3xl bg-secondary/50 h-20 w-20 rounded-2xl text-foreground border border-border">
                    🔥
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em]">Current Streak</h3>
                    <p className="text-4xl font-black text-foreground leading-none mt-2 tracking-tighter">{streak} <span className="text-xs text-muted-foreground font-bold tracking-normal align-top ml-1">Days</span></p>
                </div>
            </div>
 
            <div className="pt-8 border-t border-border">
                <p className="text-[9px] text-muted-foreground/50 font-black uppercase tracking-[0.3em] mb-4">Activity Heatmap</p>
                <div className="flex gap-2 justify-between">
                    {heatmap.map((active, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-10 rounded-lg border transition-all duration-300 ${active ? 'bg-primary/80 border-primary/50 shadow-lg shadow-primary/20' : 'bg-secondary/20 border-border'}`}
                        />
                    ))}
                </div>
                <div className="flex justify-between items-center mt-8">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Personal Best</p>
                    <p className="text-sm font-black text-foreground">{longestStreak} days</p>
                </div>
            </div>
        </div>
    );
});

export default StreakCard;
