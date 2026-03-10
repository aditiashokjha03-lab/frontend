import { useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/habits/HabitCard';
import CreateHabitModal from '../components/habits/CreateHabitModal';
import HabiTAIPanel from '../components/habits/HabiTAIPanel';

export default function Habits() {
    const { query } = useHabits();
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">

            {/* Left Column - Habit Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Your Habits</h1>
                        <p className="text-sm text-muted-foreground mt-1 font-medium">Manage and track your long-term goals.</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm hover:bg-primary-hover transition-all active:scale-95"
                    >
                        + New Habit
                    </button>
                </div>

                {query.isLoading ? (
                    <p>Loading your goals...</p>
                ) : query.data?.length === 0 ? (
                    <div className="border-2 border-dashed rounded-xl p-8 text-center text-muted-foreground">
                        No habits yet. Click + New Habit or use HabiTAI to build a plan.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {query.data?.map(habit => (
                            <HabitCard key={habit.id} habit={habit} />
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column - HabiTAI */}
            <div className="w-full md:w-96 shrink-0">
                <HabiTAIPanel />
            </div>

            <CreateHabitModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
