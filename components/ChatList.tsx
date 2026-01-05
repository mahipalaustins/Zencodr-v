"use client";

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRoom } from './providers/RoomProvider';
import { useUser } from './providers/UserProvider';
import { Message } from '@/lib/types';
import { Send } from 'lucide-react';

export default function ChatList() {
    const { roomId } = useRoom();
    const user = useUser();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', roomId)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
        fetchMessages();

        const channel = supabase
            .channel(`room-chat:${roomId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [roomId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const content = inputText;
        setInputText('');

        await supabase.from('messages').insert([
            {
                room_id: roomId,
                user_id: user.id,
                username: user.username,
                content: content,
                created_at: new Date().toISOString()
            }
        ]);
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.length === 0 && <div className="text-gray-500 text-center text-sm">No messages yet.</div>}
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.user_id === user.id ? 'items-end' : 'items-start'}`}>
                        <div className="text-xs text-gray-500 mb-1">{msg.username}</div>
                        <div className={`p-2 rounded max-w-[85%] break-words text-sm ${msg.user_id === user.id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-gray-700 flex gap-2">
                <input
                    type="text"
                    className="flex-1 bg-gray-800 border border-gray-600 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="p-2 bg-blue-600 rounded hover:bg-blue-700 text-white">
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}
