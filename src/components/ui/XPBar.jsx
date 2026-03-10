import { motion } from 'framer-motion';

export default function XPBar({ xp, level }) {
    const xpNeededForNextLevel = level * 100;
    const progress = Math.min((xp / xpNeededForNextLevel) * 100, 100);

    return (
        <div className="w-full space-y-3">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-primary flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Level {level}
                </span>
                <span className="text-muted-foreground">{xp} / {xpNeededForNextLevel} XP</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden border border-border">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-full bg-primary rounded-full"
                />
            </div>
        </div>
    );
}
