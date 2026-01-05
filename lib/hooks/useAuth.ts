import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export interface AppUser {
    id: string;
    username: string;
    email: string;
}

const STORAGE_KEY = 'zencodr_custom_session';

// Custom event for cross-hook communication
const AUTH_EVENT_KEY = 'zencodr_auth_change';

export function useAuth() {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const loadUserFromStorage = () => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        return null;
    };

    useEffect(() => {
        // Initial load
        setUser(loadUserFromStorage());
        setLoading(false);

        // Listen for storage changes (cross-tab or cross-component via storage event)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY) {
                setUser(loadUserFromStorage());
            }
        };

        // Listen for custom event (same tab, different hook instances)
        const handleCustomAuthChange = () => {
            setUser(loadUserFromStorage());
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener(AUTH_EVENT_KEY, handleCustomAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener(AUTH_EVENT_KEY, handleCustomAuthChange);
        };
    }, []);

    const notifyAuthChange = (newUser: AppUser | null) => {
        if (newUser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
        setUser(newUser);
        // Dispatch custom event to notify other hook instances
        window.dispatchEvent(new Event(AUTH_EVENT_KEY));
    };

    const signIn = async ({ email, password }: any) => {
        try {
            const { data, error } = await supabase
                .from('app_users')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .single();

            if (error || !data) {
                return { error: { message: 'Invalid email or password' } };
            }

            const appUser = { id: data.id, username: data.username, email: data.email };
            notifyAuthChange(appUser);
            return { data: { user: appUser }, error: null };
        } catch (err: any) {
            return { error: { message: err.message } };
        }
    };

    const signUp = async ({ email, password, options }: any) => {
        try {
            const username = options?.data?.username;

            const { data: existing } = await supabase
                .from('app_users')
                .select('id')
                .or(`email.eq.${email},username.eq.${username}`)
                .single();

            if (existing) {
                return { error: { message: 'User with this email or username already exists' } };
            }

            const { data, error } = await supabase
                .from('app_users')
                .insert([{ email, password, username }])
                .select()
                .single();

            if (error) throw error;

            const appUser = { id: data.id, username: data.username, email: data.email };
            notifyAuthChange(appUser);
            return { data: { user: appUser }, error: null };
        } catch (err: any) {
            return { error: { message: err.message } };
        }
    };

    const signOut = async () => {
        notifyAuthChange(null);
        router.refresh();
    };

    const changeUsername = async () => { };

    return {
        user: user ? { ...user, user_metadata: { username: user.username } } : null,
        loading,
        signIn,
        signUp,
        signOut,
        changeUsername
    };
}
