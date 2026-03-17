import { useState } from 'react';
import { useTimer } from '../context/TimerContext';
import { useHabits } from '../hooks/useHabits';
import { setVolume, setMuted } from '../components/timer/TickEngine';

export default function Timer() {
    const { status, timeLeft, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();
    const { query } = useHabits();

    const [selectedHabit, setSelectedHabit] = useState('');
    const [duration, setDuration] = useState(25);
    const [tickEnabled, setTickEnabled] = useState(true);
    const [vol, setVol] = useState(0.3);

    const habits = query.data || [];

    const handleStart = () => {
        startTimer(selectedHabit || null, duration, tickEnabled, vol);
    };

    const handleVolumeChange = (e) => {
        const newVol = parseFloat(e.target.value);
        setVol(newVol);
        setVolume(newVol);
    };

    const handleMuteToggle = () => {
        const newMuted = !tickEnabled;
        setTickEnabled(newMuted);
        setMuted(!newMuted); // engine muted when tickEnabled is false
    };

    const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secs = (timeLeft % 60).toString().padStart(2, '0');

    // Ring progress calculation
    const totalSecs = duration * 60;
    const progress = status === 'idle' ? 0 : ((totalSecs - timeLeft) / totalSecs) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 max-w-2xl mx-auto py-12">
            <h1 className="text-3xl font-bold mb-10 text-foreground">Deep Work Timer</h1>

            <div className="w-full max-w-md bg-card border border-border rounded-[40px] p-10 shadow-xl shadow-primary/5 flex flex-col items-center gap-8">

                {/* Timer Display */}
                <div className="relative w-80 h-80 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="160" cy="160" r="150" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary/30" />
                        <circle cx="160" cy="160" r="150" stroke="currentColor" strokeWidth="6" fill="transparent"
                            strokeDasharray={2 * Math.PI * 150}
                            strokeDashoffset={(2 * Math.PI * 150) * (1 - progress / 100)}
                            className="text-primary transition-all duration-1000 ease-linear"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-8xl font-black text-foreground tracking-tighter tabular-nums">{mins}:{secs}</span>
                        <div className="flex items-center gap-2 mt-4 px-4 py-1.5 bg-secondary/50 border border-white/5 rounded-lg">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'running' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{status}</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full space-y-8 mt-4">
                    {status === 'idle' ? (
                        <>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] ml-1 opacity-40">Focus Intent</label>
                                <select value={selectedHabit} onChange={e => setSelectedHabit(e.target.value)} className="w-full h-14 px-5 border border-white/5 rounded-2xl bg-secondary/30 text-[10px] font-black uppercase tracking-[0.1em] text-foreground outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer">
                                    <option value="">Mindful Focus Session</option>
                                    {habits.map(h => <option key={h.id} value={h.id}>{h.name.toUpperCase()}</option>)}
                                </select>
                            </div>
 
                            <div className="flex flex-wrap gap-3">
                                {[5, 15, 25, 45, 60].map(m => (
                                    <button key={m} onClick={() => setDuration(m)}
                                        className={`px-5 h-10 rounded-xl border border-white/5 text-[9px] font-black uppercase tracking-widest transition-all duration-500 ${duration === m ? 'bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20 scale-105' : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40'}`}>
                                        {m}m
                                    </button>
                                ))}
                            </div>
 
                            <div className="flex items-center justify-between p-5 border border-white/5 rounded-2xl bg-secondary/20">
                                <div className="flex items-center gap-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] opacity-60">
                                    <input type="checkbox" checked={tickEnabled} onChange={handleMuteToggle} className="w-4 h-4 rounded border-white/10 bg-secondary/50 text-primary focus:ring-primary ring-offset-card" />
                                    Aural Frequency
                                </div>
                                {tickEnabled && (
                                    <input type="range" min="0" max="1" step="0.05" value={vol} onChange={handleVolumeChange} className="w-24 accent-primary h-1 bg-secondary rounded-full border-none" />
                                )}
                            </div>
 
                            <button onClick={handleStart} className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Initialize Flow
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col w-full gap-6">
                            <div className="flex gap-4 w-full">
                                {status === 'running' ? (
                                    <button onClick={pauseTimer} className="flex-1 h-14 rounded-xl bg-secondary/50 border border-white/5 text-foreground font-black uppercase tracking-[0.15em] text-[10px] hover:bg-secondary transition-all active:scale-95">
                                        Suspend
                                    </button>
                                ) : (
                                    <button onClick={resumeTimer} className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.15em] text-[10px] hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95">
                                        Resume Flow
                                    </button>
                                )}
                            </div>
                            <button onClick={stopTimer} className="w-full py-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 font-black uppercase tracking-[0.2em] text-[9px] hover:bg-rose-500/10 transition-all">
                                Terminate Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
