export default function TodayProgress({ habitsCount, completedCount }) {
    const percentage = habitsCount === 0 ? 0 : Math.round((completedCount / habitsCount) * 100);

    // Svg Circle attributes
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let message = "Let's get started!";
    if (percentage === 100 && habitsCount > 0) message = "Perfect day! 🎉";
    else if (percentage >= 50) message = "Halfway there! Keep going.";

    return (
        <div className="bg-card border rounded-xl p-6 flex items-center gap-6 shadow-sm min-h-[140px]">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted" />
                    {/* Progress circle */}
                    <circle cx="64" cy="64" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-xl font-bold">{percentage}%</span>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-bold">Today's Progress</h3>
                <p className="text-muted-foreground mt-1">
                    {completedCount} of {habitsCount} habits completed
                </p>
                <p className="text-sm text-primary font-medium mt-2">{message}</p>
            </div>
        </div>
    );
}
