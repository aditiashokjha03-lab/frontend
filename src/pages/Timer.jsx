import React, { useEffect, useCallback } from 'react';
import { useTimer } from '../context/TimerContext';
import { useHabits } from '../hooks/useHabits';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, Square, Coffee, Wind } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
};

const Timer = () => {
    const {
        selectedHabit, setSelectedHabit,
        durationMinutes, setDurationMinutes,
        elapsedSeconds, status,
        startSession, pauseSession, resumeSession, stopSession
    } = useTimer();

    const { habits } = useHabits();

    // ── Tick sound ────────────────────────────────────────────────────
    const playTick = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, ctx.currentTime);
            gain.gain.setValueAtTime(0.0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.005);
            gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.04);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch {
            // silently skip if browser blocks audio
        }
    }, []);

    useEffect(() => {
        if (status !== 'running') return;
        const id = setInterval(playTick, 1000);
        return () => clearInterval(id);
    }, [status, playTick]);
    // ─────────────────────────────────────────────────────────────────

    const totalSeconds = durationMinutes * 60;
    // If we are in break mode, it's a 5 min countdown
    const isBreak = status === 'break';
    const displayTotalSeconds = isBreak ? 5 * 60 : totalSeconds;

    const remainingSeconds = Math.max(0, displayTotalSeconds - elapsedSeconds);
    const progressPercent = (elapsedSeconds / displayTotalSeconds) * 100;

    const handleStart = () => {
        if (!selectedHabit) return;
        startSession(selectedHabit, durationMinutes);
    };

    const getStatusColor = () => {
        if (status === 'break') return 'text-emerald-500 stroke-emerald-500';
        if (status === 'paused') return 'text-yellow-500 stroke-yellow-500';
        if (status === 'running') return 'text-primary stroke-primary';
        return 'text-muted-foreground stroke-muted';
    };

    return (
        <div className="container py-8 max-w-3xl mx-auto space-y-8 flex flex-col items-center">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">Focus Timer</h1>
                <p className="text-muted-foreground mt-1">Deep work mode. Stay consistent.</p>
            </div>

            <Card className="w-full max-w-md shadow-lg border-2 border-muted/50 p-6 relative overflow-hidden">
                {status === 'break' && (
                    <motion.div
                        className="absolute inset-0 bg-emerald-500/10 z-0 flex items-center justify-center opacity-50"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Wind size={200} className="text-emerald-500/20" />
                    </motion.div>
                )}
                <CardContent className="flex flex-col items-center gap-8 relative z-10 p-0">

                    <div className="w-full space-y-2">
                        <Select
                            value={selectedHabit || ''}
                            onValueChange={setSelectedHabit}
                            disabled={status !== 'idle'}
                        >
                            <SelectTrigger className="w-full text-lg h-12">
                                <SelectValue placeholder="Select a habit to focus on..." />
                            </SelectTrigger>
                            <SelectContent>
                                {habits.map(h => (
                                    <SelectItem key={h.id} value={h.id}>
                                        {h.icon} {h.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex gap-2 justify-center">
                            {[15, 25, 45, 60].map(min => (
                                <Button
                                    key={min}
                                    variant={durationMinutes === min ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setDurationMinutes(min)}
                                    disabled={status !== 'idle'}
                                    className="w-16"
                                >
                                    {min}m
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Circular Timer Display */}
                    <div className="relative w-64 h-64 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 drop-shadow-md">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
                            <motion.circle
                                cx="50" cy="50" r="45" fill="none"
                                strokeWidth="6" strokeLinecap="round"
                                className={getStatusColor()}
                                strokeDasharray="283"
                                strokeDashoffset={283 - (283 * progressPercent) / 100}
                                animate={{ strokeDashoffset: 283 - (283 * progressPercent) / 100 }}
                                transition={{ duration: 0.5, ease: 'linear' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-6xl font-mono tracking-tighter tabular-nums font-black ${getStatusColor().split(' ')[0]}`}>
                                {formatTime(remainingSeconds)}
                            </span>
                            <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mt-2">
                                {status === 'idle' ? 'Ready' : status === 'break' ? 'Breathing Room' : status}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        {status === 'idle' ? (
                            <Button size="lg" className="w-32 h-14 rounded-full text-lg gap-2 shadow-lg hover:scale-105 transition-transform" onClick={handleStart} disabled={!selectedHabit}>
                                <Play fill="currentColor" /> Start
                            </Button>
                        ) : status === 'break' ? (
                            <Button size="lg" variant="outline" className="w-40 h-14 rounded-full text-lg gap-2" onClick={() => stopSession()}>
                                <Coffee /> Skip Break
                            </Button>
                        ) : (
                            <>
                                {status === 'running' ? (
                                    <Button size="lg" variant="secondary" className="w-20 h-20 rounded-full shadow-md hover:scale-105 transition-transform" onClick={pauseSession}>
                                        <Pause fill="currentColor" size={28} />
                                    </Button>
                                ) : (
                                    <Button size="lg" className="w-20 h-20 rounded-full shadow-md hover:scale-105 transition-transform" onClick={resumeSession}>
                                        <Play fill="currentColor" size={28} />
                                    </Button>
                                )}
                                <Button size="icon" variant="destructive" className="w-14 h-14 rounded-full" onClick={() => stopSession()}>
                                    <Square fill="currentColor" size={20} />
                                </Button>
                            </>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default Timer;
