"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { signIn, loading } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { error } = await signIn({ email, password });

        if (error) {
            setError(error.message);
        } else {
            router.push('/'); // Redirect to dashboard/landing
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#00d4ff]/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#ff00ff]/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>

            <div className="w-full max-w-md p-8 rounded-2xl bg-[#121929]/70 border border-white/10 backdrop-blur-md shadow-2xl relative z-10 animate-[fadeIn_0.5s]">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue to ZenCodr</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" aria-hidden="true"></i>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] text-white font-semibold hover:shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-400 text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-[#00d4ff] hover:text-[#ff00ff] transition-colors font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
