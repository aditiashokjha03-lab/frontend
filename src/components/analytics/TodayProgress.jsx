export default function TodayProgress({ habitsCount, completedCount }) {
    const percentage = habitsCount === 0 ? 0 : Math.round((completedCount / habitsCount) * 100);

    // Svg Circle attributes
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let message = "Let's get started!";
    if (percentage === 100 && habitsCount > 0) message = "Perfect day! 🎉";
    else if (percentage >= 50) message = "Halfway there! Keep going.";

    return (
        <div className="bg-card border rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 md:gap-8 shadow-sm min-h-[140px] w-full transition-all duration-300">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted" />
                    {/* Progress circle */}
                    <circle cx="100" cy="100" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold">{percentage}%</span>
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
