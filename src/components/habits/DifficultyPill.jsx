import React from 'react';
import { Badge } from '@/components/ui/badge';

const getDifficultyConfig = (level) => {
    switch (level?.toLowerCase()) {
        case 'easy':
            return { bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300', label: 'Easy' };
        case 'medium':
            return { bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'Medium' };
        case 'hard':
            return { bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300', label: 'Hard' };
        case 'expert':
            return { bg: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Expert' };
        default:
            return { bg: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', label: 'Unknown' };
    }
};

const DifficultyPill = ({ difficulty }) => {
    const config = getDifficultyConfig(difficulty);
    return (
        <Badge variant="outline" className={`border-none font-semibold ${config.bg}`}>
            {config.label}
        </Badge>
    );
};

export default DifficultyPill;
