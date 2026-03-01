import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Target, Award } from 'lucide-react';
import { toast } from 'sonner';

const ChallengeCard = ({ challenge, onToggleJoin }) => (
    <Card className="hover:border-primary/50 transition-colors">
        <CardHeader>
            <CardTitle className="flex justify-between items-center text-xl">
                <span>{challenge.title}</span>
                <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                    <Users size={16} /> {challenge.members}
                </span>
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm line-clamp-2">{challenge.description}</p>

            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold">
                    <span>Top Participant</span>
                    <span className="text-primary">{challenge.topProgress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${challenge.topProgress}%` }} />
                </div>
            </div>

            <Button
                className="w-full mt-2"
                variant={challenge.joined ? 'secondary' : 'default'}
                type="button"
                onClick={() => onToggleJoin(challenge.id)}
            >
                {challenge.joined ? 'Leave challenge' : 'Join challenge'}
            </Button>
        </CardContent>
    </Card>
);

const initialChallenges = [
    { id: 1, title: '75 Hard Lite', description: 'Read 10 pages, workout 30 mins, drink 2L water daily.', members: 42, topProgress: 80, joined: false },
    { id: 2, title: 'Code Every Day', description: 'At least 1 commit every single day for 30 days straight.', members: 128, topProgress: 100, joined: true },
    { id: 3, title: 'Sleep Optimization', description: 'In bed before 11 PM and no screens after 10 PM.', members: 15, topProgress: 45, joined: false },
];

const Challenges = () => {
    const [challenges, setChallenges] = useState(initialChallenges);
    const [query, setQuery] = useState('');

    const filtered = useMemo(
        () =>
            challenges.filter((c) =>
                `${c.title} ${c.description}`.toLowerCase().includes(query.toLowerCase()),
            ),
        [challenges, query],
    );

    const handleToggleJoin = (id) => {
        setChallenges((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                        ...c,
                        joined: !c.joined,
                        members: c.joined ? Math.max(0, c.members - 1) : c.members + 1,
                    }
                    : c,
            ),
        );

        const updated = challenges.find((c) => c.id === id);
        if (updated) {
            toast.success(
                updated.joined
                    ? `You left “${updated.title}”.`
                    : `You joined “${updated.title}”! Stay consistent and climb the leaderboard.`,
            );
        }
    };

    const handleCreateChallenge = () => {
        toast.info('Custom community challenges are coming soon.');
    };

    return (
        <div className="container py-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Community Challenges</h1>
                    <p className="text-muted-foreground mt-1">Join forces, compete, and forge better habits together.</p>
                </div>
                <Button className="gap-2" type="button" onClick={handleCreateChallenge}>
                    <Target className="h-4 w-4" /> Create Challenge
                </Button>
            </div>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search challenges or keywords..."
                    className="pl-9"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c) => (
                    <ChallengeCard key={c.id} challenge={c} onToggleJoin={handleToggleJoin} />
                ))}
            </div>

            <div className="mt-12 p-8 bg-muted/30 border border-dashed rounded-2xl flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                    <Award size={48} />
                </div>
                <h3 className="text-2xl font-bold">Leaderboards unlocking soon</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                    Invite friends, participate in public challenges, and climb the ranks. The top 3 participants get exclusive profile badges!
                </p>
            </div>
        </div>
    );
};

export default Challenges;
