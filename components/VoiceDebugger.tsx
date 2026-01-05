"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import SimplePeer from 'simple-peer';

export default function VoiceDebugger() {
    const [logs, setLogs] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const log = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
        const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${icon} ${msg}`]);
    };

    const runTests = async () => {
        setLogs([]);
        log('Starting Voice Diagnostics...');

        // 1. Check Environment Polyfills
        try {
            // @ts-ignore
            if (typeof window.global === 'undefined') throw new Error('Global polyfill missing');
            // @ts-ignore
            if (typeof window.process === 'undefined') throw new Error('Process polyfill missing');
            log('Polyfills detected', 'success');
        } catch (e: any) {
            log(e.message, 'error');
        }

        // 2. Check SimplePeer Support
        try {
            if (!SimplePeer.WEBRTC_SUPPORT) {
                log('WebRTC not supported in this browser', 'error');
            } else {
                try {
                    const p = new SimplePeer({ initiator: true });
                    p.destroy();
                    log('SimplePeer initialized successfully', 'success');
                } catch (err: any) {
                    log(`SimplePeer crash: ${err.message}`, 'error');
                }
            }
        } catch (e: any) {
            log(`SimplePeer library error: ${e.message}`, 'error');
        }

        // 3. Check Microphone
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            log('Microphone access granted', 'success');
            stream.getTracks().forEach(t => t.stop());
        } catch (e: any) {
            log(`Microphone error: ${e.message}`, 'error');
            log('Ensure you are on HTTPS or localhost and have allowed permissions.', 'info');
        }

        // 4. Check Database (Signaling Table)
        try {
            const { error, count } = await supabase
                .from('signaling')
                .select('*', { count: 'exact', head: true });

            if (error) {
                log(`DB Connection Error: ${error.message}`, 'error');
                if (error.code === '42P01') { // undefined_table
                    log('CRITICAL: "signaling" table does not exist. Run the setup SQL script!', 'error');
                }
            } else {
                log('Connected to Supabase "signaling" table', 'success');
            }
        } catch (e: any) {
            log(`DB Unexpected Error: ${e.message}`, 'error');
        }

        // 5. Check Realtime
        try {
            const channel = supabase.channel('debug_test');
            channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    log('Realtime connection successful', 'success');
                    channel.unsubscribe();
                } else if (status === 'CHANNEL_ERROR') {
                    log('Realtime connection failed (CHANNEL_ERROR)', 'error');
                    channel.unsubscribe();
                } else if (status === 'TIMED_OUT') {
                    log('Realtime connection timed out', 'error');
                    channel.unsubscribe();
                }
            });
        } catch (e: any) {
            log(`Realtime Error: ${e.message}`, 'error');
        }
    };

    return (
        <div className="fixed bottom-10 right-10 z-50 flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto bg-navy-800 border border-white/20 rounded-lg shadow-xl overflow-hidden w-80">
                <div
                    className="p-3 bg-navy-700 flex justify-between items-center cursor-pointer hover:bg-navy-600 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="font-bold text-sm text-white">Voice Diagnostics</span>
                    <span className="text-xs text-gray-400">{isOpen ? '▼' : '▲'}</span>
                </div>

                {isOpen && (
                    <div className="p-4 flex flex-col gap-3">
                        <button
                            onClick={runTests}
                            className="w-full py-2 bg-cyan/20 text-cyan hover:bg-cyan/30 rounded text-xs font-bold transition uppercase"
                        >
                            Run Tests
                        </button>
                        <div className="h-48 overflow-y-auto bg-black/30 rounded p-2 text-xs font-mono space-y-1">
                            {logs.length === 0 && <span className="text-gray-500">Click Run Tests...</span>}
                            {logs.map((L, i) => (
                                <div key={i} className={L.includes('❌') ? 'text-red-400' : L.includes('✅') ? 'text-green-400' : 'text-gray-300'}>
                                    {L}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
