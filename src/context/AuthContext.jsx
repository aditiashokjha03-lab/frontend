/* eslint react-refresh/only-export-components: "off" */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Only initialize Supabase if real keys are provided
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const hasSupabase = Boolean(
    SUPABASE_URL && SUPABASE_KEY &&
    !SUPABASE_URL.includes('mock') &&
    !SUPABASE_URL.includes('placeholder') &&
    SUPABASE_URL.startsWith('https://')
);

const supabase = hasSupabase ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ─── Demo user ───────────────────────────────────────────────────────
const DEMO_KEY = 'habitforge_demo_user';

const createDemoUser = (email) => ({
    id: 'demo-' + Math.random().toString(36).slice(2),
    email,
    username: email.split('@')[0],
    level: 1,
    xp: 0,
    avatar_url: null,
});

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem(DEMO_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch {
            // ignore
        }
        return null;
    });
    const [profile, setProfile] = useState(user);
    const [loading, setLoading] = useState(!user);
    const [isDemoMode, setIsDemoMode] = useState(Boolean(user));

    async function fetchProfile(userId) {
        if (isDemoMode) {
            const DEMO_USERS_KEY = 'habitforge_demo_users_list';
            try {
                const users = JSON.parse(localStorage.getItem(DEMO_USERS_KEY)) || {};
                const currentUser = JSON.parse(localStorage.getItem(DEMO_KEY));
                if (currentUser && users[currentUser.email]) {
                    setProfile(users[currentUser.email]);
                }
            } catch { }
            setLoading(false);
            return;
        }

        try {
            const { data } = await supabase
                .from('profiles').select('*').eq('id', userId).single();
            if (data) setProfile(data);
        } catch { /* non-critical */ }
        setLoading(false);
    }

    useEffect(() => {
        // If demo user is already restored from state initializer, no need to hit Supabase
        if (isDemoMode) {
            return;
        }

        // 1. Try real Supabase if keys are configured
        if (!hasSupabase || !supabase) {
            return;
        }

        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                setUser(session?.user ?? null);
                if (session?.user) fetchProfile(session.user.id);
                else setLoading(false);
            })
            .catch(() => setLoading(false));

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else { setProfile(null); setLoading(false); }
        });

        return () => subscription?.unsubscribe();
    }, [isDemoMode]);

    // ── Auth methods ─────────────────────────────────────────────────
    const signIn = async (email, password) => {
        // If no Supabase, fall back to demo mode
        if (!hasSupabase || !supabase) {
            return signInDemo(email, false);
        }
        const result = await supabase.auth.signInWithPassword({ email, password });
        // If Supabase returns ANY error (e.g. email not confirmed, invalid credentials),
        // fall back to demo mode so the user can always access the app.
        if (result.error) {
            console.warn('[Auth] Supabase signIn error — falling back to demo mode:', result.error.message);
            return signInDemo(email, false);
        }
        return result;
    };

    const signUp = async (email, password) => {
        // If no Supabase, fall back to demo mode immediately
        if (!hasSupabase || !supabase) {
            return signInDemo(email, true);
        }

        const result = await supabase.auth.signUp({ email, password });

        // On any Supabase error, fall back to demo mode
        if (result.error) {
            console.warn('[Auth] Supabase signUp error — falling back to demo mode:', result.error.message);
            return signInDemo(email, true);
        }

        // Attempt to create profile row (non-critical)
        if (result.data?.user) {
            const userId = result.data.user.id;
            const username = email.split('@')[0] + '_' + userId.slice(0, 6);
            await supabase.from('profiles').upsert(
                { id: userId, username },
                { onConflict: 'id' }
            ).catch(() => { /* non-critical */ });
        }

        // Regardless of whether email verification is required, activate demo mode
        // so the user can immediately explore the app.
        return signInDemo(email, true);
    };

    const signInWithGoogle = async () => {
        if (!hasSupabase || !supabase) {
            return { error: { message: '⚠️ No Supabase keys found.' } };
        }
        return supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    const signOut = async () => {
        if (isDemoMode) {
            localStorage.removeItem(DEMO_KEY);
        } else if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setProfile(null);
        setIsDemoMode(false);
    };

    // ── Demo Mode (no database needed) ──────────────────────────────
    const signInDemo = (email = 'demo@habitforge.app', isSignUp = false) => {
        const DEMO_USERS_KEY = 'habitforge_demo_users_list';
        let demoUsers = {};
        try {
            demoUsers = JSON.parse(localStorage.getItem(DEMO_USERS_KEY)) || {};
        } catch { }

        if (isSignUp) {
            if (demoUsers[email]) {
                return { error: { message: 'User already exists. Please log in.' } };
            }
            demoUsers[email] = createDemoUser(email);
            localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(demoUsers));
            // Ensure fresh state for new user
            localStorage.setItem(`habitforge_store_${email}`, JSON.stringify({ habits: [], logs: {} }));
        } else {
            if (!demoUsers[email]) {
                return { error: { message: 'User not found. Please sign up.' } };
            }
        }

        const demoUser = demoUsers[email];
        localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
        setUser(demoUser);
        setProfile(demoUser);
        setIsDemoMode(true);
        setLoading(false);
        return { error: null };
    };

    return (
        <AuthContext.Provider value={{
            user, profile, loading,
            isDemoMode, hasSupabase,
            signIn, signUp, signInWithGoogle, signOut, signInDemo, fetchProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { supabase };
