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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl rounded-[32px] bg-card p-10 shadow-2xl border border-border mt-10 mb-10"
                >
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors">
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-foreground tracking-tight">{habitToEdit ? 'Forge Your Habit' : 'New Habit'}</h2>
                            <p className="text-sm font-medium text-muted-foreground">Define your path to personal growth.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Name and Icon */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    Habit Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => handleChange('name', e.target.value)}
                                    className="w-full bg-muted/50 border border-border focus:border-primary focus:bg-card rounded-2xl px-6 py-4 font-semibold text-lg outline-none transition-all placeholder:text-muted-foreground"
                                    placeholder="e.g. Morning Meditation"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    Icon Selection
                                </label>
                                <div className="flex flex-wrap gap-2.5 p-3 bg-muted/50 rounded-2xl border border-border">
                                    {EMOJIS.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => handleChange('icon', emoji)}
                                            className={`w-11 h-11 flex items-center justify-center rounded-xl text-xl transition-all ${formData.icon === emoji ? 'bg-primary text-primary-foreground shadow-md scale-110' : 'hover:bg-card hover:shadow-sm text-muted-foreground'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Category and Difficulty */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <LayoutGrid className="h-4 w-4" /> Category
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => handleChange('category', cat)}
                                            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${formData.category === cat ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-card border-border hover:bg-muted text-muted-foreground'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> Difficulty
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {DIFFICULTIES.map(diff => (
                                        <button
                                            key={diff}
                                            type="button"
                                            onClick={() => handleChange('difficulty', diff)}
                                            className={`px-4 py-3 rounded-2xl font-bold border transition-all ${formData.difficulty === diff ? 'bg-primary border-primary text-primary-foreground shadow-sm' : 'bg-card border-border hover:bg-muted text-muted-foreground'}`}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <Palette className="h-4 w-4" /> Custom Color
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handleChange('color', color)}
                                        className={`w-8 h-8 rounded-full border-4 transition-all ${formData.color === color ? 'scale-125 border-card shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Numeric Targets and Frequency */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div className="space-y-2 md:col-span-1">
                                <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Target className="h-4 w-4" /> Target Value
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.goal_value}
                                    onChange={e => handleChange('goal_value', parseInt(e.target.value))}
                                    className="w-full bg-muted/50 border-2 border-transparent focus:border-primary/30 rounded-2xl px-5 py-3 font-bold outline-none transition-all"
                                />
                            </div>

                            <div className="md:col-span-2 flex items-center gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Frequency</label>
                                    <div className="flex bg-muted rounded-2xl p-1 border">
                                        {FREQUENCIES.map(freq => (
                                            <button
                                                key={freq}
                                                type="button"
                                                onClick={() => handleChange('frequency', freq)}
                                                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${formData.frequency === freq ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground hover:bg-card/50'}`}
                                            >
                                                {freq}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => handleChange('reminder_enabled', !formData.reminder_enabled)}
                                        className={`p-3 rounded-2xl transition-all border-2 ${formData.reminder_enabled ? 'bg-primary/10 border-primary text-primary' : 'bg-muted/50 border-transparent text-muted-foreground'}`}
                                    >
                                        <Bell className={`h-6 w-6 ${formData.reminder_enabled ? 'animate-bounce' : ''}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-10">
                            <Button variant="ghost" onClick={onClose} type="button" className="px-8 font-semibold rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">Cancel</Button>
                            <Button
                                disabled={createMutation.isPending || updateMutation.isPending}
                                type="submit"
                                className="px-10 font-bold rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary-hover text-primary-foreground h-14 transition-all active:scale-95"
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
