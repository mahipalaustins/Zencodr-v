"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Mail, Lock, User as UserIcon, ArrowRight, Github, Code2, Loader2 } from 'lucide-react';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { signIn, signUp, changeUsername } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
            } else {
                if (username.length < 3) throw new Error('Username must be at least 3 characters');

                const { data, error } = await signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });
                if (error) throw error;
                // Supabase might require email confirmation, but for now we assume functionality or auto-confirm
                // If data.user is null, check confirmation settings
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto relative z-20">
            {/* Design Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative bg-navy-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-navy-900/50">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-cyan to-purple mb-4 shadow-lg shadow-purple/20">
                        <Code2 size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome to ZenCodr</h2>
                    <p className="text-gray-400 text-center">
                        {isLogin ? 'Enter your details to access your workspace' : 'Create an account to verify your identity'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-navy-900/50 rounded-xl mb-8 border border-white/5">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isLogin
                                ? 'bg-gradient-to-r from-cyan/20 to-purple/20 text-white shadow-sm border border-white/10'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${!isLogin
                                ? 'bg-gradient-to-r from-purple/20 to-cyan/20 text-white shadow-sm border border-white/10'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                            <div className="relative group">
                                <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="johndoe"
                                    className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                        <div className="relative group">
                            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-cyan transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/50 transition-all"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-cyan to-purple text-white font-bold rounded-xl shadow-lg shadow-purple/20 hover:shadow-cyan/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Sign In' : 'Create Account'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Decor */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-xs text-gray-500">
                        Protected by ZenCodr Secure Auth
                    </p>
                </div>
            </div>
        </div>
    );
}
