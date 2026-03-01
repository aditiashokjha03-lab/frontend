import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Flame,
    CheckCircle2,
    TrendingUp,
    Trophy,
    Timer as TimerIcon,
    BarChart3,
    Sparkles,
    ArrowRight,
    Sun,
    Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
    );
}

const Landing = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // If already authenticated, let the app route them to dashboard via ProtectedRoute
    // by clicking through to "Sign in" or directly visiting /dashboard.

    return (
        <div className="min-h-screen bg-transparent">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                            <Flame className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">HabitForge</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground">
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" asChild className="hidden sm:inline-flex">
                            <Link to={user ? '/dashboard' : '/login'}>Sign in</Link>
                        </Button>
                        <Button asChild>
                            <Link to="/signup">
                                Get started
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-20 text-center md:py-28">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Build habits that stick
                </div>
                <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl md:leading-tight">
                    Small steps lead to{' '}
                    <span className="text-primary">big transformations</span>
                </h1>
                <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                    Track your daily habits, build powerful streaks, earn achievements, and see your progress with
                    beautiful analytics. HabitForge makes self-improvement rewarding.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link to="/signup">
                            Start for free
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link to={user ? '/dashboard' : '/login'}>Sign in</Link>
                    </Button>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-6xl px-4 pb-20">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-foreground">Everything you need to thrive</h2>
                    <p className="mt-3 text-muted-foreground">
                        Powerful features designed to keep you motivated and on track.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={CheckCircle2}
                        title="Daily Habit Tracking"
                        description="Create custom habits with icons, colors, and difficulty levels. Toggle completion with a tap and watch your calendar fill up."
                    />
                    <FeatureCard
                        icon={TrendingUp}
                        title="Streak Tracking"
                        description="Build momentum with automatic streak counting. See your current and longest streaks for every habit at a glance."
                    />
                    <FeatureCard
                        icon={Trophy}
                        title="Achievements"
                        description="Unlock badges as you hit milestones. From your first habit to a 100-day streak, every milestone is celebrated."
                    />
                    <FeatureCard
                        icon={BarChart3}
                        title="Analytics & Reports"
                        description="Visualize your progress with heatmaps, completion charts, and trend lines. Understand your patterns and grow."
                    />
                    <FeatureCard
                        icon={TimerIcon}
                        title="Focus Timer"
                        description="Built-in Pomodoro timer to stay focused on your habits. Track focus sessions and build a deep work practice."
                    />
                    <FeatureCard
                        icon={Sparkles}
                        title="Difficulty Levels"
                        description="Categorize habits as easy, medium, or hard. Level up with XP-based difficulty and challenge yourself progressively."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-border bg-card">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center">
                    <h2 className="max-w-lg text-balance text-3xl font-bold text-card-foreground">
                        Your future self will thank you
                    </h2>
                    <p className="max-w-md text-muted-foreground">
                        Join HabitForge today and take the first step toward the life you want to live.
                    </p>
                    <Button size="lg" asChild>
                        <Link to="/signup">
                            Begin your journey
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                            <Flame className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">HabitForge</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Built with care. Track with purpose.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

