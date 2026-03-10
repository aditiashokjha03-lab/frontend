import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Target, Trash2, Calendar, CheckCircle2,
    AlertCircle, TrendingUp, X, Loader2
} from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { Button } from '../components/ui/button';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

const Dialog = ({ isOpen, onClose, title, children }) => (
    <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="relative bg-card border shadow-lg rounded-xl w-full max-w-md p-6 overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">{title}</h2>
                        <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {children}
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

export default function Goals() {
    const { goals, isLoading, createGoal, updateGoal, deleteGoal } = useGoals();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [newProgress, setNewProgress] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target_value: '',
        unit: '',
        end_date: ''
    });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createGoal({
                ...formData,
                target_value: parseFloat(formData.target_value),
                current_value: 0,
                status: 'active'
            });
            setIsAddOpen(false);
            setFormData({ title: '', description: '', target_value: '', unit: '', end_date: '' });
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateProgress = async (e) => {
        e.preventDefault();
        if (!selectedGoal) return;

        const increment = parseFloat(newProgress);
        const nextValue = (selectedGoal.current_value || 0) + increment;
        const isCompleted = nextValue >= selectedGoal.target_value;

        try {
            await updateGoal({
                id: selectedGoal.id,
                current_value: nextValue,
                status: isCompleted ? 'completed' : 'active'
            });
            setIsUpdateOpen(false);
            setNewProgress('');
            setSelectedGoal(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
                <div className="h-10 w-48 bg-muted animate-pulse rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-muted animate-pulse rounded-2xl border-2" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen space-y-8 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        My Goals
                    </h1>
                    <p className="text-muted-foreground text-lg italic">
                        Set long-term targets and track your journey to success.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="w-full md:w-auto rounded-xl h-12 px-6 shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Goal
                </Button>
            </header>

            {!goals?.length ? (
                <div className="flex flex-col items-center justify-center py-20 bg-card/50 border-2 border-dashed rounded-3xl space-y-6">
                    <div className="p-6 bg-primary/10 rounded-full">
                        <Target className="w-12 h-12 text-primary" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold">No goals set yet</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs">
                            Start your transformation by defining your first long-term objective.
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setIsAddOpen(true)}>
                        Create First Goal
                    </Button>
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {goals.map((goal) => {
                        const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);

                        return (
                            <motion.div
                                key={goal.id}
                                variants={item}
                                className="group bg-card/50 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl shadow-sm flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${goal.status === 'completed' ? 'bg-success/10 text-success' :
                                            goal.status === 'failed' ? 'bg-destructive/10 text-destructive' :
                                                'bg-primary/10 text-primary'
                                        }`}>
                                        {goal.status}
                                    </div>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <h3 className="text-xl font-bold truncate group-hover:text-primary transition-colors">
                                    {goal.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2 mb-6 line-clamp-2 italic">
                                    {goal.description}
                                </p>

                                <div className="mt-auto space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-medium">
                                            <span>Progress</span>
                                            <span className="text-primary font-bold">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className={`h-full rounded-full ${goal.status === 'completed' ? 'bg-success' : 'bg-primary'
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[11px] text-muted-foreground">
                                            <span>{goal.current_value} {goal.unit}</span>
                                            <span>Goal: {goal.target_value} {goal.unit}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                                        <Calendar className="w-3 h-3" />
                                        <span>Target: {new Date(goal.end_date).toLocaleDateString()}</span>
                                    </div>

                                    {goal.status === 'active' && (
                                        <Button
                                            variant="secondary"
                                            className="w-full mt-2"
                                            onClick={() => {
                                                setSelectedGoal(goal);
                                                setIsUpdateOpen(true);
                                            }}
                                        >
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            Update Progress
                                        </Button>
                                    )}

                                    {goal.status === 'completed' && (
                                        <div className="flex items-center justify-center gap-2 py-2 bg-success/10 text-success rounded-lg text-sm font-bold mt-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Goal Achieved
                                        </div>
                                    )}

                                    {goal.status === 'failed' && (
                                        <div className="flex items-center justify-center gap-2 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-bold mt-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Goal Missed
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Create Goal Dialog */}
            <Dialog
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Goal"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
                        <input
                            required
                            type="text"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="e.g. Marathon Training"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe your long-term vision..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Value</label>
                            <input
                                required
                                type="number"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="42"
                                value={formData.target_value}
                                onChange={e => setFormData({ ...formData, target_value: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit</label>
                            <input
                                required
                                type="text"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="km / lbs / hours"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Target Date</label>
                        <input
                            required
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={formData.end_date}
                            onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl mt-4">Create Goal</Button>
                </form>
            </Dialog>

            {/* Update Progress Dialog */}
            <Dialog
                isOpen={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                title={`Update Progress: ${selectedGoal?.title}`}
            >
                <form onSubmit={handleUpdateProgress} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Amount to add ({selectedGoal?.unit || 'value'})
                        </label>
                        <input
                            required
                            autoFocus
                            type="number"
                            step="any"
                            className="flex h-12 w-full rounded-xl border-2 border-primary/20 bg-background px-4 py-3 text-lg font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                            placeholder="0.00"
                            value={newProgress}
                            onChange={e => setNewProgress(e.target.value)}
                        />
                        <p className="text-[10px] text-muted-foreground text-center">
                            Current Progress: {selectedGoal?.current_value} / {selectedGoal?.target_value} {selectedGoal?.unit}
                        </p>
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-xl">Add to Progress</Button>
                </form>
            </Dialog>
        </div>
    );
}
