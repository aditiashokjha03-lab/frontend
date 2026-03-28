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
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-border">
                <div className="space-y-3">
                    <h1 className="text-4xl font-black tracking-tighter lg:text-5xl text-foreground">
                        My Goals
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium opacity-60 max-w-xl">
                        Design your long-term objectives and track your evolution to mastery. Every milestone counts towards your legacy.
                    </p>
                </div>
                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="w-full md:w-auto rounded-xl bg-primary text-primary-foreground h-14 px-8 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    New Objective
                </Button>
            </header>

            {!goals?.length ? (
                <div className="flex flex-col items-center justify-center py-24 bg-secondary/10 border border-border rounded-[3.5rem] space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] -z-10" />
                    <div className="p-8 bg-secondary/50 rounded-3xl border border-border opacity-40">
                        <Target className="w-12 h-12 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black tracking-tighter">No objectives defined</h3>
                        <p className="text-sm text-muted-foreground font-medium opacity-60 max-w-xs mx-auto">
                            Start your professional transformation by defining your first long-term objective.
                        </p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px]">
                        Initialize First Goal
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
                                className="group bg-card border border-border rounded-[2.5rem] p-10 transition-all duration-500 hover:border-border shadow-2xl shadow-black/5 flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -z-10 group-hover:bg-primary/10 transition-all duration-500" />
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border border-border ${goal.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                                            goal.status === 'failed' ? 'bg-rose-500/10 text-rose-500' :
                                                'bg-primary/10 text-primary'
                                        }`}>
                                        {goal.status}
                                    </div>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-20 hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
 
                                <h3 className="text-2xl font-black tracking-tighter truncate group-hover:text-primary transition-colors">
                                    {goal.title}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 mt-3 mb-8 line-clamp-2 leading-relaxed">
                                    {goal.description}
                                </p>
 
                                <div className="mt-auto space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                                            <span>Evolution</span>
                                            <span className="text-primary opacity-100">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden border border-border">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className={`h-full shadow-[0_0_15px_rgba(37,99,235,0.3)] ${goal.status === 'completed' ? 'bg-emerald-500' : 'bg-primary'
                                                    }`}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest opacity-30 mt-2">
                                            <span>{goal.current_value} {goal.unit}</span>
                                            <span>Target: {goal.target_value} {goal.unit}</span>
                                        </div>
                                    </div>
 
                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-30 pt-6 border-t border-border">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Deadline: {new Date(goal.end_date).toLocaleDateString()}</span>
                                    </div>
 
                                    {goal.status === 'active' && (
                                        <Button
                                            variant="secondary"
                                            className="w-full mt-4 h-12 rounded-xl bg-secondary/50 border border-border font-black uppercase tracking-[0.2em] text-[9px] hover:bg-secondary transition-all active:scale-[0.98]"
                                            onClick={() => {
                                                setSelectedGoal(goal);
                                                setIsUpdateOpen(true);
                                            }}
                                        >
                                            <TrendingUp className="w-4 h-4 mr-2" />
                                            Record Progress
                                        </Button>
                                    )}
 
                                    {goal.status === 'completed' && (
                                        <div className="flex items-center justify-center gap-2 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mt-4">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Mission Accomplished
                                        </div>
                                    )}
 
                                    {goal.status === 'failed' && (
                                        <div className="flex items-center justify-center gap-2 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mt-4">
                                            <AlertCircle className="w-4 h-4" />
                                            Mission Terminated
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
