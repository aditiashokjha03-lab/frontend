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
                <div className="relative w-72 h-72 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="144" cy="144" r="136" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                        <circle cx="144" cy="144" r="136" stroke="currentColor" strokeWidth="8" fill="transparent"
                            strokeDasharray={2 * Math.PI * 136}
                            strokeDashoffset={(2 * Math.PI * 136) * (1 - progress / 100)}
                            className="text-primary transition-all duration-1000 ease-linear"
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-7xl font-bold text-foreground tabular-nums">{mins}:{secs}</span>
                        <span className="text-[10px] font-black text-muted-foreground mt-3 uppercase tracking-[0.2em]">{status}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full space-y-6 mt-4">
                    {status === 'idle' ? (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Focus Intent</label>
                                <select value={selectedHabit} onChange={e => setSelectedHabit(e.target.value)} className="w-full p-3.5 border border-border rounded-2xl bg-muted/50 text-sm font-medium text-foreground outline-none focus:ring-1 ring-ring">
                                    <option value="">Mindful Focus</option>
                                    {habits.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                {[5, 15, 25, 45, 60].map(m => (
                                    <button key={m} onClick={() => setDuration(m)}
                                        className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-all duration-300 ${duration === m ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' : 'bg-card border-border text-muted-foreground hover:border-primary/50'}`}>
                                        {m}m
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between p-4 border border-border rounded-2xl bg-muted/50">
                                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <input type="checkbox" checked={tickEnabled} onChange={handleMuteToggle} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                                    Audio Tick
                                </div>
                                {tickEnabled && (
                                    <input type="range" min="0" max="1" step="0.05" value={vol} onChange={handleVolumeChange} className="w-24 accent-primary" />
                                )}
                            </div>

                            <button onClick={handleStart} className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95">
                                Start Session
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex gap-4 w-full">
                                {status === 'running' ? (
                                    <button onClick={pauseTimer} className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-bold text-lg hover:bg-muted/80 transition-all active:scale-95">
                                        Pause
                                    </button>
                                ) : (
                                    <button onClick={resumeTimer} className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary-hover transition-all active:scale-95">
                                        Resume
                                    </button>
                                )}
                            </div>
                            <button onClick={stopTimer} className="w-full py-3 rounded-2xl border-2 border-destructive/30 text-destructive font-bold text-sm hover:bg-destructive/10 transition-all">
                                Terminate Session
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
