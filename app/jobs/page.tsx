"use client";

import React from 'react';
import Link from 'next/link';

export default function JobsPage() {
    const jobs = [
        {
            title: 'Senior Full-Stack Engineer',
            type: 'Full-time',
            level: 'Senior',
            remotelocation: 'Remote - Global',
            isNew: true,
            tags: ['Node.js', 'React', 'Postgres', 'Real-time']
        },
        {
            title: 'Esports Product Lead',
            type: 'Full-time',
            level: 'Mid-Senior',
            remotelocation: 'Remote - EMEA/Americas',
            isFeatured: true,
            tags: ['Product Strategy', 'Esports', 'Community', 'Analytics']
        },
        {
            title: 'Community Engineer',
            type: 'Contract',
            level: 'Mid Level',
            remotelocation: 'Remote - APAC',
            tags: ['SDK Development', 'Documentation', 'Streaming', 'Community']
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-gray-200 font-sans pt-20">
            {/* Header */}



            <div className="max-w-7xl mx-auto px-5 py-10">
                <div className="text-center mb-16 animate-[fadeIn_0.5s]">
                    <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">Jobs & Careers</h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Build the future of competitive programming. Work remotely, compete globally, and grow with a team that values your passion for coding.</p>
                </div>

                {/* Benefits Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-[fadeIn_0.5s_0.2s]">
                    {[
                        { title: 'Remote-First Culture', icon: 'globe', desc: 'Work from anywhere with flexible hours that fit your lifestyle.' },
                        { title: 'Competitive Programming', icon: 'trophy', desc: 'Compete in tournaments, stream matches, and earn recognition.' },
                        { title: 'Career Growth', icon: 'rocket', desc: 'Clear career paths, mentorship programs, and continuous learning.' }
                    ].map((benefit, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-[#121929]/50 border border-white/5 hover:bg-[#121929] transition-all text-center group">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl text-[#00d4ff] mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <i className={`fas fa-${benefit.icon}`}></i>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                            <p className="text-gray-400 text-sm">{benefit.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Open Positions */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <i className="fas fa-briefcase text-2xl text-[#00d4ff]"></i>
                        <h2 className="text-3xl font-bold text-white">Open Positions</h2>
                    </div>

                    <div className="space-y-6">
                        {jobs.map((job, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-[#121929] border border-white/10 hover:border-[#00d4ff] transition-all group">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white group-hover:text-[#00d4ff] transition-colors">{job.title}</h3>
                                            {job.isNew && <span className="text-xs px-2 py-0.5 rounded bg-[#00ff88]/20 text-[#00ff88] border border-[#00ff88]/30 font-semibold">New</span>}
                                            {job.isFeatured && <span className="text-xs px-2 py-0.5 rounded bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff]/30 font-semibold">Featured</span>}
                                            <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10">Remote</span>
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1"><i className="fas fa-map-marker-alt"></i> {job.remotelocation}</span>
                                            <span className="flex items-center gap-1"><i className="fas fa-briefcase"></i> {job.type}</span>
                                            <span className="flex items-center gap-1"><i className="fas fa-chart-line"></i> {job.level}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-6 py-2 rounded-lg bg-[#00d4ff] text-white font-semibold hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all">Apply Now</button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                                    {job.tags.map(tag => (
                                        <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
