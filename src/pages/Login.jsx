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
            <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                            <Flame className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">HabitForge</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" strokeWidth={2} /> : <Moon className="h-5 w-5" strokeWidth={2} />}
                        </button>
                        <Link to="/signup" className="text-sm font-medium text-primary hover:underline">Sign up</Link>
                    </div>
                </div>
            </header>
        <div className="flex flex-1 w-full items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-card p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Welcome Back</h2>
                    <p className="mt-2 text-muted-foreground">Log in to HabitForge</p>
                </div>

                {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full rounded-md bg-primary p-2 text-primary-foreground">
                        {loading ? 'Logging in...' : 'Log In'}
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
