import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Flame, Sun, Moon } from 'lucide-react';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await signUp(email, password, username);
        setIsLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Welcome to HabitForge! 🎉');
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-transparent relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <div className="w-full max-w-sm space-y-4">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2.5 font-bold text-2xl tracking-tight">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
                            <Flame className="h-5 w-5 text-background" />
                        </div>
                        HabitForge
                    </div>
                    <p className="text-muted-foreground mt-1">Build better habits. Forge your future.</p>
                </div>

                <Card className="shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl font-bold">Create account</CardTitle>
                        <CardDescription>Start forging better habits today</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <form onSubmit={handleSignup} className="space-y-3">
                            <div className="space-y-1">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username" type="text"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email" type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password" type="password"
                                    placeholder="min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" variant="outline" className="flex-1" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Signup;
