export default function DifficultyPill({ difficulty }) {
    const colors = {
        easy: 'bg-success/10 text-success border-success/30',
        medium: 'bg-warning/10 text-warning border-warning/30',
        hard: 'bg-warning/15 text-warning border-warning/40',
        expert: 'bg-destructive/10 text-destructive border-destructive/30'
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${colors[difficulty] || colors.medium}`}>
            {difficulty}
        </span>
    );
}
