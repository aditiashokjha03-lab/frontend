import { useQuery } from '@tanstack/react-query';
import { getAchievements } from '../api/achievementsApi';

export default function Achievements() {
    const { data, isLoading } = useQuery({
        queryKey: ['achievements'],
        queryFn: getAchievements
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 space-y-4">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-sm font-bold text-muted-foreground animate-pulse tracking-widest uppercase">Loading gallery...</div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-6xl mx-auto min-h-[calc(100vh-4rem)] space-y-16">
            <div className="text-center space-y-4 mt-8">
                <span className="text-xs font-black text-primary uppercase tracking-[0.25em] bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">Hall of Fame</span>
                <h1 className="text-5xl md:text-6xl font-black text-foreground tracking-tighter">
                    Trophy Room
                </h1>
                <p className="text-sm md:text-base font-medium text-muted-foreground max-w-xl mx-auto leading-relaxed">
                    Your hard work, materialized. Track your milestones, collect badges, and celebrate your journey of self-improvement.
                </p>
            </div>
 
            {data?.length === 0 ? (
                <div className="border border-border p-16 text-center rounded-[2rem] bg-secondary/10 shadow-2xl shadow-black/5 flex flex-col items-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 rounded-3xl bg-secondary/30 flex items-center justify-center text-4xl mb-6 border border-border">🌱</div>
                    <h3 className="font-bold text-foreground text-2xl tracking-tight mb-2">No achievements yet.</h3>
                    <p className="text-sm text-muted-foreground font-medium">Keep tracking your daily habits to earn badges.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.map(ach => {
                        const isUnlocked = !!ach.unlocked_at;
 
                        return (
                            <div
                                key={ach.id}
                                className={`group bg-card rounded-[2rem] p-6 flex flex-col items-center text-center transition-all duration-500 min-h-[280px] justify-between border
                                    ${isUnlocked 
                                        ? 'border-border shadow-xl shadow-black/5 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.2)] hover:border-primary/30 hover:-translate-y-1.5' 
                                        : 'border-border/10 opacity-50 grayscale shadow-none'
                                    }
                                `}
                            >
                                <div className="flex flex-col items-center gap-6 w-full mt-4">
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-transform duration-500 ease-out group-hover:scale-110
                                        ${isUnlocked ? 'bg-secondary/50 border border-border shadow-inner' : 'bg-transparent'}
                                    `}>
                                        {ach.icon_url || '🎖️'}
                                    </div>
     
                                    <div className="space-y-2 w-full px-2">
                                        <h3 className={`font-bold text-foreground tracking-tight leading-tight line-clamp-2 ${isUnlocked ? 'text-lg' : 'text-base opacity-70'}`}>{ach.name}</h3>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em] line-clamp-2 leading-relaxed">{ach.description}</p>
                                    </div>
                                </div>
 
                                <div className="mt-8 pt-5 border-t border-border w-full">
                                    {isUnlocked ? (
                                        <div className="flex justify-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_-2px_rgba(16,185,129,0.3)] transition-colors group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30">Unlocked</span>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground opacity-60">Locked</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
