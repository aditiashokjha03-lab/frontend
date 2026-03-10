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
        <div className="relative group p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-muted/50 border border-border text-2xl group-hover:bg-muted transition-colors">
                        {habit.icon || '📌'}
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">{habit.name}</h3>
                        <p className="text-xs font-medium text-muted-foreground capitalize">{habit.category} · {habit.frequency}</p>
                    </div>
                </div>
                <DifficultyPill difficulty={habit.difficulty} />
            </div>

            <div className="flex justify-between items-center mt-3 border-t border-border pt-4">
                <span className="text-xs font-bold text-warning bg-warning/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                    🔥 {habit.current_streak || 0}d streak
                </span>
                <button onClick={handleArchive} className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-lg hover:bg-destructive/10">Archive</button>
            </div>
        </div>
    );
}
