import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, ListTodo, BarChart3, Clock, Trophy, Flame, Sun, Moon, LogOut, Menu, X, Target } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { isOnline } = useOffline();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { to: '/dashboard', icon: Home, label: 'Dashboard' },
        { to: '/habits', icon: ListTodo, label: 'Habits' },
        { to: '/goals', icon: Target, label: 'Goals' },
        { to: '/analytics', icon: BarChart3, label: 'Analytics' },
        { to: '/timer', icon: Clock, label: 'Focus' },
        { to: '/challenges', icon: Trophy, label: 'Challenges' },
    ];

    const closeMenu = () => setIsMenuOpen(false);

    const NavLinks = ({ mobile = false }) => (
        <div className={mobile ? "flex flex-col space-y-2 mt-4" : "flex-1 px-4 space-y-2 mt-4"}>
            {links.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={mobile ? closeMenu : undefined}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }`
                    }
                >
                    <link.icon size={20} />
                    {link.label}
                </NavLink>
            ))}
        </div>
    );

    const SidebarFooter = () => (
        <div className="p-4 border-t space-y-3">
            <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-muted-foreground bg-muted/50 hover:bg-muted rounded-lg border border-border/60 transition-colors"
            >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            <button
                type="button"
                onClick={signOut}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-destructive bg-destructive/5 hover:bg-destructive/15 rounded-lg border border-destructive/20 transition-colors"
            >
                <LogOut className="h-4 w-4" />
                Sign out
            </button>

            <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3 px-2 py-2 hover:bg-muted rounded-lg transition-colors overflow-hidden">
                <Avatar className="w-10 h-10 border-2 border-background">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold truncate">{profile?.username || user?.email}</span>
                    <span className="text-xs text-muted-foreground">Level {profile?.level || 1}</span>
                </div>
            </Link>
        </div>
    );

    return (
        <>
            {/* Desktop Vertical Nav */}
            <nav className="hidden md:flex flex-col w-64 bg-card border-r h-screen fixed left-0 top-0 overflow-y-auto z-40 shadow-sm">
                <div className="p-6">
                    <Link to="/dashboard" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground">
                            <Flame className="h-4 w-4 text-background" />
                        </div>
                        HabitForge
                    </Link>
                </div>

                <NavLinks />
                <SidebarFooter />
            </nav>

            {/* Mobile Header (with hamburger) */}
            <div className="md:hidden flex items-center justify-between p-4 bg-card border-b sticky top-0 z-40">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground">
                        <Flame className="h-3.5 w-3.5 text-background" />
                    </div>
                    HabitForge
                </Link>

                <div className="flex items-center gap-2">
                    {!isOnline && (
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse mr-2" title="Offline"></span>
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
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground">
                                        <Flame className="h-4 w-4 text-background" />
                                    </div>
                                    HabitForge
                                </Link>
                                {!isOnline && (
                                    <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded inline-flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Offline Mode
                                    </div>
                                )}
                            </div>

                            <NavLinks mobile={true} />

                            <div className="mt-auto">
                                <SidebarFooter />
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
