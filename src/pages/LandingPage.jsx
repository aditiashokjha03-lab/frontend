import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Flame,
    CheckCircle2,
    TrendingUp,
    Trophy,
    Timer,
    BarChart3,
    Sparkles,
    ArrowRight,
    Sun,
    Moon,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
                <Icon className="h-6 w-6 text-primary transition-all duration-500 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">{title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
        </div>
    )
}

export default function LandingPage() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary border border-white/10 overflow-hidden">
                            <img src="/logo.png" alt="HabitForge Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">HabitForge</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" strokeWidth={2} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={2} />}
                        </button>
                        <Link to="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mr-2">Sign in</Link>
                        <Button className="rounded-full px-6 h-9 text-sm font-semibold shadow-xl shadow-primary/20" asChild>
                            <Link to="/signup">Get started</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main id="main-content" className="flex-1">
                <section className="mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center justify-center gap-10 px-6 py-20 text-center" aria-labelledby="hero-heading">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        Build habits that stick
                    </div>
                    <h1 id="hero-heading" className="max-w-4xl text-balance text-5xl font-black leading-[1.1] tracking-tighter text-foreground md:text-7xl">
                        Small steps lead to big <br />
                        <span className="text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">transformations</span>
                    </h1>
                    <p className="max-w-2xl text-pretty text-lg font-medium leading-relaxed text-muted-foreground md:text-xl">
                        HabitForge is a professional habit tracker designed to help you build powerful streaks, earn achievements, and see your progress with beautiful analytics. Our productivity tool makes daily self-improvement rewarding and sustainable.
                    </p>
                    <div className="flex items-center gap-5 mt-4">
                        <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_-5px_hsl(var(--primary)/0.6)]" asChild aria-label="Start for free and sign up">
                            <Link to="/signup">Start for free</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl border-white/10 transition-all duration-500 hover:bg-white/5 hover:border-white/20" asChild aria-label="Sign in to your account">
                            <Link to="/login">Sign in</Link>
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mx-auto max-w-6xl px-4 pb-20" aria-labelledby="features-heading">
                    <div className="mb-12 text-center">
                        <h2 id="features-heading" className="text-3xl font-bold text-foreground">
                            Everything you need to thrive
                        </h2>
                        <p className="mt-3 text-muted-foreground">
                            Powerful features designed to keep you motivated and on track with your <strong>daily habits</strong>.
                        </p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={CheckCircle2}
                            title="Daily Habit Tracking"
                            description="Create custom habits with icons, colors, and difficulty levels. Toggle completion with a tap and watch your calendar fill up with consistent progress."
                        />
                        <FeatureCard
                            icon={TrendingUp}
                            title="Streak Tracking"
                            description="Build momentum with automatic streak counting. See your current and longest streaks for every habit at a glance to maintain discipline."
                        />
                        <FeatureCard
                            icon={Trophy}
                            title="Achievements"
                            description="Unlock badges as you hit milestones. From your first habit to a 100-day streak, every milestone is celebrated in your productivity journey."
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="Analytics & Reports"
                            description="Visualize your progress with heatmaps, completion charts, and trend lines. Understand your patterns and grow with data-driven insights."
                        />
                        <FeatureCard
                            icon={Timer}
                            title="Focus Timer"
                            description="Built-in Pomodoro timer to stay focused on your habits. Track focus sessions and build a deep work practice for maximum efficiency."
                        />
                        <FeatureCard
                            icon={Sparkles}
                            title="Difficulty Levels"
                            description="Categorize habits as easy, medium, or hard. Level up with XP-based difficulty and challenge yourself progressively every day."
                        />
                    </div>
                </section>

                {/* CTA Section */}
                <section className="border-t border-border bg-muted/40" aria-labelledby="cta-heading">
                    <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-24 text-center">
                        <h2 id="cta-heading" className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                            Your future self will thank you
                        </h2>
                        <p className="max-w-md text-lg text-muted-foreground">
                            Join HabitForge today and take the first step toward the life you want to live with our <strong>habit tracking app</strong>.
                        </p>
                        <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-primary/20" asChild aria-label="Begin your journey and sign up">
                            <Link to="/signup">
                                Begin your journey
                                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                            </Link>
                        </Button>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-background">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
                    <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted overflow-hidden border border-border">
                            <img src="/logo.png" alt="HabitForge Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-sm font-semibold text-foreground">HabitForge</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Built with care. Track with purpose.
                    </p>
                </div>
            </footer>
        </div>
    )
}
