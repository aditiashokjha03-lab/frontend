import DifficultyPill from './DifficultyPill';
import { useHabits } from '../../hooks/useHabits';

export default function HabitCard({ habit }) {
    const { deleteMutation } = useHabits();

    const handleArchive = () => {
        if (confirm('Archive this habit?')) {
            deleteMutation.mutate(habit.id);
        }
    };

    return (
        <div className="relative group p-6 rounded-[2rem] border border-white/5 bg-card shadow-2xl shadow-black/40 hover:border-white/10 transition-all duration-300 flex flex-col gap-5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10 group-hover:bg-primary/10 transition-all duration-500" />
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-secondary/50 border border-white/5 text-2xl group-hover:bg-secondary transition-colors">
                        {habit.icon || '📌'}
                    </div>
                    <div>
                        <h3 className="font-black text-lg tracking-tighter text-foreground">{habit.name}</h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50 tracking-[0.2em] mt-1">{habit.category} · {habit.frequency}</p>
                    </div>
                </div>
                <DifficultyPill difficulty={habit.difficulty} />
            </div>
 
            <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-5">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/5 px-3 py-1 rounded-lg border border-primary/20 flex items-center gap-1.5 transition-all group-hover:bg-primary/10">
                    🔥 {habit.current_streak || 0}d streak
                </span>
                <button onClick={handleArchive} className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] hover:text-destructive transition-colors px-3 py-1 rounded-lg hover:bg-destructive/5">Archive</button>
            </div>
        </div>
    );
}
