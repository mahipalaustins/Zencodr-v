"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { v4 as uuidv4 } from 'uuid';

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading, signOut } = useAuth();
    const [joinRoomId, setJoinRoomId] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-[#00d4ff] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleCreateRoom = async () => {
        setIsCreating(true);
        // In a real app, you might save the room to the DB here
        const newRoomId = uuidv4();
        setTimeout(() => {
            router.push(`/room/${newRoomId}`);
        }, 500);
    };

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinRoomId.trim()) {
            router.push(`/room/${joinRoomId.trim()}`);
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-gray-200 font-sans">
            {/* Navbar */}
            <nav className="border-b border-white/10 bg-[#121929]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] bg-clip-text text-transparent cursor-pointer" onClick={() => router.push('/')}>
                            <i className="fas fa-code"></i> ZenCodr
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#ff00ff] flex items-center justify-center text-white font-bold text-sm">
                                    {user.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span className="hidden md:block font-medium">{user.user_metadata?.username || 'User'}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Sign Out"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    {/* Validated/Active Section */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome Back, {user.user_metadata?.username || 'Developer'}!</h1>
                        <p className="text-gray-400 mb-8">Ready to code? Create a new room or join your team.</p>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Create Room Card */}
                            <div className="group p-6 rounded-2xl bg-[#121929] border border-white/10 hover:border-[#00d4ff] transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className="fas fa-plus-circle text-6xl text-[#00d4ff]"></i>
                                </div>
                                <h2 className="text-xl font-bold mb-2 text-white">Create New Room</h2>
                                <p className="text-gray-400 mb-6 text-sm">Start a fresh collaborative session. Share the URL with your peers to invite them.</p>
                                <button
                                    onClick={handleCreateRoom}
                                    disabled={isCreating}
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#ff00ff] text-white font-semibold hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] transition-all flex items-center justify-center gap-2"
                                >
                                    {isCreating ? (
                                        <><i className="fas fa-spinner fa-spin"></i> Creating...</>
                                    ) : (
                                        <><i className="fas fa-magic"></i> Create Instant Room</>
                                    )}
                                </button>
                            </div>

                            {/* Join Room Card */}
                            <div className="group p-6 rounded-2xl bg-[#121929] border border-white/10 hover:border-[#ff00ff] transition-all relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <i className="fas fa-door-open text-6xl text-[#ff00ff]"></i>
                                </div>
                                <h2 className="text-xl font-bold mb-2 text-white">Join Existing Room</h2>
                                <p className="text-gray-400 mb-6 text-sm">Enter a Room ID to jump into an active coding session.</p>
                                <form onSubmit={handleJoinRoom} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter Room UUID..."
                                            value={joinRoomId}
                                            onChange={(e) => setJoinRoomId(e.target.value)}
                                            className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg py-3 px-4 text-gray-200 focus:outline-none focus:border-[#ff00ff] transition-colors font-mono text-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-lg border border-[#ff00ff] text-[#ff00ff] font-semibold hover:bg-[#ff00ff]/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-sign-in-alt"></i> Join Room
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Recent/History Section (Placeholder) */}
                    <div className="hidden md:block pl-8 border-l border-white/5">
                        <h3 className="text-lg font-semibold mb-6 text-gray-300">Recent Sessions</h3>
                        <div className="space-y-4">
                            {/* Placeholder items */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-[#00d4ff] group-hover:text-white transition-colors">Project Alpha</h4>
                                    <span className="text-xs text-gray-500">2h ago</span>
                                </div>
                                <p className="text-xs text-gray-400">Python • 3 Collaborators</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-[#00d4ff] group-hover:text-white transition-colors">React Components</h4>
                                    <span className="text-xs text-gray-500">Yesterday</span>
                                </div>
                                <p className="text-xs text-gray-400">TypeScript • 2 Collaborators</p>
                            </div>
                            <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center py-8">
                                <p className="text-gray-500 text-sm">No more recent history.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
