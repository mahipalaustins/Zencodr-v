"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, loading: authLoading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Hide Navbar on Room page, Login, and Signup
    if (pathname?.startsWith('/room/') || pathname === '/login' || pathname === '/signup') {
        return null;
    }

    return (
        <>
            <header className="fixed top-0 w-full bg-[#0a0e1a]/80 backdrop-blur-md border-b border-white/10 px-8 py-4 z-[100] flex justify-between items-center animate-[slideDown_0.5s_ease-out]">
                <Link href="/" className="font-bold text-2xl flex items-center gap-2 bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent cursor-pointer">
                    <i className="fas fa-code"></i> ZenCodr
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6">
                    <Link href="/" className="text-[#00d4ff] hover:text-white transition-colors">Home</Link>
                    <Link href="/z-sports" className="text-gray-400 hover:text-white transition-colors">Z-Sports</Link>
                    <Link href="/hackathon" className="text-gray-400 hover:text-white transition-colors">Hackathon</Link>
                    <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">Jobs</Link>
                    <Link href="/mentorship" className="text-gray-400 hover:text-white transition-colors">Mentorship</Link>
                    {user && <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>}
                </nav>

                <div className="flex items-center gap-4">
                    {authLoading ? (
                        <div className="w-8 h-8 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
                    ) : user ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#ff00ff] flex items-center justify-center text-white font-bold">
                                {user.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <Link href="/dashboard" className="hidden md:block px-4 py-2 rounded-lg border border-[#00d4ff] text-[#00d4ff] hover:bg-[#00d4ff]/10 transition-colors">
                                Dashboard
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] text-white font-semibold hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all transform hover:-translate-y-0.5">
                            Login / Signup
                        </Link>
                    )}

                    <button className="md:hidden text-2xl text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 h-full w-[300px] bg-[#121929] border-l border-white/10 transform transition-transform duration-300 z-50 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-5">
                    <button onClick={() => setMobileMenuOpen(false)} className="mb-8 text-white">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                    <div className="flex flex-col gap-4">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-[#00d4ff]">Home</Link>
                        <Link href="/z-sports" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-[#00d4ff]">Z-Sports</Link>
                        <Link href="/hackathon" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-[#00d4ff]">Hackathon</Link>
                        <Link href="/jobs" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-[#00d4ff]">Jobs</Link>
                        <Link href="/mentorship" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-[#00d4ff]">Mentorship</Link>
                        {user && <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-xl text-gray-300 hover:text-[#00d4ff]">Dashboard</Link>}
                    </div>
                </div>
            </div>
        </>
    );
}
