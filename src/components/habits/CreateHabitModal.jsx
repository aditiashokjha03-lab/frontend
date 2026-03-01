import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHabits } from '../../hooks/useHabits';

const CreateHabitModal = ({ open, onOpenChange }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Health');
    const [difficulty, setDifficulty] = useState('medium');
    const [color, setColor] = useState('#3b82f6');
    const [icon, setIcon] = useState('⭐');

    const { createHabit, isCreating } = useHabits();

    const handleSave = () => {
        if (!name.trim()) return;
        createHabit({
            name,
            category,
            difficulty,
            color,
            icon,
            frequency: 'daily'
        });
        onOpenChange(false);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setCategory('Health');
        setDifficulty('medium');
        setColor('#3b82f6');
        setIcon('⭐');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create New Habit</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                                <SelectItem value="Learning">Learning</SelectItem>
                                <SelectItem value="Mindfulness">Mindfulness</SelectItem>
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
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="button" onClick={handleSave} disabled={isCreating || !name.trim()}>Save Habit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateHabitModal;
