"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LandingPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [activePage, setActivePage] = useState('landing');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showPreloader, setShowPreloader] = useState(true);

    // Stats counters state
    const [stats, setStats] = useState({
        developers: 0,
        hackathons: 0,
        mentors: 0,
        jobs: 0
    });

    useEffect(() => {
        // Hide preloader
        const timer = setTimeout(() => {
            setShowPreloader(false);
        }, 1000);

        // Initialize stats animation (simplified for React)
        const animateStats = () => {
            const targets = {
                developers: 10000,
                hackathons: 500,
                mentors: 200,
                jobs: 1000
            };

            let start = 0;
            const duration = 2000;
            const startTime = Date.now();

            const update = () => {
                const now = Date.now();
                const progress = Math.min((now - startTime) / duration, 1);

                setStats({
                    developers: Math.floor(progress * targets.developers),
                    hackathons: Math.floor(progress * targets.hackathons),
                    mentors: Math.floor(progress * targets.mentors),
                    jobs: Math.floor(progress * targets.jobs)
                });

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };

            requestAnimationFrame(update);
        };

        if (!showPreloader) {
            animateStats();
        }

        return () => clearTimeout(timer);
    }, [showPreloader]);


    const handleStartCoding = () => {
        if (user) {
            router.push('/dashboard');
        } else {
            router.push('/signup');
        }
    };

    return (
        <div className="landing-page-container font-sans text-gray-200 bg-[#0a0e1a] min-h-screen relative overflow-x-hidden">
            {/* Global Styles for Landing Page specific overrides */}
            <style jsx global>{`
            :root {
                --primary-bg: #0a0e1a;
                --secondary-bg: #121929;
                --card-bg: rgba(18, 25, 41, 0.7);
                --accent: #00d4ff;
                --accent-secondary: #ff00ff;
                --accent-tertiary: #00ff88;
                --text-primary: #e0e0e0;
                --text-secondary: #a0a0a0;
                --glass-bg: rgba(255, 255, 255, 0.05);
                --glass-border: rgba(255, 255, 255, 0.1);
            }

            body {
                background: linear-gradient(135deg, #0a0e1a 0%, #121929 50%, #0f1729 100%);
            }
            
            /* Add custom scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
            }
            ::-webkit-scrollbar-track {
                background: var(--primary-bg);
            }
            ::-webkit-scrollbar-thumb {
                background: var(--glass-border);
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: var(--accent);
            }

            @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
            @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
            @keyframes glow { from { box-shadow: 0 0 5px var(--accent); } to { box-shadow: 0 0 20px var(--accent), 0 0 30px var(--accent); } }
        `}</style>

            {/* Preloader */}
            {showPreloader && (
                <div className="fixed inset-0 bg-[#0a0e1a] flex justify-center items-center z-[9999]">
                    <div className="relative w-[100px] h-[100px]">
                        <div className="absolute top-0 left-0 w-full h-full border-[3px] border-transparent border-t-[#00d4ff] rounded-full animate-spin"></div>
                        <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-[3px] border-transparent border-t-[#ff00ff] rounded-full animate-spin [animation-delay:0.5s]"></div>
                        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] border-[3px] border-transparent border-t-[#00ff88] rounded-full animate-spin [animation-delay:1s]"></div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="pt-24 min-h-screen">

                {/* Landing Page */}
                <div className="animate-[fadeIn_0.5s]">
                    {/* Hero Section */}
                    <section className="py-20 overflow-hidden relative">
                        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-center gap-16">
                            <div className="flex-1 animate-[fadeInLeft_1s_ease-out]">
                                <h1 className="text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">
                                    Code. Collaborate. Compete. Grow.
                                </h1>
                                <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg">
                                    ZenCodr is an all-in-one platform for collaborative coding, hackathons, mentorship, jobs, and competitive learning.
                                </p>
                                <div className="flex gap-6 flex-wrap">
                                    <button onClick={handleStartCoding} className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] text-white text-lg font-semibold hover:shadow-[0_10px_20px_rgba(0,212,255,0.3)] hover:-translate-y-1 transition-all">
                                        Start Coding
                                    </button>
                                    <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 rounded-lg border-2 border-[#00d4ff] text-[#00d4ff] text-lg font-semibold hover:bg-[#00d4ff]/10 transition-all">
                                        Explore Features
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 relative h-[400px] animate-[fadeInRight_1s_ease-out]">
                                {/* Abstract Decorative Cards */}
                                <div className="absolute top-5 right-12 w-[200px] p-4 rounded-2xl bg-[#121929]/70 border border-white/10 backdrop-blur-md shadow-2xl animate-[float_4s_ease-in-out_infinite]">
                                    <div className="flex items-center gap-2 mb-4 text-[#00d4ff] font-semibold"><i className="fas fa-code"></i> Live Editor</div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] rounded w-full animate-pulse"></div>
                                        <div className="h-2 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] rounded w-[80%] animate-pulse delay-75"></div>
                                        <div className="h-2 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] rounded w-[60%] animate-pulse delay-150"></div>
                                    </div>
                                </div>
                                <div className="absolute top-[180px] right-[120px] w-[200px] p-4 rounded-2xl bg-[#121929]/70 border border-white/10 backdrop-blur-md shadow-2xl animate-[float_5s_ease-in-out_infinite_1s]">
                                    <div className="flex items-center gap-2 mb-4 text-[#00d4ff] font-semibold"><i className="fas fa-users"></i> Team Chat</div>
                                    <div className="space-y-2">
                                        <div className="h-5 bg-[#00d4ff]/20 rounded-full w-full animate-pulse"></div>
                                        <div className="h-5 bg-[#00d4ff]/20 rounded-full w-[70%] animate-pulse delay-100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="features" className="py-20 relative">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">Everything You Need to Excel</h2>
                            <p className="text-xl text-gray-400">Powerful features designed to accelerate your coding journey</p>
                        </div>
                        <div className="max-w-7xl mx-auto px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: 'code', title: 'Real-time Collaboration', desc: 'Code together with your team in real-time with integrated tools.' },
                                { icon: 'rocket', title: 'Hackathons', desc: 'Test your skills in exciting coding challenges and win prizes.' },
                                { icon: 'robot', title: 'AI Mentorship', desc: 'Get personalized guidance from AI and expert mentors.' },
                                { icon: 'briefcase', title: 'Jobs & Internships', desc: 'Get matched with top tech companies looking for your skills.' }
                            ].map((feature, i) => (
                                <div key={i} className="group p-8 rounded-2xl bg-[#121929]/70 border border-white/10 backdrop-blur-md hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:border-[#00d4ff] transition-all relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                    <div className="w-[70px] h-[70px] rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#ff00ff]/20 flex items-center justify-center text-3xl text-[#00d4ff] mb-6 group-hover:scale-110 transition-transform">
                                        <i className={`fas fa-${feature.icon}`}></i>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-200">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="py-16 bg-white/5 backdrop-blur-md border-y border-white/10">
                        <div className="max-w-5xl mx-auto px-5 flex flex-wrap justify-between gap-8">
                            {Object.entries(stats).map(([key, value]) => (
                                <div key={key} className="text-center flex-1 min-w-[150px]">
                                    <div className="text-5xl font-bold text-[#00d4ff] mb-2">{value.toLocaleString()}+</div>
                                    <div className="text-lg text-gray-400 uppercase tracking-widest">{key}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer CTA */}
                    <section className="py-20 my-10 mx-5 bg-gradient-to-br from-[#00d4ff]/10 to-[#ff00ff]/10 rounded-2xl relative overflow-hidden">
                        <div className="max-w-3xl mx-auto text-center relative z-10">
                            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent">Ready to level up your coding journey?</h2>
                            <p className="text-xl text-gray-400 mb-8">Join thousands of developers who are already collaborating, learning, and growing with ZenCodr.</p>
                            <button onClick={handleStartCoding} className="px-10 py-4 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] text-white text-xl font-semibold hover:shadow-[0_10px_20px_rgba(0,212,255,0.3)] hover:-translate-y-1 transition-all inline-block">
                                Join ZenCodr Now
                            </button>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 pt-12 pb-8 px-8 mt-12">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-[#00d4ff]">ZenCodr</h3>
                        <p className="text-gray-400 text-sm">The ultimate platform for collaborative coding, mentorship, and career growth.</p>
                    </div>
                    {['Navigation', 'Resources', 'Legal'].map((col) => (
                        <div key={col}>
                            <h3 className="text-lg font-bold mb-4 text-white">{col}</h3>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Link 1</a></li>
                                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Link 2</a></li>
                                <li><a href="#" className="hover:text-[#00d4ff] transition-colors">Link 3</a></li>
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="text-center text-gray-500 text-sm pt-8 border-t border-white/10">
                    &copy; 2026 ZenCodr. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
