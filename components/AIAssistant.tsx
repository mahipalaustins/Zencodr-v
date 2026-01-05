"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { generateAIResponse } from '@/lib/gemini';

export default function AIAssistant() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: "Hi! I'm your AI coding assistant powered by Gemini. Ask me to generate code, explain concepts, or help debug." }
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const response = await generateAIResponse(userMsg);
            setMessages(prev => [...prev, { role: 'ai', content: response }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-navy-900">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m, i) => (
                    <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in duration-300`}>
                        <div className={`
                            p-3 rounded-xl max-w-[85%] text-sm leading-relaxed relative overflow-hidden
                            ${m.role === 'user'
                                ? 'bg-gradient-primary text-white shadow-glow-sm'
                                : 'bg-navy-700 text-gray-100 border border-white/10'
                            }
                        `}>
                            {m.role === 'ai' && (
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-glow opacity-20 blur-2xl"></div>
                            )}
                            <pre className="whitespace-pre-wrap font-sans relative z-10">{m.content}</pre>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex items-center gap-2 text-cyan text-xs animate-pulse">
                        <Sparkles size={14} className="animate-spin" />
                        <span>AI is thinking...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-navy-800">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask AI anything..."
                        disabled={loading}
                        className="flex-1 bg-navy-700 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple focus:ring-1 focus:ring-purple disabled:opacity-50 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-4 py-2.5 bg-gradient-primary hover:shadow-glow rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
