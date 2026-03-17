import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Flame, Sun, Moon } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            setError(signInError.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary border border-white/10 overflow-hidden">
                            <img src="/logo.png" alt="HabitForge Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">HabitForge</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" strokeWidth={2} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={2} />}
                        </button>
                        <Link to="/signup" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Sign up</Link>
                    </div>
                </div>
            </header>
 
            <div className="flex flex-1 w-full items-center justify-center p-6">
                <div className="w-full max-w-md space-y-10 rounded-[2rem] bg-card border border-white/5 p-12 shadow-2xl shadow-black/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -z-10" />
                    <div className="text-center">
                        <h2 className="text-4xl font-black tracking-tighter">Welcome Back</h2>
                        <p className="mt-3 text-muted-foreground font-medium text-sm opacity-60">Log in to your professional habit forge.</p>
                    </div>

                {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
 
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                className="block w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                className="block w-full rounded-xl border border-white/10 bg-secondary/30 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                        </div>
                    </div>
 
                    <button type="submit" disabled={loading} className="w-full rounded-xl bg-primary py-3.5 text-sm font-black uppercase tracking-widest text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
        </div>
    );
}
