"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function MentorshipPage() {
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: "Hi there! I'm your ZenCodr AI Mentorship Assistant. I can help match you with the perfect mentor based on your skills and goals. Would you like to start a quick assessment?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [showAssessment, setShowAssessment] = useState(false);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMessages = [...messages, { role: 'user' as const, text: inputValue }];
        setMessages(newMessages);
        setInputValue('');

        // Simple mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', text: "That sounds great! I'm analyzing your profile to find the best mentors for you..." }]);
            setTimeout(() => {
                setShowAssessment(true);
            }, 1500);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-gray-200 font-sans pt-20">
            {/* Header */}
            <header className="fixed top-0 w-full bg-[#0a0e1a]/90 backdrop-blur-md border-b border-white/10 px-8 py-4 z-[100] flex justify-between items-center">
                <Link href="/" className="font-bold text-2xl flex items-center gap-2 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">
                    <i className="fas fa-code"></i> ZenCodr
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="px-4 py-2 rounded-lg border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors">
                        Dashboard
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="text-center mb-12 animate-[fadeIn_0.5s]">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">Learn, Grow & Code with Expert Mentors</h1>
                    <p className="text-xl text-gray-400">Get personalized guidance from industry leaders, coding experts, and innovators.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* AI Assistant Chat */}
                    <div className="flex flex-col h-[600px] rounded-2xl bg-[#121929] border border-white/10 overflow-hidden shadow-2xl animate-[fadeInLeft_0.5s]">
                        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#ff00ff] flex items-center justify-center text-white text-xl">
                                <i className="fas fa-robot"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-white">ZenCodr AI Assistant</h3>
                                <div className="flex items-center gap-2 text-xs text-[#00ff88]">
                                    <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
                                    Online
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow p-6 overflow-y-auto space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                        ? 'bg-[#00d4ff]/20 text-white rounded-tr-none'
                                        : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/10'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-white/10 bg-white/5">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-grow bg-[#0a0e1a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00d4ff] transition-colors"
                                    placeholder="Type your message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-6 py-3 rounded-lg bg-[#00d4ff] text-white font-semibold hover:bg-[#00c0e6] transition-colors"
                                >
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Recommendations / Info Area */}
                    <div className="space-y-6 animate-[fadeInRight_0.5s]">
                        {!showAssessment ? (
                            <div className="h-full flex flex-col justify-center items-center text-center p-8 rounded-2xl bg-[#121929]/50 border border-dashed border-white/10">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl text-gray-500 mb-6">
                                    <i className="fas fa-users"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-300 mb-2">Find Your Perfect Mentor</h3>
                                <p className="text-gray-500 max-w-md">Chat with our AI assistant to analyze your skills and goals. We&apos;ll match you with mentors who can help you reach the next level.</p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-[fadeIn_0.5s]">
                                <h3 className="text-2xl font-bold text-white mb-4">Recommended Mentors</h3>
                                {[
                                    { name: 'Sarah Chen', role: 'Staff Engineer @ Google', expertise: ['System Design', 'Scaling', 'Leadership'], img: 'S' },
                                    { name: 'David Miller', role: 'Senior Dev @ Netflix', expertise: ['React', 'Performance', 'Career Growth'], img: 'D' }
                                ].map((mentor, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-[#121929] border border-white/10 hover:border-[#00d4ff] transition-all flex gap-4 items-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff00ff]/20 to-[#00d4ff]/20 text-white text-2xl font-bold flex items-center justify-center border border-white/10">
                                            {mentor.img}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-lg font-bold text-white">{mentor.name}</h4>
                                            <p className="text-[#00d4ff] text-sm mb-2">{mentor.role}</p>
                                            <div className="flex gap-2 flex-wrap">
                                                {mentor.expertise.map(skill => (
                                                    <span key={skill} className="text-xs px-2 py-1 rounded bg-white/5 text-gray-400">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 rounded-lg border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff] hover:text-white transition-all">
                                            Connect
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
