import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, ListTodo, BarChart3, Clock, Trophy, Target, Flame, Sun, Moon, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

const NavLinks = ({ links, mobile = false, closeMenu }) => (
    <div className={mobile ? "flex flex-col space-y-2 mt-4" : "flex-1 px-4 space-y-2 mt-4"}>
        {links.map((link) => (
            <NavLink
                key={link.to}
                to={link.to}
                onClick={mobile ? closeMenu : undefined}
                aria-label={`Navigate to ${link.label}`}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
                        ? 'text-foreground bg-secondary/50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`
                }
            >
                <link.icon size={20} aria-hidden="true" />
                {link.label}
            </NavLink>
        ))}
    </div>
);

const SidebarFooter = ({ theme, toggleTheme, signOut, profile, user, closeMenu }) => (
    <div className="p-4 border-t space-y-3">
        <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-muted-foreground bg-secondary/30 hover:bg-secondary/50 rounded-lg border border-border/40 transition-all duration-200"
        >
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" aria-hidden="true" /> : <Moon className="h-3.5 w-3.5" aria-hidden="true" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
            type="button"
            onClick={signOut}
            aria-label="Sign out of your account"
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-lg border border-destructive/10 transition-all duration-200"
        >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
        </button>

        <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-lg transition-colors overflow-hidden">
            <Avatar className="w-10 h-10 border-2 border-background">
                {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">{profile?.username || user?.email}</span>
                <span className="text-xs text-muted-foreground">Level {profile?.level || 1}</span>
            </div>
        </Link>
    </div>
);

const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { isOnline } = useOffline();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/habits', icon: ListTodo, label: 'Habits ✨' },
        { to: '/timer', icon: Clock, label: 'Focus' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/challenges', icon: Target, label: 'Challenges' },
        { to: '/goals', icon: Target, label: 'Goals' },
        { to: '/achievements', icon: Trophy, label: 'Trophies' },
    ];

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            {/* Desktop Vertical Nav */}
            <nav className="hidden md:flex flex-col w-64 bg-background border-r border-border h-screen fixed left-0 top-0 overflow-y-auto z-40">
                <div className="p-8 pb-4">
                    <Link to="/dashboard" aria-label="HabitForge Dashboard" className="flex items-center gap-3 font-semibold text-lg tracking-tight text-foreground">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted p-1 shadow-sm overflow-hidden">
                            <img src="/logo.png" alt="HabitForge Logo" className="w-full h-full object-contain" loading="lazy" />
                        </div>
                        HabitForge
                    </Link>
                </div>

                <div className="px-6 py-2">
                    {!isOnline && (
                        <div className="text-[10px] font-black uppercase tracking-widest text-warning bg-warning/10 px-2.5 py-1 rounded inline-flex items-center gap-1.5 mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse"></span> Offline Mode
                        </div>
                    )}
                </div>

                <NavLinks links={links} closeMenu={closeMenu} />
                <div className="mt-auto">
                    <SidebarFooter
                        theme={theme}
                        toggleTheme={toggleTheme}
                        signOut={signOut}
                        profile={profile}
                        user={user}
                        closeMenu={closeMenu}
                    />
                </div>
            </nav>

            {/* Mobile Header (with hamburger) */}
            <div className="md:hidden flex items-center justify-between p-4 bg-background border-b border-border sticky top-0 z-40">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted overflow-hidden border border-border">
                        <img src="/logo.png" alt="HabitForge Logo" className="w-full h-full object-contain" />
                    </div>
                    HabitForge
                </Link>

                <div className="flex items-center gap-2">
                    {!isOnline && (
                        <span className="w-2.5 h-2.5 rounded-full bg-warning animate-pulse mr-2" title="Offline"></span>
                    )}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-foreground hover:bg-muted rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.nav
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-card border-r shadow-2xl z-50 md:hidden flex flex-col pt-4 overflow-y-auto"
                        >
                            <div className="px-6 pb-4">
                                <Link to="/dashboard" onClick={closeMenu} className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted overflow-hidden border border-border">
                                        <img src="/logo.png" alt="HabitForge Logo" className="w-full h-full object-contain" />
                                    </div>
                                    HabitForge
                                </Link>
                                {!isOnline && (
                                    <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-warning bg-warning/10 px-2.5 py-1 rounded inline-flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-warning"></span> Offline Mode
                                    </div>
                                )}
                            </div>

                            <NavLinks links={links} mobile={true} closeMenu={closeMenu} />

                            <div className="mt-auto">
                                <SidebarFooter
                                    theme={theme}
                                    toggleTheme={toggleTheme}
                                    signOut={signOut}
                                    profile={profile}
                                    user={user}
                                    closeMenu={closeMenu}
                                />
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
