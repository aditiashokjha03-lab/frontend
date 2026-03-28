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
        <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-4rem)] space-y-12 pb-20">
            <header className="relative bg-card border border-border rounded-[3.5rem] p-12 md:p-16 shadow-2xl shadow-black/5 overflow-hidden group">
                {/* Visual Background Decoration */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full -ml-16 -mb-16 blur-[80px]" />

                <div className="relative flex flex-col items-center sm:flex-row gap-8">
                    {/* Avatar Customization Section */}
                    <div className="relative group/avatar">
                        <Avatar className="w-48 h-48 ring-[12px] ring-secondary/50 shadow-2xl transition-all duration-700 group-hover/avatar:scale-[1.02] group-hover/avatar:rotate-1">
                            <AvatarImage src={currentAvatarUrl} alt={username} className="object-cover" />
                            <AvatarFallback className="text-5xl font-black bg-secondary text-foreground uppercase tracking-tighter">
                                {username.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        {/* Edit Button Overlay */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                            className="absolute bottom-4 right-4 p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl opacity-0 group-hover/avatar:opacity-100 transition-all duration-500 z-10 border-[6px] border-card"
                        >
                            <Edit className="w-5 h-5" />
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

                    <div className="text-center sm:text-left flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <h2 className="text-5xl font-black text-foreground tracking-tighter">@{username}</h2>
                            <div className="inline-flex px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20">
                                Level {profile?.level || 1}
                            </div>
                        </div>
                        <p className="text-sm font-black text-muted-foreground opacity-30 tracking-widest uppercase pb-6">{user?.email}</p>
 
                        <div className="flex gap-12 justify-center sm:justify-start pt-4">
                            <div className="text-center sm:text-left">
                                <span className="block font-black text-4xl text-foreground tracking-tighter">{profile?.xp || 0}</span>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] opacity-40">Exp Points</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <span className="block font-black text-4xl text-amber-500 tracking-tighter">{profile?.longest_streak || 0}</span>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] opacity-40">Max Streak</span>
                            </div>
                            <div className="text-center sm:text-left">
                                <span className="block font-black text-4xl text-emerald-500 tracking-tighter">{profile?.level || 1}</span>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] opacity-40">Milestone</span>
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
                <div className="bg-card border border-border rounded-[3rem] p-12 shadow-2xl shadow-black/5 space-y-10">
                    <h3 className="text-2xl font-black text-foreground tracking-tighter text-center">
                        System Access
                    </h3>
                    <div className="p-8 bg-secondary/10 rounded-2xl border border-border space-y-8 flex flex-col items-center">
                        <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center border border-border opacity-40">
                            <User className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground/30 text-center uppercase tracking-[0.25em] leading-relaxed max-w-[200px]">
                            Secure identity session verified for persistence.
                        </p>
                        <Button
                            variant="destructive"
                            onClick={signOut}
                            className="w-full rounded-xl h-14 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98]"
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
