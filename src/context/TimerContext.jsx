import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axiosInstance from '../api/axiosInstance';
import { initAudio, tick, chime, setVolume, setMuted } from '../components/timer/TickEngine';

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
    const [status, setStatus] = useState('idle'); // idle, running, paused, break
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const timerRef = useRef(null);

    useEffect(() => {
        if (status === 'running' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
                tick(); // Play tick sound every second
            }, 1000);
        } else if (timeLeft === 0 && status === 'running') {
            completeSession();
        }

        return () => clearInterval(timerRef.current);
    }, [status, timeLeft]);

    const startTimer = async (habitId, durationMinutes, tickEnabled = true, vol = 0.5) => {
        try {
            initAudio(); // Required to bypass browser autoplay rules (must be in user interaction)
            setMuted(!tickEnabled);
            setVolume(vol);

            const { data } = await axiosInstance.post('focus/start', {
                habit_id: habitId,
                duration_minutes: durationMinutes,
                tick_enabled: tickEnabled,
                volume: vol
            });
            setCurrentSessionId(data.id);
            setTimeLeft(durationMinutes * 60);
            setStatus('running');
        } catch (error) {
            console.error('Failed to start focus session:', error);
        }
    };

    const pauseTimer = () => setStatus('paused');
    const resumeTimer = () => setStatus('running');

    const completeSession = async () => {
        setStatus('idle');
        chime(); // Success sound
        if (currentSessionId) {
            try {
                await axiosInstance.post(`focus/end/${currentSessionId}`, { completed: true });
            } catch (error) {
                console.error('Failed to end focus session:', error);
            }
        }
    };

    const stopTimer = async () => {
        clearInterval(timerRef.current);
        setStatus('idle');
        setTimeLeft(25 * 60); // Reset to default or keep previous duration? Defaulting to 25.
        if (currentSessionId) {
            try {
                await axiosInstance.post(`focus/end/${currentSessionId}`, { completed: false });
            } catch (error) {
                console.error('Failed to stop focus session:', error);
            }
        }
    };

    return (
        <TimerContext.Provider value={{ status, timeLeft, startTimer, pauseTimer, resumeTimer, stopTimer }}>
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);
