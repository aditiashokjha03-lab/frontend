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
            <div className="flex-1 space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-foreground">Your Habits</h1>
                        <p className="text-muted-foreground mt-2 font-medium text-sm opacity-60">Manage your daily systems and professional growth.</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
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
                    <div className="bg-secondary/10 border border-border rounded-[2rem] p-16 text-center text-muted-foreground transition-all">
                        <div className="w-16 h-16 bg-secondary/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl border border-border opacity-50">🌱</div>
                        <h3 className="text-xl font-black tracking-tighter text-foreground mb-2">No active habits</h3>
                        <p className="text-sm font-medium opacity-60 max-w-xs mx-auto mb-8">Click the button above or consult HabiTAI to start your journey.</p>
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
