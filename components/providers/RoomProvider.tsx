"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Room } from '@/lib/types';
import { useRouter } from 'next/navigation';

type RoomContextType = {
    room: Room | null;
    roomId: string; // from URL
};

const RoomContext = createContext<RoomContextType | null>(null);

export function RoomProvider({ roomId, children }: { roomId: string, children: React.ReactNode }) {
    const [room, setRoom] = useState<Room | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRoom() {
            setLoading(true);
            try {
                // 1. Try to fetch existing room
                const { data, error } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('room_id', roomId)
                    .single();

                if (data) {
                    setRoom(data);
                } else {
                    // 2. If not found (error code PGRST116), create it
                    console.log('Room not found, creating new room:', roomId);
                    const { data: newRoom, error: createError } = await supabase
                        .from('rooms')
                        .insert([{ room_id: roomId }])
                        .select()
                        .single();

                    if (createError) {
                        // If error is 23505 (unique_violation), it means the room was just created by another request.
                        // We can safely ignore this and try fetching again.
                        if (createError.code === '23505') {
                            console.log('Room already created (race condition), fetching new room...');
                            const { data: existingRoom, error: retryError } = await supabase
                                .from('rooms')
                                .select('*')
                                .eq('room_id', roomId)
                                .single();

                            if (existingRoom) {
                                setRoom(existingRoom);
                                return;
                            }
                        }

                        console.error('Error creating room:', createError);
                        alert('Failed to connect to room. Please refresh.');
                        router.push('/');
                        return;
                    }

                    if (newRoom) {
                        setRoom(newRoom);
                    }
                }
            } catch (err) {
                console.error('Unexpected error in fetchRoom:', err);
                // Don't redirect immediately to allow for retries or manual recovery
            } finally {
                setLoading(false);
            }
        }

        if (roomId) {
            fetchRoom();
        }
    }, [roomId, router]);

    if (loading) return <div className="text-white text-center mt-20">Loading Room...</div>;

    return (
        <RoomContext.Provider value={{ room, roomId }}>
            {children}
        </RoomContext.Provider>
    );
}

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) throw new Error('useRoom must be used within RoomProvider');
    return context;
};
