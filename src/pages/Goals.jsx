import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, TrendingUp, Calendar, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useGoals } from '../hooks/useGoals';

const Goals = () => {
    const { goals, isLoading, createGoal, updateGoal, deleteGoal } = useGoals();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({
        title: '',
        description: '',
        target_value: 0,
        unit: '',
        end_date: ''
    });

    const handleCreateGoal = (e) => {
        e.preventDefault();
        createGoal(newGoal, {
            onSuccess: () => {
                setIsDialogOpen(false);
                setNewGoal({ title: '', description: '', target_value: 0, unit: '', end_date: '' });
            }
        });
    };

    const handleDeleteGoal = (id) => {
        deleteGoal(id);
    };

    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [progressValue, setProgressValue] = useState('');

    const openProgressDialog = (goal) => {
        setSelectedGoal(goal);
        setProgressValue('');
        setProgressDialogOpen(true);
    };

    const handleUpdateProgressSubmit = (e) => {
        e.preventDefault();
        if (!progressValue || isNaN(progressValue)) return;

        const increment = parseFloat(progressValue);
        const newValue = selectedGoal.current_value + increment;
        const status = newValue >= selectedGoal.target_value ? 'completed' : 'active';

        updateGoal({ id: selectedGoal.id, data: { current_value: newValue, status } }, {
            onSuccess: () => setProgressDialogOpen(false)
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Goals</h1>
                    <p className="text-muted-foreground mt-1">Set long-term targets and track your journey.</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 shadow-sm">
                            <Plus size={18} /> Add New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create a New Goal</DialogTitle>
                            <DialogDescription>
                                Break down your long-term ambitions into measurable targets.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateGoal} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Goal Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Read 50 books"
                                    value={newGoal.title}
                                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Input
                                    id="description"
                                    placeholder="Why is this goal important?"
                                    value={newGoal.description}
                                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="target">Target Value</Label>
                                    <Input
                                        id="target"
                                        type="number"
                                        placeholder="50"
                                        value={newGoal.target_value}
                                        onChange={(e) => setNewGoal({ ...newGoal, target_value: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Input
                                        id="unit"
                                        placeholder="books, miles, etc."
                                        value={newGoal.unit}
                                        onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Target End Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={newGoal.end_date}
                                    onChange={(e) => setNewGoal({ ...newGoal, end_date: e.target.value })}
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" className="w-full">Create Goal</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <Card key={n} className="h-64 animate-pulse bg-muted/20" />
                    ))}
                </div>
            ) : goals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-muted p-4 rounded-full mb-4">
                        <Target size={48} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">No goals yet</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                        Start your journey by setting your first long-term goal.
                    </p>
                    <Button variant="outline" className="mt-6" onClick={() => setIsDialogOpen(true)}>
                        Create your first goal
                    </Button>
                </div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {goals.map((goal) => (
                        <motion.div key={goal.id} variants={itemVariants}>
                            <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-border/60">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <Badge
                                            variant={goal.status === 'completed' ? 'success' : goal.status === 'failed' ? 'destructive' : 'secondary'}
                                            className="mb-2 capitalize"
                                        >
                                            {goal.status}
                                        </Badge>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleDeleteGoal(goal.id)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-xl line-clamp-1">{goal.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                                        {goal.description || 'No description provided.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <TrendingUp size={14} className="text-primary" />
                                                Progress
                                            </span>
                                            <span>
                                                {Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))}%
                                            </span>
                                        </div>
                                        <Progress value={(goal.current_value / goal.target_value) * 100} className="h-2" />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{goal.current_value} {goal.unit}</span>
                                            <span>Goal: {goal.target_value} {goal.unit}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar size={14} />
                                        <span>Target Date: {new Date(goal.end_date).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    {goal.status === 'active' ? (
                                        <Button
                                            className="w-full gap-2 border-border/40"
                                            variant="outline"
                                            onClick={() => openProgressDialog(goal)}
                                        >
                                            Update Progress
                                        </Button>
                                    ) : goal.status === 'completed' ? (
                                        <div className="w-full flex items-center justify-center gap-2 py-2 text-green-600 font-medium text-sm bg-green-50 rounded-md">
                                            <CheckCircle2 size={18} />
                                            Goal Achieved!
                                        </div>
                                    ) : (
                                        <div className="w-full flex items-center justify-center gap-2 py-2 text-destructive font-medium text-sm bg-destructive/5 rounded-md">
                                            <AlertCircle size={18} />
                                            Goal Missed
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            <Dialog open={progressDialogOpen} onOpenChange={setProgressDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update Progress</DialogTitle>
                        <DialogDescription>
                            {selectedGoal ? `Add ${selectedGoal.unit} to your progress for "${selectedGoal.title}".` : 'Update your goal progress.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateProgressSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="progress">Amount to add</Label>
                            <Input
                                id="progress"
                                type="number"
                                placeholder="Enter value"
                                value={progressValue}
                                onChange={(e) => setProgressValue(e.target.value)}
                                min="0"
                                step="any"
                                required
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setProgressDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Goals;
