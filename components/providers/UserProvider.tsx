"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type User = {
    id: string;
    username: string;
    color: string;
};

const UserContext = createContext<User | null>(null);

const COLORS = ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Try to load authenticated user first
        const authSession = localStorage.getItem('zencodr_custom_session');
        if (authSession) {
            try {
                const parsed = JSON.parse(authSession);
                // Deterministic color based on user ID or username
                const colorIndex = (parsed.username?.length || 0) % COLORS.length;
                setUser({
                    id: parsed.id,
                    username: parsed.username || 'User',
                    color: COLORS[colorIndex]
                });
                return;
            } catch (e) {
                // Invalid session, ignore
            }
        }

        // Fallback: Check for existing guest user or create new
        const stored = localStorage.getItem('zencodr_user');
        if (stored) {
            setUser(JSON.parse(stored));
        } else {
            const newUser = {
                id: uuidv4(),
                username: 'Guest-' + Math.floor(Math.random() * 1000),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
            };
            localStorage.setItem('zencodr_user', JSON.stringify(newUser));
            setUser(newUser);
        }
    }, []);

    if (!user) return null; // or loading spinner

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
};
