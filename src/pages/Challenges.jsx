import React, { useState } from 'react';
import { useChallenges } from '../hooks/useChallenges';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, Trophy, Users, Sword, Plus, ArrowRight, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChallengeCard = ({ challenge, isJoined, onJoin, onLeave, isPending }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group relative bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col h-full overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <Sword className="h-32 w-32 rotate-12" />
            </div>

            <div className="flex items-start justify-between mb-4">
                <div className="bg-primary/10 text-primary p-4 rounded-2xl group-hover:scale-110 transition-transform">
                    < Sword className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{challenge.member_count || 12} Joined</span>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-black tracking-tight mb-2 group-hover:text-primary transition-colors">{challenge.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                    {challenge.description || "Join the community in this epic quest for self-improvement and consistency."}
                </p>
            </div>

            <div className="mt-auto space-y-4">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span>Top Progress</span>
                        <span className="text-primary font-black">85%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            className="h-full bg-gradient-to-r from-primary to-purple-500"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Reward</span>
                        <span className="text-sm font-black text-warning flex items-center gap-1">
                            <Zap className="h-3 w-3 fill-warning" /> +{challenge.reward_xp || 200} XP
                        </span>
                    </div>
                    <Button
                        onClick={() => isJoined ? onLeave(challenge.id) : onJoin(challenge.id)}
                        disabled={isPending}
                        variant={isJoined ? "outline" : "default"}
                        className={`rounded-2xl font-black px-6 h-12 transition-all ${isJoined ? 'border-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive' : 'shadow-lg shadow-primary/20 hover:scale-105'}`}
                    >
                        {isJoined ? 'Leave Challenge' : 'Join Quest'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default function Challenges() {
    const { user } = useAuth();
    const { challenges, isLoading, joinMutation, leaveMutation } = useChallenges();
    const [searchQuery, setSearchQuery] = useState('');

    // In a real app, join status would come from membership data. 
    // Mocking for now based on user_id if we have memberships in challenge object or similar
    // For this UI demo, we'll track local state or assume based on list
    const isJoined = (challengeId) => false; // Stub

    const filteredChallenges = challenges.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 min-h-screen">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-[3rem] bg-card border border-border p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 shadow-sm">
                <div className="absolute -top-24 -right-24 h-96 w-96 bg-primary/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                        <Trophy className="h-4 w-4" /> Season 1 Live
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                        Rise to the <span className="text-primary italic">Challenge.</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-xl">
                        Join epic community quests, push your limits, and climb the global leaderboards with thousands of others.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                        <Button className="h-14 px-8 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20 transition-transform hover:scale-105">
                            <Plus className="h-5 w-5" /> Create Challenge
                        </Button>
                        <div className="flex -space-x-3 items-center">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-10 w-10 rounded-full border-4 border-card bg-muted flex items-center justify-center text-[10px] overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                </div>
                            ))}
                            <div className="pl-6 text-sm font-bold text-muted-foreground">+2.4k active</div>
                        </div>
                    </div>
                </div>

                <div className="relative w-full md:w-1/3 flex justify-center">
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0], y: [0, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[10rem] md:text-[12rem] filter drop-shadow-2xl select-none"
                    >
                        🏆
                    </motion.div>
                </div>
            </div>

            {/* Search and Grid Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Active Quests
                        <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">{filteredChallenges.length} Total</span>
                    </h2>
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Explore quests by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 w-full bg-card border-2 border-border focus:border-primary/30 rounded-2xl pl-12 pr-6 font-bold outline-none transition-all shadow-sm group-hover:border-primary/10"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-80 bg-muted animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : filteredChallenges.length === 0 ? (
                    <div className="py-24 text-center space-y-6 bg-muted/30 border-2 border-dashed rounded-[3rem]">
                        <div className="text-6xl">🔍</div>
                        <div>
                            <h3 className="text-2xl font-black">No Quests Found</h3>
                            <p className="text-muted-foreground font-medium">Try searching for something else or create your own!</p>
                        </div>
                        <Button variant="outline" className="rounded-2xl font-bold h-12" onClick={() => setSearchQuery('')}>Clear Search</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                        <AnimatePresence>
                            {filteredChallenges.map(challenge => (
                                <ChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    isJoined={isJoined(challenge.id)}
                                    onJoin={joinMutation.mutate}
                                    onLeave={leaveMutation.mutate}
                                    isPending={joinMutation.isPending || leaveMutation.isPending}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Leaderboard Teaser Section */}
            <div className="relative rounded-[3rem] bg-gradient-to-br from-primary to-purple-600 p-1 bg-[length:200%_200%] animate-gradient shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                <div className="bg-card rounded-[2.9rem] p-10 md:p-14 flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-primary/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />

                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-inner">
                        < Trophy className="h-10 w-10" />
                    </div>
                    <div className="max-w-2xl space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-loose">The Arena is Coming.</h2>
                        <p className="text-lg text-muted-foreground font-medium">
                            Compete globally, earn seasonal rewards, and cement your legacy as a HabitForge master.
                            Global leaderboards and hall of fame launching soon.
                        </p>
                    </div>
                    <Button variant="ghost" className="h-14 px-8 rounded-2xl font-black group/btn hover:bg-primary/5">
                        Learn about Pro Leagues <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
