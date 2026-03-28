import React from 'react';

const TodayProgress = React.memo(({ habitsCount, completedCount }) => {
    const percentage = habitsCount === 0 ? 0 : Math.round((completedCount / habitsCount) * 100);

    // Svg Circle attributes
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let message = "Let's get started!";
    if (percentage === 100 && habitsCount > 0) message = "Perfect day! 🎉";
    else if (percentage >= 50) message = "Halfway there! Keep going.";

    return (
        <div className="bg-card border border-border rounded-[2rem] p-10 flex flex-col sm:flex-row items-center gap-10 shadow-2xl shadow-black/5 transition-all duration-300">
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary/50" />
                    <circle cx="100" cy="100" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-black tracking-tighter">{percentage}%</span>
                </div>
            </div>
 
            <div>
                <h3 className="text-xl font-black tracking-tighter">Daily Progress</h3>
                <p className="text-sm text-muted-foreground mt-2 font-medium opacity-80">
                    {completedCount} of {habitsCount} habits completed today.
                </p>
                <div className="mt-6 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">{message}</p>
                </div>
            </div>
        </div>
    );
});

export default TodayProgress;
