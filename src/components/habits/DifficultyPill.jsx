export default function DifficultyPill({ difficulty }) {
    const colors = {
        easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        hard: 'bg-orange-600/10 text-orange-600 border-orange-600/20',
        expert: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${colors[difficulty] || colors.medium}`}>
            {difficulty}
        </span>
    );
}
