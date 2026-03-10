export default function StreakCard({ streak = 0, longestStreak = 0, heatmap = [] }) {
    return (
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col shadow-sm">
            <div className="flex items-center mb-6">
                <div className="mr-5 flex items-center justify-center text-2xl bg-warning/10 h-14 w-14 rounded-2xl text-warning border border-warning/20">
                    🔥
                </div>
                <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Current Streak</h3>
                    <p className="text-3xl font-bold text-foreground leading-none mt-1">{streak} <span className="text-sm text-muted-foreground font-semibold">Days</span></p>
                </div>
            </div>

            <div className="pt-6 border-t border-border">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-3">Recent Activity</p>
                <div className="flex gap-2 justify-between">
                    {heatmap.map((active, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-8 rounded-lg border transition-all duration-500 scale-y-100 hover:scale-y-110 ${active ? 'bg-warning border-warning/30' : 'bg-muted border-border'}`}
                        />
                    ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-4 font-semibold">
                    ✨ Personal Best: <span className="text-foreground">{longestStreak} days</span>
                </p>
            </div>
        </div>
    );
}
