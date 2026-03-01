import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Flame } from 'lucide-react';
import DifficultyPill from './DifficultyPill';
import { useHabits } from '../../hooks/useHabits';

const HabitCard = ({ habit, onEdit }) => {
    const { deleteHabit } = useHabits();

    const handleDelete = () => {
        if (confirm(`Are you sure you want to archive ${habit.name}?`)) {
            deleteHabit(habit.id);
        }
    };

    return (
        <Card className="relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg border-l-4" style={{ borderLeftColor: habit.color || 'hsl(var(--primary))' }}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{habit.icon || '⭐'}</span>
                    <CardTitle className="text-xl font-bold truncate max-w-[150px]">{habit.name}</CardTitle>
                </div>
                <div className="flex gap-1 opacity-50 hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(habit)}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">{habit.category}</span>
                        <DifficultyPill difficulty={habit.difficulty} />
                    </div>
                    <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-950 px-3 py-1.5 rounded-full">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="font-bold text-orange-700 dark:text-orange-400">
                            {habit.current_streak || 0}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HabitCard;
