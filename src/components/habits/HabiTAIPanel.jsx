import { useState } from 'react';
import { useHabiTAI } from '../../hooks/useHabiTAI';
import { useHabits } from '../../hooks/useHabits';
import { trackAiHabitAddition } from '../../api/habitaiApi';
import DifficultyPill from './DifficultyPill';

function SuggestionCard({ suggestion, sessionId, onAdd }) {
    const [added, setAdded] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const { createMutation } = useHabits();

    const handleAdd = async () => {
        const newHabit = await createMutation.mutateAsync({
            name: suggestion.name,
            frequency: suggestion.frequency,
            difficulty: suggestion.difficulty,
            category: 'HabiTAI',
            icon: '✨'
        });

        if (sessionId && newHabit?.id) {
            await trackAiHabitAddition({ session_id: sessionId, habit_id: newHabit.id });
        }

        setAdded(true);
        if (onAdd) onAdd();
    };

    return (
        <div className="bg-card border border-border rounded-2xl p-5 text-sm flex flex-col gap-3 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-foreground">{suggestion.name}</h4>
                <DifficultyPill difficulty={suggestion.difficulty} />
            </div>
            <p className="text-muted-foreground line-clamp-3 leading-relaxed text-xs">{suggestion.description}</p>

            <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {suggestion.frequency}
                </span>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                >
                    Insight
                </button>
            </div>

            {expanded && (
                <div className="bg-muted/50 p-3 rounded-xl text-xs italic text-secondary-foreground border border-border">
                    {suggestion.why}
                </div>
            )}

            <button
                onClick={handleAdd}
                disabled={added || createMutation.isPending}
                className={`mt-2 w-full py-2.5 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95
          ${added ? 'bg-success/10 text-success border border-success/30 cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm'}`}
            >
                {added ? '✓ Adopted' : 'Adopt this Habit'}
            </button>
        </div>
    );
}

export default function HabiTAIPanel() {
    const [category, setCategory] = useState('Fitness');
    const [description, setDescription] = useState('');
    const { suggestMutation, historyQuery } = useHabiTAI();

    const handleGenerate = () => {
        if (!description.trim()) return;
        suggestMutation.mutate({ goal_category: category, goal_description: description });
    };

    return (
        <div className="border border-border rounded-3xl flex flex-col h-full bg-muted/30 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-achievement text-achievement-foreground flex items-center justify-center shadow-lg shadow-achievement/20">
                        ✨
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-foreground">HabiTAI</h2>
                        <p className="text-[10px] font-bold text-achievement uppercase tracking-widest">Master AI Architect</p>
                    </div>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Focus Area</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1.5 p-3 text-sm border border-border rounded-xl bg-card shadow-sm focus:ring-1 ring-ring outline-none">
                            <option>Fitness</option>
                            <option>Mental Health</option>
                            <option>Learning</option>
                            <option>Productivity</option>
                            <option>Sleep</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1 flex justify-between">
                            <span>Your Ambition</span>
                            <span className="text-[10px] opacity-50">{description.length}/200</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            maxLength={200}
                            className="w-full mt-1.5 p-4 text-sm border border-border rounded-2xl resize-none bg-card shadow-sm focus:ring-1 ring-ring outline-none placeholder:text-muted-foreground"
                            rows={4}
                            placeholder="I want to wake up earlier and build a productive morning routine..."
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={!description.trim() || suggestMutation.isPending}
                        className="w-full bg-achievement text-achievement-foreground py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-achievement/20 hover:bg-achievement/90 disabled:opacity-50 transition-all active:scale-95"
                    >
                        {suggestMutation.isPending ? 'AI is Architecting...' : 'Engineer Habits ✨'}
                    </button>
                </div>

                {suggestMutation.data && (
                    <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="font-semibold text-sm">Suggested Plan:</h3>
                        {suggestMutation.data.suggestions.map((s, i) => (
                            <SuggestionCard
                                key={i}
                                suggestion={s}
                                sessionId={suggestMutation.data.session_id}
                            />
                        ))}
                        <button
                            onClick={handleGenerate}
                            className="w-full py-1.5 text-xs border rounded-md hover:bg-accent hover:text-accent-foreground"
                        >
                            Regenerate
                        </button>
                    </div>
                )}

                {/* History Accordion placeholder */}
                <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold text-xs text-muted-foreground mb-2">Recent Sessions (3)</h3>
                    {historyQuery.data?.map(sess => (
                        <div key={sess.id} className="text-xs p-2 mb-2 bg-background border rounded">
                            <span className="font-medium">{sess.goal_category}:</span> <span className="text-muted-foreground truncate">{sess.goal_description}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
