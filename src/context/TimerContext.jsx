// import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import axiosInstance from '../api/axiosInstance';
// import { toast } from 'sonner';

// const TimerContext = createContext({});

// export const TimerProvider = ({ children }) => {
//     const [selectedHabit, setSelectedHabit] = useState(null);
//     const [durationMinutes, setDurationMinutes] = useState(25);
//     const [elapsedSeconds, setElapsedSeconds] = useState(0);
//     const [status, setStatus] = useState('idle'); // idle, running, paused, break
//     const [sessionId, setSessionId] = useState(null);

//     const savedCallback = useRef();

//     // Remember the latest callback.
//     useEffect(() => {
//         savedCallback.current = () => {
//             if (status === 'running' || status === 'break') {
//                 setElapsedSeconds(prev => {
//                     const next = prev + 1;
//                     if (status === 'running' && next >= durationMinutes * 60) {
//                         handleSessionEnd(true);
//                         return 0;
//                     }
//                     if (status === 'break' && next >= 5 * 60) {
//                         setStatus('idle');
//                         toast.info('Break is over! Ready to focus again?');
//                         return 0;
//                     }
//                     return next;
//                 });
//             }
//         };
//     }, [status, durationMinutes]);

//     // Set up the interval.
//     useEffect(() => {
//         function tick() {
//             savedCallback.current();
//         }
//         if (status !== 'idle' && status !== 'paused') {
//             let id = setInterval(tick, 1000);
//             return () => clearInterval(id);
//         }
//     }, [status]);

//     const startSession = async (habitId, minutes) => {
//         try {
//             setSelectedHabit(habitId);
//             setDurationMinutes(minutes);
//             setElapsedSeconds(0);
//             setStatus('running');

//             const res = await axiosInstance.post('/focus/start', {
//                 habit_id: habitId,
//                 duration_minutes: minutes
//             });
//             setSessionId(res.data.data.id);
//         } catch (error) {
//             toast.error('Failed to start focus session');
//             setStatus('idle');
//         }
//     };

//     const pauseSession = () => setStatus('paused');
//     const resumeSession = () => setStatus('running');

//     const handleSessionEnd = async (completed) => {
//         setStatus(completed ? 'break' : 'idle');
//         if (completed) {
//             toast.success(`Pomodoro completed! Take a 5 minute break.`);
//         } else {
//             toast.info('Pomodoro stopped early.');
//         }

//         if (sessionId) {
//             try {
//                 await axiosInstance.post(`/focus/end/${sessionId}`, { completed });
//                 setSessionId(null);
//             } catch (error) {
//                 console.error('Failed to end session on server', error);
//             }
//         }
//     };

//     return (
//         <TimerContext.Provider
//             value={{
//                 selectedHabit, setSelectedHabit,
//                 durationMinutes, setDurationMinutes,
//                 elapsedSeconds, status,
//                 startSession, pauseSession, resumeSession, stopSession: () => handleSessionEnd(false)
//             }}
//         >
//             {children}
//         </TimerContext.Provider>
//     );
// };

// export const useTimer = () => useContext(TimerContext);



/* eslint react-refresh/only-export-components: "off" */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'sonner';

const TimerContext = createContext({});

export const TimerProvider = ({ children }) => {
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [durationMinutes, setDurationMinutes] = useState(25);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, running, paused, break

    // Use refs to avoid stale closures inside interval callbacks
    const sessionIdRef = useRef(null);
    const statusRef = useRef('idle');
    const durationRef = useRef(25);

    const playChime = useCallback(() => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);

            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.6);
        } catch {
            // If the browser blocks audio, just skip sound.
        }
    }, []);

    // Keep refs in sync with state
    useEffect(() => { statusRef.current = status; }, [status]);
    useEffect(() => { durationRef.current = durationMinutes; }, [durationMinutes]);

    const handleSessionEnd = useCallback(async (completed) => {
        setStatus(completed ? 'break' : 'idle');
        if (completed) {
            toast.success('Pomodoro completed! Take a 5 minute break. 🎉');
        } else {
            toast.info('Pomodoro stopped early.');
        }
        playChime();

        const currentSessionId = sessionIdRef.current;
        if (currentSessionId) {
            try {
                await axiosInstance.post(`/focus/end/${currentSessionId}`, { completed });
                sessionIdRef.current = null;
            } catch (error) {
                console.error('Failed to end session on server:', error.message);
            }
        }
    }, [playChime]);

    // The interval tick — uses refs to always have fresh values
    useEffect(() => {
        if (status !== 'idle' && status !== 'paused') {
            const id = setInterval(() => {
                setElapsedSeconds(prev => {
                    const next = prev + 1;
                    const currentStatus = statusRef.current;
                    const currentDuration = durationRef.current;

                    if (currentStatus === 'running' && next >= currentDuration * 60) {
                        // Timer finished — trigger end asynchronously
                        setTimeout(() => handleSessionEnd(true), 0);
                        return 0;
                    }
                    if (currentStatus === 'break' && next >= 5 * 60) {
                        setTimeout(() => {
                            setStatus('idle');
                            toast.info('Break is over! Ready to focus again?');
                            playChime();
                        }, 0);
                        return 0;
                    }
                    return next;
                });
            }, 1000);
            return () => clearInterval(id);
        }
    }, [status, handleSessionEnd, playChime]);

    const startSession = async (habitId, minutes) => {
        // Start the timer immediately — don't gate it on the API call
        setSelectedHabit(habitId);
        setDurationMinutes(minutes);
        durationRef.current = minutes;
        setElapsedSeconds(0);
        setStatus('running');
        sessionIdRef.current = null;

        try {
            const res = await axiosInstance.post('/focus/start', {
                habit_id: habitId,
                duration_minutes: minutes
            });
            sessionIdRef.current = res.data.data.id;
        } catch (error) {
            // Timer keeps running even if backend is unreachable
            console.warn('Could not sync session start with server:', error.message);
        }
    };

    const pauseSession = () => setStatus('paused');
    const resumeSession = () => setStatus('running');

    return (
        <TimerContext.Provider
            value={{
                selectedHabit, setSelectedHabit,
                durationMinutes, setDurationMinutes,
                elapsedSeconds, status,
                startSession, pauseSession, resumeSession,
                stopSession: () => handleSessionEnd(false)
            }}
        >
            {children}
        </TimerContext.Provider>
    );
};

export const useTimer = () => useContext(TimerContext);