import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBadges } from '../hooks/useBadges';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Award, Share2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
    const { profile, user, signOut, updateProfile } = useAuth();
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const { badges, isLoading: badgesLoading, checkAndUnlockBadges } = useBadges();
    const username = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';

    React.useEffect(() => {
        if (user?.id) {
            checkAndUnlockBadges(user.id);
        }
    }, [user, checkAndUnlockBadges]);

    const AVATAR_STYLES = ['adventurer', 'avataaars', 'fun-emoji', 'bottts', 'lorelei', 'thumbs'];

    const handleSignOut = async () => {
        await signOut();
        toast.success('Logged out successfully');
    };

    const handleShare = async () => {
        const shareUsername = profile?.username || user?.email?.split('@')[0] || 'user';
        const url = `${window.location.origin}/u/${shareUsername}`;
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Profile URL copied to clipboard!', { icon: <Share2 size={16} /> });
        } catch {
            toast.error('Failed to copy URL');
        }
    };

    const handleStyleChange = async (style) => {
        let seed = profile?.username || user?.email?.split('@')[0] || 'default';
        if (profile?.avatar_url && profile.avatar_url.includes('dicebear.com')) {
            try {
                const urlObj = new URL(profile.avatar_url);
                const querySeed = urlObj.searchParams.get('seed');
                if (querySeed) seed = querySeed;
            } catch {}
        }
        const newUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;

        await updateProfile({ avatar_url: newUrl });
        setIsEditingAvatar(false);
        toast.success('Avatar style updated!');
    };

    let currentSeed = profile?.username || user?.email?.split('@')[0] || 'default';
    let currentStyle = 'adventurer';
    if (profile?.avatar_url && profile.avatar_url.includes('dicebear.com')) {
        try {
            const urlObj = new URL(profile.avatar_url);
            const querySeed = urlObj.searchParams.get('seed');
            if (querySeed) currentSeed = querySeed;
            const match = profile.avatar_url.match(/9\.x\/([^/]+)\/svg/);
            if (match) currentStyle = match[1];
        } catch {}
    }

    const xp = profile?.xp || 0;
    const unlockedBadges = {
        firstStep: xp >= 10,
        habitBuilder: xp >= 100,
        levelUp: xp >= 500
    };

    return (
        <div className="container py-8 max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-card p-8 rounded-2xl border shadow-sm">
                <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-background shadow-md">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                            {username.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <button
                        onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Edit2 size={16} />
                    </button>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold">{username}</h1>
                        <p className="text-muted-foreground">{user?.email}</p>
                        <p className="text-muted-foreground text-lg mb-4">Level {profile?.level || 1} - {profile?.xp || 0} XP</p>
                        <div className="flex gap-2 justify-center md:justify-start">
                            <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Share Profile Card</Button>
                            <Button variant="destructive" onClick={handleSignOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
                        </div>
                    </div>
                    {isEditingAvatar && (
                        <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm font-medium mb-3">Choose Avatar Style:</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                {AVATAR_STYLES.map(style => {
                                    const previewUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${currentSeed}`;
                                    const isSelected = style === currentStyle;
                                    return (
                                        <button
                                            key={style}
                                            onClick={() => handleStyleChange(style)}
                                            className={`relative w-14 h-14 rounded-full overflow-hidden transition-all bg-background border-2 ${isSelected ? 'border-primary ring-4 ring-primary/20 scale-110 shadow-lg z-10' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105 hover:shadow-md'} hover:rotate-3`}
                                            title={style}
                                        >
                                            <img src={previewUrl} alt={style} className="w-full h-full object-cover p-1" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <h2 className="text-2xl font-bold flex items-center gap-2 mt-12 mb-6">
                <Award className="text-amber-500" /> Earned Badges
            </h2>

            {badgesLoading ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {badges.map((badge) => {
                        const badgeName = String(badge.name || badge.title || '').trim();
                        const badgeKey = String(badge.key || '').trim();

                        let isUnlocked = false;
                        if (badgeName === 'First Step' || badgeKey === 'first_habit') {
                            isUnlocked = unlockedBadges.firstStep;
                        } else if (badgeName === 'Habit Builder' || badgeKey === 'habits_10') {
                            isUnlocked = unlockedBadges.habitBuilder;
                        } else if (badgeName === 'Level Up!' || badgeKey === 'level_up') {
                            isUnlocked = unlockedBadges.levelUp;
                        } else {
                            isUnlocked = false;
                        }

                        return (
                            <Card
                                key={badge.id}
                                className={`relative flex flex-col items-center justify-center p-4 text-center aspect-square transition-all duration-500 ${isUnlocked ? 'border-primary shadow-lg bg-card ring-2 ring-primary/20 scale-100 opacity-100 grayscale-0 animate-in zoom-in-95' : 'opacity-60 grayscale bg-muted/50 border-dashed'}`}
                            >
                                {badge.status === 'unlocking_soon' && !isUnlocked && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap animate-pulse">
                                        Unlocking Soon
                                    </div>
                                )}
                                {isUnlocked && (
                                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-sm animate-bounce">
                                        <Award size={12} />
                                    </div>
                                )}
                                <div className={`text-3xl mb-2 transition-transform duration-500 ${isUnlocked ? 'scale-110' : 'scale-100'}`}>
                                    {badge.icon || '[Badge]'}
                                </div>
                                <span className={`text-sm font-bold ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {badge.name || badge.title}
                                </span>
                                <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
                                    {badge.description || badge.condition}
                                </span>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Profile;
