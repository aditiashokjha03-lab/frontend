import React, { useState } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { askHabitTAI } from '../../api/aiApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const HabitTAI = () => {
    const [goal, setGoal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [addingTitles, setAddingTitles] = useState([]);
    const { createHabitAsync } = useHabits();

    const handleAskAI = async () => {
        if (!goal.trim()) {
            toast.error('Please enter a goal first');
            return;
        }

        setIsLoading(true);
        try {
            const habits = await askHabitTAI(goal);
            setSuggestions(Array.isArray(habits) ? habits : []);
            toast.success('HabitTAI generated habit suggestions for you.');
        } catch (error) {
            console.error('HabitTAI frontend error:', error);
            const message = error.response?.data?.message || error.message || 'Failed to get help from HabitTAI';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddHabit = async (suggestion) => {
        setAddingTitles((current) => [...current, suggestion.title]);

        try {
            await createHabitAsync({
                name: suggestion.title,
                category: 'Personal',
                difficulty: suggestion.difficulty,
                color: '#3b82f6',
                icon: '*',
                frequency: suggestion.frequency,
            });
            toast.success(`Added "${suggestion.title}" to your habits.`);
        } catch (error) {
            console.error('Failed to add suggested habit:', error);
            toast.error('Failed to add habit');
        } finally {
            setAddingTitles((current) => current.filter((title) => title !== suggestion.title));
        }
    };

    return (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-sm">HabitTAI - AI Goal Assistant</h3>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
                Holaa!! I&apos;m HabitTAI 👋 Coming Soon!! 🚀
            </p>

            <div className="flex gap-2">
                <Input
                    placeholder="What's your goal? (e.g. Get fit, Study consistently)"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    disabled={isLoading}
                    className="bg-background border-primary/20 focus-visible:ring-primary/30"
                />
                <Button
                    onClick={handleAskAI}
                    disabled={isLoading || !goal.trim()}
                    className="gap-2 shrink-0 bg-primary hover:bg-primary/90"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Ask HabitTAI
                </Button>
            </div>

            <p className="text-[10px] text-muted-foreground mt-2 px-1">
                HabitTAI will suggest 5 small habits matched to your goal.
            </p>

            {suggestions.length > 0 && (
                <div className="grid gap-3 mt-4 md:grid-cols-2 xl:grid-cols-3">
                    {suggestions.map((suggestion) => {
                        const isAdding = addingTitles.includes(suggestion.title);

                        return (
                            <Card key={suggestion.title} className="border-primary/15 bg-background/90">
                                <CardContent className="p-4 space-y-3">
                                    <div>
                                        <p className="font-semibold leading-tight">{suggestion.title}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{suggestion.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span className="capitalize">{suggestion.difficulty}</span>
                                        <span className="capitalize">{suggestion.frequency}</span>
                                    </div>

                                    <Button
                                        onClick={() => handleAddHabit(suggestion)}
                                        disabled={isAdding}
                                        className="w-full gap-2"
                                    >
                                        {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                        Add Habit
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HabitTAI;
