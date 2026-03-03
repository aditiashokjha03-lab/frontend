import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useHabits } from '../../hooks/useHabits';

const CreateHabitModal = ({ open, onOpenChange, habit = null }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Health');
    const [difficulty, setDifficulty] = useState('medium');
    const [color, setColor] = useState('#3b82f6');
    const [icon, setIcon] = useState('⭐');
    const [goalTarget, setGoalTarget] = useState('');
    const [goalFrequency, setGoalFrequency] = useState('daily');
    const [reminderEnabled, setReminderEnabled] = useState(false);

    const { createHabit, updateHabit, isCreating } = useHabits();

    useEffect(() => {
        if (habit && open) {
            setName(habit.name || '');
            setCategory(habit.category || 'Health');
            setDifficulty(habit.difficulty || 'medium');
            setColor(habit.color || '#3b82f6');
            setIcon(habit.icon || '⭐');
            setGoalTarget(habit.goal_target || '');
            setGoalFrequency(habit.goal_frequency || 'daily');
            setReminderEnabled(habit.reminder_enabled || false);
        } else if (!habit && open) {
            resetForm();
        }
    }, [habit, open]);

    const handleSave = () => {
        if (!name.trim()) return;

        const habitData = {
            name,
            category,
            difficulty,
            color,
            icon,
            frequency: 'daily',
            goal_target: goalTarget ? parseFloat(goalTarget) : null,
            goal_frequency: goalFrequency,
            reminder_enabled: reminderEnabled
        };

        if (habit?.id) {
            updateHabit({ id: habit.id, data: habitData });
        } else {
            createHabit(habitData);
        }

        onOpenChange(false);
    };

    const resetForm = () => {
        setName('');
        setCategory('Health');
        setDifficulty('medium');
        setColor('#3b82f6');
        setIcon('⭐');
        setGoalTarget('');
        setGoalFrequency('daily');
        setReminderEnabled(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" placeholder="e.g. Read 10 pages" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="icon" className="text-right">Icon</Label>
                        <Input id="icon" value={icon} onChange={e => setIcon(e.target.value)} className="col-span-3" maxLength={2} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="color" className="text-right">Color</Label>
                        <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="col-span-3 h-10 p-1" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Fitness">Fitness</SelectItem>
                                <SelectItem value="Productivity">Productivity</SelectItem>
                                <SelectItem value="Learning">Learning</SelectItem>
                                <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                                <SelectItem value="Finance">Finance</SelectItem>
                                <SelectItem value="Social">Social</SelectItem>
                                <SelectItem value="Personal">Personal</SelectItem>
                                <SelectItem value="Custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Difficulty</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <h4 className="text-sm font-medium mb-4">Goal & Reminders</h4>
                        <div className="grid grid-cols-4 items-center gap-4 mb-4">
                            <Label htmlFor="target" className="text-right">Target</Label>
                            <Input id="target" type="number" value={goalTarget} onChange={e => setGoalTarget(e.target.value)} className="col-span-3" placeholder="Optional" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 mb-4">
                            <Label className="text-right">Frequency</Label>
                            <Select value={goalFrequency} onValueChange={setGoalFrequency}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between gap-4 px-4">
                            <Label htmlFor="reminders">Enable Reminders</Label>
                            <Switch id="reminders" checked={reminderEnabled} onCheckedChange={setReminderEnabled} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" onClick={handleSave} disabled={isCreating || !name.trim()}>
                        {habit ? 'Update Habit' : 'Save Habit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateHabitModal;
