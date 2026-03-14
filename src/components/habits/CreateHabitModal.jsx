import React, { useState, useEffect } from 'react';
import { useHabits } from '../../hooks/useHabits';
import { Button } from '../ui/button';
import { X, Sparkles, Target, Bell, Palette, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Health', 'Fitness', 'Productivity', 'Learning', 'Mindfulness', 'Finance', 'Social', 'Personal', 'Custom'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];
const FREQUENCIES = ['Daily', 'Weekly', 'Monthly'];
const COLORS = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
];
const EMOJIS = ['🌱', '💪', '📚', '🧘', '💰', '🍎', '🎯', '🔥', '💎', '💻', '🎨', '🚶'];

export default function CreateHabitModal({ isOpen, onClose, habitToEdit = null }) {
    const { createMutation, updateMutation } = useHabits();

    const [formData, setFormData] = useState({
        name: '',
        icon: '⭐',
        color: '#3B82F6',
        category: 'Health',
        difficulty: 'Medium',
        frequency: 'Daily',
        goal_value: 1,
        reminder_enabled: false,
    });

    useEffect(() => {
        if (habitToEdit) {
            setFormData({
                name: habitToEdit.name || '',
                icon: habitToEdit.icon || '⭐',
                color: habitToEdit.color || '#3B82F6',
                category: habitToEdit.category || 'Health',
                difficulty: habitToEdit.difficulty || 'Medium',
                frequency: habitToEdit.frequency || 'Daily',
                goal_value: habitToEdit.goal_value || 1,
                reminder_enabled: habitToEdit.reminder_enabled || false,
            });
        } else {
            setFormData({
                name: '',
                icon: '⭐',
                color: '#3B82F6',
                category: 'Health',
                difficulty: 'Medium',
                frequency: 'Daily',
                goal_value: 1,
                reminder_enabled: false,
            });
        }
    }, [habitToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            difficulty: formData.difficulty.toLowerCase(),
            frequency: formData.frequency.toLowerCase(),
        };

        if (habitToEdit) {
            await updateMutation.mutateAsync({ id: habitToEdit.id, data: payload });
        } else {
            await createMutation.mutateAsync(payload);
        }
        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-hidden h-[100dvh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="relative w-full max-w-2xl bg-card rounded-[24px] shadow-2xl border border-border flex flex-col overflow-hidden max-h-full"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-1.5 z-10 text-muted-foreground rounded-full hover:bg-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>

                    {/* Compact Header */}
                    <div className="px-6 pt-5 pb-3 flex flex-col border-b border-border/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">{habitToEdit ? 'Edit Habit' : 'New Habit'}</h2>
                                <p className="text-xs font-medium text-muted-foreground">Define your path to personal growth.</p>
                            </div>
                        </div>
                    </div>

                    {/* Compact Scrollable Form Body */}
                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto px-6 py-4 space-y-4 max-h-[calc(100vh-140px)] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        
                        {/* Row 1: Name and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    Habit Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    className="w-full bg-muted/50 border border-border focus:border-primary focus:bg-card rounded-xl px-4 py-2 text-sm font-semibold outline-none transition-all placeholder:text-muted-foreground/50 h-10"
                                    placeholder="e.g. Morning Meditation"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <LayoutGrid className="h-3.5 w-3.5" /> Category
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {CATEGORIES.slice(0, 6).map(cat => ( // Show fewer initially to save space if needed, or use a select dropdown if it gets too crowded. For now, compact buttons.
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleChange('category', cat)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${formData.category === cat ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-card border-border hover:bg-muted text-muted-foreground'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                    {/* Optional: Add a 'More' dropdown or keep it as is if it fits. 6 cats usually fit well. Let's show all but compactly */}
                                     {CATEGORIES.slice(6).map(cat => (
                                         <button
                                             key={cat}
                                             type="button"
                                             onClick={() => handleChange('category', cat)}
                                             className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all hidden sm:inline-block ${formData.category === cat ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-card border-border hover:bg-muted text-muted-foreground'}`}
                                         >
                                             {cat}
                                         </button>
                                     ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Icons and Color */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    Icon
                                </label>
                                <div className="flex flex-wrap gap-1.5 p-1.5 bg-muted/30 rounded-xl border border-border/50">
                                    {EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => handleChange('icon', emoji)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-lg transition-all ${formData.icon === emoji ? 'bg-primary text-primary-foreground shadow-sm scale-105' : 'hover:bg-card hover:shadow-sm text-muted-foreground'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Palette className="h-3.5 w-3.5" /> Color Accent
                                </label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleChange('color', color)}
                                            className={`w-6 h-6 rounded-full border-2 transition-all ${formData.color === color ? 'scale-125 border-card shadow-md ring-2 ring-primary ring-offset-1 ring-offset-background' : 'border-transparent opacity-70 hover:opacity-100 ring-1 ring-transparent hover:ring-border hover:ring-offset-1 hover:ring-offset-background'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Difficulty and Frequency & Target */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <Sparkles className="h-3.5 w-3.5" /> Difficulty
                                </label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {DIFFICULTIES.map(diff => (
                                        <button
                                            key={diff}
                                            type="button"
                                            onClick={() => handleChange('difficulty', diff)}
                                            className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all text-center ${formData.difficulty === diff ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-card border-border hover:bg-muted text-muted-foreground'}`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>

                             <div className="flex items-end gap-3">
                                 <div className="flex-1 space-y-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        Frequency
                                    </label>
                                    <div className="flex bg-muted/50 rounded-lg p-0.5 border border-border/50">
                                        {FREQUENCIES.map(freq => (
                                            <button
                                                key={freq}
                                                type="button"
                                                onClick={() => handleChange('frequency', freq)}
                                                className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all ${formData.frequency === freq ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:bg-card/50'}`}
                                            >
                                                {freq}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="w-20 space-y-1.5">
                                     <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                                        <Target className="h-3.5 w-3.5" /> Goal
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.goal_value}
                                        onChange={e => handleChange('goal_value', parseInt(e.target.value))}
                                        className="w-full bg-muted/50 border border-border/50 focus:border-primary/50 rounded-lg px-2 text-center py-1.5 text-sm font-bold outline-none transition-all h-[34px]"
                                    />
                                </div>
                                <div className="space-y-1.5 pb-[1px]">
                                     <button
                                        type="button"
                                        title="Toggle Reminder"
                                        onClick={() => handleChange('reminder_enabled', !formData.reminder_enabled)}
                                        className={`p-2 rounded-lg transition-all border ${formData.reminder_enabled ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card border-border hover:bg-muted text-muted-foreground'}`}
                                    >
                                        <Bell className={`h-4 w-4 ${formData.reminder_enabled ? 'animate-bounce' : ''}`} />
                                    </button>
                                </div>
                             </div>
                        </div>

                        {/* Footer Buttons attached to the bottom */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border/50 mt-auto shrink-0 mb-2">
                             <Button variant="ghost" onClick={onClose} type="button" size="sm" className="px-5 text-xs font-semibold rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">Cancel</Button>
                             <Button
                                disabled={createMutation.isPending || updateMutation.isPending}
                                type="submit"
                                size="sm"
                                className="px-8 text-xs font-bold rounded-xl shadow-md shadow-primary/20 bg-primary hover:bg-primary-hover text-primary-foreground h-9 transition-all active:scale-95"
                            >
                                {createMutation.isPending || updateMutation.isPending ? 'Forging...' : habitToEdit ? 'Save Changes' : 'Forging Habit'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
