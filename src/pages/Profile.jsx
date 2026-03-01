import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings, Award, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
    const { profile, user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
        toast.success('Logged out successfully');
    };

    const handleShare = () => {
        // Scaffold implementation for canvas social share
        toast.success('Share card generated! (Placeholder)', { icon: <Share2 size={16} /> });
    };

    return (
        <div className="container py-8 max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-card p-8 rounded-2xl border shadow-sm">
                <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{profile?.username || user?.email}</h1>
                    <p className="text-muted-foreground text-lg mb-4">Level {profile?.level || 1} • {profile?.xp || 0} XP</p>
                    <div className="flex gap-2 justify-center md:justify-start">
                        <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share Profile Card</Button>
                        <Button variant="secondary"><Settings className="mr-2 h-4 w-4" /> Preferences</Button>
                        <Button variant="destructive" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold flex items-center gap-2 mt-12 mb-6">
                <Award className="text-amber-500" /> Earned Badges
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="flex flex-col items-center justify-center p-4 text-center aspect-square opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer bg-muted/50 border-dashed">
                        <div className="text-3xl mb-2">🔒</div>
                        <span className="text-xs font-semibold">Locked</span>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Profile;
