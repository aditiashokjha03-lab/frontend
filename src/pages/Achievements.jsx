import { useQuery } from '@tanstack/react-query';
import { getAchievements } from '../api/achievementsApi';

export default function Achievements() {
    const { data, isLoading } = useQuery({
        queryKey: ['achievements'],
        queryFn: getAchievements
    });

    if (isLoading) return <div className="p-8 text-center animate-pulse">Loading gallery...</div>;

    return (
        <div className="p-4 md:p-12 max-w-6xl mx-auto min-h-[calc(100vh-4rem)]">
            <div className="text-center mb-16">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3 block">Hall of Fame</span>
                <h1 className="text-4xl font-black text-foreground mb-4 tracking-tight">
                    Trophy Room
                </h1>
                <p className="text-sm font-medium text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Your hard work, materialized. Track your milestones, collect badges, and celebrate your journey of self-improvement.
                </p>
            </div>

            {data?.length === 0 ? (
                <div className="border border-border p-20 text-center rounded-[40px] bg-card shadow-sm flex flex-col items-center">
                    <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center text-4xl mb-6">🌱</div>
                    <p className="font-bold text-foreground text-lg">No achievements yet.</p>
                    <p className="text-sm text-muted-foreground mt-1">Keep tracking your habits to unlock your first badge!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                    {data?.map(ach => {
                        const isUnlocked = !!ach.unlocked_at;

                        return (
                            <div
                                key={ach.id}
                                className={`relative group bg-card border border-border rounded-[32px] p-8 flex flex-col items-center text-center transition-all duration-500
                  ${isUnlocked ? 'shadow-lg hover:shadow-2xl hover:-translate-y-2' : 'opacity-40 grayscale'}
                `}
                            >
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm transition-transform duration-500 group-hover:scale-110
                  ${isUnlocked ? 'bg-muted/50 border border-border' : 'bg-muted/50'}
                `}>
                                    {ach.icon_url || '🎖️'}
                                </div>

                                <h3 className="font-bold text-foreground text-lg leading-tight mb-2">{ach.name}</h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider line-clamp-2 leading-relaxed">{ach.description}</p>

                                <div className="mt-6 pt-6 border-t border-border w-full">
                                    {isUnlocked ? (
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-success bg-success/10 px-3 py-1.5 rounded-full">Unlocked</span>
                                    ) : (
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">Locked</span>
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
