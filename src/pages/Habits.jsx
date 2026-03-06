import React, { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/habits/HabitCard';
import CreateHabitModal from '../components/habits/CreateHabitModal';
import HabitTAI from '../components/habits/HabitTAI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, FolderOpen } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Habits = () => {
    const { habits } = useHabits();
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', 'Health', 'Productivity', 'Finance', 'Social', 'Personal'];

    const handleEdit = (habit) => {
        setSelectedHabit(habit);
        setIsModalOpen(true);
    };

    const handleModalChange = (open) => {
        setIsModalOpen(open);
        if (!open) setSelectedHabit(null);
    };

    const filteredHabits = (habits || []).filter(habit => {
        const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || habit.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">My Habits</h1>
                    <p className="text-muted-foreground mt-1">Manage and organize your self-improvement goals.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Create Habit
                </Button>
            </div>

            <HabitTAI />

            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search habits..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full sm:w-auto">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        {categories.map(c => (
                            <TabsTrigger key={c} value={c} className="capitalize">{c}</TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            {filteredHabits.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl border-muted bg-muted/20">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <FolderOpen className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No habits found</h3>
                    <p className="text-muted-foreground mt-1 max-w-sm">
                        {searchQuery || activeCategory !== 'All'
                            ? "No habits match your current filters. Try adjusting them."
                            : "You haven't created any habits yet. Start by defining your first goal!"}
                    </p>
                    {(searchQuery || activeCategory !== 'All') ? (
                        <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}>Clear Filters</Button>
                    ) : (
                        <Button className="mt-4" onClick={() => setIsModalOpen(true)}>Create Habit</Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHabits.map((habit, i) => (
                        <motion.div
                            key={habit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <HabitCard habit={habit} onEdit={handleEdit} />
                        </motion.div>
                    ))}
                </div>
            )}

            <CreateHabitModal open={isModalOpen} onOpenChange={handleModalChange} habit={selectedHabit} />
        </div>
    );
};

export default Habits;
