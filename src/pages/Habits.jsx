import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/habits/HabitCard';
import CreateHabitModal from '../components/habits/CreateHabitModal';
import HabiTAIPanel from '../components/habits/HabiTAIPanel';

export default function Habits() {
    const { query } = useHabits();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-screen">

            {/* Left Column - Habit Grid */}
            <div className="flex-1 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Your Habits</h1>
                        <p className="text-muted-foreground mt-1 font-medium">Manage and track your daily system for success.</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 whitespace-nowrap"
                    >
                        + New Habit
                    </button>
                </div>

                {query.isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-card animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : query.data?.length === 0 ? (
                    <div className="border-2 border-dashed border-border rounded-3xl p-12 text-center text-muted-foreground bg-card/50">
                        <p className="text-lg font-bold">No habits yet.</p>
                        <p className="text-sm">Click + New Habit or use HabiTAI to build a plan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {query.data?.map(habit => (
                            <HabitCard key={habit.id} habit={habit} />
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column - HabiTAI */}
            <div className="w-full lg:w-[400px] shrink-0">
                <div className="sticky top-8 space-y-6">
                    <HabiTAIPanel />
                </div>
            </div>

            <CreateHabitModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
