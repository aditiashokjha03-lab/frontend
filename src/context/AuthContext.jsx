import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile();
            else setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) fetchProfile();
            else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription?.unsubscribe();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axiosInstance.get('/profile');
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email, password, username) => {
        return supabase.auth.signUp({
            email,
            password,
            options: { data: { username } }
        });
    };

    const signIn = async (email, password) => {
        return supabase.auth.signInWithPassword({ email, password });
    };

    const signOut = async () => {
        return supabase.auth.signOut();
    };

    const updateProfile = async (updates) => {
        try {
            const { data } = await axiosInstance.put('/profile', updates);
            setProfile(data);
            return data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
