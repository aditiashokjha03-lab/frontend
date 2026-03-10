import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Camera, Check, LogOut, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';

const AVATAR_STYLES = [
    'adventurer',
    'avataaars',
    'fun-emoji',
    'bottts',
    'lorelei',
    'thumbs'
];

export default function Profile() {
    const { user, profile, signOut, updateProfile } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    const [updating, setUpdating] = useState(false);

    const username = profile?.username || user?.email?.split('@')[0] || 'User';
    const currentAvatarUrl = profile?.avatar_url;

    const handleStyleSelect = async (style) => {
        setUpdating(true);
        const newAvatarUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${username}`;
        try {
            await updateProfile({ avatar_url: newAvatarUrl });
            setIsEditingAvatar(false);
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-4rem)] space-y-8 pb-12">
            <header className="relative bg-card border border-border rounded-[40px] p-10 shadow-xl shadow-primary/5 overflow-hidden group">
                {/* Visual Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-muted rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-muted rounded-full -ml-16 -mb-16 blur-2xl" />

                <div className="relative flex flex-col items-center sm:flex-row gap-8">
                    {/* Avatar Customization Section */}
                    <div className="relative group/avatar">
                        <Avatar className="w-40 h-40 ring-8 ring-muted shadow-2xl transition-all duration-500 group-hover/avatar:scale-105 group-hover/avatar:rotate-2">
                            <AvatarImage src={currentAvatarUrl} alt={username} />
                            <AvatarFallback className="text-4xl font-black bg-muted text-foreground uppercase">
                                {username.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Edit Button Overlay */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                            className="absolute bottom-2 right-2 p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 z-10 border-4 border-card"
                        >
                            <Edit className="w-4 h-4" />
                        </motion.button>

                        {/* Updating Overlay */}
                        {updating && (
                            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] rounded-full flex items-center justify-center z-20">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                                />
                            </div>
                        )}
                    </div>

                    <div className="text-center sm:text-left flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                            <h2 className="text-4xl font-black text-foreground tracking-tight">@{username}</h2>
                            <div className="inline-flex px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                Rank {profile?.level || 1}
                            </div>
                        </div>
                        <p className="text-sm font-bold text-muted-foreground mb-8">{user?.email}</p>

                        <div className="flex gap-10 justify-center sm:justify-start">
                            <div className="text-center">
                                <span className="block font-black text-3xl text-foreground">{profile?.xp || 0}</span>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Exp Points</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-black text-3xl text-warning">{profile?.longest_streak || 0}</span>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Max Streak</span>
                            </div>
                            <div className="text-center">
                                <span className="block font-black text-3xl text-success">{profile?.level || 1}</span>
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Milestone</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Avatar Style Selection Panel */}
                <AnimatePresence>
                    {isEditingAvatar && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-8 pt-8 border-t overflow-hidden"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 text-center sm:text-left flex items-center gap-2">
                                <Camera className="w-4 h-4" /> Pick an AI Style
                            </h3>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 p-1">
                                {AVATAR_STYLES.map((style) => {
                                    const styleUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${username}`;
                                    const isSelected = currentAvatarUrl === styleUrl;

                                    return (
                                        <motion.button
                                            key={style}
                                            whileHover={{ scale: 1.1, translateY: -4 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleStyleSelect(style)}
                                            className={`relative w-16 h-16 rounded-full border-2 transition-all p-0.5 ${isSelected
                                                ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-card shadow-lg shadow-primary/20'
                                                : 'border-transparent hover:border-primary/40 shadow-sm'
                                                }`}
                                        >
                                            <img
                                                src={styleUrl}
                                                alt={style}
                                                className="w-full h-full rounded-full bg-muted"
                                            />
                                            {isSelected && (
                                                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 shadow-md">
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                </div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="max-w-md mx-auto">
                {/* Account Actions */}
                <div className="bg-card border border-border rounded-[32px] p-10 shadow-sm space-y-8">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                        System & Access
                    </h3>
                    <div className="p-6 bg-muted/50 rounded-2xl border border-border space-y-6">
                        <p className="text-xs font-bold text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
                            Secured session for {user?.email}
                        </p>
                        <Button
                            variant="destructive"
                            onClick={signOut}
                            className="w-full rounded-2xl h-14 shadow-lg shadow-destructive/20 font-bold text-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all active:scale-95"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Terminate Session
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
