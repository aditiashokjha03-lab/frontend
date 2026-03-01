import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const XPBar = ({ xp = 0, level = 1 }) => {
    // Simple formula: each level takes 100 * level XP.
    const currentLevelMaxXP = level * 100;
    const progressPercentage = Math.min(100, Math.max(0, (xp / currentLevelMaxXP) * 100));

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Progression</span>
                    <Badge variant="secondary" className="font-mono bg-blue-100 text-blue-800 dark:bg-blue-900 border-none">
                        Lvl {level}
                    </Badge>
                </div>
                <span className="text-xs font-mono text-muted-foreground">{xp} / {currentLevelMaxXP} XP</span>
            </div>

            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                <motion.div
                    className="h-full bg-blue-500 dark:bg-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
};

export default XPBar;
