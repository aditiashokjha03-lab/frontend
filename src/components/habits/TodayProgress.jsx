export default function TodayProgress({ completed, total }) {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    let message = "Let's get started!";
    if (percentage === 100 && total > 0) message = "Perfect day! 🎉";
    else if (percentage >= 50) message = "Halfway there! Keep going.";

    return (
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center text-center shadow-sm">
            <h3 className="text-base font-semibold mb-6 w-full text-left text-foreground">Today's Progress</h3>
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent" className="text-muted" />
                    <circle cx="72" cy="72" r={radius} stroke="currentColor" strokeWidth="10" fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="text-primary transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-foreground">{percentage}%</span>
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                    {completed} / {total} habits done
                </p>
                <p className="text-sm text-success font-semibold">{message}</p>
            </div>
        </div>
    );
}
