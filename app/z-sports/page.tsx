"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ZSportsPage() {
    const [activeFilter, setActiveFilter] = useState('all');

    const games = [
        { type: 'free', title: 'Python Challenge', icon: 'python', desc: 'Solve logic puzzles to sharpen your Python skills.', tags: ['#Python', '#Beginner'] },
        { type: 'free', title: 'HTML Arena', icon: 'html5', desc: 'Design layouts under a time limit.', tags: ['#HTML', '#CSS', '#Beginner'] },
        { type: 'free', title: 'JS Battlefield', icon: 'js-square', desc: 'Test your JavaScript logic in fun missions.', tags: ['#JavaScript', '#Intermediate'] },
        { type: 'paid', fee: '199', title: 'Web Dev Wars', icon: 'laptop-code', desc: 'Build and deploy a small website in 60 minutes.', tags: ['#WebDev', '#FullStack'] },
        { type: 'paid', fee: '299', title: 'App Forge Arena', icon: 'mobile-alt', desc: 'Compete to create fast, functional apps.', tags: ['#Mobile', '#ReactNative'] },
    ];

    const filteredGames = activeFilter === 'all'
        ? games
        : games.filter(game => game.type === activeFilter || (activeFilter === 'prize' && game.type === 'paid')); // Assuming prize pool games are paid for now

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
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">Welcome to Z-Sports — The Gaming Arena for Coders!</h1>
                    <p className="text-xl text-gray-400">Play. Learn. Compete. Win rewards and master your tech skills.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    {['all', 'free', 'paid', 'prize'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-6 py-2 rounded-full border transition-all capitalize ${activeFilter === filter
                                    ? 'bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] border-transparent text-white shadow-[0_0_15px_rgba(0,212,255,0.5)]'
                                    : 'border-white/10 text-gray-400 hover:border-[#00d4ff] hover:text-white'
                                }`}
                        >
                            {filter === 'prize' ? 'High Prize Pool' : `${filter} Games`}
                        </button>
                    ))}
                </div>

                {/* Games Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredGames.map((game, index) => (
                        <div key={index} className="group p-6 rounded-2xl bg-[#121929] border border-white/10 hover:border-[#00d4ff] hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">{game.title}</h3>
                                <i className={`fab fa-${game.icon} text-3xl text-[#00d4ff]`}></i>
                            </div>
                            <p className="text-gray-400 mb-6 flex-grow">{game.desc}</p>
                            <div className="flex gap-2 flex-wrap mb-6">
                                {game.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-300 border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                {game.fee && <span className="text-[#ff00ff] font-bold">Entry Fee: ₹{game.fee}</span>}
                                <button className="px-4 py-2 rounded-lg bg-[#00d4ff]/10 text-[#00d4ff] hover:bg-[#00d4ff] hover:text-white transition-all w-full md:w-auto ml-auto">
                                    Join Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
