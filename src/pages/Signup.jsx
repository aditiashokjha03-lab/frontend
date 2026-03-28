import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Flame, Sun, Moon } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        if (!username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
            return setError('Username must be 3-20 characters, alphanumeric or underscores');
        }

        setLoading(true);
        const { error: signUpError } = await signUp(email, password, username);

        if (signUpError) {
            setError(signUpError.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary border border-border overflow-hidden">
                            <img src="/logo.png" alt="HabitForge Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">HabitForge</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" strokeWidth={2} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={2} />}
                        </button>
                        <Link to="/login" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Sign in</Link>
                    </div>
                </div>
            </header>
 
            <div className="flex flex-1 w-full items-center justify-center p-6">
                <div className="w-full max-w-md space-y-10 rounded-[2rem] bg-card border border-border p-12 shadow-2xl shadow-black/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10" />
                    <div className="text-center">
                        <h2 className="text-4xl font-black tracking-tighter">Forge Ahead</h2>
                        <p className="mt-3 text-muted-foreground font-medium text-sm opacity-60">Start building the life you actually want.</p>
                    </div>

                {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
 
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Username</label>
                            <input type="text" required value={username} onChange={e => setUsername(e.target.value)}
                                className="block w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="block w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirm Password</label>
                            <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                className="block w-full rounded-xl border border-border bg-secondary/30 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                    </div>
 
                    <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-3.5 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                        {loading ? 'Forging Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
                </p>
            </div>
        </div>
        </div>
    );
}
