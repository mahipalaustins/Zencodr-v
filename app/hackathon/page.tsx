"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function HackathonPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const hackathons = [
        {
            title: 'AI Innovation Challenge',
            organizer: 'TechCorp India',
            date: 'Oct 15-17, 2023',
            mode: 'Online',
            prize: '₹8,30,000',
            themes: ['AI', 'Machine Learning', 'Open Innovation'],
            difficulty: 'intermediate',
            type: 'online'
        },
        {
            title: 'Web3 Builders Weekend',
            organizer: 'Blockchain Academy',
            date: 'Nov 5-6, 2023',
            mode: 'Bangalore', // Using mode for location logic mostly
            prize: '₹5,00,000',
            themes: ['Web3', 'Blockchain', 'DeFi'],
            difficulty: 'beginner',
            type: 'offline'
        },
        {
            title: 'Sustainability Hack',
            organizer: 'GreenTech Initiative',
            date: 'Nov 18-20, 2023',
            mode: 'Hybrid',
            prize: '₹12,50,000',
            themes: ['Sustainability', 'Climate Tech', 'IoT'],
            difficulty: 'advanced',
            type: 'hybrid'
        }
    ];

    const filteredHackathons = activeFilter === 'all'
        ? hackathons
        : hackathons.filter(h => h.type === activeFilter || h.difficulty === activeFilter);

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
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">ZENCODR Hackathon Hub</h1>
                    <p className="text-xl text-gray-400">Explore upcoming hackathons, compete, innovate, and build the future together.</p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {['all', 'online', 'offline', 'hybrid', 'beginner', 'intermediate', 'advanced'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full border transition-all capitalize text-sm ${activeFilter === filter
                                    ? 'bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] border-transparent text-white shadow-[0_0_15px_rgba(0,212,255,0.5)]'
                                    : 'border-white/10 text-gray-400 hover:border-[#00d4ff] hover:text-white'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Hackathon List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {filteredHackathons.map((hackathon, index) => (
                        <div key={index} className="group p-6 rounded-2xl bg-[#121929] border border-white/10 hover:border-[#ff00ff] hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,0,255,0.2)] transition-all flex flex-col">
                            <h3 className="text-xl font-bold text-white mb-1">{hackathon.title}</h3>
                            <p className="text-sm text-gray-400 mb-4">{hackathon.organizer}</p>

                            <div className="space-y-3 mb-6 flex-grow">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <i className="fas fa-calendar text-[#00d4ff] w-5"></i>
                                    <span>{hackathon.date}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <i className="fas fa-map-marker-alt text-[#00d4ff] w-5"></i>
                                    <span>{hackathon.mode}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <i className="fas fa-trophy text-[#ff00ff] w-5"></i>
                                    <span className="font-bold">{hackathon.prize}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap mb-6">
                                {hackathon.themes.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/5">
                                <button className="flex-1 py-2 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-white transition-all text-sm">
                                    View Details
                                </button>
                                <button className="flex-1 py-2 rounded-lg bg-[#ff00ff]/10 text-[#ff00ff] hover:bg-[#ff00ff] hover:text-white transition-all text-sm font-semibold">
                                    Register
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Resources Section */}
                <div className="py-12 border-t border-white/10">
                    <div className="text-center mb-10">
                        <i className="fas fa-book text-4xl text-[#00d4ff] mb-4"></i>
                        <h2 className="text-3xl font-bold text-white">Hackathon Preparation Resources</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'How to Form a Winning Team', icon: 'users', desc: 'Learn the secrets to assembling a balanced team.' },
                            { title: 'How to Pitch Your Idea', icon: 'presentation', desc: 'Master the art of presenting your project to judges.' },
                            { title: 'Best Tools to Use', icon: 'tools', desc: 'Discover essential tools and frameworks for speed.' }
                        ].map((resource, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-[#121929] border border-white/10 hover:bg-[#1a233a] transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-white pr-4">{resource.title}</h3>
                                    <i className={`fas fa-${resource.icon} text-2xl text-[#00d4ff]`}></i>
                                </div>
                                <p className="text-gray-400 text-sm mb-4">{resource.desc}</p>
                                <button className="text-[#00d4ff] text-sm hover:underline">Read Article &rarr;</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
