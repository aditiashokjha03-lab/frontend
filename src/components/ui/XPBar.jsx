import { motion } from 'framer-motion';

export default function XPBar({ xp, level }) {
    const xpNeededForNextLevel = level * 100;
    const progress = Math.min((xp / xpNeededForNextLevel) * 100, 100);

    return (
        <div className="w-full space-y-4">
            <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="text-foreground/60 flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Level {level}
                </span>
                <span className="text-muted-foreground/40">{xp} / {xpNeededForNextLevel} XP</span>
            </div>
            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden border border-border">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-primary rounded-full"
                />
            </div>
        </div>
    );
}
