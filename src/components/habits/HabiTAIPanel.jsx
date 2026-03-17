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
        <div className="bg-card border border-white/5 rounded-[2rem] p-6 text-sm flex flex-col gap-4 shadow-2xl shadow-black/40 relative overflow-hidden group transition-all duration-300 hover:border-white/10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] -z-10 group-hover:bg-primary/10 transition-all duration-500" />
            <div className="flex justify-between items-start">
                <h4 className="font-black tracking-tighter text-foreground text-base leading-tight">{suggestion.name}</h4>
                <DifficultyPill difficulty={suggestion.difficulty} />
            </div>
            <p className="text-muted-foreground/60 leading-relaxed text-xs font-medium">{suggestion.description}</p>
 
            <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/5">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                    {suggestion.frequency}
                </span>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-[0.2em]"
                >
                    {expanded ? 'Hide Insight' : 'View Insight'}
                </button>
            </div>
 
            {expanded && (
                <div className="bg-secondary/30 p-4 rounded-xl text-xs italic text-foreground font-medium border border-white/5 animate-in fade-in duration-300">
                    {suggestion.why}
                </div>
            )}
 
            <button
                onClick={handleAdd}
                disabled={added || createMutation.isPending}
                className={`mt-2 w-full py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-[0.98]
          ${added ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-not-allowed'
                        : 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]'}`}
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
        <div className="border border-white/5 rounded-[2.5rem] flex flex-col h-full bg-secondary/10 overflow-hidden shadow-2xl shadow-black/40">
            <div className="p-8 border-b border-white/5 bg-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-achievement/5 blur-[50px] -z-10" />
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-achievement/10 text-achievement flex items-center justify-center border border-achievement/20 shadow-xl shadow-achievement/10">
                        ✨
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tighter text-foreground">HabiTAI</h2>
                        <p className="text-[10px] font-black text-achievement uppercase tracking-[0.2em] opacity-80">Master AI Architect</p>
                    </div>
                </div>
            </div>
 
            <div className="p-8 flex-1 overflow-y-auto flex flex-col gap-8 custom-scrollbar">
                <div className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Focus Area</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-2 p-4 text-sm border border-white/10 rounded-xl bg-secondary/30 shadow-inner focus:ring-2 ring-primary/20 outline-none transition-all font-medium appearance-none">
                            <option>Fitness</option>
                            <option>Mental Health</option>
                            <option>Learning</option>
                            <option>Productivity</option>
                            <option>Sleep</option>
                            <option>Custom</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex justify-between">
                            <span>Your Ambition</span>
                            <span className="text-[9px] opacity-30">{description.length}/200</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            maxLength={200}
                            className="w-full mt-2 p-4 text-sm border border-white/10 rounded-[1.5rem] resize-none bg-secondary/30 shadow-inner focus:ring-2 ring-primary/20 outline-none placeholder:text-muted-foreground/30 font-medium transition-all"
                            rows={4}
                            placeholder="I want to wake up earlier and build a productive morning routine..."
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={!description.trim() || suggestMutation.isPending}
                        className="w-full bg-achievement text-achievement-foreground py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-achievement/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all"
                    >
                        {suggestMutation.isPending ? 'AI is Architecting...' : 'Engineer Habits ✨'}
                    </button>
                </div>
 
                {suggestMutation.data && (
                    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <h3 className="font-black tracking-tighter text-sm uppercase opacity-40">Suggested Plan</h3>
                        {suggestMutation.data.suggestions.map((s, i) => (
                            <SuggestionCard
                                key={i}
                                suggestion={s}
                                sessionId={suggestMutation.data.session_id}
                            />
                        ))}
                        <button
                            onClick={handleGenerate}
                            className="w-full py-2 text-[10px] font-black uppercase tracking-widest border border-white/5 rounded-lg hover:bg-white/5 transition-all opacity-40 hover:opacity-100"
                        >
                            Regenerate
                        </button>
                    </div>
                )}
 
                {/* History Accordion placeholder */}
                <div className="mt-4 pt-10 border-t border-white/5">
                    <h3 className="font-black tracking-tighter text-[10px] uppercase text-muted-foreground mb-4 opacity-40">Recent Sessions</h3>
                    <div className="space-y-3">
                        {historyQuery.data?.map(sess => (
                            <div key={sess.id} className="text-xs p-4 bg-card border border-white/5 rounded-xl shadow-sm">
                                <span className="font-black uppercase text-[9px] text-primary tracking-widest block mb-1">{sess.goal_category}</span> 
                                <span className="text-muted-foreground font-medium line-clamp-1 opacity-60">{sess.goal_description}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
