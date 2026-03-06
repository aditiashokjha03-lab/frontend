/* eslint react-refresh/only-export-components: "off" */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { queryClient } from '../store/queryClient';

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

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(Boolean(hasSupabase && supabase));
    async function fetchProfile(userId) {
        try {
            const { data } = await supabase
                .from('profiles').select('*').eq('id', userId).single();
            if (data) setProfile(data);
        } catch { /* non-critical */ }
        setLoading(false);
    }

    const updateProfile = async (updates) => {
        const newProfile = { ...profile, ...updates };
        setProfile(newProfile);

        if (user && supabase) {
            const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
            if (error) {
                console.warn('[Auth] Profile update error:', error.message);
            }
        }
    };

    useEffect(() => {
        if (!hasSupabase || !supabase) {
            return;
        }

        (async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                setLoading(false);
                return;
            }
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile(session.user.id);
            else setLoading(false);
        })();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const nextUser = session?.user ?? null;
            setUser(nextUser);
            if (nextUser) {
                fetchProfile(nextUser.id);
            } else {
                setProfile(null);
                setLoading(false);
                queryClient.clear();
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    // ── Auth methods ─────────────────────────────────────────────────
    const signIn = async (email, password) => {
        if (!hasSupabase || !supabase) {
            return { error: { message: 'Supabase is not configured.' } };
        }
        const result = await supabase.auth.signInWithPassword({ email, password });
        return result;
    };

    const signUp = async (email, password, username) => {
        const seed = username || Math.random().toString(36).substring(7);
        const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;

        if (!hasSupabase || !supabase) {
            return { error: { message: 'Supabase is not configured.' } };
        }

        const result = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username, avatar_url: avatarUrl }
            }
        });

        // Attempt to create profile row (non-critical)
        if (result.data?.user) {
            const userId = result.data.user.id;
            const finalUsername = username || email.split('@')[0] + '_' + userId.slice(0, 6);
            const { error: upsertError } = await supabase.from('profiles').upsert(
                { id: userId, username: finalUsername, avatar_url: avatarUrl },
                { onConflict: 'id' }
            );
            if (upsertError) {
                console.warn('[Auth] Non-critical profile upsert error:', upsertError.message);
            }
        }

        return result;
    };

    const signInWithGoogle = async () => {
        if (!hasSupabase || !supabase) {
            return { error: { message: '⚠️ No Supabase keys found.' } };
        }
        return supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    const signOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        setUser(null);
        setProfile(null);
        queryClient.clear();
    };

    return (
        <AuthContext.Provider value={{
            user, profile, loading,
            hasSupabase,
            signIn, signUp, signInWithGoogle, signOut, fetchProfile, updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { supabase };
